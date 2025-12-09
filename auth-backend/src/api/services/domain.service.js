import {
  responseREST,
  responseRESTError,
  httpStatus,
  dbStatus,
} from "../../common/functions.js";

export const getDomainsService = async (req, res) => {
  const functionName = "getDomainsService";
  try {
    const tenantDb = $connectTenant(req.userInfo.email);

    const domains = await tenantDb.any(
      `
      SELECT 
        id,
        name,
        status,
        created_at,
        updated_at,
        is_script_installed,
        script_installed_at,
        sub_domain,
        main_domain
      FROM domains 
      WHERE status IN ($1, $2) and is_system = false
      ORDER BY created_at DESC
      `,
      [dbStatus.ENABLE, dbStatus.DISABLE]
    );

    return responseREST(res, httpStatus.SUCCESS, domains);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const createDomainService = async (req, res) => {
  const functionName = "createDomainService";
  try {
    const { name, main_domain, sub_domain } = req.body;
    const tenantDb = $connectTenant(req.userInfo.email);

    const parsedUrl = new URL("https://" + name);
    const path = parsedUrl.pathname;

    if (path !== "/" && path !== "") {
      return responseREST(
        res,
        httpStatus.INVALID_ARGUMENT,
        req.t("invalid_domain_name")
      )
    }

    const domainLimitQuery = `SELECT "limit" FROM features WHERE name = 'Domains'`;
    const domainUsageQuery = `SELECT count(DISTINCT main_domain)::INTEGER AS domain_count FROM domains where is_system=false and status = $1 and main_domain !=$2`;
    const domainExistsQuery = `SELECT name, status FROM domains WHERE name = $1`;

    const result = await tenantDb.task(async (t) => {
      const [domainLimit, domainUsage, domainExists] = await t.batch([
        t.one(domainLimitQuery),
        t.one(domainUsageQuery, [dbStatus.ENABLE, name]),
        t.oneOrNone(domainExistsQuery, [name]),
      ]);

      if (domainExists && domainExists.status !== dbStatus.DELETE) {
        return responseWithErrorAndMessage(
          httpStatus.ALREADY_EXISTS,
          req.t("domain_already_exists"),
          null
        );
      }

      const newDomain = await t.one(
        `INSERT INTO domains (name, main_domain, sub_domain, status, created_by) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, name, main_domain, sub_domain, status`,
        [
          name,
          main_domain,
          sub_domain,
          domainLimit.limit > domainUsage.domain_count
            ? dbStatus.ENABLE
            : dbStatus.DISABLE,
          req.userInfo.user_id,
        ]
      );

      return {
        status: true,
        data: newDomain,
      }
    });
    if (!result.status) {
      return responseREST(res, {
        status: false,
        status_code: result.status_code,
      },
      result.message);
    }

    responseREST(res, httpStatus.SUCCESS, req.t("domain_created"), result.data);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const updateDomainService = async (req, res) => {
  const functionName = "updateDomainService";
  try {
    const { id } = req.params;
    const { name, main_domain, sub_domain, status } = req.body;
    const tenantDb = $connectTenant(req.userInfo.email);

    // Check if domain exists
    const domain = await tenantDb.oneOrNone(
      `SELECT id, status FROM domains WHERE id = $1 AND is_system = false`,
      [id]
    );

    if (!domain) {
      return responseRESTError(req, res, "Domain not found");
    }

    const updatedDomain = await tenantDb.one(
      `UPDATE domains 
       SET 
         name = COALESCE($1, name),
         main_domain = COALESCE($2, main_domain),
         sub_domain = COALESCE($3, sub_domain),
         status = COALESCE($4, status),
         updated_at = NOW(),
         updated_by = $5
       WHERE id = $6
       RETURNING *`,
      [name, main_domain, sub_domain, status, req.userInfo.email, id]
    );

    return responseREST(res, httpStatus.OK, updatedDomain);
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const deleteDomainService = async (req, res) => {
  const functionName = "deleteDomainService";
  try {
    const { id } = req.params;
    const tenantDb = $connectTenant(req.userInfo.email);

    // Check if domain exists
    const domain = await tenantDb.oneOrNone(
      `SELECT id, status FROM domains WHERE id = $1 AND is_system = false`,
      [id]
    );

    if (!domain) {
      return responseRESTError(req, res, "Domain not found");
    }

    // Soft delete
    await tenantDb.none(
      `UPDATE domains 
       SET 
         status = $1, 
         deleted_at = NOW(), 
         deleted_by = $2 
       WHERE id = $3`,
      [dbStatus.DELETE, req.userInfo.email, id]
    );

    return responseREST(res, httpStatus.OK, { 
      message: 'Domain deleted successfully',
      id: id 
    });
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};
