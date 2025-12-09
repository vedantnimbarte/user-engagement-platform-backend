import Joi from "joi";
import {
  responseRESTError,
  responseRESTInvalidArgs,
} from "../../common/functions.js";
import { 
  createSubscriptionService, 
  changeSubscriptionStatus, 
  listInvoices,
  getSubscriptionDetails,
  listPaymentMethods,
  deletePaymentMethod,
  getUpcomingInvoiceAmount
} from "../services/subscription.service.js";

export const createSubscription = async (req, res) => {
  try {
    const schema = Joi.object({
      price_id: Joi.string().uuid().required(),
      mau_quantity: Joi.number()
        .integer()
        .greater(0)
        .multiple(1000)
        .required(),
        trial: Joi.boolean().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return responseRESTInvalidArgs(req, res, error.details[0].message);
    }

    return await createSubscriptionService(req, res);
  } catch (error) {
    $logger.error('createSubscription', null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const changeSubscriptionStatusController = async (req, res) => {
  try {
    const schema = Joi.object({
      status: Joi.string().valid('cancel', 'reactivate').required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return responseRESTInvalidArgs(res, {error});
    }

    return await changeSubscriptionStatus(req, res);
  } catch (error) {
    $logger.error('changeSubscriptionStatus', null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const listInvoicesController = async (req, res) => {
  try {
    const schema = Joi.object({
      limit: Joi.number().integer().min(1).max(100).optional(),
      starting_after: Joi.string().optional()
    });

    const { error } = schema.validate(req.query);
    if (error) {
      return responseRESTInvalidArgs(res, {error});
    }

    return await listInvoices(req, res);
  } catch (error) {
    $logger.error('listInvoices', null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const getSubscriptionDetailsController = async (req, res) => {
  try {
    return await getSubscriptionDetails(req, res);
  } catch (error) {
    $logger.error('getSubscriptionDetails', null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const listPaymentMethodsController = async (req, res) => {
  try {
    return await listPaymentMethods(req, res);
  } catch (error) {
    $logger.error('listPaymentMethods', null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const deletePaymentMethodController = async (req, res) => {
  try {
    const schema = Joi.object({
      payment_method_id: Joi.string().required().pattern(/^pm_/)
    });

    const { error } = schema.validate(req.params);
    if (error) {
      return responseRESTInvalidArgs(req, res, error.details[0].message);
    }

    return await deletePaymentMethod(req, res);
  } catch (error) {
    $logger.error('deletePaymentMethod', null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const getUpcomingInvoiceAmountController = async (req, res) => {
  try {
    const schema = Joi.object({
      price_id: Joi.string().uuid().required(),
      mau_quantity: Joi.number()
        .integer()
        .greater(0)
        .multiple(1000)
        .required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return responseRESTInvalidArgs(req, res, error.details[0].message);
    }

    return await getUpcomingInvoiceAmount(req, res);
  } catch (error) {
    $logger.error('getUpcomingInvoiceAmount', null, req, error.message);
    return responseRESTError(req, res, error);
  }
};
