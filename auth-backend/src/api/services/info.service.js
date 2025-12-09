import {
  responseREST,
  responseRESTError,
  httpStatus,
  dbStatus,
} from "../../common/functions.js";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { EMAIL_TEMPLATES } from "../../common/variables.js";

export const userInfoService = async (req, res) => {
  const functionName = "userInfoService";

  try {
    const query = `
          SELECT 
            u.email,
            u.first_name,
            u.last_name,
            u.profile_picture_url,
            u.phone_number,
            u.is_phone_verified,
            c.name as country_name,
            t.name as timezone_name,
            l.name as language_name
          FROM users u
          LEFT JOIN countries c ON c.id = u.country_id
          LEFT JOIN timezones t ON t.id = u.timezone_id
          LEFT JOIN languages l ON l.id = u.language_id
          WHERE u.id = $1`;

    const userInfo = await global.$main.oneOrNone(query, [
      req.userInfo.user_id,
    ]);

    $logger.info(functionName, null, req, "User info fetched successfully");

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.user_info_fetched_successfully"),
      userInfo
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const twoFactorInfoService = async (req, res) => {
  const functionName = "twoFactorInfoService";

  try {
    const query = `
          SELECT
            ua.is_two_fa_enabled,
            ua.is_authenticator_verified,
            ua.authenticator_verified_at,
            ua.authenticator_key,  
            ua.is_phone_verified,
            ua.phone_verified_at,
            ua.is_email_verified,
            ua.email_verified_at,
            ua.is_two_fa_phone_enabled,
            ua.is_two_fa_email_enabled,
            ua.is_two_fa_authenticator_enabled,
            ua.default_two_fa_method
          FROM user_authentications ua
          WHERE ua.user_id = $1`;

    const userInfo = await global.$main.oneOrNone(query, [
      req.userInfo.user_id,
    ]);

    $logger.info(
      functionName,
      null,
      req,
      "Two factor info fetched successfully"
    );

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.two_factor_info_fetched_successfully"),
      userInfo
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const enableDisableTwoFactorService = async (req, res) => {
  const functionName = "enableDisableTwoFactorService";

  try {
    // Use a transaction to ensure data consistency
    const query = `
        UPDATE user_authentications
        SET 
          is_two_fa_enabled = $1
        WHERE user_id = $2`;

    await global.$main.none(query, [
      req.body.is_two_fa_enabled,
      req.userInfo.user_id,
    ]);

    $logger.info(
      functionName,
      null,
      req,
      `Two-factor authentication ${
        req.body.is_two_fa_enabled ? "enabled" : "disabled"
      } successfully`
    );

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t(
        req.body.is_two_fa_enabled
          ? "msg.two_factor_enabled_successfully"
          : "msg.two_factor_disabled_successfully"
      )
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const setupAuthenticatorService = async (req, res) => {
  const functionName = "setupAuthenticatorService";

  try {
    // Generate secret key
    const secret = authenticator.generateSecret();

    // Generate otpauth URL for QR code
    const otpauthUrl = authenticator.keyuri(
      req.userInfo.email,
      process.env.APP_NAME,
      secret
    );

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

    // Save temporary secret in user_authentications
    await global.$main.none(
      `
        UPDATE user_authentications
        SET 
          authenticator_key = $1,
          updated_at = now()
        WHERE user_id = $2
      `,
      [secret, req.userInfo.user_id]
    );

    $logger.info(
      functionName,
      null,
      req,
      "Authenticator setup initiated successfully"
    );

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.authenticator_setup_initiated"),
      {
        qrCode: qrCodeUrl,
        secret: secret,
        otpauthUrl,
      }
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const verifyAuthenticatorService = async (req, res) => {
  const functionName = "verifyAuthenticatorService";

  try {
    const { token } = req.body;

    // Get temporary secret
    const auth = await global.$main.oneOrNone(
      `
      SELECT authenticator_key
      FROM user_authentications
      WHERE user_id = $1
    `,
      [req.userInfo.user_id]
    );

    if (!auth?.authenticator_key) {
      throw new Error(req.t("msg.authenticator_not_setup"));
    }

    // Verify token
    const isValid = authenticator.verify({
      token,
      secret: auth.authenticator_tmp_key,
    });

    if (!isValid) {
      throw new Error(req.t("msg.invalid_authenticator_code"));
    }

    // Update authentication status
    await global.$main.none(
      `
        UPDATE user_authentications
        SET 
          authenticator_key = authenticator_key,
          is_authenticator_verified = true,
          authenticator_verified_at = now(),
          is_two_fa_authenticator_enabled = true,
          default_two_fa_method = COALESCE(default_two_fa_method, 'authenticator'),
          updated_at = now()
        WHERE user_id = $1
      `,
      [req.userInfo.user_id]
    );

    // Send email notification
    await sendMail(
      req,
      req.userInfo.email,
      EMAIL_TEMPLATES.LINK_TWO_FACTOR_AUTHENTICATION,
      {
        email: req.userInfo.email,
        method: "authenticator",
      }
    );

    $logger.info(
      functionName,
      null,
      req,
      "Authenticator verified successfully"
    );

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.authenticator_verified_successfully")
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const getUserAllDataService = async (req, res) => {
  const functionName = "getUserAllDataService";

  try {
    const user = await global.$main.oneOrNone(
      `SELECT 
        u.id AS user_id, 
        u.email,
        u.first_name,
        u.last_name,
        u.settings->>'theme' AS theme,
        u.profile_picture_url,
        ua.default_organization_id,
        ua.default_role_id,
        o.name AS organization_name,
        o.script_id,
        o.logo_url,
        o.subdomain,
        o.is_script_installed,
        o.created_by AS organization_created_by,
        s.id AS subscription_id,
        s.is_free AS is_free_subscription,
        s.is_trial AS is_trial_subscription,
        s.start_date,
        s.end_date,
        pp.package_id
      FROM users u
      INNER JOIN user_authentications ua ON ua.user_id = u.id 
      INNER JOIN user_organizations uo ON uo.user_id = u.id AND uo.status = $3
      INNER JOIN organizations o ON o.id = uo.organization_id AND o.status = $4
      INNER JOIN subscriptions s ON s.organization_id = o.id
      LEFT JOIN package_prices pp ON pp.id = s.package_price_id
      WHERE LOWER(u.email) = LOWER($1)
      AND u.status = $2
      LIMIT 1`,
      [req.userInfo.email, dbStatus.ENABLE, dbStatus.ENABLE, dbStatus.ENABLE]
    );

    const response = {
      user: {
        id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        theme: user.theme,
        profile_picture_url: user.profile_picture_url,
        is_owner: user.organization_created_by === user.user_id,
        organization: {
          id: user.organization_id,
          name: user.organization_name,
          logo_url: user.logo_url,
          sub_domain: user.subdomain,
          script_id: user.script_id,
          is_script_installed: user.is_script_installed,
          subscription: {
            id: user.subscription_id,
            package_id: user.package_id,
            is_free: user.is_free_subscription,
            is_trial: user.is_trial_subscription,
            subscription_start_date: user.subscription_start_date,
            subscription_end_date: user.subscription_end_date,
          },
        },
      },
    };

    $logger.info(functionName, null, req, "User data fetched successfully");

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.user_data_fetched_successfully"),
      response
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};
