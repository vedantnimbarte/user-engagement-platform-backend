import common from "@userplus/common";
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

const {
  dbStatus,
  dbPermission,
  otpType,
  pathOfService,
  pathOfServiceMui,
  emailTemplate,
  smsText,
  httpStatus,
  signJWTs,
  encrypt,
  decrypt,
  generateOTP,
  responseWithError,
  responseWithErrorAndMessage,
  responseRESTError,
  responseREST,
  responseWithData,
  responseRESTInvalidArgs,
  subscriptionMode,
  verifyUser,
  getTenantByAccountId,
} = common;

const getSMTPSettings = async () => {
  try {
    // const smtpSettingData = await global.pool.query(
    // 	`SELECT mail_protocol_type, smtp_host, smtp_user_name,
    // 	smtp_password, from_email_id, smtp_port, timeout FROM smtp_setting;`
    // );

    // if (!smtpSettingData.rowCount) {
    // 	return {
    // 		status: false,
    // 		error: ['SMTP Setting is not defined.']
    // 	};
    // }

    // smtpSettingData.rows[0].smtp_password = decrypt(
    // 	smtpSettingData.rows[0].smtp_password
    // );

    const emailConfig = {
      host: process.env.MAIL_HOST,
      secureConnection: process.env.MAIL_SECURE_CONNECTION === "true",
      port: parseInt(process.env.MAIL_PORT, 10),
      auth: {
        user: process.env.MAIL_USER_NAME,
        pass: process.env.MAIL_PASSWORD,
      },
    };

    const sourceEmail = process.env.MAIL_FROM_EMAIL;
    const mailTransporter = nodemailer.createTransport(
      smtpTransport(emailConfig)
    );
    return { status: true, sourceEmail: sourceEmail, mailTransporter };
  } catch (error) {
    return {
      status: false,
      error: error.message,
    };
  }
};

export {
  dbStatus,
  dbPermission,
  otpType,
  pathOfService,
  pathOfServiceMui,
  emailTemplate,
  smsText,
  httpStatus,
  signJWTs,
  encrypt,
  decrypt,
  generateOTP,
  responseWithError,
  responseWithErrorAndMessage,
  responseRESTError,
  responseREST,
  responseWithData,
  responseRESTInvalidArgs,
  subscriptionMode,
  verifyUser,
  getTenantByAccountId,
  getSMTPSettings,
};
