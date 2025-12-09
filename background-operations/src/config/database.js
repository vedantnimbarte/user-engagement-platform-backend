import pg from "pg-promise";

const pgp = pg({
  capSQL: true,
  error: (err, e) => {
    if (e.cn) {
      console.error("CN:", e.cn);
      console.error("EVENT:", err.message || err);
    }
  },
});

const mainDbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  max: 30,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
};

// Create global main database instance
global.$main = pgp(mainDbConfig);

// Create global tenant connection function
global.$connectTenant = (dbUrl) => {
  return pgp({
    connectionString: dbUrl,
    max: 2,
    min: 1,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 5000,
    maxUses: 5000,
    allowExitOnIdle: true,
    application_name: dbUrl.split("/").pop(), // Use the database name as the application name
    keepAlive: true,
  });
};

const testConnection = async () => {
  try {
    const connection = await global.$main.connect();
    console.log("Main database connection successful");
    connection.done();
    return true;
  } catch (error) {
    console.error("Main database connection error:", error);
    return false;
  }
};

const cleanup = async () => {
  try {
    const promise = Promise.resolve(pgp.end());
    await promise;
    console.log("Database connections closed successfully");
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
};

export { testConnection, cleanup };
