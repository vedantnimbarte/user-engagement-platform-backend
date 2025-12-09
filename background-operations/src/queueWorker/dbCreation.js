import { dbStatus } from "../common/functions.js";
import { generateTenantDB } from "../dbManagement/dbFunctions.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createDb = async (data) => {
  try {
    const { user_id, organization_id, email, ownerRoleId } = data;

    const db_url = `postgresql://${
      process.env.TENANT_DB_USER_SAVE || process.env.TENANT_DB_USER
    }:${
      process.env.TENANT_DB_PASSWORD_SAVE || process.env.TENANT_DB_PASSWORD
    }@${process.env.TENANT_DB_HOST_SAVE || process.env.TENANT_DB_HOST}:${
      process.env.TENANT_DB_PORT_SAVE || process.env.TENANT_DB_PORT
    }/${email}?schema=public&pgbouncer=true`;

    const [taskData, _] = await Promise.all([
      $main.task(async (ts) => {
        // Prepare dates for subsequent operations
        const currentDate = new Date();
        const next = getNextMonth(
          currentDate.getDate(),
          currentDate.getMonth(),
          currentDate.getFullYear()
        );
        const subMonthEndDate = new Date(
          next.year,
          next.month,
          next.date,
          currentDate.getHours(),
          currentDate.getMinutes(),
          currentDate.getSeconds(),
          currentDate.getMilliseconds()
        );

        // 2. Batch insert operations
        const insertResults = await ts.batch([
          // Insert tenant_dbs
          ts.none(
            `
                INSERT INTO tenant_dbs (organization_id, db_url, created_by) 
                VALUES ($1, $2, $3)
            `,
            [organization_id, db_url, user_id]
          ),

          // Insert subscription
          ts.one(
            `
                INSERT INTO subscriptions (
                    organization_id, start_date, is_current, 
                    is_free, is_trial, created_by
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `,
            [organization_id, currentDate, true, true, false, user_id]
          ),
        ]);

        const subscription = insertResults[1];

        // 3. Batch MAU insert and feature fetches
        const finalBatchResults = await ts.batch([
          // Insert MAU counts
          ts.none(
            `
                INSERT INTO organization_mau_counts(
                    organization_id, subscription_id, mau_count, 
                    month_started_at, month_ended_at
                ) 
                VALUES ($1, $2, $3, $4, $5)
            `,
            [organization_id, subscription.id, 0, currentDate, subMonthEndDate]
          ),

          // Get features with package features
          ts.manyOrNone(
            `
                SELECT f.id, f.name, pf.feature_limit 
                FROM features f 
                LEFT JOIN package_application_features pf 
                    ON pf.feature_id = f.id 
                    AND pf.package_id = (SELECT id FROM packages WHERE is_default = true AND status = $1)
                    AND pf.status = $1
                WHERE f.status = $1
            `,
            [dbStatus.ENABLE]
          ),

          // Get sub features
          ts.manyOrNone(`
                SELECT * 
                FROM sub_features 
                WHERE status = ${dbStatus.ENABLE}
            `),

          // Get feature types
          ts.manyOrNone(`
                SELECT id, name, can_create, can_update, can_read, can_delete, 
                       can_action, can_export, can_import, status
                FROM feature_types
                WHERE status = ${dbStatus.ENABLE}
            `),
        ]);

        const [
          _,
          allFeaturesAndPackageFeatures,
          allSubFeatures,
          allFeatureTypes,
        ] = finalBatchResults;

        return {
          allFeaturesAndPackageFeatures,
          allSubFeatures,
          allFeatureTypes,
        };
      }),
      generateTenantDB(email),
    ]);

    const { allFeaturesAndPackageFeatures, allSubFeatures, allFeatureTypes } =
      taskData;

    const tenantDb = await $connectTenant(db_url);

    //create multiple insert queries
    const defaultData = await fs.promises.readFile(
      path.join(__dirname, "../constant/dbData.sql"), // Updated path
      "utf8"
    );

    // Role Insert Query
    const roleInsertQuery = `INSERT INTO roles (id, name, description, is_system, logo, created_by) VALUES 
    ('${ownerRoleId}', 'Account Owner', 'Has permission over everything', true, 'http://account_owner.svg', '${user_id}'),
    ('43a9490b-6526-4693-89d0-6dd1890d5e37', 'Admin', 'I am Admin', false, 'http://admin.svg', '${user_id}');`;
    // Domain Insert Query
    const domainInsertQuery = `INSERT INTO domains (name, created_by, is_system) VALUES
    ('${process.env.SAND_BOX_DOMAIN}/sandbox', '${user_id}', true),
    ('${process.env.SAND_BOX_DOMAIN}/saas', '${user_id}', true),
    ('${process.env.SAND_BOX_DOMAIN}/website', '${user_id}', true);`;
    // User Role Association Query
    const userRoleAssociationQuery = `INSERT INTO user_role_associations (user_id, role_id) VALUES ('${user_id}', '${ownerRoleId}');`;
    // Start and End Query
    const startQuery = `SET session_replication_role = replica;`;
    const endQuery = `SET session_replication_role = DEFAULT;`;

    // Feature Type Insert Query
    let featureTypeInsertQuery = `INSERT INTO feature_types (id, name, can_create, can_update, can_read, can_delete, can_action, can_export, can_import, status) VALUES `;
    let featureTypeValues = [];
    for (let featureType of allFeatureTypes) {
      featureTypeValues.push(
        `('${featureType.id}', '${featureType.name}', '${featureType.can_create}', '${featureType.can_update}', '${featureType.can_read}', '${featureType.can_delete}', '${featureType.can_action}', '${featureType.can_export}', '${featureType.can_import}', '${featureType.status}')`
      );
    }
    featureTypeInsertQuery += featureTypeValues.join(", ") + ";";

    // Feature Insert Query
    let featureInsertQuery = `INSERT INTO features (id, name, status, "limit") VALUES `;
    let featureValues = [];
    for (let feature of allFeaturesAndPackageFeatures) {
      featureValues.push(
        `('${feature.id}', '${feature.name}', '${
          feature.feature_limit ? dbStatus.ENABLE : dbStatus.DISABLE
        }', ${feature.feature_limit ? feature.feature_limit : 0})`
      );
    }
    featureInsertQuery += featureValues.join(", ") + ";";

    // Sub Feature Insert Query
    let subFeatureInsertQuery = `INSERT INTO sub_features (id, feature_id, key, feature_type_id, status, name) VALUES `;
    let permissionSubFeatureInsertQuery = `INSERT INTO permission_sub_features (role_id, sub_feature_id, can_create, can_read, can_update, can_delete, can_action, can_export, can_import, created_by) VALUES `;
    let subFeatureValues = [];
    let permissionSubFeatureValues = [];

    for (let subFeature of allSubFeatures) {
      subFeatureValues.push(
        `('${subFeature.id}', '${subFeature.feature_id}', '${subFeature.key}', '${subFeature.feature_type_id}', '${subFeature.status}', '${subFeature.name}')`
      );

      const featureType = allFeatureTypes.find(
        (ft) => ft.id === subFeature.feature_type_id
      );
      permissionSubFeatureValues.push(
        `('${ownerRoleId}', '${subFeature.id}', ${
          featureType.can_create ? true : null
        }, ${featureType.can_read ? true : null}, ${
          featureType.can_update ? true : null
        }, ${featureType.can_delete ? true : null},${
          featureType.can_action ? true : null
        }, ${featureType.can_export ? true : null}, ${
          featureType.can_import ? true : null
        }, '${user_id}')`
      );
    }
    subFeatureInsertQuery += subFeatureValues.join(", ") + ";";
    permissionSubFeatureInsertQuery +=
      permissionSubFeatureValues.join(", ") + ";";

    const userInsertQuery = `INSERT INTO users (id, email, created_by) VALUES ('${user_id}', '${email}', '${user_id}');`;
    const updateUserQuery = `UPDATE users SET default_role_id = '${ownerRoleId}' WHERE id = '${user_id}';`;

    const defaultDataAppend = `${defaultData}${userInsertQuery}${roleInsertQuery}${updateUserQuery}${domainInsertQuery}${userRoleAssociationQuery}${featureTypeInsertQuery}${featureInsertQuery}${subFeatureInsertQuery}${permissionSubFeatureInsertQuery}`;

    // console.log("featureInsertQuery", featureInsertQuery);
    // await tenantDb.none(defaultData);
    // await tenantDb.none(userInsertQuery);
    // await tenantDb.none(roleInsertQuery);
    // await tenantDb.none(updateUserQuery);
    // await tenantDb.none(domainInsertQuery);
    // await tenantDb.none(userRoleAssociationQuery);
    // await tenantDb.none(featureTypeInsertQuery);
    // await tenantDb.none(featureInsertQuery);
    // await tenantDb.none(subFeatureInsertQuery);
    // await tenantDb.none(permissionSubFeatureInsertQuery);
    await tenantDb.none(defaultDataAppend);

    return {
      message: "Database created successfully",
      status: true,
    };
  } catch (error) {
    console.error(`Migration failed for:`, error.message);
  }
};

const getNextMonth = (date, month, year) => {
  let nextDate = 0;
  let nextMonth = 0;
  let nextYear = 0;
  if (month === 11) {
    nextYear = year + 1;
    nextMonth = 0;
  } else {
    nextYear = year;
    nextMonth = month + 1;
  }
  if (month === 1 && date > 28) {
    nextDate = 28;
  }
  if ([0, 2, 4, 7, 9].includes(month) && date > 30) {
    nextDate = 30;
  } else {
    nextDate = date;
  }
  return {
    date: nextDate,
    month: nextMonth,
    year: nextYear,
  };
};

export { createDb };
