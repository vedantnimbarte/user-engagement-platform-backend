import Joi from "joi";
import {
  responseRESTError,
  responseRESTInvalidArgs,
} from "../../common/functions.js";
import {
  listSurveysService,
  getSurveyService,
  createSurveyService,
  updateSurveyService,
  deleteSurveyService,
  createQuestionService,
  updateQuestionService,
  deleteQuestionService,
  publishSurveyService,
  listQuestionsService,
} from "../services/surveyService.js";

export const listSurveys = async (req, res) => {
  const functionName = "listSurveys";
  try {

    return await listSurveysService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const getSurvey = async (req, res) => {
  const functionName = "getSurvey";
  try {
    const schema = Joi.object({
      id: Joi.number().required(),
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

    return await getSurveyService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const createSurvey = async (req, res) => {
  const functionName = "createSurvey";
  try {
    const schema = Joi.object({
      name: Joi.string().max(255).required(),
      description: Joi.string().optional(),
      type: Joi.string().optional()
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

    return await createSurveyService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const updateSurvey = async (req, res) => {
  const functionName = "updateSurvey";
  try {
    const schema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().max(255).optional(),
      description: Joi.string().optional(),
      design: Joi.object().optional(),
      target: Joi.object().optional(),
      trigger: Joi.object().optional(),
      other: Joi.object().optional()
    });

    const validate = schema.validate({ ...req.params, ...req.body });
    if (validate.error) {
      $logger.warn(
        functionName,
        { ...req.params, ...req.body },
        req,
        "Invalid Argument Passed: " + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }

    return await updateSurveyService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const deleteSurvey = async (req, res) => {
  const functionName = "deleteSurvey";
  try {
    const schema = Joi.object({
      id: Joi.number().required(),
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

    return await deleteSurveyService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const listQuestions = async (req, res) => {
  const functionName = "listQuestions";
  try {
    const schema = Joi.object({
      surveyId: Joi.number().required(),
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

    return await listQuestionsService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const createQuestion = async (req, res) => {
  const functionName = "createQuestion";
  try {
    const schema = Joi.object({
      surveyId: Joi.number().required(),
      element_type: Joi.string().max(255).required(),
      question: Joi.object().required(),
      logic: Joi.object().optional(),
      setting: Joi.object().optional(),
      other: Joi.object().optional(),
      sort_order: Joi.number().required(),
    });

    const validate = schema.validate({ ...req.params, ...req.body });
    if (validate.error) {
      $logger.warn(
        functionName,
        { ...req.params, ...req.body },
        req,
        "Invalid Argument Passed: " + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }

    return await createQuestionService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const updateQuestion = async (req, res) => {
  const functionName = "updateQuestion";
  try {
    const schema = Joi.object({
      questionId: Joi.number().required(),
      element_type: Joi.string().max(255).optional(),
      question: Joi.object().optional(),
      logic: Joi.object().optional(),
      setting: Joi.object().optional(),
      other: Joi.object().optional(),
      sort_order: Joi.number().optional(),
    });

    const validate = schema.validate({ ...req.params, ...req.body });
    if (validate.error) {
      $logger.warn(
        functionName,
        { ...req.params, ...req.body },
        req,
        "Invalid Argument Passed: " + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }

    return await updateQuestionService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const deleteQuestion = async (req, res) => {
  const functionName = "deleteQuestion";
  try {
    const schema = Joi.object({
      questionId: Joi.number().required(),
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

    return await deleteQuestionService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const publishSurvey = async (req, res) => {
  const functionName = "publishSurvey";
  try {
    const schema = Joi.object({
      id: Joi.number().required(),
      status: Joi.string().valid("publish", "unpublish").required(),
    });

    const validate = schema.validate({...req.params, ...req.body});
    if (validate.error) {
      $logger.warn(
        functionName,
        req.params,
        req,
        "Invalid Argument Passed: " + validate.error.details[0].message
      );
      return responseRESTInvalidArgs(res, validate);
    }

    return await publishSurveyService(req, res);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};