import { fileURLToPath } from "url";
import { dirname } from "path";
import { execSync } from "child_process";
import path from "path";
import os from "os";
import util from "util";
import { exec as execCallback } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const exec = util.promisify(execCallback);

const generateTenantDB = async (accountName) => {
  try {
    const dbUrl = `postgresql://${process.env.TENANT_DB_USER}:${process.env.TENANT_DB_PASSWORD}@${process.env.TENANT_DB_HOST}:${process.env.TENANT_DB_PORT}/${accountName}?schema=public`;
    const dbUrlForSave = `postgresql://${
      process.env.TENANT_DB_USER_SAVE || process.env.TENANT_DB_USER
    }:${
      process.env.TENANT_DB_PASSWORD_SAVE || process.env.TENANT_DB_PASSWORD
    }@${process.env.TENANT_DB_HOST_SAVE || process.env.TENANT_DB_HOST}:${
      process.env.TENANT_DB_PORT_SAVE || process.env.TENANT_DB_PORT
    }/${accountName}?schema=public&pgbouncer=true`;
    const environment = process.env.OS || null;
    const tenantSchemaPath = path.join(path.resolve(__dirname));

    const command =
      environment === "Windows_NT"
        ? `set TENANT_DB_URL=${dbUrl} && npx prisma migrate deploy --schema=${tenantSchemaPath}/tenant/schema.prisma`
        : `export TENANT_DB_URL=${dbUrl} && npx prisma migrate deploy --schema=${tenantSchemaPath}/tenant/schema.prisma`;

    await exec(command, { stdio: "inherit" });

    return {
      message: "",
      status: true,
      data: dbUrlForSave,
    };
  } catch (error) {
    return {
      message: error.message,
      status: false,
      data: null,
    };
  }
};

const deleteTenantDB = async (accountName) => {
  try {
    const dbUrl = `postgresql://${process.env.TENANT_DB_USER}:${process.env.TENANT_DB_PASSWORD}@${process.env.TENANT_DB_HOST}:${process.env.TENANT_DB_PORT}`;
    const environment = process.env.OS || null;

    const command =
      environment === "windows"
        ? `set PGPASSWORD=${process.env.TENANT_DB_PASSWORD} && psql -U ${process.env.TENANT_DB_USER} -h ${process.env.TENANT_DB_HOST} -p ${process.env.TENANT_DB_PORT} -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${accountName}' AND pid <> pg_backend_pid();" && psql -U ${process.env.TENANT_DB_USER} -h ${process.env.TENANT_DB_HOST} -p ${process.env.TENANT_DB_PORT} -c "DROP DATABASE IF EXISTS ${accountName};"`
        : `PGPASSWORD=${process.env.TENANT_DB_PASSWORD} psql -U ${process.env.TENANT_DB_USER} -h ${process.env.TENANT_DB_HOST} -p ${process.env.TENANT_DB_PORT} -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${accountName}' AND pid <> pg_backend_pid();" && PGPASSWORD=${process.env.TENANT_DB_PASSWORD} psql -U ${process.env.TENANT_DB_USER} -h ${process.env.TENANT_DB_HOST} -p ${process.env.TENANT_DB_PORT} -c "DROP DATABASE IF EXISTS ${accountName};"`;

    await exec(command);

    return {
      message: `Database ${accountName} deleted successfully.`,
      status: true,
    };
  } catch (error) {
    return {
      message: error.message,
      status: false,
    };
  }
};

const migrateAllTenantDB = async (dbUrl) => {
  try {
    const tenantSchemaPath = path.join(path.resolve(__dirname));
    const platform = os.platform();
    const migrateCommand =
      platform === "win32"
        ? `set TENANT_DB_URL=${dbUrl} && npx prisma migrate deploy --schema=${tenantSchemaPath}/tenant/schema.prisma`
        : `export TENANT_DB_URL=${dbUrl} && npx prisma migrate deploy --schema=${tenantSchemaPath}/tenant/schema.prisma`;

    await exec(migrateCommand, { stdio: "inherit" });
    console.log(`Migration successful for: ${dbUrl}`);
    return { status: true };
  } catch (error) {
    console.error(`Migration failed for: ${dbUrl}`, error.message);
    return {
      message: error.message,
      status: false,
      data: dbUrl,
    };
  }
};

const createMany = async (data, table, client) => {
  const keys = Object.keys(data[0]).join(",");
  const values = [];
  const valuePlaceholders = data.map((e, index) => {
    const valueArray = Object.values(e);
    values.push(...valueArray);
    return `(${valueArray
      .map((_, i) => `$${index * valueArray.length + i + 1}`)
      .join(",")})`;
  });

  return await client.query(
    `INSERT INTO ${table} (${keys}) VALUES ${valuePlaceholders.join(
      ","
    )} RETURNING *`,
    values
  );
};

const checkLimitOfModule = async (table, client) => {
  const { rows: response } = await client.query(
    `SELECT COUNT(*) FROM ${table}`
  );
  return response?.[0]?.count ? parseInt(response[0].count) : 0;
};

export {
  generateTenantDB,
  migrateAllTenantDB,
  createMany,
  checkLimitOfModule,
  deleteTenantDB,
};
