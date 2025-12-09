const pg = require("pg");

class Database {
  static instances = {};

  constructor(connectionString) {
    if (!Database.instances[connectionString]) {
      this.pool = new pg.Pool({
        connectionString: connectionString,
        max: 5,
        idleTimeoutMillis: 20000,
        connectionTimeoutMillis: 3000,
        allowExitOnIdle: true,
      });

      Database.instances[connectionString] = this;
    }

    return Database.instances[connectionString];
  }

  static getInstance(connectionString) {
    if (!Database.instances[connectionString]) {
      Database.instances[connectionString] = new Database(connectionString);
    }

    return Database.instances[connectionString];
  }

  connect() {
    return this.pool.connect();
  }

  query(sql, params) {
    return this.pool.query(sql, params);
  }

  release() {
    return this.pool.release();
  }
}

module.exports = Database;
