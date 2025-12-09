import Joi from "joi";
import {
  responseRESTError,
  responseRESTInvalidArgs,
} from "../../common/functions.js";
import {
  getDomainsService,
  createDomainService,
  updateDomainService,
  deleteDomainService,
} from "../services/domain.service.js";

export const getDomains = async (req, res) => {
  const functionName = "getDomains";
  try {
    return await getDomainsService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const createDomain = async (req, res) => {
  const functionName = "createDomain";
  try {
    const schema = Joi.object({
      name: Joi.string().max(255).required(),
      main_domain: Joi.string().max(255).required(),
      sub_domain: Joi.string().max(255).optional(),
    });

    const validate = schema.validate(req.body);
    if (validate.error) {
      $logger.warn(
        functionName,
        req.body,
        req,
        "Invalid Argument Passed: " + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }

    return await createDomainService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);    
    return responseRESTError(req, res, error);
  }
};

export const updateDomain = async (req, res) => {
  const functionName = "updateDomain";
  try {
    const schema = Joi.object({
      name: Joi.string().max(255).optional(),
      main_domain: Joi.string().max(255).optional(),
      sub_domain: Joi.string().max(255).optional(),
      status: Joi.number().valid(1,3).optional(),
    });

    const validate = schema.validate(req.body);
    if (validate.error) {
      $logger.warn(
        functionName,
        req.body,
        req,
        "Invalid Argument Passed: " + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }

    return await updateDomainService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const deleteDomain = async (req, res) => {
  const functionName = "deleteDomain";
  try {
    const schema = Joi.object({
      id: Joi.string().required(),
    });

    const validate = schema.validate(req.params);
    if (validate.error) {
      $logger.warn(
        functionName,
        req.params,
        req,
        "Invalid Argument Passed: " + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }

    return await deleteDomainService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};
