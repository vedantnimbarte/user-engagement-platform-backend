import Joi from "joi";
import {
  responseRESTError,
  responseRESTInvalidArgs,
} from "../../common/functions.js";
import {
  getOrganizationProfileService,
  updateOrganizationProfileService,
} from "../services/organization.service.js";

export const getOrganizationProfile = async (req, res) => {
  const functionName = "getOrganizationProfile";
  try {
    return await getOrganizationProfileService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const updateOrganizationProfile = async (req, res) => {
  const functionName = "updateOrganizationProfile";
  try {
    const schema = Joi.object({
      name: Joi.string().max(255).optional(),
      logo: Joi.string().optional(),
      description: Joi.string().optional(),
      website: Joi.string().uri().optional(),
      country_id: Joi.number().optional(),
      state_id: Joi.number().optional(),
      city: Joi.string().max(100).optional(),
      zip_code: Joi.string().max(10).optional(),
      timezone_id: Joi.array().optional(),
      other_info: Joi.object().optional(),
      tax_ids: Joi.object().optional(),
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

    return await updateOrganizationProfileService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};
