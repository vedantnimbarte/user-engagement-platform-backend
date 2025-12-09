import Joi from "joi";
import {
  enableDisableTwoFactorService,
  setupAuthenticatorService,
  twoFactorInfoService,
  userInfoService,
  verifyAuthenticatorService,
  getUserAllDataService,
} from "../services/info.service.js";
import { responseRESTInvalidArgs } from "../../common/functions.js";

export const userInfo = async (req, res) => {
  const functionName = "userInfo";
  try {
    return await userInfoService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const twoFactorInfo = async (req, res) => {
  const functionName = "twoFactorInfo";
  try {
    return await twoFactorInfoService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const enableDisableTwoFactor = async (req, res) => {
  const functionName = "enableDisableTwoFactor";
  try {
    const { is_two_fa_enabled } = req.body;
    const schema = Joi.object({
      is_two_fa_enabled: Joi.boolean().required(),
    });

    const validate = schema.validate(req.body);
    if (validate.error) {
      $logger.warn(
        functionName,
        req.body,
        req,
        "In-Valid Argument Passed" + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }
    return await enableDisableTwoFactorService(req, res, is_two_fa_enabled);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const setupAuthenticator = async (req, res) => {
  const functionName = "setupAuthenticator";
  try {
    return await setupAuthenticatorService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const verifyAuthenticator = async (req, res) => {
  const functionName = "verifyAuthenticator";
  try {
    const schema = Joi.object({
      token: Joi.string().required(),
    });

    const validate = schema.validate(req.body);
    if (validate.error) {
      return responseRESTInvalidArgs(res, validate);
    }

    return await verifyAuthenticatorService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const getUserAllData = async (req, res) => {
  const functionName = "getUserAllData";
  try {
    return await getUserAllDataService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};
