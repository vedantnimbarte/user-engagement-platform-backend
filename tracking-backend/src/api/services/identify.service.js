import { httpStatus, responseREST, responseRESTError, userplusMethods } from "../../common/functions.js";
import { trackedUserType, userActivityState } from "../../common/variables.js";

const identify = async (req, res) => {      
    const functionName = 'identify';
    const tenantDB = $connectTenant(req.userInfo.email);
    try {
      if (req.body?.user_info?.user_type !== trackedUserType.IDENTIFIED) {
      
        return responseREST(
          res,
          httpStatus.NOT_SUCCESS,
          'Invalid argument passed',
          null
        );
      }
      const { user_info, anonymous_tracking_id, attributes,  } =
        req.body;
  
    //   const isHubspotConnected = await checkHubspotStatus(tenantDB);
    //   if (isHubspotConnected) {
    //     const hubspotPreferences = await fetchHubspotPreferences(tenantDB);
  
    //     const preferredUserType = hubspotPreferences.opted_user_type;
    //     const emailAttribute = hubspotPreferences.email_attribute;
  
    //     if (
    //       preferredUserType.includes('anonymous') &&
    //       currentUserInfo.user_details[`${emailAttribute}`]
    //     ) {
    //       addToHubspotEventQueue({
    //         accountId: req.accountId,
    //         tenantDB: tenantDB,
    //         event: {
    //           table: 'identify',
    //           properties: {
    //             email: currentUserInfo.user_details[`${emailAttribute}`],
    //             utk: currentUserInfo.user_tracking_id,
    //           },
    //         },
    //       });
    //     }
    //   }
      const responseTrackAttributes =
        await userplusMethods.attribute.trackAttributesData(
          {
            attributes,
            is_system_attribute: false,
          },
          tenantDB
        );
  
      if (!responseTrackAttributes.canProceed) {
        return responseRESTError(req, res, responseTrackAttributes.error);
      }
  
      const { tracking_id, user_type, user_details } = user_info;
  
      // Check sesion exists for the anonymous_tracking_id
      let sessionForAnonymous = null;
      let sessionForIdentified = null;
      let sessionId = null;
  
      if (anonymous_tracking_id) {
        const findSessionForAnonymous = await tenantDB.any(
          `SELECT usa.* FROM user_session_activities usa
           JOIN tracked_users utd ON usa.user_id = utd.id 
           WHERE utd.tracked_id = $1 
              AND utd.user_type = ${trackedUserType.ANONYMOUS} 
              AND usa.session_state = ${userActivityState.ACTIVE};`,
          [anonymous_tracking_id]
        );
  
        if (findSessionForAnonymous.length) {
          sessionForAnonymous = findSessionForAnonymous[0];
          sessionId = sessionForAnonymous.id;
        }
      } else {
        // If anonymous_tracking_id is not passed,
        const findSessionForIdentified = await tenantDB.any(
          `SELECT usa.* FROM user_session_activities usa
           JOIN tracked_users utd ON usa.user_id = utd.id 
           WHERE utd.tracked_id = $1 
              AND utd.user_type = ${trackedUserType.IDENTIFIED} 
              AND usa.session_state = ${userActivityState.ACTIVE};`,
          [tracking_id]
        );
  
        if (findSessionForIdentified.length) {
          sessionForIdentified = findSessionForIdentified[0];
          sessionId = sessionForIdentified.id;
        }
      }
  
   
  
      if (!sessionForAnonymous && !sessionForIdentified) {
       
        return responseREST(
          res,
          httpStatus.NOT_SUCCESS,
          'Session not created for user',
          null
        );
      } else if (sessionForAnonymous && !sessionForIdentified) {
        
  
        const findAnonymousUserInUserTrackedData = await tenantDB.any(
          `SELECT * FROM tracked_users WHERE tracked_id = $1 AND user_type = ${trackedUserType.ANONYMOUS};`,
          [anonymous_tracking_id]
        );
  
        // Find the identified user in user_tracked_data table that is already present
        const findIdentifiedUserInUserTrackedData = await tenantDB.any(
          `SELECT to_char(created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS user_created_at,* FROM tracked_users WHERE tracked_id = $1 AND user_type = ${trackedUserType.IDENTIFIED};`,
          [tracking_id]
        );

  
        console.log(findIdentifiedUserInUserTrackedData[0])
        if(findIdentifiedUserInUserTrackedData.length){
          
            await tenantDB.none(
                `UPDATE tracked_users SET zip = $1, city = $2, browser_id = $3, operating_system_id = $4, currency_id = $5, ip_address = $6, device_type = $7, 
                last_seen_at = $8, latitude = $9, longitude = $10, timezone_id = $11, region_name = $12, referral_url = $13, referral_domain = $14, 
                user_status = $15, continent = $16, user_details = $17
                WHERE tracked_id = $18 AND user_type = ${trackedUserType.IDENTIFIED};`,
                [
                  findAnonymousUserInUserTrackedData[0].zip,
                  findAnonymousUserInUserTrackedData[0].city,
                  findAnonymousUserInUserTrackedData[0].browser_id,
                  findAnonymousUserInUserTrackedData[0].operating_system_id,
                  findAnonymousUserInUserTrackedData[0].currency_id,
                  findAnonymousUserInUserTrackedData[0].ip_address,
                  findAnonymousUserInUserTrackedData[0].device_type,
                  new Date().toISOString(),
                  findAnonymousUserInUserTrackedData[0].latitude,
                  findAnonymousUserInUserTrackedData[0].longitude,
                  findAnonymousUserInUserTrackedData[0].timezone_id,
                  findAnonymousUserInUserTrackedData[0].region_name,
                  findAnonymousUserInUserTrackedData[0].referral_url,
                  findAnonymousUserInUserTrackedData[0].referral_domain,
                  userActivityState.ACTIVE,
                  findAnonymousUserInUserTrackedData[0].continent,
                  JSON.stringify({
                    ...findIdentifiedUserInUserTrackedData[0]?.user_details,
                    ...user_details,
                  }),
                  tracking_id,
                ]
              );

            await tenantDB.none(
                `UPDATE user_session_activities SET user_id = $1,user_created_at_fk = $2
                WHERE user_id = $3`,
                [
                  findIdentifiedUserInUserTrackedData[0].id,
                  findIdentifiedUserInUserTrackedData[0].user_created_at,
                  findAnonymousUserInUserTrackedData[0].id
                ]
              );

            await tenantDB.none(
                `DELETE FROM tracked_users WHERE id = $1`,
                [
                  findAnonymousUserInUserTrackedData[0].id
                ]
              );

            
        } else {

            await tenantDB.none(
                `UPDATE tracked_users SET tracked_id = $1 , user_type = ${trackedUserType.IDENTIFIED}, user_details = $2
                WHERE tracked_id = $3`,
                [
                  tracking_id,
                  JSON.stringify({
                    ...user_details,
                  }),
                  anonymous_tracking_id
                ]
              );
        }

        
        
      } else if (!sessionForAnonymous && sessionForIdentified) {
        const findIdentifiedUserInUserTrackedData = await tenantDB.oneOrNone(
          `SELECT * FROM tracked_users WHERE tracked_id = $1 AND user_type = ${trackedUserType.IDENTIFIED};`,
          [tracking_id]
        );
  
        await tenantDB.none(
          `UPDATE tracked_users SET user_details = $1 WHERE tracked_id = $2 
              AND user_type = ${trackedUserType.IDENTIFIED};`,
          [
            JSON.stringify({
              ...findIdentifiedUserInUserTrackedData?.user_details,
              ...user_details,
            }),
            tracking_id,
          ]
        );
      } else if (sessionForAnonymous && sessionForIdentified) {
       
      
        
  
        // Find the anonymous user in user_tracked_data table
        const findAnonymousUserInUserTrackedData = await tenantDB.oneOrNone(
          `SELECT * FROM tracked_users WHERE tracked_id = $1 AND user_type = ${trackedUserType.ANONYMOUS};`,
          [anonymous_tracking_id]
        );
  
        // Find the identified user in user_tracked_data table
        const findIdentifiedUserInUserTrackedData = await tenantDB.oneOrNone(
          `SELECT *,to_char(created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS user_created_at FROM tracked_users WHERE tracked_id = $1 AND user_type = ${trackedUserType.IDENTIFIED};`,
          [tracking_id]
        );
  
      
         await tenantDB.none(
          `UPDATE tracked_users SET user_details = $1, browser_id = $2, operating_system_id = $3, currency_id = $4, ip_address = $5, device_type = $6, last_seen_at = $7, latitude = $8, longitude = $9, timezone_id = $10, region_name = $11, referral_url = $12, referral_domain = $13, user_status = $14, continent = $15 WHERE tracking_id = $16 AND user_type = ${trackedUserType.IDENTIFIED};`,
          [
            JSON.stringify({
              ...findIdentifiedUserInUserTrackedData.user_details,
              ...findAnonymousUserInUserTrackedData.user_details,
              ...user_details,
            }),
            findIdentifiedUserInUserTrackedData.browser_id,
            findIdentifiedUserInUserTrackedData.operating_system_id,
            findIdentifiedUserInUserTrackedData.currency_id,
            findIdentifiedUserInUserTrackedData.ip_address,
            findIdentifiedUserInUserTrackedData.device_type,
            new Date().toISOString(),
            findIdentifiedUserInUserTrackedData.latitude,
            findIdentifiedUserInUserTrackedData.longitude,
            findIdentifiedUserInUserTrackedData.timezone_id,
            findIdentifiedUserInUserTrackedData.region_name,
            findIdentifiedUserInUserTrackedData.referral_url,
            findIdentifiedUserInUserTrackedData.referral_domain,
            userActivityState.ACTIVE,
            findIdentifiedUserInUserTrackedData.continent,
            tracking_id,
          ]
        );

        await tenantDB.none(
            `UPDATE user_session_activities SET user_id = $1,user_created_at_fk = $2
                WHERE user_id = $3;`,
            [findIdentifiedUserInUserTrackedData.id,findIdentifiedUserInUserTrackedData.created_at, findAnonymousUserInUserTrackedData.id]
          );
  
        await tenantDB.none(
          `DELETE FROM tracked_users WHERE tracked_id = $1 AND user_type = ${trackedUserType.ANONYMOUS};`,
          [anonymous_tracking_id]
        );
  
        sessionId = sessionForIdentified.id;
      }
  

      // get oldest session for the user
      const oldestSession = await tenantDB.oneOrNone(
        `SELECT usa.id as session_id , usa.is_first_visit,usa.user_id FROM user_session_activities usa
        JOIN tracked_users tu ON usa.user_id = tu.id
         WHERE tu.tracked_id = $1 ORDER BY started_at ASC LIMIT 1;`,
        [tracking_id]
      );
  
      await tenantDB.none(
        `UPDATE user_session_activities SET is_first_visit = true WHERE id = $1;`,
        [oldestSession.session_id]
      );

      
      await tenantDB.none(
        `UPDATE user_session_activities SET is_first_visit = false WHERE id != $1 AND user_id = $2;`,
        [oldestSession.session_id, oldestSession.user_id]
      );
  
      return responseREST(
        res,
        httpStatus.SUCCESS,
        'User identified successfully!',
        {
         session_id: sessionId
        }
      );
    } catch (error) {
     
      return responseRESTError(req, res, error);
    }
  };

  export {
    identify
  }

  
