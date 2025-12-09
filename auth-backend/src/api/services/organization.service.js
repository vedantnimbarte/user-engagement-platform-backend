import {
  responseREST,
  responseRESTError,
  httpStatus,
  dbStatus,
} from "../../common/functions.js";

export const getOrganizationProfileService = async (req, res) => {
  const functionName = "getOrganizationProfileService";

  try {
    const organizationProfile = await global.$main.one(
      `
      SELECT 
        o.id,
        o.name,
        o.email,
        o.description,
        o.address_line1,
        o.logo_url,
        o.website_url,
        o.other_info,
        o.subdomain,
        o.script_id,
        o.is_script_installed,
        o.created_at,
        o.updated_at,
        o.city,
        o.phone_number,
        o.zip_code,
        c.name as country_name,
        s.name as state_name,
        t.name as timezone_name,
        cur.code as currency_code,
        cur.symbol as currency_symbol
      FROM organizations o
      LEFT JOIN countries c ON c.id = o.country_id
      LEFT JOIN states s ON s.id = o.state_id
      LEFT JOIN timezones t ON t.id = o.timezone_id
      LEFT JOIN currencies cur ON cur.id = o.currency_id
      WHERE o.id = $1 
      AND o.status = $2`,
      [req.userInfo.organization_id, dbStatus.ENABLE]
    );

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.organization_profile_fetched_successfully"),
      organizationProfile
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};

export const updateOrganizationProfileService = async (req, res) => {
  const functionName = "updateOrganizationProfileService";

  try {
    const {
      name,
      logo,
      description,
      website,
      country_id,
      state_id,
      city,
      zip_code,
      timezone_id,
      other_info,
      tax_ids,
    } = req.body;

    await global.$main.none(
      `
        UPDATE organizations SET
        name = $1,
        description = $2,
        website_url = $3,
        logo_url = $4,
        country_id = $5,
        state_id = $6,
        city = $7,
        zip_code = $8,
        timezone_id = $9,
        tax_ids = $10,
        other_info = $11,
        updated_at = NOW()
        WHERE id = $12 AND status = $13
        `,
      [
        name,
        description,
        website,
        logo,
        country_id,
        state_id,
        city,
        zip_code,
        timezone_id,
        other_info,
        tax_ids,
        req.userInfo.organization_id,
        dbStatus.ENABLE,
      ]
    );

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("msg.organization_profile_updated_successfully")
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};
