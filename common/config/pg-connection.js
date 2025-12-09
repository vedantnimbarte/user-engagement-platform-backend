const { dbStatus } = require("./commonVariable");
const Database = require("./prisma-singleton-connection");

const getTenantByAccountId = async (account_id) => {
  try {
    if (!account_id) {
      return {
        status: false,
        data: null,
        message: "Invalid argument passed",
      };
    }

    let dbUrl = await redisClient.get(`tenantDB_${account_id}`);

    if (!dbUrl) {
      const client = await global.pool; //.connect();
      const result = await client.query(
        "SELECT db_url FROM tenant_db WHERE account_id = $1",
        [account_id]
      );
      if (!result.rows.length) {
        return {
          status: false,
          data: result,
          message: "No tenant found",
        };
      }
      dbUrl = result.rows[0].db_url;

      redisClient.set(`tenantDB_${account_id}`, dbUrl, "EX", 3600);
    }

    const tenantPool = Database.getInstance(dbUrl);

    return {
      status: true,
      data: tenantPool,
    };
  } catch (err) {
    return {
      status: false,
      message: err.message,
    };
  }
  // finally {
  //   client.release();
  // }
};

module.exports = { getTenantByAccountId };
