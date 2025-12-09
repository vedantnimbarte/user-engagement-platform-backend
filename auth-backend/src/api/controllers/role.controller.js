import Joi from "joi";
import { responseRESTError } from "../../common/functions.js";
import {
  createRoleService,
  getRolesService,
  updateRoleService,
  deleteRoleService,
  getSubFeaturesService,
} from "../services/role.service.js";

export const getRoles = async (req, res) => {
  try {
    // Validate query parameters
    const schema = Joi.object({
      search: Joi.string().trim().optional(),
      status: Joi.string().optional(),
    });

    // Validate request query
    const { error } = schema.validate(req.query);
    if (error) {
      return responseRESTError(req, res, error.details[0].message);
    }

    // Call service to get roles
    await getRolesService(req, res);
  } catch (error) {
    $logger.error("getRoles", null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const createRole = async (req, res) => {
  try {
    const roleValidation = Joi.object({
      name: Joi.string().max(256).required(),
      description: Joi.string().max(500).min(0).allow("", null),
      permissions: Joi.array()
        .items(
          Joi.object()
            .keys({
              sub_feature_id: Joi.string().uuid().required(),
              can_create: Joi.boolean().optional(),
              can_read: Joi.boolean().optional(),
              can_delete: Joi.boolean().optional(),
              can_update: Joi.boolean().optional(),
              can_action: Joi.boolean().optional(),
              can_export: Joi.boolean().optional(),
              can_import: Joi.boolean().optional(),
            })
            .or(
              "can_create",
              "can_read",
              "can_delete",
              "can_update",
              "can_action",
              "can_export",
              "can_import"
            )
            .required()
        )
        .required()
        .min(1),
    }).options({ abortEarly: false, allowUnknown: false });

    // Validate request query
    const { error } = roleValidation.validate(req.body);
    if (error) {
      return responseRESTError(req, res, error.details[0].message);
    }
    return await createRoleService(req, res);
  } catch (error) {
    $logger.error("createRole", null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const updateRole = async (req, res) => {
  try {
    // Validate request body
    const roleValidation = Joi.object({
      id: Joi.string().uuid().required(),
      name: Joi.string().max(256).optional(),
      description: Joi.string().max(500).allow("", null).optional(),
      permissions: Joi.array()
        .items(
          Joi.object()
            .keys({
              sub_feature_id: Joi.string().uuid().required(),
              can_create: Joi.boolean().optional(),
              can_read: Joi.boolean().optional(),
              can_update: Joi.boolean().optional(),
              can_delete: Joi.boolean().optional(),
              can_action: Joi.boolean().optional(),
              can_export: Joi.boolean().optional(),
              can_import: Joi.boolean().optional(),
            })
            .or(
              "can_create",
              "can_read",
              "can_delete",
              "can_update",
              "can_action",
              "can_export",
              "can_import"
            )
        )
        .optional()
        .min(0),
    }).options({ abortEarly: false, allowUnknown: false });

    // Validate request body
    const { error } = roleValidation.validate(req.body);
    if (error) {
      return responseRESTError(req, res, error.details[0].message);
    }

    // Call service to update role
    return await updateRoleService(req, res);
  } catch (error) {
    $logger.error("updateRole", null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const deleteRole = async (req, res) => {
  try {
    // Validate request body
    const roleValidation = Joi.object({
      id: Joi.string().uuid().required(),
    }).options({ abortEarly: false, allowUnknown: false });

    // Validate request body
    const { error } = roleValidation.validate(req.body);
    if (error) {
      return responseRESTError(req, res, error.details[0].message);
    }

    // Call service to delete role
    return await deleteRoleService(req, res);
  } catch (error) {
    $logger.error("deleteRole", null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const getSubFeatures = async (req, res) => {
  try {
    // Validate query parameters
    const queryValidation = Joi.object({
      role_id: Joi.string().uuid().optional(),
    }).options({ allowUnknown: true });

    // Validate query
    const { error } = queryValidation.validate(req.query);
    if (error) {
      return responseRESTError(req, res, error.details[0].message);
    }

    // Call service to get sub-features
    return await getSubFeaturesService(req, res);
  } catch (error) {
    $logger.error("getSubFeatures", null, req, error.message);
    return responseRESTError(req, res, error);
  }
};
