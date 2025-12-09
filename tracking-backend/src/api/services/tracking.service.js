import { isbot } from "isbot";
import { httpStatus, responseREST, responseRESTError, userplusMethods } from "../../common/functions.js";
import { channelStatus, REDIS_CHANNELS, trackedUserType, upConstants, userActivityState } from "../../common/variables.js";
import axios from "axios";
import { tryCatch } from "bullmq";
import moment from "moment/moment.js";
import { addJob } from "../../config/queueManager.js";


// {
//     "session_info": {
//         "page_url": "https://coral-ana-73.tiiny.site/",
//         "domain": "coral-ana-73.tiiny.site",
//         "device_type": "Desktop",
//         "referral_url": "",
//         "browser_language": "en-US",
//         "char_set": "UTF-8",
//         "page_title": "TaskFlow - Project Management Simplified"
//     },
//     "user_info": {
//         "tracking_id": "IOW4T97FMKGCT6",
//         "user_type": "anonymous",
//         "user_details": null
//     },
//     "script_id": "5TDA4DJ6XY",
//     "domain_id": "99aa8ed6-4287-49bf-bf1b-626aadd7fa16",
//     "fired_at": "2025-03-15T12:50:34.476Z",
//     "channel": 1
// }

const trackMe = async (req, res) => {

    try {

        const isBot = isbot(req.get("user-agent"));

        if (isBot) {

            return responseREST(
                res,
                httpStatus.NOT_SUCCESS,
                "Request from a bot",
                null
            );
        }

        const { session_info, user_info, script_id, domain_id, fired_at,geo_location, channel = channelStatus.WEB } = req.body;

        if (
            !session_info ||
            !user_info ||
            !script_id ||
            !domain_id ||
            !fired_at ||
            !channel ||
            !geo_location
        ) {

            return responseREST(
                res,
                httpStatus.NOT_SUCCESS,
                req.t("msg.argument_validation_error"),
                null
            );
        }



        const tenantDb = await $connectTenant(req.userInfo.email);


        const domainId = await userplusMethods.common.validateDomainId(
            { domain_id },
            tenantDb
        );

        let is_system_domain = false;

        if (!domainId.canProceed) {

            return responseRESTError(req, res, {
                message: domainId.error,
            });
        } else {
            is_system_domain = domainId.data.is_system;
        }



        const { tracking_id, user_type, user_details = null } = user_info

        if (![trackedUserType.IDENTIFIED, trackedUserType.ANONYMOUS].includes(user_type)) {
            return responseREST(
                res,
                httpStatus.NOT_SUCCESS,
                req.t("msg.invalid_argument"),
                null
            );
        }

     

        const {
            page_title,
            page_url,
            domain,
            device_type,
            referral_url,
            browser_language,
            screen_width,
            screen_height,
            char_set,
            page_path,
        } = session_info;

        let ip_address =
            req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
            req.headers["x-real-ip"] ||
            req.headers["x-cluster-client-ip"] ||
            req.headers["x-client-ip"] ||
            req.socket.remoteAddress ||
            req.connection.remoteAddress;

      
        if (!ip_address) {

            return responseRESTError(req, res, {
                message: "IP address not found",
            });
        }

        const browser = req.useragent.browser;
        const browser_version = req.useragent.version;
        const operating_system = req.useragent.os;

        // let geoLocationResponse = await axios.get(
        //     `https://pro.ip-api.com/json/${ip_address}?fields=66842623&key=82LH3HgJ6w0DP7N`,
        //     {
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //     }
        // );


        let geoLocationResponse = geo_location;

        if (geoLocationResponse.status === "success") {
            // If IP lookup fails, update data without location details

            var {
                lat: latitude,
                lon: longitude,
                continent: continent_name,
                countryCode: country_code,
                country: country_name,
                region: region_code,
                regionName: region_name,
                city,
                zip,
                timezone,
                offset,
                currency,
                location,
            } = geoLocationResponse;


            let countryData = await $main.any(
                `SELECT * FROM countries WHERE name ILIKE $1;`,
                [country_name]
            );


            // Fecthing the foreign keys from relative tables (if exists)
            // Otherwise create a field in the realtive table and fetch the id

            var countryInDB =
                await userplusMethods.common.fetchingForeignDataFromRelationalTable(
                    {
                        tableName: "countries",
                        dataForUpsertion: {
                            name: country_name,
                            code: country_code,
                            flag_url: countryData?.[0]?.flag_url
                                ? countryData?.[0].flag_url
                                : null,

                        },
                    },
                    tenantDb
                );

            if (!countryInDB.canProceed) {
                return responseRESTError(req, res, countryInDB.error);
            }



            var stateInDB =
                await userplusMethods.common.fetchingForeignDataFromRelationalTable(
                    {
                        tableName: "states",
                        dataForUpsertion: {
                            name: region_name,
                            region_code,
                        },
                    },
                    tenantDb
                );

            if (!stateInDB.canProceed) {
                return responseRESTError(req, res, stateInDB.error);
            }

            var currencyInDB =
                await userplusMethods.common.fetchingForeignDataFromRelationalTable(
                    {
                        tableName: "currencies",
                        dataForUpsertion: {
                            name: country_name,
                            code: currency,
                        },
                    },
                    tenantDb
                );

            if (!currencyInDB.canProceed) {
                return responseRESTError(req, res, currencyInDB.error);
            }

            var browserLanguageInDB =
                await userplusMethods.common.fetchingForeignDataFromRelationalTable(
                    {
                        tableName: "browser_languages",
                        dataForUpsertion: {
                            name: browser_language,
                        },
                    },
                    tenantDb
                );

            if (!browserLanguageInDB.canProceed) {
                return responseRESTError(req, res, currencyInDB.error);
            }

            var timezoneInDB =
                await userplusMethods.common.fetchingForeignDataFromRelationalTable(
                    {
                        tableName: "timezones",
                        dataForUpsertion: {
                            timezone: timezone,
                            gmt_offset: offset
                        },
                    },
                    tenantDb
                );

            if (!timezoneInDB.canProceed) {
                return responseRESTError(req, res, timezoneInDB.error);
            }
        }

        const browserInDB =
            await userplusMethods.common.fetchingForeignDataFromRelationalTable(
                {
                    tableName: "browsers",
                    dataForUpsertion: {
                        name: browser,
                    },
                },
                tenantDb
            );

        if (!browserInDB.canProceed) {
            return responseRESTError(req, res, browserInDB.error);
        }

        const operatingSystemInDB =
            await userplusMethods.common.fetchingForeignDataFromRelationalTable(
                {
                    tableName: "operating_systems",
                    dataForUpsertion: {
                        name: operating_system,
                    },
                },
                tenantDb
            );
        if (!operatingSystemInDB.canProceed) {
            return responseRESTError(req, res, operatingSystemInDB.error);
        }

        const pageInDB =
            await userplusMethods.common.fetchingForeignDataFromRelationalTable(
                {
                    tableName: "pages",
                    dataForUpsertion: {
                        url: page_url,
                    },
                },
                tenantDb
            );
        if (!pageInDB.canProceed) {
            return responseRESTError(req, res, pageInDB.error);
        }



        // let check if this anonymous user has any session
        let is_user_first_visit = false;
        if (user_type !== trackedUserType.IDENTIFIED) {
            let checkSessionForUser = await tenantDb.any(
                `SELECT COUNT(*) FROM user_session_activities usa JOIN tracked_users utd 
              ON usa.user_id = utd.id
            WHERE utd.tracked_id = $1;`,
                [tracking_id]
            );

            if (checkSessionForUser[0].count == 0) {
                is_user_first_visit = true;
            }

        }

        //add find user

        let findUser = await tenantDb.any(
            `SELECT * FROM tracked_users WHERE tracked_id = $1 AND user_type = $2;`,
            [tracking_id, user_type]
        );


        let attributesForTracking = {
            continent_name: continent_name ? continent_name : null,
            country_code: country_code ? country_code : null,
            country: country_name ? country_name : null,
            region_code: region_code ? region_code : null,
            region_name: region_name ? region_name : null,
            city: city ? city : null,
            zip: zip ? zip : null,
            currency: currency ? currency : null,
            latitude: latitude ? latitude : null,
            longitude: longitude ? longitude : null,
            ip_address,
            browser,
            operating_system,
            device_type,
            browser_language,
            page_title: page_title,
            domain,
            browser_version,
            referral_url: referral_url,
            referral_domain: !Boolean(referral_url)
                ? referral_url
                : new URL(referral_url).hostname.replace("www.", ""),
            char_set,
            page_path,
            first_seen_at: new Date().toISOString(),
            last_seen_at: new Date().toISOString(),
            page_url,
        };

        let trackedDataOfUser;

        if (!findUser.length) {
            trackedDataOfUser = await tenantDb.one(
                `INSERT INTO tracked_users (tracked_id, user_type,  domain_id, channel,zip,city,browser_id,country_id,currency_id,operating_system_id,
              latitude,longitude,timezone_id,ip_address,device_type,region_name,referral_url,referral_domain,user_status,continent,user_details,last_seen_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING id,to_char(created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS created_at;`,
                [
                    tracking_id,
                    user_type,
                    domain_id,
                    channel ? channel : channelStatus.WEB,
                    zip ? zip : null,
                    city ? city : null,
                    browserInDB.foreignData.id,
                    countryInDB.foreignData.id,
                    currencyInDB.foreignData.id,
                    operatingSystemInDB.foreignData.id,
                    latitude ? latitude : null,
                    longitude ? longitude : null,
                    timezoneInDB.foreignData.id,
                    ip_address,
                    device_type,
                    region_name,
                    referral_url,
                    !Boolean(referral_url)
                        ? referral_url
                        : new URL(referral_url).hostname.replace("www.", ""),
                    userActivityState.ACTIVE,
                    continent_name ? continent_name : null,
                    user_details,
                    new Date().toISOString()

                ]
            );

            if (!is_system_domain && channel == channelStatus.WEB) {
                const updateMauCount =
                    await userplusMethods.common.updateMauCountOfAccount(req);

                if (!updateMauCount.canProceed) {
                    return responseRESTError(req, res, updateMauCount.error);
                }
            }
        } else {

           

            attributesForTracking.first_seen_at =
                findUser[0].created_at;
            let oldChannel = findUser[0].channel;

            if (
                oldChannel !== channelStatus.WEB &&
                channel === channelStatus.WEB &&
                !is_system_domain
            ) {
                const updateMauCount =
                    await userplusMethods.common.updateMauCountOfAccount(req);

                if (!updateMauCount.canProceed) {
                    return responseRESTError(req, res, updateMauCount.error);
                }
            }

            let dataToUpdate = {
                ...attributesForTracking,
                session_state: userActivityState.ACTIVE,
                last_seen_at: new Date().toISOString(),
            };

            if (oldChannel !== channelStatus.WEB) {
                dataToUpdate.channel = channel;
            }

            trackedDataOfUser = await tenantDb.one(
                `UPDATE tracked_users  SET zip = $1, city = $2,browser_id = $3, operating_system_id = $4,currency_id = $5,ip_address = $6, device_type = $7, last_seen_at = $8,latitude = $9,longitude = $10,
              timezone_id = $11,region_name = $12,referral_url = $13,referral_domain = $14,user_status = $15,continent = $16,user_details = $17 WHERE tracked_id = $18 RETURNING *,to_char(created_at, 'YYYY-MM-DD HH24:MI:SS.USOF') AS created_at;`,
                [dataToUpdate.zip, dataToUpdate.city, dataToUpdate.browser_id, dataToUpdate.operating_system_id,
                dataToUpdate.currency_id, dataToUpdate.ip_address, dataToUpdate.device_type, new Date().toISOString(),
                dataToUpdate.latitude, dataToUpdate.longitude, dataToUpdate.timezone_id, dataToUpdate.region_name,
                dataToUpdate.referral_url, dataToUpdate.referral_domain, userActivityState.ACTIVE, dataToUpdate.continent,
                dataToUpdate.user_details, tracking_id]
            );
        }
        let newSession = await tenantDb.one(
            `INSERT INTO user_session_activities
            (user_id,  
              browser_id, operating_system_id, started_at, ended_at, session_state, is_first_visit, 
              entrance_page_id, exit_page_id, browser_language_id, device_type, 
               latitude, longitude, continent, city, state_id, country_id, 
              zipcode, timezone_id, currency_id, ip_address, channel, domain_id,user_created_at_fk)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 
              $18, $19, $20, $21, $22, $23,$24) RETURNING id,started_at;
          `,
            [
                trackedDataOfUser.id,
                browserInDB.foreignData.id,
                operatingSystemInDB.foreignData.id,
                new Date(),
                null,
                userActivityState.ACTIVE,
                is_user_first_visit,
                pageInDB.foreignData.id,
                null,
                browserLanguageInDB.foreignData.id,
                device_type,
                `${latitude ? latitude : ""}`,
                `${longitude ? longitude : ""}`,
                continent_name,
                city,
                stateInDB?.foreignData?.id,
                countryInDB?.foreignData?.id,
                isNaN(Number(zip)) ? 0 : Number(zip),
                timezoneInDB?.foreignData?.id,
                currencyInDB?.foreignData?.id,
                ip_address,
                channel ? channel : channelStatus.WEB,
                domain_id,
                trackedDataOfUser.created_at
                
            ]
        );

        const eventInDB =
        await userplusMethods.common.fetchingForeignDataFromRelationalTable(
            {
                tableName: "events",
                dataForUpsertion: {
                    name: 'session_init',
                    type: 'system'
                },
            },
            tenantDb
        );

        await tenantDb.none(
            `INSERT INTO event_trackings (event_id, session_id, fired_at, domain_id,page_id,session_started_at_fk)
            VALUES ($1, $2, $3, $4, $5, $6);`,
            [
                eventInDB.foreignData.id,
                newSession.id,
                new Date(),
                domain_id,
                pageInDB.foreignData.id,
                newSession.started_at
            ]
        );

        const session_id = newSession.id;
        return responseREST(
            res,
            httpStatus.SUCCESS,
            "Session created successfully!",
            {
                session_id,
                tracking_id,
                user_details
            }
        );

    } catch (error) {
        return responseRESTError(req, res, error);
    }

}

const trackDataInDB = async (req, res) => {
    const functionName = "trackDataInDB";
    const tenantDB = $connectTenant(req.userInfo.email);
    try {
        // vlaidate domain id 
        const {
            event,
            data,
            user_info,
            attributes,
            category,
            session_id,
            domain_id,
            fired_at,
        } = req.body;

        const validateDomain = await userplusMethods.common.validateDomainId(
            { domain_id },
            tenantDB
        );
        if (!validateDomain.canProceed) {
            return responseRESTError(req, res, validateDomain.error);
        }
        // check session_id is valid or not
        const validateSession = await userplusMethods.common.validateSessionId(
            { session_id },
            tenantDB
        );
        if (!validateSession.canProceed) {
            return responseRESTError(req, res, validateSession.error);
        }
        // check user in user_tracked_data table
        const validateUser = await userplusMethods.common.validateUserInUserTrackedData(
            { ...user_info },
            tenantDB
        );
        if (!validateUser.canProceed) {
            return responseRESTError(req, res, validateUser.error);
        }

        let event_type = "";
        if (!upConstants.systemEvents.includes(event) && data?.event_type === "pinned") {
            event_type = "pinned";
        }
        else if (event === "page_view") {
            event_type = "page_view";
        }
        else if (!upConstants.systemEvents.includes(event)) {
            event_type = "custom_event";
        }
        else {
            event_type = "system_event";
        }
        let trackEventData;

        switch (event_type) {
            case "custom_event":
                trackEventData = await userplusMethods.eventHandlers.trackCustomEvent({
                    event,
                    data,
                    attributes,
                    category,
                    session_id,
                    domain_id,
                    ...user_info,
                    session_started_at: validateSession.data.started_at,
                    fired_at
                }, tenantDB);

                break;
            case "page_view":
                trackEventData = await userplusMethods.eventHandlers.trackPageView({
                    data,
                    event,
                    ...user_info,
                    session_id,
                    session_started_at: validateSession.data.started_at,
                    domain_id,
                    fired_at
                }, tenantDB)
                break;
            // case "pinned":
            //     await userplusMethods.eventHandlers.trackPinned({
            //         data,
            //         session_id,
            //         domain_id,
            //     }, tenantDB)

            //     break;
            case "system_event":
                trackEventData = await userplusMethods.eventHandlers.trackSystemEvent({
                    event,
                    data,
                    ...user_info,
                    session_id,
                    session_started_at: validateSession.data.started_at,
                    domain_id,
                    fired_at
                }, tenantDB)

                break;
            default:
                break;
        }

        if (!trackEventData.canProceed) {
            return responseRESTError(req, res, trackEventData.error);
        }

        return responseREST(res, httpStatus.SUCCESS, "data success", null);
    } catch (error) {
        return responseRESTError(req, res, error);
    }
};

const deactivatingSession = async (req, res) => {
    const controllerName = "deactivatingSession";
    try {

        const tenantDB = $connectTenant(req.userInfo.email);
        const { session_id, page_url } = req.body;

        return tenantDB.tx(async client => {

            const findSession = await client.oneOrNone(
                `SELECT  user_id , session_state,  session_information
        FROM user_session_activities 
        WHERE id = $1 AND session_state != $2`,
                [session_id, userActivityState.INACTIVE]
            );

            if (!findSession) {
                return res.status(404).json({
                    ...httpStatus.NOT_FOUND,
                    message: "Session not found.",
                    data: null,
                });
            }

            const now_date = new Date().toISOString();
            const pageInDB =
                await userplusMethods.common.fetchingForeignDataFromRelationalTable(
                    {
                        tableName: "pages",
                        dataForUpsertion: {
                            url: page_url,
                        },
                    },
                    client
                );
            if (!pageInDB.canProceed) {
                return responseRESTError(req, res, pageInDB.error);
            }

            findSession.session_information = {
                ...findSession.session_information,
                // time_spent_as_idle will be difference between last_idle_at and current time
                time_spent_as_idle:
                    findSession.idle_time +
                    moment().diff(
                        moment(findSession.idle_at),
                        "seconds"
                    ) +
                    60,
            };

            await client.none(
                `UPDATE user_session_activities 
        SET session_state = $1, ended_at = $2,
        exit_page_id = $3
        WHERE id = $4 AND session_state != $1`,
                [
                    userActivityState.INACTIVE,
                    now_date,
                    pageInDB.foreignData.page_id,
                    session_id,
                ]
            );

            const user_id = findSession.user_id

            // Find the entry for user in user_tracked_data table
            const findUserTrackedData = await client.oneOrNone(
                `SELECT * FROM tracked_users 
        WHERE id = $1`,
                [user_id]
            );

            if (findUserTrackedData) {
                // check if user has other session active
                const checkOtherSession = await client.oneOrNone(
                    `SELECT * FROM user_session_activities 
        WHERE user_id = $1 AND session_state in ($2,$3) AND id != $4`,
                    [user_id, userActivityState.ACTIVE, userActivityState.IDLE, session_id]
                );
                if (!checkOtherSession) {
                    await client.none(
                        `UPDATE tracked_users 
            SET user_status = $1
            WHERE id = $2`,
                        [userActivityState.INACTIVE, user_id]
                    );
                }
            }
            // handle session_page_view table
            const sessionViewPage = await client.oneOrNone(
                `SELECT id as session_page_view_id, viewed_at , time_spent, ended_at
        FROM session_page_views
        WHERE session_id = $1
        ORDER BY viewed_at DESC
        Limit 1`,
                [session_id]
            );

            if (
                sessionViewPage &&
                findSession.session_state == userActivityState.ACTIVE
            ) {
                const {
                    session_page_view_id,
                    viewed_at,
                    ended_at,
                    time_spent,
                } = sessionViewPage;

                let time_spent_in_seconds = 0;

                if (ended_at == null) {
                    time_spent_in_seconds = moment().diff(moment(viewed_at), "seconds");
                } else {
                    time_spent_in_seconds =
                        moment().diff(moment(ended_at), "seconds") + time_spent_in_seconds;
                }
                await client.none(
                    `UPDATE session_page_views
        SET time_spent = $1 , ended_at = $3
        WHERE id = $2`,
                    [time_spent, session_page_view_id, now_date]
                );
            }

            return res.status(200).json({
                ...httpStatus.SUCCESS,
                message: "Session deactivated successfully.",
                data: null,
            });

        });
    } catch (error) {
        return responseRESTError(req, res, error);
    }
};

const manageSession = async (req, res) => {
    const controllerName = "manageSession";
    try {
        const client = $connectTenant(req.userInfo.email);

        const { session_id, session_state, minsToWait } = req.body;
        if (!session_id || !session_state || !minsToWait) {

            return responseREST(
                res,
                httpStatus.INVALID_ARGUMENT,
                "session_id, session_state ,socket_id and minsToWait are required",
                null
            );
        }

        // Finding the session
        const findSession = await client.oneOrNone(
            `SELECT 
          id as session_id, session_state, session_information, idle_time,idle_at, user_id 
        FROM user_session_activities 
        WHERE id = $1 AND session_state IN ($2, $3)`,
            [session_id, userActivityState.ACTIVE, userActivityState.IDLE]
        );

        if (!findSession) {
            return responseREST(
                res,
                httpStatus.NOT_FOUND,
                "No Active session found.",
                null
            );
        }

        if (
            findSession.session_state === userActivityState.ACTIVE &&
            session_state === userActivityState.IDLE
        ) {
            // Most Recent Page View
            const findMostRecentPageView = await client.oneOrNone(
                `SELECT viewed_at, id as session_page_view_id, page_id, sort_order , time_spent, ended_at
          FROM session_page_views
          WHERE session_id = $1 
          ORDER BY sort_order DESC
          LIMIT 1`,
                [findSession.session_id]
            );

            if (!findMostRecentPageView) {
                return responseREST(
                    res,
                    httpStatus.NOT_FOUND,
                    "No page view found for this session",
                    null
                );
            }

            let time_spent_in_seconds;
            if (findMostRecentPageView.time_spent !== null) {
                time_spent_in_seconds =
                    moment().diff(
                        moment(findMostRecentPageView.ended_at),
                        "seconds"
                    ) -
                    minsToWait * 60 +
                    findMostRecentPageView.time_spent;
            } else {
                time_spent_in_seconds =
                    moment().diff(
                        moment(findMostRecentPageView.viewed_at),
                        "seconds"
                    ) -
                    minsToWait * 60;
            }
            if (time_spent_in_seconds < 0) {
                time_spent_in_seconds = 0;
            }

            // Updating the most recent page view
            await client.none(
                `UPDATE session_page_views
          SET time_spent = $1, ended_at = $2
          WHERE id = $3`,
                [
                    time_spent_in_seconds,
                    new Date().toISOString(),
                    findMostRecentPageView.session_page_view_id,
                ]
            );
            const responseUser = await updateUserBySession(client, {
                findSession,
                session_state,
            });

            if (!responseUser.canProceed) {
                logger.error(controllerName, req.body, req, responseUser.error);
                return responseRESTError(req, res, responseUser.error);
            }
        } else if (
            findSession.session_state === userActivityState.IDLE &&
            session_state === userActivityState.ACTIVE
        ) {
            // Most Recent Page View
            const findMostRecentPageView = await client.oneOrNone(
                `SELECT viewed_at, id as session_page_view_id, page_id, sort_order 
          FROM session_page_views 
          WHERE session_id = $1 
          ORDER BY sort_order DESC
          LIMIT 1`,
                [findSession.session_id]
            );

            // Updating the most recent page view
            await client.none(
                `UPDATE session_page_views
          SET ended_at = $1
          WHERE id = $2`,
                [
                    new Date().toISOString(),
                    findMostRecentPageView.session_page_view_id,
                ]
            );

            const responseUser = await updateUserBySession(client, {
                findSession,
                session_state,
            });

            if (!responseUser.canProceed) {
                return responseRESTError(req, res, responseUser.error);
            }
        }

        if (session_state === userActivityState.IDLE) {
            findSession.idle_at = new Date();
        }

        if (session_state === userActivityState.ACTIVE) {
            findSession.idle_time = findSession.idle_time +
                moment().diff(
                    moment(findSession.idle_at),
                    "seconds"
                ) +
                60 * minsToWait
        }

        await client.query(
            `UPDATE user_session_activities SET session_state = $1, idle_time = $2, idle_at = $3 
        WHERE id = $4`,
            [session_state, findSession.idle_time, findSession.idle_at, findSession.session_id]
        );

        return responseREST(
            res,
            httpStatus.SUCCESS,
            "Session updated successfully",
            null
        );
    } catch (error) {
        return responseRESTError(req, res, error);
    }
};

const updateUserBySession = async (client, data) => {
    try {
        const { findSession, session_state } = data;

        // Update the entry in user_tracked_data table
        const userId =
            findSession.user_id;

        const findUserTrackedData = await client.oneOrNone(
            `SELECT * FROM tracked_users 
        WHERE id = $1`,
            [userId]
        );

        if (findUserTrackedData) {
            let { last_seen_at, id } = findUserTrackedData;

            //check if user has other session active
            const checkOtherSession = await client.oneOrNone(
                `SELECT * FROM user_session_activities 
          WHERE user_id = $1 AND session_state = $2 AND id != $3`,
                [userId, userActivityState.ACTIVE, findSession.id]
            );

            let user_status = userActivityState.ACTIVE;

            if (!checkOtherSession && session_state === userActivityState.IDLE) {
                user_status = userActivityState.IDLE;
            }

            last_seen_at =
                session_state === userActivityState.ACTIVE
                    ? new Date()
                    : last_seen_at;

            // Update the tracked_data field in user_tracked_data table
            await client.none(
                `UPDATE tracked_users 
          SET last_seen_at = $1, user_status = $2
          WHERE id = $3`,
                [last_seen_at, user_status, id]
            );

            return {
                canProceed: true,
                data: null,
            };
        }

        return {
            canProceed: false,
            error: { message: "No user found for this session." },
        };
    } catch (error) {
        return {
            canProceed: false,
            error: error,
        };
    }
};

const tracker = async (req, res) => {
    const controllerName = "tracker";
    try {
        await addJob(
            REDIS_CHANNELS.UP_TRACKING_QUEUE,
            {
             body: req.body,
             userInfo: req.userInfo,
             process:req.body.process
            },
            {
              priority: 1,
            }
          );
        return responseREST(
            res,
            httpStatus.SUCCESS,
            "Success",
            null
        );
    } catch (error) {
        return responseRESTError(req, res, error);
    }
};

export {
    trackMe,
    trackDataInDB,
    deactivatingSession,
    manageSession,
    tracker
}