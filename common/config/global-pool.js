const pg = require("pg");

// let pool;

try {
  pg.types.setTypeParser(1114, (string) =>
    string.replace(" ", "T").concat("Z")
  );

  global.pool = new pg.Pool({
    connectionString: process.env.DB_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    allowExitOnIdle: true,
  });
} catch (err) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

// module.exports = pool;
