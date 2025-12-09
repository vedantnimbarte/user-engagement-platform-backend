import {
  responseREST,
  responseRESTError,
  httpStatus,
  verifyUser,
} from "../../common/functions.js";

const checkToken = async (req, res, next) => {
  const functionName = "middleware";
  try {
    // Extract access token
    const access_token = req.headers.authorization?.replace("Bearer ", "");

    // Check for valid access token
    if (!access_token || access_token === "undefined") {
      $logger.info(functionName, null, req, "unauthorized_request");
      return responseREST(
        res,
        httpStatus.UNAUTHORIZED,
        req.t("msg.unauthorized_request"),
        { accessTokenNotFound: true },
        null
      );
    }

    // Verify user token
    const userData = await verifyUser(req, {
      access_token,
    });

    if (!userData.status) {
      return res.status(userData.statusCode).json(userData);
    }

    // Set user information in request object
    req.userInfo = {
      user_id: userData.data.user_id,
      email: userData.data.email,
      role_id: userData?.data?.role_id,
      package_id: userData?.data?.package_id,
      organization_id: userData?.data?.organization_id,
      subscription_id: userData?.data?.subscription_id,
    };

    next();
  } catch (error) {
    $logger.error(functionName, null, req, "", error.message);
    return responseRESTError(req, res, error);
  }
};

export { checkToken };
