import {
  responseRESTError,
  responseREST,
  dbStatus,
  responseWithError,
  responseWithData,
  httpStatus,
} from "../../common/functions.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../../common/mail-sender.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import slugify from "slugify";
import { REDIS_CHANNELS, EMAIL_TEMPLATES } from "../../common/variables.js";
import axios from "axios";
import { addJob } from "../../config/queueManager.js";
import { profile } from "console";
import e from "express";
import { OAuth2Client } from "google-auth-library";
import { nanoid } from "nanoid";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const preRegisterService = async (req, res) => {
  const functionName = "preRegisterService";

  try {
    const { email_id, password } = req.body;

    // Check email existence
    const exists = await global.$main.oneOrNone(
      `
        SELECT EXISTS (
            SELECT 1 
            FROM users 
            WHERE LOWER(email) = $1
            AND deleted_at IS NULL
            AND status = $2
        )
      `,
      [email_id, dbStatus.ENABLE]
    );

    if (exists.exists) {
      return responseRESTError(
        req,
        res,
        new Error(req.t("msg.email_already_exists"))
      );
    }

    // Create jwt token
    const token = jwt.sign(
      { email: email_id, password: password },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_TOKEN_EXPIRY || "600s",
      }
    );

    // Send verification email
    const mailResponse = await sendMail(
      req,
      email_id,
      EMAIL_TEMPLATES.PRE_REGISTRATION_VERIFICATION,
      { token, email: email_id }
    );

    if (!mailResponse.status) {
      return responseRESTError(
        req,
        res,
        req.t("msg.failed_to_send_verification_email")
      );
    }

    // Audit logging
    $logger.info(
      functionName,
      { email_id: email_id, exists: exists.exists },
      req,
      "Email check completed"
    );

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.verification_email_sent")
    );
  } catch (error) {
    $logger.error(
      functionName,
      { email_id: req.body.email_id },
      req,
      error.message
    );
    return responseRESTError(req, res, error);
  }
};

export const verifyRegistrationLinkService = async (req, res) => {
  const functionName = "verifyRegistrationLinkService";

  try {
    // Verify token and extract data
    const { token, ip_address } = req.body;
    const { email, password } = jwt.verify(token, process.env.JWT_SECRET);
    const ownerRoleId = "836bb588-30c0-47ea-9e1e-473f2c53a7a3";

    const exists = await global.$main.oneOrNone(
      `SELECT EXISTS (SELECT 1 FROM users WHERE LOWER(email) = $1 AND deleted_at IS NULL AND status = $2)`,
      [email, dbStatus.ENABLE]
    );
    if (exists.exists) {
      return responseRESTError(
        req,
        res,
        new Error(req.t("msg.email_already_exists"))
      );
    }

    const data = await global.$main.task(async (ts) => {
      // Get geolocation and generate script ID in parallel
      const [geoLocationResponse, scriptId, passwordHash] = await Promise.all([
        getGeoLocation(ip_address),
        generateScriptId(ts),
        bcrypt.hash(password, 10),
      ]);

      // Process geo location data
      const {
        country_name: country = "india",
        time_zone: { id: timeZone } = {},
        city = "",
        zip = "",
        region_name: state = "",
      } = geoLocationResponse || {};

      // Get location related data using batch queries
      const locationData = await ts.batch([
        ts.oneOrNone("SELECT id FROM countries WHERE name ILIKE $1", [country]),
        ts.oneOrNone(
          `SELECT value->>'language_id' as id FROM common WHERE key = $1`,
          ["general_settings"]
        ),
        ts.oneOrNone("SELECT id FROM currencies WHERE is_default = $1", [true]),
        state
          ? ts.oneOrNone("SELECT id FROM states WHERE name ILIKE $1", [state])
          : null,
        timeZone
          ? ts.oneOrNone("SELECT id FROM timezones WHERE name ILIKE $1", [
              timeZone,
            ])
          : null,
      ]);

      const [countryData, languageData, currencyData, stateData, timezoneData] =
        locationData;

      if (!countryData) {
        return responseRESTError(
          req,
          res,
          new Error(req.t("country.country_not_found"))
        );
      }

      const userData = await ts.tx("create-user", async (t) => {
        try {
          // First: Insert User
          const user = await t.one(
            `
            INSERT INTO users (
              email,
              country_id,
              timezone_id,
              language_id,
              created_at,
              updated_at,
              settings
            ) VALUES ( $1, $2, $3, $4, NOW(), NOW(), $5)
            RETURNING id, email
          `,
            [
              email,
              countryData.id,
              timezoneData.id,
              languageData.id,
              { theme: "default" },
            ]
          );

          // Second: Insert Organization
          const organization = await t.one(
            `
            INSERT INTO organizations (
              email,
              script_id,
              country_id,
              timezone_id,
              currency_id,
              state_id,
              city,
              zip_code,
              created_by,
              created_at,
              updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
            RETURNING id
            `,
            [
              email,
              scriptId,
              countryData.id,
              timezoneData.id,
              currencyData.id,
              stateData.id,
              city,
              zip,
              user.id,
            ]
          );

          const session_id = crypto.randomUUID();
          const [accessToken, refreshToken] = await Promise.all([
            generateToken("access_token", session_id, user.id, organization.id),
            generateToken(
              "refresh_token",
              session_id,
              user.id,
              organization.id
            ),
          ]);

          // Third: Parallel insertions using batch
          await t.batch([
            // User Authentication
            t.none(
              `
              INSERT INTO user_authentications (
                user_id,
                password,
                is_two_fa_enabled,
                default_two_fa_method,
                email_verified_at,
                default_organization_id,
                default_role_id
              ) VALUES ($1, $2, $3, $4, NOW(), $5, $6)
            `,
              [
                user.id,
                passwordHash,
                false,
                "email",
                organization.id,
                ownerRoleId,
              ]
            ),

            // User Account
            t.none(
              `
              INSERT INTO user_organizations (
                user_id,
                organization_id,
                status,
                created_at,
                updated_at,
                created_by
              ) VALUES ($1, $2, $3, NOW(), NOW(), $4)
            `,
              [user.id, organization.id, dbStatus.ENABLE, user.id]
            ),

            // User Login Session
            t.none(
              `
              INSERT INTO user_login_sessions (
                id,
                user_id,
                browser,
                os,
                ip_address,
                login_at,
                log,
                two_fa_status,
                refresh_token,
                remember_me
              ) VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8, $9)
            `,
              [
                session_id,
                user.id,
                req?.useragent?.browser,
                req?.useragent?.os,
                req?.ip,
                "User registered successfully",
                "done",
                refreshToken,
                false,
              ]
            ),
          ]);

          //database creation call to queue
          await addJob(
            REDIS_CHANNELS.DB_CREATION_QUEUE,
            {
              user_id: user.id,
              organization_id: organization.id,
              email: email,
              ownerRoleId: ownerRoleId,
            },
            {
              priority: 1,
            }
          );

          // Return created user and organization details
          return {
            user_id: user.id,
            email: user.email,
            organization_id: organization.id,
            script_id: scriptId,
            session_id,
            accessToken,
            refreshToken,
          };
        } catch (error) {
          throw error;
        }
      });

      return {
        userData,
        locationData,
      };
    });

    await $redis.set(
      `access_${data.userData.user_id}_${data.userData.session_id}`,
      {
        email: data.userData.email,
        user_id: data.userData.user_id,
        organization_id: data.userData.organization_id,
        session_id: data.userData.session_id,
      },
      parseInt(process.env.ACCESS_TOKEN_EXPIRY_MILISECONDS) / 1000
    );

    const response = {
      accessToken: data.userData.accessToken,
      refreshToken: accessToken,
      user: {
        id: data.userData.user_id,
        email: data.userData.email,
        first_name: null,
        last_name: null,
        theme: "default",
        profile_picture_url: "",
        organization: {
          id: data.userData.organization_id,
          name: "",
          logo_url: "",
          sub_domain: "",
          script_id: data.userData.script_id,
          is_script_installed: false,
        },
      },
    };

    $logger.info(
      functionName,
      { response },
      req,
      "User registered successfully"
    );
    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.user_registered_successfully"),
      response,
      null
    );
  } catch (error) {
    $logger.error(functionName, null, req, "", error.message);
    return responseRESTError(req, res, error);
  }
};

export const registrationDataService = async (req, res) => {
  try {
    const { first_name, last_name, organization_name, other_info } = req.body;
    let subDomain = slugify(organization_name.split(" ")[0].toLowerCase(), {
      replacement: "-",
      remove: /[*+~.()'"!:@]/g,
      lower: true, // Convert to lower case, defaults to `false`
      strict: true, // Strip special characters except replacement, defaults to `false`
      locale: "en", // Language code of the locale to use
      trim: true,
    });

    await global.$main.task(async (ts) => {
      subDomain = await checkSubDomain(ts, subDomain);
      await ts.batch([
        ts.none(
          `UPDATE organizations SET subdomain = $1, name = $2, other_info = $3 WHERE id = $4`,
          [
            subDomain,
            organization_name,
            other_info,
            req.userInfo.organization_id,
          ]
        ),
        ts.none(
          `UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3`,
          [first_name, last_name, req.userInfo.user_id]
        ),
      ]);
    });

    console.log("Registration Data Service");

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.organization_created_successfully"),
      req.body
    );
  } catch (error) {
    $logger.error(functionName, null, req, "", error.message);
    return responseRESTError(req, res, error);
  }
};

export const loginService = async (req, res) => {
  const functionName = "loginService";
  try {
    const { email, password } = req.body;

    // Generate session ID and tokens
    const session_id = crypto.randomUUID();
    const result = await global.$main.task(async (t) => {
      // Check if user exists and is active
      const user = await t.oneOrNone(
        `SELECT 
          u.id as user_id, 
          u.email,
          u.first_name,
          u.last_name,
          u.settings->>'theme' as theme,
          u.profile_picture_url,
          ua.password, 
          ua.default_organization_id,
          ua.default_role_id,
          o.name as organization_name,
          o.script_id,
          o.logo_url,
          o.subdomain,
          is_script_installed,
          s.id as subscription_id,
          pp.package_id
         FROM users u
         INNER JOIN user_authentications ua ON ua.user_id = u.id 
         INNER JOIN user_organizations uo ON uo.user_id = u.id AND uo.status = $3
         INNER JOIN organizations o ON o.id = uo.organization_id AND o.status = $4
         INNER JOIN subscriptions s ON s.organization_id = o.id
         LEFT JOIN package_prices pp ON pp.id = s.package_price_id
         WHERE LOWER(u.email) = LOWER($1)
         AND u.deleted_at IS NULL 
         AND u.status = $2
         LIMIT 1`,
        [email, dbStatus.ENABLE, dbStatus.ENABLE, dbStatus.ENABLE]
      );

      if (!user) {
        return responseWithErrorAndMessage(
          httpStatus.UNAUTHORIZED,
          req.t("msg.invalid_credentials"),
          null
        );
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return responseWithErrorAndMessage(
          httpStatus.UNAUTHORIZED,
          req.t("msg.invalid_credentials"),
          null
        );
      }

      const [accessToken, refreshToken] = await Promise.all([
        generateToken(
          "access_token",
          session_id,
          user.user_id,
          user.default_organization_id
        ),
        generateToken(
          "refresh_token",
          session_id,
          user.user_id,
          user.default_organization_id
        ),
      ]);

      // Create login session
      await t.none(
        `INSERT INTO user_login_sessions (
          id,
          user_id,
          browser,
          os,
          ip_address,
          login_at,
          log,
          two_fa_status,
          refresh_token,
          remember_me
        ) VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8, $9)`,
        [
          session_id,
          user.user_id,
          req?.useragent?.browser,
          req?.useragent?.os,
          req?.ip,
          "User logged in successfully",
          "no",
          refreshToken,
          false,
        ]
      );

      const userData = {
        accessToken,
        refreshToken,
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_picture_url: user.profile_picture_url,
        role_id: user.default_role_id,
        organization_id: user.default_organization_id,
        organization_name: user.organization_name,
        script_id: user.script_id,
        email: user.email,
        theme: user.theme || "default",
        sub_domain: user.subdomain,
        logo_url: user.logo_url,
        is_script_installed: user.is_script_installed,
      };
      return {
        status: true,
        data: userData,
      };
    });

    if (!result.status) {
      return responseREST(
        res,
        {
          status: result.status,
          statusCode: result.statusCode,
        },
        result.message
      );
    }

    const response = {
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
      user: {
        id: result.data.user_id,
        email: result.data.email,
        first_name: result.data.first_name,
        last_name: result.data.last_name,
        theme: result.data.theme,
        profile_picture_url: result.data.profile_picture_url,
        organization: {
          id: result.data.organization_id,
          name: result.data?.organization_name || "",
          logo_url: result.data.logo_url,
          sub_domain: result.data.sub_domain,
          script_id: result.data.script_id,
          is_script_installed: result.data.is_script_installed,
        },
      },
    };

    responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.login_successful"),
      response
    );

    await $redis.set(
      `access_${result.data.user_id}_${session_id}`,
      {
        email: result.data.email,
        user_id: result.data.user_id,
        role_id: result.data.role_id,
        organization_id: result.data.organization_id,
        subscription_id: result.data?.subscription_id || "free",
        package_id: result.data?.package_id || "free",
      },
      parseInt(process.env.ACCESS_TOKEN_EXPIRY_MILISECONDS) / 1000
    );
  } catch (error) {
    $logger.error(functionName, null, req, "", error.message);
    return responseRESTError(req, res, error);
  }
};

/**
 * Get geolocation data from IP address
 * @param {string} ip_address - IP address
 * @returns {Promise<Object>} Geolocation data
 */
const getGeoLocation = async (ip_address) => {
  const response = await axios.get(
    `https://api.ipstack.com/${ip_address}?access_key=${process.env.IPSTACK_API_KEY}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch geo location data");
  }

  return response.data;
};

/**
 * Generate unique script ID for organization
 * @param {Object} t - Database transaction object
 * @returns {Promise<string>} Generated script ID
 */
const generateScriptId = async (t) => {
  const nanoid = await import("nanoid");
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Using recursive function with pg-promise
  const generateUniqueId = async () => {
    const scriptId = nanoid.customAlphabet(alphabet, 10)();
    const exists = await t.oneOrNone(
      "SELECT EXISTS(SELECT 1 FROM organizations WHERE script_id = $1)",
      [scriptId]
    );
    return exists.exists ? generateUniqueId() : scriptId;
  };

  return generateUniqueId();
};

/**
 * Generates access or refresh token
 * @param {string} type - Token type (access_token/refresh_token)
 * @param {string} session_id - Session ID
 * @param {string} user_id - User ID
 * @param {string} organization_id - Organization ID
 * @returns {Promise<string>} Generated token
 */
const generateToken = async (type, session_id, user_id, organization_id) => {
  const expirySeconds =
    type === "access_token"
      ? process.env.ACCESS_TOKEN_EXPIRY_MILISECONDS
      : process.env.REFRESH_TOKEN_EXPIRY_SECONDS;

  const expiresAt = new Date(Date.now() + parseInt(expirySeconds) * 1000);

  return jwt.sign(
    {
      session_id,
      organization_id,
      user_id,
      expiresAt,
    },
    process.env.JWT_SECRET,
    { expiresIn: expirySeconds }
  );
};

const checkSubDomain = async (db, subDomain) => {
  let uniqueSubDomain = subDomain;
  let exists = true;

  while (exists) {
    exists = await db.oneOrNone(
      `SELECT 
        CASE 
          WHEN EXISTS (SELECT 1 FROM organizations WHERE subdomain = $1) 
          OR EXISTS (SELECT 1 FROM restricted_sub_domains WHERE name = $1)
          THEN true
          ELSE false
        END as exists`,
      [uniqueSubDomain]
    );

    if (exists.exists) {
      const suffix = uniqueSubDomain.match(/-(\d+)$/);
      const newSuffix = suffix ? parseInt(suffix[1]) + 1 : 1;
      uniqueSubDomain = `${subDomain}-${newSuffix}`;
    } else {
      exists = false;
    }
  }

  return uniqueSubDomain;
};

export const forgotPasswordService = async (req, res) => {
  const functionName = "forgotPasswordService";
  try {
    const { email } = req.body;

    // Check if user exists and is active
    const user = await global.$main.oneOrNone(
      `SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name
       FROM users u
       WHERE LOWER(u.email) = LOWER($1)
       AND u.deleted_at IS NULL 
       AND u.status = $2
       LIMIT 1`,
      [email, dbStatus.ENABLE]
    );

    if (!user) {
      return responseREST(
        res,
        httpStatus.NOT_FOUND,
        req.t("msg.invalid_email")
      )
    }

    // Create reset token that expires in 1 hour
    const resetToken = jwt.sign(
      { user_id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send reset password email
    const mailResponse = await sendMail(
      req,
      email,
      EMAIL_TEMPLATES.RESET_PASSWORD_LINK,
      {
        token: resetToken,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      }
    );

    if (!mailResponse.status) {
      return responseREST(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        req.t("msg.error_sending_email")
      );
    }

    // Store reset token in Redis with expiry
    await $redis.set(
      `reset_password_${user.id}`,
      resetToken,
      3600 // 1 hour in seconds
    );

    // Audit logging
    $logger.info(
      functionName,
      { email },
      req,
      "Reset password email sent successfully"
    );

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.reset_password_link_sent")
    );
  } catch (error) {
    $logger.error(functionName, { email: req.body.email }, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const resetPasswordService = async (req, res) => {
  const functionName = "resetPasswordService";
  try {
    const { token, password } = req.body;

    // Verify token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return responseREST(
        res,
        httpStatus.NOT_SUCCESS,
        req.t("msg.invalid_reset_token")
      );
    }

    // Check if token exists in Redis
    const storedToken = await $redis.get(
      `reset_password_${decodedToken.user_id}`
    );
    if (!storedToken || storedToken !== token) {
      return responseREST(
        res,
        httpStatus.BAD_REQUEST,
        req.t("msg.reset_link_doesnt_exists")
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password in database
    const result = await global.$main.tx(async (t) => {
      // Update password in user_authentications table
      await t.none(
        `UPDATE user_authentications 
         SET password = $1
         WHERE user_id = $2`,
        [hashedPassword, decodedToken.user_id]
      );

      // Get user details for email
      const user = await t.one(
        `SELECT 
          u.email,
          u.first_name,
          u.last_name
         FROM users u
         WHERE u.id = $1`,
        [decodedToken.user_id]
      );

      return user;
    });

    // Delete reset token from Redis
    await $redis.del(`reset_password_${decodedToken.user_id}`);

    // Send password change confirmation email
    await sendMail(req, result.email, EMAIL_TEMPLATES.PASSWORD_CHANGED, {
      first_name: result.first_name,
      last_name: result.last_name,
      email: result.email,
    });

    // Audit logging
    $logger.info(
      functionName,
      { user_id: decodedToken.user_id },
      req,
      "Password reset successful"
    );

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.reset_password_successful")
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const sendMagicLinkService = async (req, res) => {
  const functionName = "sendMagicLinkService";
  try {
    const { email } = req.body;

    // Check if user exists and is active
    const user = await global.$main.oneOrNone(
      `SELECT 
        u.id as user_id,
        u.email,
        u.first_name,
        u.last_name,
        u.settings->>'theme' as theme,
        u.profile_picture_url,
        ua.default_organization_id,
        ua.default_role_id,
        o.name as organization_name,
        o.script_id,
        o.logo_url,
        o.subdomain as sub_domain,
        o.is_script_installed,
        s.id as subscription_id,
        pp.package_id
       FROM users u
       INNER JOIN user_authentications ua ON ua.user_id = u.id 
       INNER JOIN user_organizations uo ON uo.user_id = u.id AND uo.status = $3
       INNER JOIN organizations o ON o.id = uo.organization_id AND o.status = $4
       INNER JOIN subscriptions s ON s.organization_id = o.id
       LEFT JOIN package_prices pp ON pp.id = s.package_price_id
       WHERE LOWER(u.email) = LOWER($1)
       AND u.deleted_at IS NULL 
       AND u.status = $2
       LIMIT 1`,
      [email, dbStatus.ENABLE, dbStatus.ENABLE, dbStatus.ENABLE]
    );

    if (!user) {
      return responseREST(
        res,
        httpStatus.NOT_FOUND,
        req.t("msg.user_not_found")
      );
    }

    // Generate unique magic link token
    const magicToken = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        userData: user,
        type: "magic_link",
        timestamp: Date.now(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Store token in Redis with expiry
    await $redis.set(
      `magic_link_${user.user_id}`,
      magicToken,
      900 // 15 minutes in seconds
    );

    // Generate magic link URL
    const magicLinkUrl = `${process.env.FRONTEND_URL}/auth/magic-link?token=${magicToken}`;

    // Send magic link email
    const mailResponse = await sendMail(
      req,
      email,
      EMAIL_TEMPLATES.MAGIC_LINK_LOGIN,
      {
        magic_link: magicLinkUrl,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      }
    );

    if (!mailResponse.status) {
      throw new Error(req.t("msg.failed_to_send_magic_link"));
    }

    $logger.info(
      functionName,
      { email, user_id: user.user_id },
      req,
      "Magic link sent successfully"
    );

    return responseREST(res, httpStatus.SUCCESS, req.t("msg.magic_link_sent"));
  } catch (error) {
    $logger.error(functionName, { email: req.body.email }, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const verifyMagicLinkService = async (req, res) => {
  const functionName = "verifyMagicLinkService";
  try {
    const { token } = req.body;

    // Verify token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Verify token type
      if (decodedToken.type !== "magic_link") {
        return responseREST(
          res,
          httpStatus.UNAUTHORIZED,
          req.t("msg.invalid_magic_link")
        );
      }
    } catch (error) {
      return responseREST(
        res,
        httpStatus.UNAUTHORIZED,
        req.t("msg.invalid_magic_link")
      );
    }

    // Check if token exists in Redis
    const storedToken = await $redis.get(`magic_link_${decodedToken.user_id}`);
    if (!storedToken || storedToken !== token) {
      return responseREST(
        res,
        httpStatus.NOT_FOUND ,
        req.t("msg.magic_link_expired")
      );
    }

    // Delete magic link token from Redis (one-time use)
    await $redis.del(`magic_link_${decodedToken.user_id}`);

    // Verify user is still active
    const user = await global.$main.oneOrNone(
      `SELECT id FROM users 
       WHERE id = $1 
       AND deleted_at IS NULL 
       AND status = $2`,
      [decodedToken.user_id, dbStatus.ENABLE]
    );

    if (!user) {
      return responseREST(
        res,
        httpStatus.NOT_FOUND,
        req.t("msg.user_not_found")
      );
    }

    const session_id = crypto.randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      generateToken(
        "access_token",
        session_id,
        user.user_id,
        user.default_organization_id
      ),
      generateToken(
        "refresh_token",
        session_id,
        user.user_id,
        user.default_organization_id
      ),
    ]);

    await global.$main.none(
      `INSERT INTO user_login_sessions (
        id,
        user_id,
        browser,
        os,
        ip_address,
        login_at,
        log,
        two_fa_status,
        refresh_token,
        remember_me
      ) VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8, $9)`,
      [
        session_id,
        user.user_id,
        req?.useragent?.browser,
        req?.useragent?.os,
        req?.ip,
        "User logged in successfully with magic link",
        "no",
        refreshToken,
        false,
      ]
    );

    await $redis.set(
      `access_${user.user_id}_${session_id}`,
      {
        email: user.email,
        user_id: user.user_id,
        role_id: user.default_role_id,
        organization_id: user.default_organization_id,
        subscription_id: user?.subscription_id || "free",
        package_id: user?.package_id || "free",
      },
      parseInt(process.env.ACCESS_TOKEN_EXPIRY_MILISECONDS) / 1000
    );

    // Log successful login
    $logger.info(
      functionName,
      { user_id: decodedToken.user_id },
      req,
      "Magic link login successful"
    );

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.login_successful"),
      {
        accessToken,
        refreshToken,
        user: {
          id: decodedToken.userData.user_id,
          email: decodedToken.userData.email,
          first_name: decodedToken.userData.first_name,
          last_name: decodedToken.userData.last_name,
          theme: decodedToken.userData.theme,
          profile_picture_url: decodedToken.userData.profile_picture_url,
          organization: {
            id: decodedToken.userData.default_organization_id,
            name: decodedToken.userData.organization_name,
            logo_url: decodedToken.userData.logo_url,
            sub_domain: decodedToken.userData.sub_domain,
            script_id: decodedToken.userData.script_id,
            is_script_installed: decodedToken.userData.is_script_installed,
          },
        },
      }
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const refreshTokenService = async (req, res) => {
  const functionName = "refreshTokenService";
  try {
    const { refresh_token } = req.body;

    // Verify refresh token
    let decodedToken;
    try {
      decodedToken = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return responseREST(
        res,
        httpStatus.UNAUTHORIZED,
        req.t("msg.invalid_refresh_token")
      );
    }

    // Check if refresh token exists in database
    const tokenExists = await global.$main.oneOrNone(
      `SELECT EXISTS (
        SELECT 1 
        FROM user_login_sessions 
        WHERE refresh_token = $1 
        AND user_id = $2
        AND id = $3
      )`,
      [refresh_token, decodedToken.user_id, decodedToken.session_id]
    );

    if (!tokenExists.exists) {
      return responseREST(
        res,
        httpStatus.UNAUTHORIZED,
        req.t("msg.invalid_refresh_token")
      );
    }

    // Get user data
    const user = await global.$main.oneOrNone(
      `SELECT 
        u.id as user_id,
        u.email,
        u.first_name,
        u.last_name,
        u.settings->>'theme' as theme,
        u.profile_picture_url,
        ua.default_organization_id,
        ua.default_role_id,
        o.name as organization_name,
        o.script_id,
        o.logo_url,
        o.subdomain as sub_domain,
        o.is_script_installed,
        s.id as subscription_id,
        pp.package_id
       FROM users u
       INNER JOIN user_authentications ua ON ua.user_id = u.id 
       INNER JOIN user_organizations uo ON uo.user_id = u.id AND uo.status = $3
       INNER JOIN organizations o ON o.id = uo.organization_id AND o.status = $4
       INNER JOIN subscriptions s ON s.organization_id = o.id
       LEFT JOIN package_prices pp ON pp.id = s.package_price_id
       WHERE u.id = $1
       AND u.deleted_at IS NULL 
       AND u.status = $2
       LIMIT 1`,
      [decodedToken.user_id, dbStatus.ENABLE, dbStatus.ENABLE, dbStatus.ENABLE]
    );

    if (!user) {
      return responseREST(
        res,
        httpStatus.NOT_FOUND,
        req.t("msg.user_not_found")
      );
    }

    const [access_token, new_refresh_token] = await Promise.all([
      generateToken(
        "access_token",
        decodedToken.session_id,
        user.user_id,
        user.default_organization_id
      ),
      generateToken(
        "refresh_token",
        decodedToken.session_id,
        user.user_id,
        user.default_organization_id
      ),
    ]);

    await $main.none(
      `UPDATE user_login_sessions 
         SET refresh_token = $1, 
             updated_at = NOW()
         WHERE id = $2`,
      [new_refresh_token, session_id]
    );

    $logger.info(
      functionName,
      {
        user_id: user.user_id,
        session_id,
      },
      req,
      "Token refresh successful"
    );

    responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.token_refresh_successful"),
      {
        access_token,
        refresh_token: new_refresh_token,
        session_id,
        user: {
          id: user.user_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          theme: user.theme,
          profile_picture_url: user.profile_picture_url,
          organization: {
            id: user.default_organization_id,
            name: user.organization_name,
            logo_url: user.logo_url,
            sub_domain: user.sub_domain,
            script_id: user.script_id,
            is_script_installed: user.is_script_installed,
          },
        },
      }
    );

    $redis.set(
      `access_${user.user_id}_${session_id}`,
      {
        email: user.email,
        user_id: user.user_id,
        role_id: user.default_role_id,
        organization_id: user.default_organization_id,
        subscription_id: user?.subscription_id || "free",
        package_id: user?.package_id || "free",
      },
      parseInt(process.env.ACCESS_TOKEN_EXPIRY_MILISECONDS) / 1000
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const googleAuthService = async (req, res) => {
  const functionName = "googleAuthService";
  try {
    const { token } = req.body;

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture, given_name, family_name } =
      ticket.getPayload();

    // Start transaction
    const result = await global.$main.tx(async (t) => {
      // Check if user exists
      let user = await t.oneOrNone(
        `SELECT 
          u.id as user_id,
          u.email,
          u.first_name,
          u.last_name,
          u.settings->>'theme' as theme,
          u.profile_picture_url,
          ua.default_organization_id,
          ua.default_role_id,
          o.name as organization_name,
          o.script_id,
          o.logo_url,
          o.subdomain as sub_domain,
          o.is_script_installed,
          s.id as subscription_id,
          pp.package_id
         FROM users u
         LEFT JOIN user_authentications ua ON ua.user_id = u.id 
         LEFT JOIN user_organizations uo ON uo.user_id = u.id AND uo.status = $3
         LEFT JOIN organizations o ON o.id = uo.organization_id AND o.status = $4
         LEFT JOIN subscriptions s ON s.organization_id = o.id AND s.is_current = true
         LEFT JOIN package_prices pp ON pp.id = s.package_price_id
         WHERE LOWER(u.email) = LOWER($1)
         AND u.deleted_at IS NULL 
         AND u.status = $2
         LIMIT 1`,
        [email, dbStatus.ENABLE, dbStatus.ENABLE, dbStatus.ENABLE]
      );

      if (!user) {
        // Create new user
        const newUser = await t.one(
          `INSERT INTO users 
            (email, first_name, last_name, profile_picture_url, status, 
             email_verified_at, settings)
           VALUES ($1, $2, $3, $4, $5, NOW(), $6)
           RETURNING id as user_id, email, first_name, last_name, profile_picture_url, 
                     settings->>'theme' as theme`,
          [
            email,
            given_name,
            family_name,
            picture,
            dbStatus.ENABLE,
            { theme: "light" },
          ]
        );

        // Create default organization for new user
        const organization = await t.one(
          `INSERT INTO organizations 
            (name, status, created_by)
           VALUES ($1, $2, $3)
           RETURNING id, name, logo_url, subdomain as sub_domain, 
                     script_id, is_script_installed`,
          [`${given_name}'s Organization`, dbStatus.ENABLE, newUser.user_id]
        );

        // Create user authentication record
        await t.none(
          `INSERT INTO user_authentications 
            (user_id, auth_type, default_organization_id, default_role_id)
           VALUES ($1, 'google', $2, $3)`,
          [newUser.user_id, organization.id, 1] // Assuming role_id 1 is default
        );

        // Create user organization mapping
        await t.none(
          `INSERT INTO user_organizations 
            (user_id, organization_id, status)
           VALUES ($1, $2, $3)`,
          [newUser.user_id, organization.id, dbStatus.ENABLE]
        );

        // Create free trial subscription
        const subscription = await t.one(
          `INSERT INTO subscriptions 
            (organization_id, is_current)
           VALUES ($1, true)
           RETURNING id as subscription_id`,
          [organization.id] // Assuming package_price_id 1 is free trial
        );

        user = {
          ...newUser,
          default_organization_id: organization.id,
          default_role_id: 1,
          organization_name: organization.name,
          script_id: organization.script_id,
          logo_url: organization.logo_url,
          sub_domain: organization.sub_domain,
          is_script_installed: organization.is_script_installed,
          subscription_id: subscription.subscription_id,
          package_id: 1, // Free trial package
        };
      }

      // Generate tokens
      const { access_token, refresh_token } = signJWTs({
        user_id: user.user_id,
        email: user.email,
        role_id: user.default_role_id,
        package_id: user.package_id,
        organization_id: user.default_organization_id,
        subscription_id: user.subscription_id,
      });

      // Get user agent details
      const userAgent = req.useragent;
      const deviceType = userAgent.isMobile
        ? "mobile"
        : userAgent.isTablet
        ? "tablet"
        : "desktop";

      // Create login session
      const loginSession = await t.one(
        `INSERT INTO user_login_sessions 
          (user_id, organization_id, refresh_token, ip_address, user_agent, 
           browser, browser_version, os, os_version, device_type, device_brand, 
           device_model, is_mobile, is_tablet, is_desktop, login_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         RETURNING id`,
        [
          user.user_id,
          user.default_organization_id,
          refresh_token,
          req.ip,
          userAgent.source,
          userAgent.browser,
          userAgent.version,
          userAgent.os,
          userAgent.os_version,
          deviceType,
          userAgent.platform,
          userAgent.device || null,
          userAgent.isMobile,
          userAgent.isTablet,
          userAgent.isDesktop,
          "google",
        ]
      );

      // Store session in Redis
      await $redis.hset(`session:${loginSession.id}`, {
        user_id: user.user_id,
        organization_id: user.default_organization_id,
        refresh_token,
        access_token,
        device_info: JSON.stringify({
          ip: req.ip,
          user_agent: userAgent.source,
          browser: userAgent.browser,
          os: userAgent.os,
          device_type: deviceType,
        }),
        login_type: "google",
      });

      // Set Redis expiry
      await $redis.expire(`session:${loginSession.id}`, 86400 * 30); // 30 days

      // Update last login
      await t.none(`UPDATE users SET last_login_at = NOW() WHERE id = $1`, [
        user.user_id,
      ]);

      return { user, loginSession, access_token, refresh_token };
    });

    $logger.info(
      functionName,
      {
        user_id: result.user.user_id,
        session_id: result.loginSession.id,
        login_type: "google",
      },
      req,
      "Google authentication successful"
    );

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.login_successful"),
      {
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        session_id: result.loginSession.id,
        user: {
          id: result.user.user_id,
          email: result.user.email,
          first_name: result.user.first_name,
          last_name: result.user.last_name,
          theme: result.user.theme,
          profile_picture_url: result.user.profile_picture_url,
          organization: {
            id: result.user.default_organization_id,
            name: result.user.organization_name,
            logo_url: result.user.logo_url,
            sub_domain: result.user.sub_domain,
            script_id: result.user.script_id,
            is_script_installed: result.user.is_script_installed,
          },
        },
      }
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};
