import Joi from "joi"
import { responseRESTError, responseRESTInvalidArgs } from "../../common/functions.js";
import { deactivatingSession, manageSession, trackDataInDB, tracker, trackMe } from "../services/tracking.service.js";
import { identify } from "../services/identify.service.js";


const trackMeController = async (req, res) => {
    const controllerName = "trackMe";
    try {
      const dataValidation = Joi.object({
        session_info: Joi.object(),
        user_info: Joi.object(),
        script_id: Joi.string(),
        domain_id: Joi.number(),
        fired_at: Joi.date(),
        channel: Joi.number(),
        geo_location: Joi.object().required(),
      }).unknown(true);
      const trackMeValidate = dataValidation.validate(req.body);
  
      if (trackMeValidate.error) {
        return responseRESTInvalidArgs(res, trackMeValidate);
      }
  
      return await trackMe(req, res);
    } catch (error) {
      return responseRESTError(req, res, error);
    }
  };

  const trackController = async (req, res) => {
    const controllerName = "track";
    try {
      
  
      return await trackDataInDB(req, res);
    } catch (error) {
      return responseRESTError(req, res, error);
    }
  };

  const deactiveController = async(req,res) =>{
    const controllerName = "deactivatingSession";
    try {
      return await deactivatingSession(req, res);
    } catch (error) {
      return responseRESTError(req, res, error);
    }
  }

  const manageController = async(req,res) =>{
    const controllerName = "manageSession";
    try {
      return await manageSession(req, res);
    } catch (error) {
      return responseRESTError(req, res, error);
    }
  }
  
  const identifyController = async (req,res) => {
    try {
      return await identify(req, res);
    } catch (error) {
      return responseRESTError(req, res, error);
    }
  }

  const trackerController = async (req,res) => {
    try {
      const dataValidation = Joi.object({
        process: Joi.string().valid("page_view", "deactivate","manage_session","identify").required(),
        script_id: Joi.string().required(),
      }).unknown(true);
      const trackMeValidate = dataValidation.validate(req.body);
  
      if (trackMeValidate.error) {
        return responseRESTInvalidArgs(res, trackMeValidate);
      }
  
      return await tracker(req, res);
    } catch (error) {
      return responseRESTError(req, res, error);
    }
  }

  export {
    trackMeController,
    trackController,
    deactiveController,
    manageController,
    identifyController,
    trackerController
  }