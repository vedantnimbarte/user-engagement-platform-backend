import { decrypt, httpStatus, responseWithError } from "../common/functions";
import twilio from "twilio";

const getUserPhoneDetails = async (req, userId) => {
  try {
    const query = `
            SELECT 
                u.first_name, 
                u.last_name, 
                u.phone_no, 
                c.phone_code 
            FROM users u 
            INNER JOIN country c ON u.country_id = c.country_id 
            WHERE u.user_id = $1`;

    const user = await main.oneOrNone(query, [userId]);

    if (!user?.phone_no) {
      return {
        ...httpStatus.NOT_FOUND,
        message: req.t("2FA.phone_number_not_found"),
      };
    }

    if (!user?.phone_code) {
      return {
        ...httpStatus.NOT_FOUND,
        message: req.t("2FA.mobile_prefix_not_found"),
      };
    }

    return { status: true, data: user };
  } catch (error) {
    return responseWithError(req, error);
  }
};

const getTwilioCredentials = async () => {
  const query = `
        SELECT 
            twilio_phone_no,
            twilio_account_sid,
            twilio_auth_token
        FROM twilio_setting`;

  const creds = await main.oneOrNone(query);

  if (!creds) {
    throw new Error("Twilio credentials not found");
  }

  return {
    phoneNo: creds.twilio_phone_no,
    accountSid: decrypt(creds.twilio_account_sid),
    authToken: decrypt(creds.twilio_auth_token),
  };
};

const sendOTPOnPhone = async (req, userId, replaceData, textContent) => {
  try {
    // Get user phone details
    const userResponse = await getUserPhoneDetails(req, userId);
    if (!userResponse.status) {
      return userResponse;
    }

    // Get Twilio credentials
    const creds = await getTwilioCredentials();
    const client = twilio(creds.accountSid, creds.authToken);

    // Prepare message content
    const userInfo = { ...userResponse.data, ...replaceData };
    const content = textContent.replace(
      /{{(.+?)}}/g,
      (_, key) => userInfo[key.trim()] || ""
    );

    // Send message
    await client.messages.create({
      body: content,
      from: creds.phoneNo,
      to: `+${userResponse.data.phone_code}${userResponse.data.phone_no}`,
    });

    return { status: true };
  } catch (error) {
    logger.error("SMS Send Error:", error);
    return responseWithError(req, error);
  }
};

export { sendOTPOnPhone };
