import Joi from "joi";
import {
  responseRESTError,
  responseRESTInvalidArgs,
} from "../../common/functions.js";
import {
  preRegisterService,
  verifyRegistrationLinkService,
  registrationDataService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
  sendMagicLinkService,
  verifyMagicLinkService,
  refreshTokenService,
  googleAuthService,
} from "../services/auth.service.js";

// Check whether the user is already registered or not!!
const preRegister = async (req, res) => {
  const functionName = "preRegister";
  try {
    const userValidate = Joi.object({
      email_id: Joi.string()
        .email({ tlds: { allow: false } })
        .trim()
        .max(256)
        .required(),
      password: Joi.string().trim().max(256).required(),
    });
    const validate = userValidate.validate(req.body);
    if (validate.error) {
      $logger.warn(
        functionName,
        req.body,
        req,
        "In-Valid Argument Passed" + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }
    return await preRegisterService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, "", error.message);
    return responseRESTError(req, res, error);
  }
};

const verifyRegistrationLink = async (req, res) => {
  const functionName = "verifyRegistrationLink";
  try {
    const userValidate = Joi.object({
      token: Joi.string().trim().required(),
      ip_address: Joi.string().trim().required(),
    });
    const validate = userValidate.validate(req.body);
    if (validate.error) {
      $logger.warn(
        functionName,
        req.body,
        req,
        "In-Valid Argument Passed" + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }
    return await verifyRegistrationLinkService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, "", error.message);
    return responseRESTError(req, res, error);
  }
};

const registrationData = async (req, res) => {
  const functionName = "registrationData";
  try {
    const userValidate = Joi.object({
      first_name: Joi.string().trim().required(),
      last_name: Joi.string().trim().required(),
      organization_name: Joi.string().trim().required(),
      other_info: Joi.object().optional(),
    });
    const validate = userValidate.validate(req.body);
    if (validate.error) {
      $logger.warn(
        functionName,
        req.body,
        req,
        "In-Valid Argument Passed" + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }
    return await registrationDataService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, "", error.message);
    return responseRESTError(req, res, error);
  }
};

const login = async (req, res) => {
  const functionName = "login";
  try {
    const passwordGrantValidate = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .max(256)
        .required()
        .trim(),
      password: Joi.string().max(256).required(),
      grant_type: Joi.string().max(256).optional(),
      remember_me: Joi.boolean().allow(null),
    });
    const validate = passwordGrantValidate.validate(req.body);

    if (validate.error) {
      $logger.warn(
        functionName,
        req.body,
        req,
        "In-Valid Argument Passed" + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }
    return await loginService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, "", error.message);
    return responseRESTError(req, res, error);
  }
};

const forgotPassword = async (req, res) => {
  const functionName = "forgotPassword";
  try {
    const forgotPasswordValidate = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .max(256)
        .required()
        .trim(),
    });

    const validate = forgotPasswordValidate.validate(req.body);

    if (validate.error) {
      $logger.warn(
        functionName,
        req.body,
        req,
        "In-Valid Argument Passed" + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }

    return await forgotPasswordService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, "", error.message);
    return responseRESTError(req, res, error);
  }
};

const resetPassword = async (req, res) => {
  const functionName = "resetPassword";
  try {
    const resetPasswordValidate = Joi.object({
      token: Joi.string().required(),
      password: Joi.string().min(8).max(256).required(),
    });

    const validate = resetPasswordValidate.validate(req.body);

    if (validate.error) {
      $logger.warn(
        functionName,
        req.body,
        req,
        "In-Valid Argument Passed" + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }

    return await resetPasswordService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, "", error.message);
    return responseRESTError(req, res, error);
  }
};

const sendMagicLink = async (req, res) => {
  const functionName = "sendMagicLink";
  try {
    const magicLinkValidate = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .max(256)
        .required()
        .trim(),
    });

    const validate = magicLinkValidate.validate(req.body);

    if (validate.error) {
      $logger.warn(
        functionName,
        req.body,
        req,
        "In-Valid Argument Passed" + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }

    return await sendMagicLinkService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, "", error.message);
    return responseRESTError(req, res, error);
  }
};

const verifyMagicLink = async (req, res) => {
  const functionName = "verifyMagicLink";
  try {
    const verifyMagicLinkValidate = Joi.object({
      token: Joi.string().required(),
    });

    const validate = verifyMagicLinkValidate.validate(req.body);

    if (validate.error) {
      $logger.warn(
        functionName,
        req.body,
        req,
        "In-Valid Argument Passed" + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }

    return await verifyMagicLinkService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, "", error.message);
    return responseRESTError(req, res, error);
  }
};

const refreshToken = async (req, res) => {
  const functionName = "refreshToken";
  try {
    const refreshTokenValidate = Joi.object({
      refresh_token: Joi.string().required()
    });

    const validate = refreshTokenValidate.validate(req.body);

    if (validate.error) {
      $logger.warn(
        functionName,
        req.body,
        req,
        "In-Valid Argument Passed" + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }

    return await refreshTokenService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, "", error.message);
    return responseRESTError(req, res, error);
  }
};

const googleAuth = async (req, res) => {
  const functionName = "googleAuth";
  try {
    const googleAuthValidate = Joi.object({
      token: Joi.string().required(),
    });

    const validate = googleAuthValidate.validate(req.body);

    if (validate.error) {
      $logger.warn(
        functionName,
        req.body,
        req,
        "In-Valid Argument Passed" + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }

    return await googleAuthService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, "", error.message);
    return responseRESTError(req, res, error);
  }
};

export {
  preRegister,
  verifyRegistrationLink,
  registrationData,
  login,
  forgotPassword,
  resetPassword,
  sendMagicLink,
  verifyMagicLink,
  refreshToken,
  googleAuth,
};
