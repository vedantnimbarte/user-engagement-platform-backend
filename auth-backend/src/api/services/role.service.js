import {
  responseREST,
  responseRESTError,
  httpStatus,
  dbStatus,
} from "../../common/functions.js";
import crypto from "crypto";
import pgPromise from "pg-promise";
const pgp = pgPromise();

export const getRolesService = async (req, res) => {
  const functionName = "getRolesService";
  try {
    const tenantDb = $connectTenant(req.userInfo.email);

    // Get query parameter for search
    const { search, status } = req.query;

    // Build WHERE clause
    const whereConditions = ["status != $1"];
    const queryParams = [dbStatus.DELETE];
    let paramCount = 2;

    if (status) {
      whereConditions.push(`status = $${paramCount}`);
      queryParams.push(status);
      paramCount++;
    }

    if (search) {
      whereConditions.push(`(
        name ILIKE $${paramCount} OR 
        description ILIKE $${paramCount}
      )`);
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    // Get roles
    const roles = await tenantDb.any(
      `SELECT id, name, description, status, created_at, logo, is_system, created_at, created_by, updated_at, updated_by
       FROM roles
       WHERE ${whereConditions.join(" AND ")}
       ORDER BY created_at DESC`,
      queryParams
    );

    // Log successful retrieval
    $logger.info(
      functionName,
      {
        total_roles: roles.length,
      },
      req,
      "Roles retrieved successfully"
    );

    return responseREST(
      res,
      httpStatus.SUCCESS,
      "Roles retrieved successfully",
      roles
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const createRoleService = async (req, res) => {
  const functionName = "createRoleService";
  const tenantDb = $connectTenant(req.userInfo.email);

  try {
    const { name, description, permissions } = req.body;

    // Start a transaction to ensure atomicity
    const result = await tenantDb.tx(async (t) => {
      // Check if a role with the same name already exists
      const existingRole = await t.oneOrNone(
        "SELECT id FROM roles WHERE name = $1 AND status != $2",
        [name, dbStatus.DELETE]
      );

      if (existingRole) {
        throw new Error("Role with this name already exists");
      }

      // Insert the new role
      const role = await t.one(
        `INSERT INTO roles (
          name, 
          description, 
          status, 
          created_by, 
          updated_by, 
          created_at, 
          updated_at
        ) VALUES ( $1, $2, $3, $4, $5, now(), now())
        RETURNING id, name, description, status`,
        [
          name,
          description || null,
          dbStatus.ENABLE,
          req.userInfo.user_id,
          req.userInfo.user_id,
        ]
      );

      const cs = new pgp.helpers.ColumnSet(
        [
          "role_id",
          "sub_feature_id",
          "can_create",
          "can_read",
          "can_update",
          "can_delete",
          "can_action",
          "can_export",
          "can_import",
          "created_by",
          "updated_by",
        ],
        { table: "permission_sub_features" }
      );

      const values = permissions.map((perm) => ({
        role_id: role.id,
        sub_feature_id: perm.sub_feature_id,
        can_create: perm.can_create || null,
        can_read: perm.can_read || null,
        can_update: perm.can_update || null,
        can_delete: perm.can_delete || null,
        can_action: perm.can_action || null,
        can_export: perm.can_export || null,
        can_import: perm.can_import || null,
        created_by: req.userInfo.user_id,
        updated_by: req.userInfo.user_id,
      }));

      await t.none(pgp.helpers.insert(values, cs) + " ON CONFLICT DO NOTHING");
      return { role, roleId: role.id };
    });

    // Log role creation
    $logger.info(
      functionName,
      {
        role_id: result.roleId,
        role_name: result.role.name,
      },
      req,
      "Role created successfully"
    );

    // Return successful response
    return responseREST(
      res,
      httpStatus.CREATED,
      "Role created successfully",
      result.role
    );
  } catch (error) {
    // Log and return error
    $logger.error(functionName, null, req, error.message);

    // Check for unique constraint violation
    if (
      error.message.includes("unique constraint") ||
      error.message.includes("duplicate key")
    ) {
      return responseRESTError(
        req,
        res,
        "A role with this name already exists"
      );
    }

    return responseRESTError(req, res, error);
  }
};

export const updateRoleService = async (req, res) => {
  const functionName = "updateRoleService";
  const tenantDb = $connectTenant(req.userInfo.email);

  try {
    const { id, name, description, permissions } = req.body;

    // Start a transaction to ensure atomicity
    const result = await tenantDb.tx(async (t) => {
      // Check if role exists
      const existingRole = await t.oneOrNone(
        "SELECT id FROM roles WHERE id = $1 AND status != $2",
        [id, dbStatus.DELETE]
      );

      if (!existingRole) {
        throw new Error("Role not found");
      }

      // Check if another role with the same name exists (excluding current role)
      if (name) {
        const nameConflict = await t.oneOrNone(
          "SELECT id FROM roles WHERE name = $1 AND id != $2 AND status != $3",
          [name, id, dbStatus.DELETE]
        );

        if (nameConflict) {
          throw new Error("Role with this name already exists");
        }
      }

      // Update role details
      const role = await t.one(
        `UPDATE roles 
         SET 
           name = COALESCE($1, name), 
           description = COALESCE($2, description), 
           updated_by = $3, 
           updated_at = now()
         WHERE id = $4
         RETURNING id, name, description, status`,
        [name, description, req.userInfo.user_id, id]
      );

      // Prepare column set for permissions
      const cs = new pgp.helpers.ColumnSet(
        [
          "role_id",
          "sub_feature_id",
          "can_create",
          "can_read",
          "can_update",
          "can_delete",
          "can_action",
          "can_export",
          "can_import",
          "created_by",
          "updated_by",
        ],
        { table: "permission_sub_features" }
      );

      // Delete existing permissions for this role
      await t.none("DELETE FROM permission_sub_features WHERE role_id = $1", [
        id,
      ]);

      // Insert new permissions
      if (permissions && permissions.length > 0) {
        const values = permissions.map((perm) => ({
          role_id: id,
          sub_feature_id: perm.sub_feature_id,
          can_create: perm.can_create || null,
          can_read: perm.can_read || null,
          can_update: perm.can_update || null,
          can_delete: perm.can_delete || null,
          can_action: perm.can_action || null,
          can_export: perm.can_export || null,
          can_import: perm.can_import || null,
          created_by: req.userInfo.user_id,
          updated_by: req.userInfo.user_id,
        }));

        await t.none(
          pgp.helpers.insert(values, cs) + " ON CONFLICT DO NOTHING"
        );
      }

      return { role, roleId: role.id };
    });

    // Log role update
    $logger.info(
      functionName,
      {
        role_id: result.roleId,
        role_name: result.role.name,
      },
      req,
      "Role updated successfully"
    );

    // Return successful response
    return responseREST(
      res,
      httpStatus.SUCCESS,
      "Role updated successfully",
      result.role
    );
  } catch (error) {
    // Log and return error
    $logger.error(functionName, null, req, error.message);

    // Check for specific error types
    if (error.message.includes("Role not found")) {
      return responseRESTError(
        req,
        res,
        "Role not found",
        httpStatus.NOT_FOUND
      );
    }

    if (error.message.includes("Role with this name already exists")) {
      return responseRESTError(
        req,
        res,
        "Role with this name already exists",
        httpStatus.CONFLICT
      );
    }

    return responseRESTError(req, res, error);
  }
};

export const deleteRoleService = async (req, res) => {
  const functionName = "deleteRoleService";
  const tenantDb = $connectTenant(req.userInfo.email);

  try {
    const { id } = req.body;

    // Start a transaction to ensure atomicity
    const result = await tenantDb.tx(async (t) => {
      // Check if role exists and is not already deleted
      const existingRole = await t.oneOrNone(
        "SELECT id FROM roles WHERE id = $1 AND status != $2",
        [id, dbStatus.DELETE]
      );

      if (!existingRole) {
        throw new Error("Role not found");
      }

      // Check if role is in use (has any users assigned)
      const roleInUse = await t.oneOrNone(
        "SELECT 1 FROM user_role_associations WHERE role_id = $1 LIMIT 1",
        [id]
      );

      if (roleInUse) {
        throw new Error(
          "Cannot delete role. Role is currently assigned to users."
        );
      }

      // Soft delete the role
      const deletedRole = await t.one(
        `UPDATE roles 
         SET 
           status = $1, 
           updated_by = $2, 
           updated_at = now()
         WHERE id = $3
         RETURNING id, name, status`,
        [dbStatus.DELETE, req.userInfo.user_id, id]
      );

      // Delete associated permissions
      await t.none("DELETE FROM permission_sub_features WHERE role_id = $1", [
        id,
      ]);

      return deletedRole;
    });

    // Log role deletion
    $logger.info(
      functionName,
      {
        role_id: result.id,
        role_name: result.name,
      },
      req,
      "Role deleted successfully"
    );

    // Return successful response
    return responseREST(
      res,
      httpStatus.SUCCESS,
      "Role deleted successfully",
      result
    );
  } catch (error) {
    // Log and return error
    $logger.error(functionName, null, req, error.message);

    // Check for specific error types
    if (error.message.includes("Role not found")) {
      return responseRESTError(
        req,
        res,
        "Role not found",
        httpStatus.NOT_FOUND
      );
    }

    if (error.message.includes("Cannot delete role")) {
      return responseRESTError(
        req,
        res,
        "Cannot delete role. Role is currently assigned to users.",
        httpStatus.NOT_SUCCESS
      );
    }

    return responseRESTError(req, res, error);
  }
};

export const getSubFeaturesService = async (req, res) => {
  const functionName = "getSubFeaturesService";
  const tenantDb = $connectTenant(req.userInfo.email);

  try {
    const { role_id } = req.query;

    const query = `
      WITH feature_permissions AS (
        SELECT 
          f.id AS feature_id,
          f.name AS feature_name,
          sf.id AS sub_features_id,
          sf.name AS sub_features_name,
          sf.key AS sub_features_key,
          ft.can_create AS type_can_create,
          ft.can_read AS type_can_read,
          ft.can_update AS type_can_update,
          ft.can_delete AS type_can_delete,
          ft.can_action AS type_can_action,
          ft.can_export AS type_can_export,
          psf.can_create AS permission_can_create,
          psf.can_read AS permission_can_read,
          psf.can_update AS permission_can_update,
          psf.can_delete AS permission_can_delete,
          psf.can_action AS permission_can_action,
          psf.can_export AS permission_can_export
        FROM 
          features f
        INNER JOIN 
          sub_features sf ON f.id = sf.feature_id
        INNER JOIN 
          feature_types ft ON sf.feature_type_id = ft.id
        LEFT JOIN 
          permission_sub_features psf ON sf.id = psf.sub_feature_id 
          ${role_id ? "AND psf.role_id = $1" : ""}
        WHERE 
          f.status = $${role_id ? "2" : "1"} 
          AND sf.status = $${role_id ? "2" : "1"}
          AND (
            ft.can_create = true OR
            ft.can_read = true OR
            ft.can_update = true OR
            ft.can_delete = true OR
            ft.can_action = true OR
            ft.can_export = true
          )
      )
      SELECT 
        feature_id,
        feature_name,
        json_agg(
          json_build_object(
            'sub_features_id', sub_features_id,
            'sub_features_name', sub_features_name,
            'sub_features_key', sub_features_key,
            'can_create', CASE
              WHEN type_can_create = false THEN NULL
              WHEN ${
                role_id
                  ? "permission_can_create IS NOT NULL THEN permission_can_create"
                  : "true THEN false"
              }
              ELSE false
            END,
            'can_read', CASE
              WHEN type_can_read = false THEN NULL
              WHEN ${
                role_id
                  ? "permission_can_read IS NOT NULL THEN permission_can_read"
                  : "true THEN false"
              }
              ELSE false
            END,
            'can_update', CASE
              WHEN type_can_update = false THEN NULL
              WHEN ${
                role_id
                  ? "permission_can_update IS NOT NULL THEN permission_can_update"
                  : "true THEN false"
              }
              ELSE false
            END,
            'can_delete', CASE
              WHEN type_can_delete = false THEN NULL
              WHEN ${
                role_id
                  ? "permission_can_delete IS NOT NULL THEN permission_can_delete"
                  : "true THEN false"
              }
              ELSE false
            END,
            'can_action', CASE
              WHEN type_can_action = false THEN NULL
              WHEN ${
                role_id
                  ? "permission_can_action IS NOT NULL THEN permission_can_action"
                  : "true THEN false"
              }
              ELSE false
            END,
            'can_export', CASE
              WHEN type_can_export = false THEN NULL
              WHEN ${
                role_id
                  ? "permission_can_export IS NOT NULL THEN permission_can_export"
                  : "true THEN false"
              }
              ELSE false
            END
          )
          ORDER BY sub_features_name
        ) AS sub_features
      FROM 
        feature_permissions
      GROUP BY 
        feature_id,
        feature_name
      ORDER BY
        feature_name
    `;

    const subFeatures = await tenantDb.many(
      query,
      role_id ? [role_id, dbStatus.ENABLE] : [dbStatus.ENABLE]
    );

    const formattedFeatures = subFeatures.map((feature) => ({
      feature_id: feature.feature_id,
      name: feature.feature_name,
      sub_features: feature.sub_features,
    }));

    $logger.info(
      functionName,
      {
        total_features: formattedFeatures.length,
        role_id: role_id || "all",
      },
      req,
      "Sub-features retrieved successfully"
    );

    return responseREST(
      res,
      httpStatus.SUCCESS,
      "Sub-features retrieved successfully",
      formattedFeatures
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};
