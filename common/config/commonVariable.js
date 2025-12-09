/**
 * To be used for database status.
 **/

const dbStatus = {
  ENABLE: 1,
  DELETE: 2,
  DISABLE: 3,
  ARCHIVED: 4,
  UNDER_MAINTENANCE: 5,
  CANCEL: 6,
  FAILED: 7,
  PAUSE: 8,
  PENDING_CHANGES: 9,
  EARLY_ACCESS: 10,
  FORCE_DISABLE: 11,
  PROCESSING: 12,
  PROCESSED: 13,
  CONNECTED: 14,
  DISCONNECTED: 15,
};

/**
 * To be used for checking permission before each API.
 **/
const dbPermission = {
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
  CREATE: "create",
  ACTION: "action",
  EXPORT: "export",
  IMPORT: "import",
};

const spacePermission = {
  SPACE_OWNER: 1,
  ADMINISTRATOR: 2,
  CREATOR: 3,
  REVIEWER: 4,
  EDITOR: 5,
  COMMENTER: 6,
  READER: 7,
};

/**
 * To be used for checking permission before each API.
 **/
const subscriptionMode = {
  CANCEL: "cancel",
  TRIAL: "trial",
  ACTIVE: "active",
};

/**
 * To be used for setting the severity of a log
 */
const logSeverity = {
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

/**
 * Types of otp which can be used to send otp.
 **/
const otpType = {
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
  TWO_FA: "2FA",
  OTP_LOGIN: "OTP_LOGIN",
  CHANGE_EMAIL: "CHANGE_EMAIL",
  PHONE_VERIFICATION: "PHONE_VERIFICATION",
  CHANGE_PASSWORD: "CHANGE_PASSWORD",
  TWO_FA_STATUS_REQUIRED: "REQUIRED",
  TWO_FA_STATUS_DONE: "DONE",
  LINK_PHONE_TWO_FA: "LINK_PHONE_TWO_FA",
  UNLINK_PHONE_TWO_FA: "UNLINK_PHONE_TWO_FA",
  UNLINK_AUTHENTICATOR_TWO_FA: "UNLINK_AUTHENTICATOR_TWO_FA",
  CHANGE_PHONE_NO: "CHANGE_PHONE_NO",
};

/**
 * To be used for survey channel status.
 **/
const channelStatus = {
  WEBAPP: 1,
  SHAREABLE_LINK: 2,
  DEMOX: 3,
};

/**
 * Types of email templates which can be used to send emails.
 **/
const emailTemplate = {
  email_verification: "email_verification",
  otp_login: "otp_login",
  invitation_link: "invitation_link",
  two_factor_authentication_login: "two_factor_authentication_login",
  reset_password_link: "reset_password_link",
  set_password_link: "set_password_link",
  welcome_on_registration: "welcome_on_registration",
  assign_user_to_org: "assign_user_to_org",
  change_email: "change_email",
  change_password: "change_password",
  test_mail: "test_mail",
  unlink_two_factor_authentication: "unlink_two_factor_authentication",
  details_of_demo_request: "details_of_demo_request",
  new_user_register: "new_user_register",
  send_instruction: "send_instruction",
  free_trial_active: "free_trial_active",
  response_of_demo_request: "response_of_demo_request",
};

/**
 * Keys of Input type.
 **/
const inputType = {
  radioButton: "radio_button",
  textBox: "textbox",
  checkBox: "check_box",
  dropdown: "dropdown",
};

const smsText = {
  TWO_FA_TEXT:
    "{{first_name}} Userlove two-factor verification code is {{otp}}",
};

const revisionStatus = {
  UPCOMING: 3,
  CURRENT: 1,
  OLD: 2,
};

module.exports = {
  dbStatus,
  dbPermission,
  logSeverity,
  otpType,
  emailTemplate,
  inputType,
  subscriptionMode,
  smsText,
  channelStatus,
  revisionStatus,
  spacePermission,
};
