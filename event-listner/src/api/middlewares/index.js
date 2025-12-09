const {
  responseREST,
  responseRESTError,
  httpStatus,
  verifyUser,
} = require("@userplus/common");

const middleware = async (req, res, next) => {
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

    // Get subdomain from headers or request
    const subdomain = req.headers["sub-domain"] || req.subdomains?.[0];

    // Validate subdomain
    if (!subdomain) {
      return responseREST(
        res,
        httpStatus.PERMISSION_DENIED,
        req.t("msg.unauthorized_request"),
        null,
        ["Subdomain not found"]
      );
    }

    // Verify user token
    const userData = await verifyUser({
      access_token,
    });

    if (!userData.status) {
      return res.status(userData.statusCode).json(userData);
    }

    // Set user information in request object
    req.userInformation = {
      userId: userData.data.userId,
      emailId: userData.data.emailId,
      roleId: userData.data.roleId,
      packageId: userData.data.packageId,
      accountId: userData.data.accountId,
      sessionId: userData.data.sessionId,
      subscriptionId: userData.data.subscriptionId,
      tokenAccountId: userData.data.tokenAccountId,
      accountType: userData.data?.accountType,
    };

    next();
  } catch (error) {
    $logger.error(functionName, null, req, "", error.message);
    return responseRESTError(req, res, error);
  }
};

module.exports = middleware;
