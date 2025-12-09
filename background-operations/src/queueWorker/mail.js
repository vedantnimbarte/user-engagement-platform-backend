import { dbStatus } from "../common/functions.js";
import { getSMTPSettings } from "../common/functions.js";

const generateHTMLContent = async (templateData, userInfo, callFrom = null) => {
  const functionName = "generateHTMLContent";
  try {
    const emailDetails = {
      ...userInfo,
    };

    const content = templateData.replace(
      /{{(.+?)}}/g,
      (match) => emailDetails[match.replace("{{", "").replace("}}", "")]
    );

    if (callFrom && callFrom === "send_instruction") {
      return { status: true, data: content };
    }

    let html = `<body>${content}</body>`;
    return { status: true, data: html };
  } catch (error) {
    $logger.error(functionName, null, null, "", error.message);
    return { status: false, error: error.message };
  }
};

const sendDataOnMail = async (data) => {
  const functionName = "sendDataOnMail";
  try {
    // const result = await $main.task(async (t) => {
    const templateInfo = await $main.oneOrNone(
      `SELECT subject, content FROM email_templates 
         WHERE key ILIKE $1 AND status = $2;`,
      [data?.email_template_key.trim(), dbStatus.ENABLE]
    );
    if (!templateInfo) {
      $logger.info(functionName, data, {}, "no email template found");
      return { status: false, error: "no email template found" };
    }

    //   const userInfo = await t.oneOrNone(
    //     `SELECT * FROM users WHERE email = $1;`,
    //     [data.email_id]
    //   );

    //   if (
    //     !userInfo &&
    //     ![
    //       "early_access_request_canceled",
    //       "send_instruction",
    //       "change_email",
    //     ].includes(data.email_template_key)
    //   ) {
    //     $logger.info(
    //       functionName,
    //       data.email,
    //       {},
    //       "No user information found for the provided email ID."
    //     );
    //     return null;
    //   }

    //   return { templateInfo, userInfo };
    // });

    // if (!result) return;

    // const { templateInfo, userInfo } = result;
    const getMailConfig = await getSMTPSettings();

    if (!getMailConfig.status) {
      return getMailConfig;
    }

    const userInfoAndData = {
      // ...userInfo,
      ...data.data,
    };
    const htmlData = await generateHTMLContent(
      templateInfo.content,
      userInfoAndData,
      data.email_template_key
    );

    if (!htmlData.status) {
      return htmlData;
    }

    let subject = templateInfo.subject.includes("{{")
      ? templateInfo.subject.replace(
          /{{(.+?)}}/g,
          (match) => userInfoAndData[match.replace("{{", "").replace("}}", "")]
        )
      : templateInfo.subject;

    const fromEmail = `<${getMailConfig.sourceEmail}>`;
    const mailOptions = {
      from: fromEmail,
      to: data.email_id,
      subject: subject,
      html: htmlData.data,
      attachments: [],
    };

    const mailing = await getMailConfig.mailTransporter.sendMail(mailOptions);

    if (!mailing || mailing === "undefined" || mailing === undefined) {
      $logger.info(functionName, data, {}, "mailing error");
    }

    if (mailing.response.includes("OK")) {
      $logger.info(functionName, data, {}, "mail sent successfully");
    }
  } catch (error) {
    $logger.error(functionName, null, {}, "", error.message);
    throw new Error(error.message);
  }
};

const sendMailWithData = async (req, res) => {
  const functionName = "sendMailWithData";
  try {
    const getTemplateInfo = await global.pool.query(
      `SELECT email_subject, email_content FROM email_template 
			WHERE email_template_key ILIKE $1
			AND status = $2;`,
      [req.body.email_template_key.trim(), dbStatus.ENABLE]
    );

    if (!getTemplateInfo.rowCount) {
      $logger.info(functionName, req.body, req, "no email template found");
    }

    getTemplateInfo.data = getTemplateInfo.rows[0];

    const getMailConfig = await getSMTPSettings();

    if (!getMailConfig.status) {
      return getMailConfig;
    }

    const userInfoAndData = { ...req.body.data };

    const htmlData = await generateHTMLContent(
      getTemplateInfo.data.email_content,
      userInfoAndData,
      req.body.email_template_key
    );

    let subject = getTemplateInfo.data.email_subject;

    if (getTemplateInfo.data.email_subject.includes("{{")) {
      subject = getTemplateInfo.data.email_subject.replace(
        /{{(.+?)}}/g,
        (match) => userInfoAndData[match.replace("{{", "").replace("}}", "")]
      );
    }

    const fromEmail = `<${getMailConfig.sourceEmail}>`;

    const templateNotification = {
      details_of_demo_request: "book_demo",
      new_user_register: "new_user",
      extend_free_trial: "extend_free_trial",
      new_early_access_request: "new_early_access_request",
      alert_for_same_domain: "alert_for_same_domain",
    };

    const getEmailFromSystemNotification = await global.pool.query(
      `SELECT email_ids FROM email_notification 
					WHERE notification_key = $1;`,
      [templateNotification[req.body.email_template_key]]
    );

    const mailOptions = {
      from: fromEmail,
      to: getEmailFromSystemNotification?.rowCount
        ? getEmailFromSystemNotification.rows[0].email_ids
        : "vs505326@gmail.com",
      subject: subject,
      html: htmlData.data,
      attachments: [],
    };

    await getMailConfig.mailTransporter.sendMail(mailOptions);
  } catch (error) {
    $logger.error(functionName, null, req, "", error.message);
    throw new Error(error.message);
  }
};

export { sendDataOnMail, sendMailWithData };
