const crypto = require("crypto-js");
const otpGenerator = require("otp-generator");
const httpStatus = require("./httpStatus");
const path = require("path");
const jwt = require("jsonwebtoken");
const Joilib = require("joi");
const { createClient } = require("redis");
const { dbStatus, dbPermission } = require("./commonVariable");
require("./global-pool");
const { getTenantByAccountId } = require("./pg-connection");

(async () => {
  const client = createClient({
    password: process.env.REDIS_PASSWORD.toString().trim(),
    socket: {
      host: process.env.REDIS_HOST.toString().trim(),
      port: Number(process.env.REDIS_PORT),
    },
  });
  setTimeout(async () => {
    await client.connect();
  }, 1000);

  global.redisClient = client;
})();

const validateUserInfo = async (userId) => {
  try {
    const getUserInfoQuery = `SELECT * FROM users WHERE user_id = $1`;
    const getUserInfo = await global.pool.query(getUserInfoQuery, [userId]);

    if (!getUserInfo.rowCount) {
      return {
        status: false,
        message: "User Not found",
        error: "",
      };
    }

    if (getUserInfo.rows[0].status !== dbStatus.ENABLE) {
      return {
        status: false,
        message: "User is Disable or Deleted",
        error: "",
      };
    }

    return { status: true, data: getUserInfo.rows[0] };
  } catch (error) {
    return {
      status: false,
      message: "Internal server error",
      error: error.message,
    };
  }
};

const validateAccount = async (data) => {
  try {
    //convert to raw query with order by

    const getAccountInfoQuery = `SELECT 
    account_type, account.account_id, account.status,
    subscription_id , is_free , subscription_end_date,
    package_price.package_id
    FROM account 
    LEFT JOIN subscriptions ON account.account_id = subscriptions.account_id 
    LEFT JOIN package_price ON subscriptions.package_price_id = package_price.package_price_id
    WHERE account.sub_domain = $1
    ORDER BY subscriptions.created_at DESC LIMIT 1`;

    const getAccountInfo = await global.pool.query(getAccountInfoQuery, [
      data.sub_domain,
    ]);

    if (!getAccountInfo.rowCount) {
      return {
        status: false,
        message: "Account not found",
      };
    }

    if (getAccountInfo.rows[0].status !== dbStatus.ENABLE) {
      return {
        status: false,
        message: "This Account is Deleted",
        error: "",
      };
    }

    return { status: true, data: getAccountInfo.rows[0] };
  } catch (error) {
    return {
      status: false,
      message: "Internal server error",
      error: error.message,
    };
  }
};
const checkUserAccount = async (data) => {
  try {
    const getUserAccountQuery = `SELECT * FROM user_account WHERE user_id = $1 AND account_id = $2`;
    const getUserAccount = await global.pool.query(getUserAccountQuery, [
      data.userId,
      data.accountId,
    ]);

    if (!getUserAccount.rowCount) {
      return {
        status: false,
        message: "User Not Found In Account",
        error: "",
      };
    }

    if (getUserAccount.rows[0].status !== dbStatus.ENABLE) {
      return {
        status: false,
        message: "User De-active Or Deleted In Account",
        error: "",
      };
    }

    return { status: true, data: getUserAccount.rows[0] };
  } catch (error) {
    return {
      status: false,
      message: "internal_server_error",
      error: error.message,
    };
  }
};

const verifyUser = async (data) => {
  try {
    const tokenInfo = await verifyJWTs(
      data.access_token,
      process.env.ACCESS_JWT_SECRET
    );

    if (!tokenInfo.status) {
      return responseWithErrorAndMessage(
        { statusCode: 401, status: false },
        tokenInfo.message,
        tokenInfo
      );
    }

    if (!tokenInfo.data.session_id) {
      return responseWithErrorAndMessage(
        { statusCode: 401, status: false },
        "Token is Invalid",
        "Session Id Not found In Token"
      );
    }

    const checkTokenInRedis = await redisClient.get(tokenInfo.data.session_id);

    if (!checkTokenInRedis) {
      return responseWithErrorAndMessage(
        { statusCode: 401, status: false },
        "Token is Invalid",
        "Token is Not Found In Redis"
      );
    }

    const verifyToken = await verifyJWTs(
      checkTokenInRedis,
      process.env.ACCESS_JWT_SECRET
    );

    if (!verifyToken.status) {
      return responseWithErrorAndMessage(
        { statusCode: 401, status: false },
        verifyToken.message,
        verifyToken
      );
    }

    if (!verifyToken.data.session_id) {
      return responseWithErrorAndMessage(
        { statusCode: 401, status: false },
        "Token is Invalid",
        "Session Id Not found In Token"
      );
    }

    const getUserInfo = await validateUserInfo(verifyToken.data.user_id);

    if (!getUserInfo.status) {
      return responseWithErrorAndMessage(
        { statusCode: 404, status: false },
        getUserInfo.message,
        getUserInfo
      );
    }

    const getAccountInfo = await validateAccount(data);

    if (!getAccountInfo.status) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        getAccountInfo.message,
        getAccountInfo
      );
    }

    if (getAccountInfo?.data?.account_id !== verifyToken.data.account) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "error in validating account",
        "Mismatch in account id"
      );
    }

    const validateUserAccountAssociation = await checkUserAccount({
      userId: getUserInfo.data.user_id,
      accountId: getAccountInfo.data.account_id,
    });

    if (!validateUserAccountAssociation.status) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        validateUserAccountAssociation.message,
        validateUserAccountAssociation
      );
    }

    if (
      getAccountInfo.data?.subscription_end_date < new Date() &&
      getAccountInfo.data?.is_free
    ) {
      await global.pool.query(
        `UPDATE subscriptions SET is_current = $1 WHERE subscription_id = $2`,
        [false, getAccountInfo.data?.subscription_id]
      );
    }

    const userInformation = {
      userId: getUserInfo.data.user_id,
      emailId: getUserInfo.data.email_id,
      sessionId: verifyToken.data.session_id,
      roleId: verifyToken.data.role,
      accountId: getAccountInfo.data?.account_id,
      packageId: getAccountInfo.data?.package_id || null,
      accountType: getAccountInfo.data.account_type,
      subscriptionId: getAccountInfo.data?.subscription_id || null,
      tokenAccountId: verifyToken.data.account,
    };

    return {
      status: true,
      data: userInformation,
    };
  } catch (error) {
    return {
      status: false,
      data: null,
      statusCode: 500,
      message: "internal server error",
      error: error.message,
    };
  }
};

const checkPermission = async (data) => {
  const functionName = "checkPermission";
  try {
    let db = {};

    let findAccount = await redisClient.get(
      `account_${data.userInformation.accountId}`
    );

    if (findAccount) {
      findAccount = JSON.parse(findAccount);
    } else {
      const findAccountQuery = `SELECT * FROM account WHERE account_id = $1 AND status = $2`;
      findAccount = await global.pool.query(findAccountQuery, [
        data.userInformation.accountId,
        dbStatus.ENABLE,
      ]);

      // IF Account Not Found
      if (!findAccount.rowCount) {
        return responseWithErrorAndMessage(
          { statusCode: 403, status: false },
          findAccount.message,
          findAccount
        );
      }

      findAccount = findAccount.rows[0];
      redisClient.set(
        `account_${data.userInformation.accountId}`,
        JSON.stringify(findAccount),
        "EX",
        3600
      );
    }

    //Validate Subscription
    if (findAccount.account_type !== "gainserv") {
      if (!data.userInformation.subscriptionId) {
        return responseWithErrorAndMessage(
          { statusCode: 403, status: false },
          "Subscription Id Not Found",
          data.userInformation
        );
      }

      let findSubscription = await redisClient.get(
        `sub_${data.userInformation.subscriptionId}`
      );

      if (findSubscription) {
        findSubscription = JSON.parse(findSubscription);
      } else {
        const findSubscriptionQuery = `SELECT * FROM subscriptions WHERE subscription_id = $1`;
        findSubscription = await global.pool.query(findSubscriptionQuery, [
          data.userInformation.subscriptionId,
        ]);

        if (!findSubscription.rowCount) {
          return responseWithErrorAndMessage(
            { statusCode: 403, status: false },
            findSubscription.message,
            findSubscription
          );
        }

        findSubscription = findSubscription.rows[0];
        redisClient.set(
          `sub_${data.userInformation.subscriptionId}`,
          JSON.stringify(findSubscription),
          "EX",
          3600 * 8
        );
      }

      const currentDate = new Date();
      const endDate = new Date(findSubscription.subscription_end_date);

      if (findSubscription.is_free) {
        const trialEndDate = endDate;

        if (trialEndDate < currentDate) {
          return responseWithErrorAndMessage(
            { statusCode: 403, status: false },
            "Trial Period Expired",
            findSubscription
          );
        }
      } else {
        const subscriptionEndDate = endDate;

        if (subscriptionEndDate < currentDate) {
          return responseWithErrorAndMessage(
            { statusCode: 403, status: false },
            "Subscription Period Expired",
            findSubscription
          );
        }
      }
    }

    let DB = {
      data: global.pool,
    };

    // Set Tenant DB Connection if Account type is not gainserv
    if (findAccount.account_type !== "gainserv") {
      DB = await getTenantByAccountId(data.userInformation.accountId);
    }

    const checkRoleQuery = `SELECT * FROM roles WHERE role_id = $1`;
    const checkRole = await DB.data.query(checkRoleQuery, [
      data.userInformation.roleId,
    ]);

    // If role not found or disabled or deleted return error
    if (!checkRole.rowCount) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "Role not found",
        checkRole.data
      );
    } else if (checkRole.rows[0].status === dbStatus.DELETE) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "User role is deleted",
        checkRole.rows[0]
      );
    } else if (checkRole.rows[0].status === dbStatus.DISABLE) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "User role is disabled",
        checkRole.rows[0]
      );
    }

    // Find Feature by feature key with feature type
    let featurePermission = await redisClient.get(
      `features_${data.userInformation.accountId}`
    );

    if (featurePermission) {
      featurePermission = JSON.parse(featurePermission).find((feature) => {
        if (
          feature.feature_key === data.key &&
          feature.status === dbStatus.ENABLE
        ) {
          return feature;
        }
      });
    } else {
      const featurePermissionQuery = `SELECT 
      feature.application_id, feature.feature_id, feature.feature_key, feature.status,
      feature_type.feature_type, feature_type.feature_create, feature_type.feature_update, feature_type.feature_delete, feature_type.feature_read, feature_type.feature_action 
      FROM feature 
      LEFT JOIN feature_type ON feature.feature_type_id = feature_type.feature_type_id`;
      featurePermission = await DB.data.query(featurePermissionQuery);

      redisClient.set(
        `features_${data.userInformation.accountId}`,
        JSON.stringify(featurePermission.rows),
        "EX",
        3600
      );

      featurePermission = featurePermission.rows.find((feature) => {
        if (
          feature.feature_key === data.key &&
          feature.status === dbStatus.ENABLE
        ) {
          return feature;
        }
      });

      // If feature not found
      if (!featurePermission || !featurePermission.feature_type) {
        return responseWithErrorAndMessage(
          { statusCode: 403, status: false },
          "Feature or Feature type not found",
          featurePermission
        );
      }
    }

    // If Feature has not permission for create or update or delete or read or action
    if (
      data.permission === dbPermission.CREATE &&
      !featurePermission.feature_create
    ) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "This feature not allow to create",
        null
      );
    } else if (
      data.permission === dbPermission.UPDATE &&
      !featurePermission.feature_update
    ) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "This feature not allow to update",
        null
      );
    } else if (
      data.permission === dbPermission.DELETE &&
      !featurePermission.feature_delete
    ) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "This feature not allow to delete",
        null
      );
    } else if (
      data.permission === dbPermission.READ &&
      !featurePermission.feature_read
    ) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "This feature not allow to read",
        null
      );
    } else if (
      data.permission === dbPermission.ACTION &&
      !featurePermission.feature_action
    ) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "This feature not allow to action",
        null
      );
    }

    let checkPermissionForFeature = await redisClient.get(
      `role_permission_${data.userInformation.accountId}_${data.userInformation.roleId}`
    );

    if (checkPermissionForFeature) {
      checkPermissionForFeature = JSON.parse(checkPermissionForFeature).find(
        (feature) => {
          if (
            feature.application_id === featurePermission.application_id &&
            feature.feature_id === featurePermission.feature_id
          ) {
            return feature;
          }
        }
      );
    } else {
      // Find Permission for feature, for that Application and Role

      const checkPermissionForFeatureQuery = `SELECT * FROM permission_application_feature WHERE role_id = $1`;
      checkPermissionForFeature = await DB.data.query(
        checkPermissionForFeatureQuery,
        [data.userInformation.roleId]
      );

      redisClient.set(
        `role_permission_${data.userInformation.accountId}_${data.userInformation.roleId}`,
        JSON.stringify(checkPermissionForFeature.rows),
        "EX",
        3600
      );

      checkPermissionForFeature = checkPermissionForFeature.rows.find(
        (feature) => {
          if (
            feature.application_id === featurePermission.application_id &&
            feature.feature_id === featurePermission.feature_id
          ) {
            return feature;
          }
        }
      );

      // If Permission not found for that feature
      if (!checkPermissionForFeature) {
        return responseWithErrorAndMessage(
          httpStatus.PERMISSION_DENIED,
          "This Feature not allow to access for this role",
          null
        );
      }
    }

    // If Feature has no Permission to create for that role and application
    if (
      data.permission === dbPermission.CREATE &&
      !checkPermissionForFeature.permissions_create
    ) {
      return responseWithErrorAndMessage(
        httpStatus.PERMISSION_DENIED,
        "This Feature not allow to create for this role",
        null
      );
    }

    // If Feature has no Permission to update for that role and application
    else if (
      data.permission === dbPermission.UPDATE &&
      !checkPermissionForFeature.permissions_update
    ) {
      return responseWithErrorAndMessage(
        httpStatus.PERMISSION_DENIED,
        "This Feature not allow to update for this role",
        null
      );
    }
    // If Feature has no Permission to delete for that role and application
    else if (
      data.permission === dbPermission.DELETE &&
      !checkPermissionForFeature.permissions_delete
    ) {
      return responseWithErrorAndMessage(
        httpStatus.PERMISSION_DENIED,
        "This Feature not allow to delete for this role",
        null
      );
    }
    // If Feature has no Permission to read for that role and application
    else if (
      data.permission === dbPermission.READ &&
      !checkPermissionForFeature.permissions_read
    ) {
      return responseWithErrorAndMessage(
        httpStatus.PERMISSION_DENIED,
        "This Feature not allow to read for this role",
        null
      );
    }
    // If Feature has no Permission to Action for that role and application
    else if (
      data.permission === dbPermission.ACTION &&
      !checkPermissionForFeature.permissions_action
    ) {
      return responseWithErrorAndMessage(
        httpStatus.PERMISSION_DENIED,
        "This Feature not allow to action for this role",
        null
      );
    }

    // If Code Reached here that means you have permission for that role so send status true....
    return responseWithErrorAndMessage(
      httpStatus.SUCCESS,
      "You have permission for this feature",
      null
    );
  } catch (error) {
    return responseWithErrorAndMessage(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      null
    );
  }
};

const checkPermissionV1 = async (data) => {
  const functionName = "checkPermissionV1";
  try {
    let db = {};

    let findAccount = await redisClient.get(
      `account_${data.userInformation.accountId}`
    );

    if (findAccount) {
      findAccount = JSON.parse(findAccount);
    } else {
      const findAccountQuery = `SELECT * FROM account WHERE account_id = $1 AND status = $2`;
      findAccount = await global.pool.query(findAccountQuery, [
        data.userInformation.accountId,
        dbStatus.ENABLE,
      ]);

      // IF Account Not Found
      if (!findAccount.rowCount) {
        return responseWithErrorAndMessage(
          { statusCode: 403, status: false },
          findAccount.message,
          findAccount
        );
      }

      findAccount = findAccount.rows[0];
      redisClient.set(
        `account_${data.userInformation.accountId}`,
        JSON.stringify(findAccount),
        "EX",
        3600
      );
    }

    //Validate Subscription
    if (findAccount.account_type !== "gainserv") {
      if (!data.userInformation.subscriptionId) {
        return responseWithErrorAndMessage(
          { statusCode: 403, status: false },
          "Subscription Id Not Found",
          data.userInformation
        );
      }

      let findSubscription = await redisClient.get(
        `sub_${data.userInformation.subscriptionId}`
      );

      if (findSubscription) {
        findSubscription = JSON.parse(findSubscription);
      } else {
        const findSubscriptionQuery = `SELECT * FROM subscriptions WHERE subscription_id = $1`;
        findSubscription = await global.pool.query(findSubscriptionQuery, [
          data.userInformation.subscriptionId,
        ]);

        if (!findSubscription.rowCount) {
          return responseWithErrorAndMessage(
            { statusCode: 403, status: false },
            findSubscription.message,
            findSubscription
          );
        }

        findSubscription = findSubscription.rows[0];
        redisClient.set(
          `sub_${data.userInformation.subscriptionId}`,
          JSON.stringify(findSubscription),
          "EX",
          3600 * 8
        );
      }

      const currentDate = new Date();
      const endDate = new Date(findSubscription.subscription_end_date);

      if (findSubscription.is_free) {
        const trialEndDate = endDate;

        if (trialEndDate < currentDate) {
          return responseWithErrorAndMessage(
            { statusCode: 403, status: false },
            "Trial Period Expired",
            findSubscription
          );
        }
      } else {
        const subscriptionEndDate = endDate;

        if (subscriptionEndDate < currentDate) {
          return responseWithErrorAndMessage(
            { statusCode: 403, status: false },
            "Subscription Period Expired",
            findSubscription
          );
        }
      }
    }

    let DB = {
      data: global.pool,
    };

    // Set Tenant DB Connection if Account type is not gainserv
    if (findAccount.account_type !== "gainserv") {
      DB = await getTenantByAccountId(data.userInformation.accountId);
    }

    const checkRoleQuery = `SELECT * FROM roles WHERE role_id = $1`;
    const checkRole = await DB.data.query(checkRoleQuery, [
      data.userInformation.roleId,
    ]);

    // If role not found or disabled or deleted return error
    if (!checkRole.rowCount) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "Role not found",
        checkRole.data
      );
    } else if (checkRole.rows[0].status === dbStatus.DELETE) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "User role is deleted",
        checkRole.rows[0]
      );
    } else if (checkRole.rows[0].status === dbStatus.DISABLE) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "User role is disabled",
        checkRole.rows[0]
      );
    }

    // Find Feature by feature key with feature type
    let subFeaturePermission = await redisClient.get(
      `sub_features_${data.userInformation.accountId}`
    );

    if (subFeaturePermission) {
      subFeaturePermission = JSON.parse(subFeaturePermission).find(
        (subFeature) => {
          if (
            subFeature.sub_features_key === data.key &&
            subFeature.status === dbStatus.ENABLE
          ) {
            return subFeature;
          }
        }
      );
    } else {
      const subFeaturePermissionQuery = `SELECT sub_features_id ,sub_features_key ,sub_features.status,feature_create,feature_read,feature_update,feature_delete,feature_action FROM sub_features 
      LEFT JOIN feature_type ON sub_features.feature_type_id = feature_type.feature_type_id`;
      subFeaturePermission = await DB.data.query(subFeaturePermissionQuery);

      redisClient.set(
        `sub_features_${data.userInformation.accountId}`,
        JSON.stringify(subFeaturePermission.rows),
        "EX",
        3600
      );

      subFeaturePermission = subFeaturePermission.rows.find((subFeature) => {
        if (
          subFeature.sub_features_key === data.key &&
          subFeature.status === dbStatus.ENABLE
        ) {
          return subFeature;
        }
      });

      // If feature not found
      if (!subFeaturePermission) {
        return responseWithErrorAndMessage(
          { statusCode: 403, status: false },
          "Feature not found",
          subFeaturePermission
        );
      }
    }

    // If Feature has not permission for create or update or delete or read or action
    if (
      data.permission === dbPermission.CREATE &&
      !subFeaturePermission.feature_create
    ) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "This feature not allow to create",
        null
      );
    } else if (
      data.permission === dbPermission.UPDATE &&
      !subFeaturePermission.feature_update
    ) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "This feature not allow to update",
        null
      );
    } else if (
      data.permission === dbPermission.DELETE &&
      !subFeaturePermission.feature_delete
    ) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "This feature not allow to delete",
        null
      );
    } else if (
      data.permission === dbPermission.READ &&
      !subFeaturePermission.feature_read
    ) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "This feature not allow to read",
        null
      );
    } else if (
      data.permission === dbPermission.ACTION &&
      !subFeaturePermission.feature_action
    ) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "This feature not allow to action",
        null
      );
    }

    let checkPermissionForFeature = await redisClient.get(
      `role_subFeature_permission_${data.userInformation.accountId}_${data.userInformation.roleId}`
    );

    if (checkPermissionForFeature) {
      checkPermissionForFeature = JSON.parse(checkPermissionForFeature).find(
        (subFeature) => {
          if (
            subFeature.sub_features_id === subFeaturePermission.sub_features_id
          ) {
            return subFeature;
          }
        }
      );
    } else {
      // Find Permission for feature, for that Application and Role

      const checkPermissionForFeatureQuery = `select permission_sub_features.sub_features_id , permission_sub_features.feature_create,permission_sub_features.feature_read,permission_sub_features.feature_update,permission_sub_features.feature_delete,permission_sub_features.feature_action 
      from permission_sub_features
      join sub_features on sub_features.sub_features_id = permission_sub_features.sub_features_id
      where role_id = $1`;
      checkPermissionForFeature = await DB.data.query(
        checkPermissionForFeatureQuery,
        [data.userInformation.roleId]
      );

      redisClient.set(
        `role_subFeature_permission_${data.userInformation.accountId}_${data.userInformation.roleId}`,
        JSON.stringify(checkPermissionForFeature.rows),
        "EX",
        3600
      );

      checkPermissionForFeature = checkPermissionForFeature.rows.find(
        (subFeature) => {
          if (
            subFeature.sub_features_id === subFeaturePermission.sub_features_id
          ) {
            return subFeature;
          }
        }
      );

      // If Permission not found for that feature
      if (!checkPermissionForFeature) {
        return responseWithErrorAndMessage(
          httpStatus.PERMISSION_DENIED,
          "This Feature not allow to access for this role",
          null
        );
      }
    }

    // If Feature has no Permission to create for that role and application
    if (
      data.permission === dbPermission.CREATE &&
      !checkPermissionForFeature.feature_create
    ) {
      return responseWithErrorAndMessage(
        httpStatus.PERMISSION_DENIED,
        "This Feature not allow to create for this role",
        null
      );
    }

    // If Feature has no Permission to update for that role and application
    else if (
      data.permission === dbPermission.UPDATE &&
      !checkPermissionForFeature.feature_update
    ) {
      return responseWithErrorAndMessage(
        httpStatus.PERMISSION_DENIED,
        "This Feature not allow to update for this role",
        null
      );
    }
    // If Feature has no Permission to delete for that role and application
    else if (
      data.permission === dbPermission.DELETE &&
      !checkPermissionForFeature.feature_delete
    ) {
      return responseWithErrorAndMessage(
        httpStatus.PERMISSION_DENIED,
        "This Feature not allow to delete for this role",
        null
      );
    }
    // If Feature has no Permission to read for that role and application
    else if (
      data.permission === dbPermission.READ &&
      !checkPermissionForFeature.feature_read
    ) {
      return responseWithErrorAndMessage(
        httpStatus.PERMISSION_DENIED,
        "This Feature not allow to read for this role",
        null
      );
    }
    // If Feature has no Permission to Action for that role and application
    else if (
      data.permission === dbPermission.ACTION &&
      !checkPermissionForFeature.feature_action
    ) {
      return responseWithErrorAndMessage(
        httpStatus.PERMISSION_DENIED,
        "This Feature not allow to action for this role",
        null
      );
    }

    // If Code Reached here that means you have permission for that role so send status true....
    return responseWithErrorAndMessage(
      httpStatus.SUCCESS,
      "You have permission for this feature",
      null
    );
  } catch (error) {
    return responseWithErrorAndMessage(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      null
    );
  }
};

const verifyUserToken = async (data) => {
  try {
    const tokenInfo = await verifyJWTs(
      data.access_token,
      process.env.ACCESS_JWT_SECRET
    );

    if (!tokenInfo.status) {
      return responseWithErrorAndMessage(
        { statusCode: 401, status: false },
        tokenInfo.message,
        tokenInfo
      );
    }

    if (!tokenInfo.data.session_id) {
      return responseWithErrorAndMessage(
        { statusCode: 401, status: false },
        "Token is Invalid",
        "Session Id Not found In Token"
      );
    }

    const cachedSession = await $redis.get(tokenInfo.data.session_id);

    if (!cachedSession) {
      return responseWithErrorAndMessage(
        { statusCode: 401, status: false },
        "Token is Invalid",
        "Token is Not Found In Redis"
      );
    }

    return {
      status: true,
      data: cachedSession,
    };
  } catch (error) {
    return {
      status: false,
      data: null,
      statusCode: 500,
      message: "internal server error",
      error: error.message,
    };
  }
};

const permissionCheck = async (data) => {
  try {
    // Validate required data
    if (
      !data?.userInformation?.accountId ||
      !data?.userInformation?.roleId ||
      !data?.key ||
      !data?.permission
    ) {
      return responseWithErrorAndMessage(
        { statusCode: 400, status: false },
        "Missing required parameters",
        null
      );
    }

    // Set Tenant DB Connection
    const tenant = await global.$connectTenant(data.userInformation.accountId);

    // Check role status
    const checkRole = await tenant.oneOrNone(
      `
      SELECT status 
      FROM roles 
      WHERE role_id = $(roleId)
      LIMIT 1
    `,
      {
        roleId: data.userInformation.roleId,
      }
    );

    if (!checkRole) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "Role not found",
        null
      );
    }

    // Check role status
    const roleStatusMessages = {
      [dbStatus.DELETE]: "User role is deleted",
      [dbStatus.DISABLE]: "User role is disabled",
    };

    if (roleStatusMessages[checkRole.status]) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        roleStatusMessages[checkRole.status],
        checkRole
      );
    }

    // Get feature from cache or DB
    const subFeatureCacheKey = `sub_features_${data.userInformation.accountId}`;
    let subFeatureFeatureType = await global.$cache.hget(
      subFeatureCacheKey,
      data.key
    );

    if (!subFeatureFeatureType) {
      const subFeatures = await tenant.any(
        `
        SELECT 
          sf.id,
          sf.key,
          sf.status,
          ft.can_create,
          ft.can_read,
          ft.can_update,
          ft.can_delete,
          ft.can_action
        FROM sub_features sf
        LEFT JOIN feature_types ft ON sf.feature_type_id = ft.id
        WHERE sf.status = $(enableStatus)
      `,
        {
          enableStatus: dbStatus.ENABLE,
        }
      );

      // Cache features with pipeline for better performance
      const pipeline = global.$cache.pipeline();
      subFeatures.forEach((feature) => {
        pipeline.hset(subFeatureCacheKey, feature.key, feature);
      });
      pipeline.expire(subFeatureCacheKey, 3600); // 1 hour
      pipeline.exec();

      subFeatureFeatureType = subFeatures.find((sf) => sf.key === data.key);
    }

    if (!subFeatureFeatureType) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        "Feature not found",
        null
      );
    }

    // Check feature type permissions
    const featurePermissionMap = {
      [dbPermission.CREATE]: "can_create",
      [dbPermission.READ]: "can_read",
      [dbPermission.UPDATE]: "can_update",
      [dbPermission.DELETE]: "can_delete",
      [dbPermission.ACTION]: "can_action",
    };

    const requiredPermission = featurePermissionMap[data.permission];
    if (!requiredPermission || !subFeatureFeatureType[requiredPermission]) {
      return responseWithErrorAndMessage(
        { statusCode: 403, status: false },
        `This feature not allowed to ${data.permission.toLowerCase()}`,
        null
      );
    }

    // Get role permissions from cache or DB
    const cacheKey = `role_subFeature_permission_${data.userInformation.accountId}_${data.userInformation.roleId}`;
    let permissionForFeature = await global.$cache.hget(
      cacheKey,
      subFeatureFeatureType.id
    );

    if (!permissionForFeature) {
      const permissions = await tenant.any(
        `
        SELECT 
          psf.sub_feature_id,
          psf.can_create,
          psf.can_read, 
          psf.can_update,
          psf.can_delete,
          psf.can_action
        FROM permission_sub_features psf
        JOIN sub_features sf ON sf.id = psf.sub_feature_id 
        WHERE role_id = $(roleId)
      `,
        {
          roleId: data.userInformation.roleId,
        }
      );

      // Cache permissions with pipeline
      const pipeline = global.$cache.pipeline();
      permissions.forEach((permission) => {
        pipeline.hset(cacheKey, permission.sub_feature_id, permission);
      });
      pipeline.expire(cacheKey, 3600);
      pipeline.exec();

      permissionForFeature = permissions.find(
        (p) => p.sub_feature_id === subFeatureFeatureType.id
      );
    }

    if (!permissionForFeature) {
      return responseWithErrorAndMessage(
        httpStatus.PERMISSION_DENIED,
        "This feature not allowed to access for this role",
        null
      );
    }

    // Check permissions based on action type
    const permissionMap = {
      [dbPermission.CREATE]: {
        check: !permissionForFeature.can_create,
        message: "This Feature not allow to create for this role",
      },
      [dbPermission.UPDATE]: {
        check: !permissionForFeature.can_update,
        message: "This Feature not allow to update for this role",
      },
      [dbPermission.DELETE]: {
        check: !permissionForFeature.can_delete,
        message: "This Feature not allow to delete for this role",
      },
      [dbPermission.READ]: {
        check: !permissionForFeature.can_read,
        message: "This Feature not allow to read for this role",
      },
      [dbPermission.ACTION]: {
        check: !permissionForFeature.can_action,
        message: "This Feature not allow to action for this role",
      },
    };

    const permission = permissionMap[data.permission];
    if (permission && permission.check) {
      return responseWithErrorAndMessage(
        httpStatus.PERMISSION_DENIED,
        permission.message,
        null
      );
    }

    // If Code Reached here that means you have permission for that role so send status true....
    return responseWithErrorAndMessage(
      httpStatus.SUCCESS,
      "You have permission for this feature",
      null
    );
  } catch (error) {
    console.error("Error in checkPermission:", error);
    return responseWithErrorAndMessage(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      error.message
    );
  }
};

/**
 * Used to encrypt the text.
 * @param
 * text -- string value that you want to encrypt.
 * @example
 * return encrypt('string test 1')
 **/
const encrypt = (text) => {
  return crypto.AES.encrypt(text, process.env.ENCRYPT_KEY).toString();
};

/**
 * Used to decrypt the text.
 * @param
 * ciphertext -- chipher value that you want to decrypt.
 * @example
 * const text='U2FsdGVkX1+DBsW1d2lQLdGR7ldKFbY8HtS3+IeLPE0N2E=';
 * return decrypt(text)
 **/
const decrypt = (ciphertext) => {
  const bytes = crypto.AES.decrypt(ciphertext, process.env.ENCRYPT_KEY);
  return bytes.toString(crypto.enc.Utf8);
};

/**
 * Used to check key exists in object.
 * @param
 * item -- pass object.
 * @param
 * checkArr -- key which need to be check.
 * @example
 * const json={"search_text":"India"}
 * return await checkHasOwnProperty(json, ["search_text"])
 *
 **/
const checkHasOwnProperty = async (item, checkArr) => {
  if (typeof item === "object") {
    let allKeyExist = true;
    let checkObject = item;
    checkArr.forEach(async (element) => {
      if (typeof checkObject === "object") {
        if (typeof element === "string") {
          if (checkObject.hasOwnProperty(element)) {
            checkObject = checkObject[element];
          } else {
            allKeyExist = false;
          }
        }
      } else {
        allKeyExist = false;
      }
    });
    return allKeyExist;
  }
  return false;
};

/**
 * Used to add pagination on query. And validate skip and take.
 * @param
 * pageInfo -- pass object.
 * @example
 * const pageInfo={skip:0, take:50}
 * return await getPagination(pageInfo)
 *
 **/
const getPagination = async (pageInfo) => {
  let skip = 0,
    take = Number(process.env.MAX_PAGE_LIMIT);

  if (
    (await checkHasOwnProperty(pageInfo, ["skip"])) &&
    (await checkHasOwnProperty(pageInfo, ["take"]))
  ) {
    if (pageInfo.skip >= 0 && pageInfo.take > 0) {
      skip = pageInfo.skip;
      take = pageInfo.take;
    }
  }
  return { skip, take };
};

/**
 * Used to generate file name.
 **/
const generateFileName = (name = null) => {
  let timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  let random = ("" + Math.random()).substring(2, 8);
  if (name) {
    return name + "_" + timestamp + random;
  } else {
    return timestamp + random;
  }
};

/**
 * Used to generate OTP.
 * @param
 * length -- Length of otp to generate.
 * @param
 * type -- Type of otp to generate("otp" or "secret")
 * @example
 * return await getPagination(6,'otp')
 *
 **/
const generateOTP = async (length, type) => {
  let value;
  if (type === "otp")
    value = otpGenerator.generate(length, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
  else if (type === "secret") {
    value = otpGenerator.generate(length, {
      digits: true,
      upperCaseAlphabets: true,
      specialChars: true,
      lowerCaseAlphabets: true,
    });
  }

  return value;
};

const signJWTs = async (data, secret, tokenExpiry) => {
  let signedToken;
  if (tokenExpiry) {
    signedToken = jwt.sign(data, secret, {
      expiresIn: tokenExpiry,
    });
  } else {
    signedToken = jwt.sign(data, secret);
  }
  return signedToken;
};

/**
 * Common response for error to use.
 * @param
 * context -- Pass context.
 * @param
 * error -- Pass error message or object.
 * For string pass mesage.
 * If object then it should have error key or message key which holds error message.
 *
 **/
const responseWithError = (context, error = null) => {
  return {
    ...httpStatus.INTERNAL_SERVER_ERROR,
    message: context.req
      ? context.req.t("msg.internal_server_error")
      : context.t("msg.internal_server_error"),
    data: null,
    error:
      typeof error === "object" && error != null
        ? [error.error || error.message]
        : [error],
  };
};

/**
 * Common response for error and custom message.
 * @param
 * resHttpStatus -- httpStatus.
 * @param
 * message -- Message that will be shown to user.
 * @param
 * error -- Pass error message or object.
 * For string pass mesage.
 * If object then it should have error key or message key which holds error message.
 **/
const responseWithErrorAndMessage = (resHttpStatus, message, error) => {
  return {
    ...resHttpStatus,
    message: message,
    data: null,
    error:
      typeof error === "object" && error != null
        ? [error.error || error.message]
        : [error],
  };
};

/**
 * Common response REST API error.
 * @param
 * req -- Pass req object
 * @param
 * res -- Pass res object
 * @param
 * error -- Pass error message or object.
 * For string pass mesage.
 * If object then it should have error key or message key which holds error message.
 **/
const responseRESTError = (req, res, error = null) => {
  return res.status(httpStatus.INTERNAL_SERVER_ERROR.statusCode).json({
    ...httpStatus.INTERNAL_SERVER_ERROR,
    message: req.t("msg.internal_server_error"),
    data: null,
    error:
      typeof error === "object" && error != null
        ? [error.error || error.message]
        : [error],
  });
};

/**
 * Common response REST API with or without error.
 * @param
 * res -- Pass req object
 * @param
 * resHttpStatus -- Pass httpStatus
 * @param
 * message -- Pass message
 * @param
 * data -- Pass data
 * @param
 * error -- Pass error message or object.
 * For string pass mesage.
 * If object then it should have error key or message key which holds error message.
 **/
const responseREST = (
  res,
  resHttpStatus,
  message,
  data = null,
  error = null
) => {
  return res.status(resHttpStatus.statusCode).json({
    ...resHttpStatus,
    message: message,
    data: data,
    error:
      typeof error === "object" && error != null
        ? [error.error || error.message]
        : [error],
  });
};

/**
 * Common response REST API with or without error.
 * @param
 * resHttpStatus -- Pass httpStatus
 * @param
 * message -- Pass message
 * @param
 * data -- Pass data
 * @param
 * rowsCount -- Total number of record in table.
 **/
const responseWithData = (resHttpStatus, message, data, rowsCount) => {
  if (rowsCount !== undefined) {
    return {
      ...resHttpStatus,
      message: message,
      rowsCount: rowsCount,
      data: data,
      error: null,
    };
  }
  return {
    ...resHttpStatus,
    message: message,
    data: data,
    error: null,
  };
};

/**
 * Common response REST API with or without error.
 * @param
 * schema -- JOI schema
 * @param
 * data -- Data to be validated
 **/
const responseInvalidArgs = (schema, data) => {
  const validate = schema.validate(data);
  if (validate.error) {
    {
      return {
        ...httpStatus.INVALID_ARGUMENT,
        data: null,
        message: validate.error.details.map((i) => i.message).join(", "),
        error: validate.error.details.map((i) => i.message),
      };
    }
  } else {
    return {
      status: true,
    };
  }
};
const responseRESTInvalidArgs = (res, validate) => {
  return res.status(httpStatus.INVALID_ARGUMENT.statusCode).json({
    ...httpStatus.INVALID_ARGUMENT,
    message: validate.error.details.map((i) => i.message).join(","),
    data: null,
    error: null,
  });
};

/**
 * Return the path of assets folder.
 **/
const getAssetsPath = () => {
  return path.join(path.resolve(__dirname + "/../../../../assets"));
};

const verifyJWTs = async (token, secret) => {
  try {
    const verifyJWT = jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        return { status: false, message: err, data: null };
      }
      return { status: true, data: decoded, message: "successful" };
    });

    if (!verifyJWT.status) {
      if (verifyJWT.message.toString().split(":")[1].trim() === "jwt expired") {
        return {
          statusCode: 401,
          status: false,
          message: "You are unauthorized for this request!",
          data: { invalidToken: true },
          error: "Token Expired",
        };
      } else if (
        verifyJWT.message.toString().split(":")[1].trim() ===
          "invalid signature" ||
        verifyJWT.message.toString().split(":")[1].trim() === "invalid token" ||
        verifyJWT.message.toString().split(":")[1].trim() === "jwt malformed" ||
        verifyJWT.message.toString().split(":")[0].trim() === "SyntaxError"
      ) {
        return {
          statusCode: 401,
          status: false,
          message: "You are unauthorized for this request!",
          data: { invalidToken: true },
          error: "Invalid Token",
        };
      }
    }

    // Successful
    if (verifyJWT.status && verifyJWT.data) {
      return {
        statusCode: 200,
        status: true,
        message: "ok",
        data: verifyJWT.data,
        error: [],
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      status: false,
      message: "Internal server error",
      data: {},
      error: error.message,
    };
  }
};

const sortBy = (sort, defaultSort) => {
  let orderBy = [];

  if (sort && sort.length > 0) {
    orderBy = sort.map((data) => {
      return { [data.field]: data.sort };
    });
  } else {
    if (defaultSort) {
      orderBy = defaultSort;
    } else {
      orderBy = [];
    }
  }

  return orderBy;
};

const Joi = Joilib.defaults((schema) =>
  schema.options({ abortEarly: false, errors: { wrap: { label: false } } })
);

module.exports = {
  encrypt,
  decrypt,
  getPagination,
  checkHasOwnProperty,
  generateFileName,
  generateOTP,
  signJWTs,
  responseWithError,
  responseWithData,
  responseWithErrorAndMessage,
  responseREST,
  responseRESTError,
  responseInvalidArgs,
  getAssetsPath,
  responseRESTInvalidArgs,
  verifyJWTs,
  sortBy,
  Joi,
  verifyUser,
  checkPermission,
  checkPermissionV1,
  getTenantByAccountId,
};
