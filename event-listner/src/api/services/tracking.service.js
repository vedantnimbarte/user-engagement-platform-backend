import moment from "moment/moment.js";
import {  userplusMethods } from "../../common/functions.js";

const trackDataInDB = async (req) => {
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
            return ;
        }
        // check session_id is valid or not
        const validateSession = await userplusMethods.common.validateSessionId(
            { session_id },
            tenantDB
        );
        if (!validateSession.canProceed) {
            return ;
        }
        // check user in user_tracked_data table
        const validateUser = await userplusMethods.common.validateUserInUserTrackedData(
            { ...user_info },
            tenantDB
        );
        if (!validateUser.canProceed) {
            return ;
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
            return 
        }

        return 
    } catch (error) {
        return ;
    }
};

const deactivatingSession = async (data) => {
    const controllerName = "deactivatingSession";
    try {
        const tenantDB = $connectTenant(data.userInfo.email);
        const { session_id, page_url } = data;

        return tenantDB.tx(async client => {

            const findSession = await client.oneOrNone(
                `SELECT  user_id , session_state,  session_information
        FROM user_session_activities 
        WHERE id = $1 AND session_state != $2`,
                [session_id, userActivityState.INACTIVE]
            );

            if (!findSession) {
                return 
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
                return pageInDB.error;
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

            return {
                canProceed: true,
                message: "Session deactivated successfully.",
                data: null,};

        });
    } catch (error) {
        return { canProceed: false, error: error };
    }
};

const autoDeactivatingSessions = async (data) => {
    const controllerName = "deactivatingSession";
    try {
        const tenantDB = $connectTenant(data.userInfo.email);
        const { sessions = [] } = data.body;

        for (const session_id of sessions){
         const session =  await tenantDB.tx(async client => {

                const findSession = await client.oneOrNone(
                    `SELECT  user_id , session_state,  session_information
            FROM user_session_activities 
            WHERE id = $1 AND session_state != $2`,
                    [session_id, userActivityState.INACTIVE]
                );
    
                if (!findSession) {
                    return 
                }
    
                const now_date = new Date().toISOString();
               
    
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
                    `SELECT id as session_page_view_id, viewed_at , time_spent, ended_at,page_id
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
    
                await client.none(
                    `UPDATE user_session_activities 
            SET session_state = $1, ended_at = $2,
            exit_page_id = $3
            WHERE id = $4 AND session_state != $1`,
                    [
                        userActivityState.INACTIVE,
                        now_date,
                        sessionViewPage.page_id,
                        session_id,
                    ]
                );
    
                return {
                    canProceed: true,
                    message: "Session deactivated successfully.",
                    data: null,};
    
            });
        }

       
    } catch (error) {
        return { canProceed: false, error: error };
    }
};



const manageSession = async (data) => {
    const controllerName = "manageSession";
    try {
        const client = $connectTenant(data.userInfo.email);

        const { session_id, session_state, minsToWait } = data.body;
        if (!session_id || !session_state || !minsToWait) {

            return { canProceed: false, error: "session_id, session_state ,socket_id and minsToWait are required" };
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
            return { canProceed: false, error: "No Active session found." };
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
                return { canProceed: false, error: "No page view found for this session" };
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
                return { canProceed: false, error: responseUser.error };
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
                return { canProceed: false, error: responseUser.error };
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

        return { canProceed: true, message: "Session updated successfully" };
    } catch (error) {
        return { canProceed: false, error: error };
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

export { trackDataInDB, deactivatingSession, manageSession,autoDeactivatingSessions };