import common from "@userplus/common";
import { addJob } from "../config/queueManager.js";
import { REDIS_CHANNELS } from "./variables.js";

const { httpStatus } = common;

const sendMail = async (req, emailId, emailTemplateName, data) => {
  try {
    const mailData = {
      email_id: emailId,
      email_template_key: emailTemplateName,
      data: data,
      withUserId: true,
    };

    // Add job to the mail queue
    await addJob(REDIS_CHANNELS.MAIL_QUEUE, mailData);
    return { ...httpStatus.SUCCESS };
  } catch (error) {
    console.error("Error sending mail:", error);
    return {
      ...httpStatus.INTERNAL_SERVER_ERROR,
      message: req.t("msg.internal_server_error"),
      data: null,
      error: error.message,
    };
  }
};

const sendMailRestAPI = async (req, emailTemplateName, data) => {
  try {
    const mailData = {
      email_template_key: emailTemplateName,
      data: data,
      withUserId: false,
    };

    // Add job to the mail queue
    await mailQueue.add(mailData);
    return { ...httpStatus.SUCCESS };
  } catch (error) {
    return {
      ...httpStatus.INTERNAL_SERVER_ERROR,
      message: req.t("msg.internal_server_error"),
      data: null,
      error: error.message,
    };
  }
};

export { sendMail, sendMailRestAPI };
