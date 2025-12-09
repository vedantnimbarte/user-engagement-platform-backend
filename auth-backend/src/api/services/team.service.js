import {
  responseREST,
  responseRESTError,
  httpStatus,
  dbStatus,
  responseWithErrorAndMessage,
} from "../../common/functions.js";
import { sendMail } from "../../common/mail-sender.js";
import { EMAIL_TEMPLATES } from "../../common/variables.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


export const getTeamUsersService = async (req, res) => {
  // TODO: Add caching to improve performance if needed.
  const functionName = "getTeamUsersService";
  try {
    const tenantDb = $connectTenant(req.userInfo.email);
    const {
      skip = 0,
      limit = 10,
      search,
      sort_by = "created_at",
      sort_order = "desc",
      status,
    } = req.query;

    // Build WHERE clause
    const whereConditions = ["u.status != $1"];
    const queryParams = [dbStatus.DELETE];
    let paramCount = 2;

    if (status) {
      whereConditions.push(`u.status = $${paramCount}`);
      queryParams.push(status);
      paramCount++;
    }

    if (search) {
      whereConditions.push(`(
        u.first_name ILIKE $${paramCount} OR 
        u.last_name ILIKE $${paramCount} OR 
        u.email ILIKE $${paramCount}
      )`);
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    // Build ORDER BY clause
    const orderBy = `u.${
      sort_by === "name"
        ? "first_name"
        : sort_by === "email"
        ? "email"
        : sort_by === "status"
        ? "status"
        : "created_at"
    } ${sort_order.toUpperCase()}`;

    // Get total count and team users with roles
    const result = await tenantDb.task(async (t) => {
      const totalCount = await t.one(
        `
        SELECT COUNT(*)::INTEGER
        FROM users u
        WHERE ${whereConditions.join(" AND ")}
        `,
        queryParams
      );

      const users = await t.any(
        `
        SELECT
          u.id,
          u.email,
          u.first_name,
          u.last_name,
          u.status,
          u.profile_picture_url,
          u.default_role_id,
          (
            SELECT json_agg(
              json_build_object(
                'role_id', role.id,
                'role_name', role.name
              )
            )
          ) AS roles
        FROM users u
        INNER JOIN user_role_associations ura ON u.id = ura.user_id
        INNER JOIN roles role ON ura.role_id = role.id
        WHERE ${whereConditions.join(" AND ")}
        GROUP BY u.id, u.email, u.first_name, u.last_name, u.status, u.profile_picture_url, u.default_role_id
        ORDER BY ${orderBy}
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
        `,
        [...queryParams, limit, skip]
      );

      return {
        data: users,
        pagination: {
          total: totalCount.count,
          skip: skip,
          limit: limit,
        },
      };
    });

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("user_list_fetched"),
      result
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const createTeamUserService = async (req, res) => {
  const functionName = "createTeamUserService";
  try {
    const { email, role, name } = req.body;
    const tenantDb = $connectTenant(req.userInfo.email);

    const teamLimit = await tenantDb.oneOrNone(
      `SELECT "limit" FROM features WHERE name = $1`,
      ["Team"]
    );
    // const teamUsage = await tenantDb.oneOrNone(
    //   `SELECT count(*)::INTEGER AS team_count FROM users WHERE status != $1`,
    //   [dbStatus.DELETE]
    // );
    // if (teamUsage.team_count >= teamLimit.limit) {
    //   return responseRESTError(req, res, "Team limit exceeded");
    // }

    const isOwnerRoleGiven = await tenantDb.oneOrNone(
      `SELECT 1 FROM roles WHERE id = $1 and name = $2`,
      [role, "Account Owner"]
    );

    if (isOwnerRoleGiven) {
      return responseRESTError(req, res, "Can not assign owner role");
    }

    // Check if user already exists
    const userExists = await $main.any(
      `SELECT uo.status as organization_status, uo.organization_id, u.status , u.email, u.first_name, u.last_name, u.id as user_id, ua.password
       FROM user_organizations uo 
       INNER JOIN users u ON uo.user_id = u.id
       INNER JOIN user_authentications ua ON u.id = ua.user_id
       WHERE u.email = $1`,
      [email]
    );
    const organization = await $main.oneOrNone(
      `SELECT name, logo_url FROM organizations WHERE id = $1`,
      [req.userInfo.organization_id]
    );

    if (userExists && userExists.length > 0) {

      //invite user to organization
      const invitationToken = jwt.sign(
        {
          user_id: userExists[0].user_id,
          organization_id: req.userInfo.organization_id,
          email: req.body.email,
          first_name: userExists[0].first_name,
          last_name: userExists[0].last_name,
          organization_name: organization.name,
          organization_logo_url: organization.logo_url,
          purpose: "invite",
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      if (userExists[0].status === dbStatus.DELETE) {
        await $main.none(
          `UPDATE users 
          SET status = $1 
          WHERE id = $2`,
          [dbStatus.ENABLE, userExists[0].id]
        );
      }

      const userExistsInOrg = userExists.find(
        (user) => user.organization_id === req.userInfo.organization_id
      );
      if (
        userExistsInOrg &&
        userExistsInOrg.organization_status === dbStatus.DELETE
      ) {
        // restore user account
        await $main.none(
          `UPDATE user_organizations 
          SET status = $1 
          WHERE user_id = $2 AND organization_id = $3`,
          [
            dbStatus.ARCHIVED,
            userExistsInOrg.user_id,
            userExistsInOrg.organization_id,  
          ]
        );
        await tenantDb.none(
          `UPDATE users 
          SET status = $1 
          WHERE user_id = $2`,
          [dbStatus.ARCHIVED, userExistsInOrg.user_id]
        );

        await sendMail(req, email, EMAIL_TEMPLATES.INVITE_USER, {
          first_name: userExists[0].first_name,
          last_name: userExists[0].last_name,
          email: userExists[0].email,
          user_id: userExists[0].user_id,
          organization_id: req.userInfo.organization_id,
          organization_name: organization.name,
          organization_logo_url: organization.logo_url,
          actionLink: `${process.env.FRONTEND_URL}/invite?token=${invitationToken}`,
        });

        return responseREST(
          res,
          httpStatus.SUCCESS,
          "User Invited successfully"
        );
      }
      if (userExistsInOrg) {
        return responseRESTError(
          req,
          res,
          "User already exists in organization"
        );
      }

      await $main.none(
        `INSERT INTO user_organizations (user_id, organization_id, status, invitation_token, invitation_role_id,created_at,created_by) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          userExists[0].user_id,
          req.userInfo.organization_id,
          dbStatus.ARCHIVED,
          invitationToken,
          req.body.role,
          new Date(),
          req.userInfo.user_id,
        ]
      );

      await tenantDb.tx(async (t) => {  
        await t.none(
          `INSERT INTO users (id, email, first_name, last_name, status, created_at, created_by, default_role_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            userExists[0].user_id,
            email,
          userExists[0].first_name,
          userExists[0].last_name,
          dbStatus.ARCHIVED,
          new Date(),
          req.userInfo.user_id,
          role,
        ]
      );
        await t.none(
          `INSERT INTO user_role_associations (user_id, role_id) VALUES ($1, $2)`,
            [userExists[0].user_id, role]
        );
      });

      await sendMail(req, email, EMAIL_TEMPLATES.INVITE_USER, {
        first_name: userExists[0].first_name,
        last_name: userExists[0].last_name,
        email: userExists[0].email,
        user_id: userExists[0].user_id,
        organization_id: req.userInfo.organization_id,
        organization_name: organization.name,
        organization_logo_url: organization.logo_url,
        actionLink: `${process.env.FRONTEND_URL}/invite?token=${invitationToken}`,
      });

      return responseREST(
        res,
        httpStatus.SUCCESS,
        "User invited successfully",
        invitationToken
      );
    }

    const result = await $main.tx(async (t) => {
      const adminDetails = await t.oneOrNone(
        `SELECT u.email, u.first_name, u.last_name, u.profile_picture_url, o.name, o.logo_url, o.country_id, o.timezone_id
         FROM users u
         JOIN user_organizations ON user_organizations.user_id = u.id and user_organizations.organization_id = $2
         JOIN organizations o ON o.id = user_organizations.organization_id
         WHERE u.id = $1`,
        [req.userInfo.user_id, req.userInfo.organization_id]
      );

      const nameParts = name.split(" ");
      const firstName = nameParts.shift();
      const lastName = nameParts.join(" ");

      const createUser = await t.one(
        `INSERT INTO users (email, first_name, last_name ,country_id ,timezone_id , status, created_at, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [
          email,
          firstName,
          lastName,
          adminDetails.country_id,
          adminDetails.timezone_id,
          dbStatus.ENABLE,
          new Date(),
          req.userInfo.user_id,
        ]
      );

      await t.none(
        `INSERT INTO user_organizations (user_id, organization_id, status, created_by) VALUES ($1, $2, $3, $4)`,
        [
          createUser.id,
          req.userInfo.organization_id,
          dbStatus.ARCHIVED,
          req.userInfo.user_id,
        ]
      );

      const setPasswordToken = jwt.sign(
        {
          user_id: createUser.id,
          organization_id: req.userInfo.organization_id,
          email,
          first_name: firstName,
          last_name: lastName,
          organization_name: adminDetails.name,
          organization_logo_url: adminDetails.logo_url,
          purpose: "set_password",
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      await t.none(
        `INSERT INTO user_authentications (user_id, default_two_fa_method, is_two_fa_enabled, default_organization_id, default_role_id, password_reset_token) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          createUser.id,
          "email",
          false,
          req.userInfo.organization_id,
          req.body.role,
          setPasswordToken,
        ]
      );

      return {
        user_id: createUser.id,
        email,
        first_name: firstName,
        last_name: lastName,
        organization_name: organization.name,
        organization_logo_url: organization.logo_url,
        password_reset_token: setPasswordToken,
      };
    });

    await tenantDb.tx(async (t) => {
      await t.none(
        `INSERT INTO users (id, email, first_name, last_name, status, created_at, created_by, default_role_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          result.user_id,
          email,
          result.first_name,
          result.last_name,
          dbStatus.ARCHIVED,
          new Date(),
          req.userInfo.user_id,
          req.body.role,
        ]
      );
      await t.none(
        `INSERT INTO user_role_associations (user_id, role_id) VALUES ($1, $2)`,
        [result.user_id, req.body.role]
      );
    });

    const sendData = {
      first_name: result.first_name,
      last_name: result.last_name,
      email: result.email,
      organization_name: result.organization_name,
      organization_logo_url: result.organization_logo_url,
      actionLink: `${process.env.FRONTEND_URL}/set-password?token=${result.password_reset_token}`,
    };

    await sendMail(req, email, EMAIL_TEMPLATES.SET_PASSWORD_LINK, sendData);

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.user_invited_successfully"),
      null
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const reinviteTeamUserService = async (req, res) => {
  const functionName = "reinviteTeamUserService";
  try {
    const { email } = req.body;
    const tenantDb = $connectTenant(req.userInfo.email);

    // Check if user exists in the organization
    const user = await $main.one(
      `SELECT 
        uo.status as organization_status, 
        uo.organization_id, 
        u.status, 
        u.id as user_id,
        ua.password IS NULL as needs_password_set,
        ua.is_email_verified
       FROM user_organizations uo 
       INNER JOIN users u ON uo.user_id = u.id
       LEFT JOIN user_authentications ua ON u.id = ua.user_id
       WHERE u.email = $1 AND uo.organization_id = $2`,
      [email, req.userInfo.organization_id]
    );

    if (!user) {
      return responseRESTError(req, res, "User not found in organization");
    }

    // Check if user is already active
    if (
      user.status === dbStatus.ENABLE &&
      user.organization_status === dbStatus.ENABLE
    ) {
      // Determine the type of token to generate
      const tokenPurpose = user.needs_password_set ? "set_password" : "invite";

      // Get organization details
      const organization = await $main.oneOrNone(
        `SELECT name FROM organizations WHERE id = $1`,
        [req.userInfo.organization_id]
      );

      // Generate token based on purpose
      const token = jwt.sign(
        {
          user_id: user.user_id,
          organization_id: req.userInfo.organization_id,
          email: email,
          first_name: user.first_name,
          last_name: user.last_name,
          organization_name: organization.name,
          organization_logo_url: organization.logo_url,
          purpose: tokenPurpose,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Determine email template and subject
      const emailTemplate =
        tokenPurpose === "set_password"
          ? EMAIL_TEMPLATES.SET_PASSWORD_LINK
          : EMAIL_TEMPLATES.TEAM_INVITE;

      // Construct invitation/set password link
      const actionLink = `${process.env.FRONTEND_URL}/${tokenPurpose}?token=${token}`;

      // Send email
      await sendMail(req, email, emailTemplate, {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        organization_name: organization.name,
        organization_logo_url: organization.logo_url,
        actionLink,
      });

      return responseREST(
        res,
        httpStatus.SUCCESS,
        tokenPurpose === "set_password"
          ? req.t("msg.password_set_invitation_sent")
          : req.t("msg.team_invitation_sent")
      );
    }

    // If user is not active, handle differently
    if (
      user.status === dbStatus.DISABLE ||
      user.organization_status === dbStatus.DISABLE
    ) {
      return responseRESTError(req, res, "User account is currently disabled");
    }

    return responseRESTError(req, res, "Unable to process invitation");
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const updateTeamUserDetailsService = async (req, res) => {
  const functionName = "updateTeamUserDetailsService";
  try {
    const { user_id, name, email, status } = req.body;
    const tenantDb = $connectTenant(req.userInfo.email);

    // Check if user exists
    const userExists = await $main.oneOrNone(
      `SELECT id, email, first_name, last_name 
       FROM users 
       WHERE id = $1`,
      [user_id]
    );

    if (!userExists) {
      return responseRESTError(req, res, "User not found");
    }

    // Check if the user is trying to update their own details
    if (user_id === req.userInfo.user_id) {
      return responseRESTError(
        req,
        res,
        "Cannot update your own details through this endpoint"
      );
    }

    // Prepare update fields
    const updates = [];
    const values = [user_id];
    let paramCount = 2;

    // Name handling
    if (name) {
      const nameParts = name.split(" ");
      const firstName = nameParts.shift();
      const lastName = nameParts.join(" ");

      await $main.none(
        `UPDATE users 
         SET first_name = $1, last_name = $2, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $3`,
        [firstName, lastName, user_id]
      );
    }

    // Email handling (if changed)
    if (email && email !== userExists.email) {
      // Check if email already exists
      const emailExists = await $main.oneOrNone(
        `SELECT 1 FROM users WHERE email = $1`,
        [email]
      );

      if (emailExists) {
        return responseRESTError(req, res, "Email already in use");
      }

      await $main.none(
        `UPDATE users 
         SET email = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [email, user_id]
      );
    }

    // Update tenant-specific details
    const updateFields = [];
    const updateValues = [user_id];
    let updateParamCount = 2;

    if (status) {
      // Update status in main and tenant databases
      await $main.none(
        `UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [status, user_id]
      );

      updateFields.push(`status = $${updateParamCount}`);
      updateValues.push(status);
      updateParamCount++;
    }

    // Update tenant database if there are fields to update
    if (updateFields.length > 0) {
      const updateQuery = `
        UPDATE users 
        SET ${updateFields.join(
          ", "
        )}, updated_at = CURRENT_TIMESTAMP, updated_by = $1 
        WHERE user_id = $2
        RETURNING user_id, first_name, last_name, email, status
      `;
      updateValues.unshift(req.userInfo.email);
      const updatedUser = await tenantDb.oneOrNone(updateQuery, updateValues);

      $logger.info(
        functionName,
        {
          user_id,
          updated_by: req.userInfo.user_id,
        },
        req,
        "User details updated successfully"
      );

      return responseREST(res, httpStatus.OK, updatedUser);
    }

    return responseREST(res, httpStatus.OK, "No updates performed", null);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const deleteTeamUserService = async (req, res) => {
  const functionName = "deleteTeamUserService";
  try {
    const { user_id } = req.body;
    const deletedBy = req.userInfo.user_id;
    const organizationId = req.userInfo.organization_id;

    // Validate user exists and is not already deleted
    const userExists = await $main.oneOrNone(
      `SELECT id FROM users 
       WHERE id = $1 AND status = $2`,
      [user_id, dbStatus.ENABLE]
    );

    if (!userExists) {
      return responseRESTError(req, res, "User not found");
    }

    // Prevent self-deletion
    if (user_id === deletedBy) {
      return responseRESTError(req, res, "Cannot delete your own account");
    }
    
    // Soft delete in tenant database
    const tenantDb = $connectTenant(req.userInfo.email);
    await tenantDb.none(
      `UPDATE users 
       SET status = $1, 
           deleted_at = CURRENT_TIMESTAMP, 
           deleted_by = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [dbStatus.DELETE, deletedBy, user_id]
    );

    // Remove from organization
    await $main.none(
      `UPDATE user_organizations 
       SET status = $1, 
           deleted_at = CURRENT_TIMESTAMP, 
           deleted_by = $2
       WHERE user_id = $3 AND organization_id = $4`,
      [dbStatus.DELETE, deletedBy, user_id, organizationId]
    );

    // Log deletion
    $logger.info(
      functionName,
      {
        user_id,
        deleted_by: deletedBy,
      },
      req,
      "User deleted successfully"
    );

    return responseREST(
      res,
      httpStatus.SUCCESS,
      "User deleted successfully",
      null
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const assignRoleToUserService = async (req, res) => {
  const functionName = "assignRoleToUserService";
  try {
    const { user_id, role_id, assign } = req.body;
    const assignedBy = req.userInfo.user_id;
    const organizationId = req.userInfo.organization_id;

    const tenantDb = $connectTenant(req.userInfo.email);
    const role = await tenantDb.oneOrNone(
      `SELECT id, name FROM roles 
       WHERE id = $1 AND status != $2`,
      [role_id, dbStatus.DELETE]
    );

    if (!role) {
      return responseRESTError(req, res, "Role not found");
    }

    // Validate user exists
    const userExists = await tenantDb.oneOrNone(
      `SELECT id FROM users 
       WHERE id = $1 AND status != $2`,
      [user_id, dbStatus.DELETE]
    );

    if (!userExists) {
      return responseRESTError(req, res, "User not found");
    }

    const userRole = await tenantDb.any(
      `SELECT role_id FROM user_role_associations 
       WHERE user_id = $1`,
      [user_id]
    );

    const isRoleAssigned = userRole.find((role) => role.role_id === role_id);

    if (isRoleAssigned) {
      return responseRESTError(req, res, "User already has this role");
    }

    if (assign) {
      await tenantDb.none(
        `INSERT INTO user_role_associations (user_id, role_id) VALUES ($1, $2)`,
        [user_id, role_id]
      );
    } else {
      if (userRole.length === 1) {
        return responseRESTError(
          req,
          res,
          "Cannot remove the only assigned role"
        );
      }
      await tenantDb.none(
        `DELETE FROM user_role_associations 
         WHERE user_id = $1 AND role_id = $2`,
        [user_id, role_id]
      );
    }

    // Log role assignment
    $logger.info(
      functionName,
      {
        user_id,
        role,
        assigned_by: assignedBy,
      },
      req,
      "Role assigned successfully"
    );

    return responseREST(res, httpStatus.SUCCESS, "Role assigned successfully", {
      role,
    });
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const getUserDataService = async (req, res) => {
  const functionName = "getUserDataService";
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return responseRESTError(req, res, "Invalid token");
    }

    return responseREST(res, httpStatus.SUCCESS, "User data fetched", decoded);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const setPasswordService = async (req, res) => {
  const functionName = "setPasswordService";

  try {
    const { token, password } = req.body;

    // Verify token and extract data
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    // Hash the new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update user password and status
    const result = await global.$main.tx(async (t) => {
      const user = await t.oneOrNone(
        `
        SELECT users.id, users.status, user_authentications.password
        FROM users 
        JOIN user_authentications ON users.id = user_authentications.user_id
        WHERE LOWER(email) = LOWER($1)
        AND deleted_at IS NULL
        AND status != $2
        `,
        [email, dbStatus.DELETE]
      );

      if (!user) {
        return responseREST(res, httpStatus.NOT_FOUND, "User not found", null)
      }

      if (user.password) {
        return responseREST(res, httpStatus.NOT_SUCCESS, "User already has a password", null)
      }

      // Update user password and status
      await t.none(
        `
        UPDATE user_authentications 
        SET 
          password = $1
        WHERE user_id = $2
        `,
        [passwordHash, user.id]
      );

      await t.none(
        `UPDATE user_organizations 
        SET 
          status = $1,
          updated_at = NOW()
        WHERE user_id = $2 AND organization_id = $3`,
        [dbStatus.ENABLE, user.id, req.userInfo.organization_id]
      );

      return user;
    });

    const tenantDb = $connectTenant(req.userInfo.email);

    await tenantDb.none(
      `
      UPDATE users 
      SET 
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      `,
      [dbStatus.ENABLE, result.id]
    );

    // Log the successful password set
    $logger.info(
      functionName,
      { email },
      req,
      "Password set successfully"
    );

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.password_set_successfully")
    );

  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const acceptInvitationService = async (req, res) => {
  const functionName = "acceptInvitationService";

  try {
    const { token } = req.body;

    // Verify token and extract data
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, user_id, organization_id } = decoded;

    // Process the invitation in a transaction
    const result = await global.$main.tx(async (t) => {
      // Check if user exists and get their details
      const user = await t.oneOrNone(
        `
        SELECT id, status
        FROM users 
        WHERE id = $1
        AND deleted_at IS NULL
        AND status != $2
        `,
        [user_id, dbStatus.DELETE]
      );

      if (!user) {
        return responseWithErrorAndMessage(
          httpStatus.NOT_FOUND,
          req.t("msg.user_not_found"),
          null
        );
      }

      // Check if organization exists
      const organization = await t.oneOrNone(
        `
        SELECT id, status
        FROM organizations
        WHERE id = $1
        AND deleted_at IS NULL
        AND status != $2
        `,
        [organization_id, dbStatus.DELETE]
      );

      if (!organization) {
          return responseWithErrorAndMessage(
          httpStatus.NOT_FOUND,
          req.t("msg.organization_not_found"),
          null
        );
      }

      // Check if user is already a member of the organization
      const existingMembership = await t.oneOrNone(
        `
        SELECT id, status
        FROM user_organizations
        WHERE user_id = $1
        AND organization_id = $2
        `,
        [user.id, organization_id]
      );

      if (existingMembership && existingMembership.status == dbStatus.DELETE) {
        return responseWithErrorAndMessage(
          httpStatus.NOT_SUCCESS,
          req.t("msg.user_is_deleted_from_organization"),
          null  
        );
      }

      if (existingMembership && existingMembership.status != dbStatus.ARCHIVED) {
        return responseWithErrorAndMessage(
          httpStatus.NOT_SUCCESS,
          req.t("msg.user_is_already_a_member_of_organization"),
          null
        );
      }

      await t.none(
        `
        UPDATE user_organizations
        SET status = $1, updated_at = NOW()
        WHERE user_id = $2 AND organization_id = $3
        `,
        [dbStatus.ENABLE, user.id, organization_id]
      );

      return {
        status: true,
        data: {
          user_id: user.id,
          organization_id: organization_id
        }
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

    const tenantDb = $connectTenant(req.userInfo.email);
    await tenantDb.none(
      `
        UPDATE users
        SET status = $1, updated_at = NOW()
        WHERE id = $2
      `,
      [dbStatus.ENABLE, result.data.user_id]
    );

    // Log successful invitation acceptance
    $logger.info(
      functionName,
      { email, organization_id },
      req,
      "Invitation accepted successfully"
    );

    return responseREST(
      res,
      httpStatus.SUCCESS,
      "Invitation accepted successfully",
      result
    );

  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return responseRESTError(req, res, new Error(req.t("msg.invalid_token")));
    }
    if (error.name === "TokenExpiredError") {
      return responseRESTError(req, res, new Error(req.t("msg.token_expired")));
    }
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};