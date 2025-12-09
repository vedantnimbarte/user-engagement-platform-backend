import {
  responseRESTError,
  responseREST,
  dbStatus,
  httpStatus,
} from "../../common/functions.js";

export const getPackagesService = async (req, res) => {
  const functionName = "getPackagesService";
  try {
    const packages = await $main.any(
      `SELECT p.id AS package_id, p.name, p.trial_days, p.maus_unit_limit, p.type, (CASE
        WHEN EXISTS (
          SELECT is_trial FROM subscriptions WHERE organization_id = $1 AND is_trial = true LIMIT 1
        ) THEN false
        ELSE p.is_trial
      END) AS is_trial, json_agg(
        json_build_object(
          'id', pp.id,
          'price', pp.price,
          'interval', it.key,
          'parent_package_id', pp.parent_package_id
        )
      ) AS prices
      FROM packages p
      JOIN package_prices pp ON p.id = pp.package_id
      JOIN interval_types it ON pp.interval_type_id = it.id
      WHERE p.status = $2
      GROUP BY p.id
      ORDER BY p.level ASC`,
      [req.userInfo.organization_id, dbStatus.ENABLE]
    );

    return responseREST(
      res,
      httpStatus.SUCCESS,
      req.t("packaged_get_success"),
      packages
    );
  } catch (error) {
    $logger.error(functionName, null, req, error.message);
    return responseRESTError(req, res, error);
  }
};
