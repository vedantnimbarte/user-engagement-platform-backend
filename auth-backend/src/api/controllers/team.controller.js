import Joi from "joi";
import {
  dbStatus,
  responseRESTError,
  responseRESTInvalidArgs,
} from "../../common/functions.js";
import {
  getTeamUsersService,
  createTeamUserService,
  updateTeamUserDetailsService,
  deleteTeamUserService,
  reinviteTeamUserService,
  assignRoleToUserService,
  getUserDataService,
  setPasswordService,
  acceptInvitationService,
} from "../services/team.service.js";
import e from "express";

export const getTeamUsers = async (req, res) => {
  const functionName = "getTeamUsers";
  try {
    const schema = Joi.object({
      skip: Joi.number().min(0).default(0),
      limit: Joi.number().min(1).max(100).default(10),
      search: Joi.string().allow("").optional(),
      sort_by: Joi.string()
        .valid("name", "email", "role", "created_at", "status")
        .default("created_at"),
      sort_order: Joi.string().valid("asc", "desc").default("desc"),
      status: Joi.number().valid(1, 3).optional(),
    });

    const validate = schema.validate(req.query);
    if (validate.error) {
      $logger.warn(
        functionName,
        req.query,
        req,
        "Invalid Argument Passed: " + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }

    return await getTeamUsersService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const createTeamUser = async (req, res) => {
  const functionName = "createTeamUser";
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      role: Joi.string().uuid().required(),
      name: Joi.string().max(255).required(),
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

    return await createTeamUserService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const updateTeamUser = async (req, res) => {
  const functionName = "updateTeamUser";
  try {
    const schema = Joi.object({
      user_id: Joi.string().uuid().required(),
      name: Joi.string().optional(),
      email: Joi.string().email().optional(),
      status: Joi.string().valid(dbStatus.ENABLE, dbStatus.DISABLE).optional(),
    }).min(2); // Ensure at least one field is provided

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

    // Delegate to service method
    return await updateTeamUserDetailsService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const deleteTeamUser = async (req, res) => {
  const functionName = "deleteTeamUser";
  try {
    const schema = Joi.object({
      user_id: Joi.string().uuid().required(),
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

    // Delegate to service method
    return await deleteTeamUserService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const reinviteTeamUser = async (req, res) => {
  const functionName = "reinviteTeamUser";
  try {
    const schema = Joi.object({
      email: Joi.string().required(),
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
    return await reinviteTeamUserService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const assignRoleToUser = async (req, res) => {
  const functionName = "assignRoleToUser";
  try {
    const schema = Joi.object({
      user_id: Joi.string().uuid().required(),
      role_id: Joi.string().uuid().required(),
      assign: Joi.boolean(),
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

    // Delegate to service method
    return await assignRoleToUserService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const getUserData = async (req, res) => {
  const functionName = "getUserData";
  try {
    const schema = Joi.object({
      token: Joi.string().required(),
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
    // Delegate to service method
    return await getUserDataService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const setPassword = async (req, res) => {
  const functionName = "setPassword";
  try {
    const schema = Joi.object({
      token: Joi.string().required(),
      password: Joi.string().trim().max(256).required(),
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
    // Delegate to service method
    return await setPasswordService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const acceptInvitation = async (req, res) => {
  const functionName = "acceptInvitation";
  try {
    const schema = Joi.object({
      token: Joi.string().required()
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
    
    return await acceptInvitationService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};
