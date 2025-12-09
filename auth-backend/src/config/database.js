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
  max: 10,
  connectionTimeoutMillis: 5000,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
};

// Create global main database instance
global.$main = pgp(mainDbConfig);

let tenants = new Map();

// Create global tenant connection function
global.$connectTenant = (db) => {
  const now = Date.now();
  const dbname = db.includes("postgres://") ? db.split("/").pop() : db;

  // Check if connection exists in memory cache
  if (tenants.has(db)) {
    const tenant = tenants.get(db);
    tenant.lastUsed = now;
    if(!tenant.connection.$pool.ended){
      return tenant.connection
    }else{
      tenants.delete(db);
    }
  }

  // Create a new connection if not found in cache
  let dbUrl = db.includes("postgres://")
    ? db
    : `postgres://${process.env.TENANT_DB_USER}:${process.env.TENANT_DB_PASSWORD}@${process.env.TENANT_DB_HOST}:${process.env.TENANT_DB_PORT}/${db}`;

  // Create connection with proper pg-promise options
  const conn = pgp({
    connectionString: dbUrl,
    poolSize: {
      max: 2,
      min: 0,
    },
    idleTimeoutMillis: 30000,
    allowExitOnIdle: true,
    application_name: dbname,
    keepAlive: true,
    query_timeout: 30000,
  });

  // Store in memory cache with timestamp
  tenants.set(db, { connection: conn, lastUsed: now });

  return conn;
};

// Connection cleanup interval - managing only in-memory connections
setInterval(() => {
  const now = Date.now();
  const cutoff = now - 60000; // 1 minute

  // Find and close idle connections
  for (const [db, tenant] of tenants.entries()) {
    if (tenant.lastUsed < cutoff) {
      try {
        // Use proper pgp pool ending method
        pgp.end(tenant.connection);
        tenants.delete(db);
        console.log(`Closed idle connection to ${db}`);
      } catch (error) {
        console.error(`Error closing connection to ${db}:`, error);
      }
    }
  }
}, 120000);

const testConnection = async () => {
  try {
    const connection = await $main.connect();
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
