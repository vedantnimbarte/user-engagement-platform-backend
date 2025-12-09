import common from "@userplus/common";
import { userActivityState } from "./variables.js";

const userplusMethods = {
  common: {
    mergeFeatureProgress: async (args, tenantDB) => {
      try {
        const {
          featureProgressForIdentified: featureProgressForIdentifiedUser,
          featureProgressForAnonymous: featureProgressForAnonymousUser,
          currentUserInfo,
          anonymous_tracking_id,
        } = args;

        const anonymousFP = {
          checklist: [],
          product_tour: [],
          nps: [],
        };
        const identifiedFP = {
          checklist: [],
          product_tour: [],
          nps: [],
        };

        if (featureProgressForAnonymousUser) {
          anonymousFP.checklist = featureProgressForAnonymousUser.find(
            (fp) => fp.feature_type === ulConstants.FEATURE_TYPE.CHECKLIST
          ).feature_progress;
          anonymousFP.product_tour = featureProgressForAnonymousUser.find(
            (fp) => fp.feature_type === ulConstants.FEATURE_TYPE.PRODUCT_TOUR
          ).feature_progress;
          anonymousFP.nps = featureProgressForAnonymousUser.find(
            (fp) => fp.feature_type === ulConstants.FEATURE_TYPE.NPS
          ).feature_progress;
        }

        if (featureProgressForIdentifiedUser) {
          identifiedFP.checklist = featureProgressForIdentifiedUser.find(
            (fp) => fp.feature_type === ulConstants.FEATURE_TYPE.CHECKLIST
          ).feature_progress;
          identifiedFP.product_tour = featureProgressForIdentifiedUser.find(
            (fp) => fp.feature_type === ulConstants.FEATURE_TYPE.PRODUCT_TOUR
          ).feature_progress;
          identifiedFP.nps = featureProgressForIdentifiedUser.find(
            (fp) => fp.feature_type === ulConstants.FEATURE_TYPE.NPS
          ).feature_progress;
        }

        // Calling the merge function for each feature one by one
        // 1. Checklist
        const responseMergeChecklist =
          await userplusMethods.checklist.featureProgressMergerChecklist(
            {
              userProgressForChecklist: identifiedFP.checklist,
              anonymousProgressForChecklist: anonymousFP.checklist,
              user_tracking_id: currentUserInfo.user_tracking_id,
              anonymous_tracking_id: anonymous_tracking_id,
            },
            tenantDB
          );
        if (!responseMergeChecklist.canProceed) {
          return responseMergeChecklist;
        }

        // 2. Product Tour
        const responseMergeProductTour =
          await userplusMethods.product_tour.featureProgressMergerProductTour(
            {
              userProgressProductTour: identifiedFP.product_tour,
              anonymousProgressProductTour: anonymousFP.product_tour,
              user_tracking_id: currentUserInfo.user_tracking_id,
              anonymous_tracking_id: anonymous_tracking_id,
            },
            tenantDB
          );
        if (!responseMergeProductTour.canProceed) {
          return responseMergeProductTour;
        }

        // 3. NPS
        // Calling merger function for NPS

        const responseMergeNPS =
          await userplusMethods.nps.featureProgressMergerNPS(
            {
              userProgressNPS: identifiedFP.nps,
              anonymousProgressNPS: anonymousFP.nps,
              user_tracking_id: currentUserInfo.user_tracking_id,
              anonymous_tracking_id: anonymous_tracking_id,
            },
            tenantDB
          );
        if (!responseMergeNPS.canProceed) {
          return responseMergeNPS;
        }
        return {
          canProceed: true,
        };
      } catch (error) {
        return {
          canProceed: false,
          error: error,
        };
      }
    },

    fetchingForeignDataFromRelationalTable: async (
      { tableName, dataForUpsertion },
      tenantDB
    ) => {
      try {
        let q = `SELECT * FROM ${tableName} 
        WHERE ${Object.keys(dataForUpsertion)
            .map((k, i) => `${k} = $${i + 1}`)
            .join(" AND ")};`;
        let refrenceData = await tenantDB.any(
          q,
          Object.values(dataForUpsertion)
        );

        if (!refrenceData.length) {
          let newrefrenceData = await tenantDB.any(
            `INSERT INTO ${tableName} 
              (${Object.keys(dataForUpsertion).join(",")})
              VALUES (${Object.keys(dataForUpsertion).map(
              (_, i) => `$${i + 1}`
            )}) RETURNING *;
            `,
            Object.values(dataForUpsertion)
          );

          refrenceData = newrefrenceData;
        }

        return {
          canProceed: true,
          foreignData: refrenceData[0],
        };
      } catch (error) {
        return {
          canProceed: false,
          error: error,
        };
      }
    },

    checkSessionForUser: async (tenantDB, userId) => {
      const resolverName = "checkSessionForUser";

      try {
        const checkExists = await tenantDB.any(
          `SELECT usa.id FROM user_session_activities usa
           JOIN tracked_users tu on usa.user_id = tu.id
            WHERE tu.tracked_id = $1 AND usa.session_state IN ($2,$3);`,
          [userId, userActivityState.ACTIVE, userActivityState.IDLE]
        );

        if (!checkExists.length) {
          return {
            data: null,
          };
        }

        return {
          data: checkExists[0],
        };
      } catch (error) {
        console.log(error)
        return {
          data: null,
        };
      }
    },

    getUserFeatureProgressReport: async (args, tenantDB) => {
      try {
        const progressForChecklist = await tenantDB.query(
          `SELECT checklist_id , progress FROM user_progress_checklist WHERE user_id = $1;`,
          [args.user_tracking_id]
        );
        const progressForProductTour = await tenantDB.query(
          `SELECT product_tour_id ,progress FROM user_progress_product_tour WHERE user_id = $1;`,
          [args.user_tracking_id]
        );
        const progressForNPS = await tenantDB.query(
          `SELECT * FROM user_progress_nps WHERE user_id = $1;`,
          [args.user_tracking_id]
        );
        const progressOfDemox = await tenantDB.query(
          `SELECT * FROM user_progress_demox WHERE user_id = $1;`,
          [args.user_tracking_id]
        );

        const featureProgressReport = [
          {
            feature_type: "checklist",
            feature_progress: progressForChecklist.rows,
          },
          {
            feature_type: "product_tour",
            feature_progress: progressForProductTour.rows,
          },
          {
            feature_type: "nps",
            feature_progress: progressForNPS.rows,
          },
          {
            feature_type: "demox",
            feature_progress: progressOfDemox.rows,
          },
        ];

        return { isError: false, data: featureProgressReport };
      } catch (error) {
        return {
          isError: true,
          error: error,
        };
      }
    },

    getSessionData: async (args, tenantDB) => {
      try {
        const findSession = await tenantDB.oneOrNone(
          `SELECT usa.session_id, user_tracking_id, 
            anonymous_tracking_id, user_details, 
            page_view_tracking
            FROM user_session_activities usa
            LEFT JOIN LATERAL (
            SELECT session_id, json_agg(json_build_object(
              'page_url', page_url,
            'time_spent_in_seconds', time_spent_in_seconds,
            'viewed_at', viewed_at,
            'ended_at', ended_at,
            'sort_order', sort_order
            )) AS page_view_tracking FROM session_page_view spv
            JOIN page
            ON spv.page_id = page.page_id
            WHERE session_id = usa.session_id
            GROUP BY session_id
            ) AS spv
          ON usa.session_id = spv.session_id
              WHERE usa.id = $1;`,
          [args.session_id]
        );

        if (findSession) {
          return { canProceed: true, data: findSession };
        } else {
          return {
            canProceed: false,
            error: { message: "Session not found" },
          };
        }
      } catch (error) {
        return {
          canProceed: false,
          error: error,
        };
      }
    },
    mergeTrackedData: (data1, data2) => {
      // finding the nps, product tour and checklist data
      const npsData1 = data1?.nps || [];
      const npsData2 = data2?.nps || [];
      const productTourData1 = data1?.product_tour || [];
      const productTourData2 = data2?.product_tour;
      const checklistData1 = data1?.checklist || [];
      const checklistData2 = data2?.checklist || [];

      // Merging the nps data : triggered
      const npsTriggered1 = npsData1?.triggered || [];
      const npsTriggered2 = npsData2?.triggered || [];
      const npsTriggeredMerged = [...npsTriggered1, ...npsTriggered2];
      // Looping over npsTriggeredMerged and removing duplicates and increasing the count
      const npsTriggeredMergedUnique = npsTriggeredMerged.reduce(
        (acc, curr) => {
          const index = acc.findIndex((item) => item.nps_id === curr.nps_id);
          if (index === -1) {
            return [...acc, curr];
          } else {
            acc[index].count += 1;
            return acc;
          }
        },
        []
      );

      // Merging the nps data : completed
      const npsCompleted1 = npsData1?.completed || [];
      const npsCompleted2 = npsData2?.completed || [];
      const npsCompletedMerged = [...npsCompleted1, ...npsCompleted2];
      // Looping over npsCompletedMerged and removing duplicates and increasing the count
      const npsCompletedMergedUnique = npsCompletedMerged.reduce(
        (acc, curr) => {
          const index = acc.findIndex((item) => item.nps_id === curr.nps_id);
          if (index === -1) {
            return [...acc, curr];
          } else {
            acc[index].count += 1;
            return acc;
          }
        },
        []
      );

      // Merging the nps data : dismissed
      const npsDismissed1 = npsData1?.dismissed || [];
      const npsDismissed2 = npsData2?.dismissed || [];
      const npsDismissedMerged = [...npsDismissed1, ...npsDismissed2];
      // Looping over npsDismissedMerged and removing duplicates and increasing the count
      const npsDismissedMergedUnique = npsDismissedMerged.reduce(
        (acc, curr) => {
          const index = acc.findIndex((item) => item.nps_id === curr.nps_id);
          if (index === -1) {
            return [...acc, curr];
          } else {
            acc[index].count += 1;
            return acc;
          }
        },
        []
      );

      // returning the merged data
      return {
        ...data2,
        nps: {
          triggered: npsTriggeredMergedUnique,
          completed: npsCompletedMergedUnique,
          dismissed: npsDismissedMergedUnique,
        },
      };
    },
    updateMauCountOfAccount: async (req) => {
      const controllerName = "updateMauCountOfAccount";
      try {
        // set the mau count in account_mau_count table
        const getAccountSubscriptionDetail = await $main.any(
          `SELECT * FROM subscriptions WHERE organization_id = $1;`,
          [req.userInfo.organization_id]
        );

        if (!getAccountSubscriptionDetail.length) {
          return {
            canProceed: false,
            error: "Cannot find a current subscription.",
          };
        }

        const today = new Date(); // This creates a new date object for the current date and time
        const getMauCount = await $main.any(
          `SELECT * FROM organization_mau_counts WHERE organization_id = $1 AND subscription_id = $2 
            AND mau_month_started_at <= $3 AND mau_month_ended_at >= $3`,
          [
            req.userInfo.organization_id,
            getAccountSubscriptionDetail[0]?.id,
            today.toISOString(),
          ]
        );

        if (getMauCount.length) {
          // update this entry
          await $main.any(
            `UPDATE organization_mau_counts SET mau_count = $1 WHERE id = $2 
              AND subscription_id = $3;`,
            [
              getMauCount[0].mau_count + 1,
              getMauCount[0].id,
              getAccountSubscriptionDetail[0].id,
            ]
          );

          return {
            canProceed: true,
            data: null,
          };
        }
        const subscriptionStart =
          getAccountSubscriptionDetail[0].start_date;

        if (today.getDate() >= subscriptionStart.getDate()) {
          // create entry for this date in account_mau_count table
          // set mau_month_start_date to minus one month to subscription start_date
          await $main.none(
            `INSERT INTO organization_mau_counts (organization_id, subscription_id, mau_count, month_started_at, 
              month_ended_at) VALUES ($1, $2, $3, $4, $5);`,
            [
              req.userInfo.organization_id,
              getAccountSubscriptionDetail[0].id,
              1,
              new Date(subscriptionStart.setMonth(today.getMonth())),
              new Date(
                subscriptionStart.setMonth(subscriptionStart.getMonth() + 1)
              ),
            ]
          );
        } else {
          let mau_month_started_at = new Date(
            subscriptionStart.setMonth(today.getMonth() - 1)
          );

          let next = getNextMonth(subscriptionStart);
          let mau_month_end_date = new Date(next.monthEndDate);

          await $main.none(
            `INSERT INTO organization_mau_counts (organization_id, subscription_id, mau_count, month_started_at, 
              month_ended_at) VALUES ($1, $2, $3, $4, $5);`,
            [
              req.userInfo.organization_id,
              getAccountSubscriptionDetail[0].id,
              1,
              new Date(mau_month_started_at),
              new Date(mau_month_end_date),
            ]
          );
        }
       
        return {
          canProceed: true,
          data: null,
        };
      } catch (error) {
        return {
          canProceed: false,
          error: error,
        };
      }
    },

    getNextMonth: (subscriptionStartDate) => {
      let date = subscriptionStartDate.getDate();
      let month = subscriptionStartDate.getMonth();
      let year = subscriptionStartDate.getFullYear();

      let nextDate = 0;
      let nextMonth = 0;
      let nextYear = 0;
      if (month === 11) {
        nextYear = year + 1;
        nextMonth = 0;
      } else {
        nextYear = year;
        nextMonth = month + 1;
      }
      if (month === 1 && date > 28) {
        nextDate = 28;
      }
      if ([0, 2, 4, 7, 9].includes(month) && date > 30) {
        nextDate = 30;
      } else {
        nextDate = date;
      }

      let monthEndDate = new Date(
        nextYear,
        nextMonth,
        nextDate,
        subscriptionStartDate.getHours(),
        subscriptionStartDate.getMinutes(),
        subscriptionStartDate.getSeconds(),
        subscriptionStartDate.getMilliseconds()
      );

      return {
        date: nextDate,
        month: nextMonth,
        year: nextYear,
        monthEndDate: monthEndDate,
      };
    },
    validateDomainId: async (args, tenantDB) => {
      try {
        console.log("validateDomainId", args);
          const domain = await tenantDB.any(
            `SELECT name, is_system FROM 
              domains WHERE id = $1;`,
            [args.domain_id]
          );

        if (!domain.length) {
          return {
            canProceed: false,
            error: { message: "Invalid domain id" },
          };
        }

        return {
          canProceed: true,
          data: domain[0],
        };
      } catch (error) {
        return {
          canProceed: false,
          error: error.message,
        };
      }
    },

    validateSessionId: async (args, tenantDB) => {
      // check session_id
      try {
        let query = `SELECT id,started_at FROM user_session_activities WHERE id = $1`;
        const sessionData = await tenantDB.oneOrNone(query, [
          args.session_id,
        ]);
        if (!sessionData) {
          return {
            canProceed: false,
            error: { message: "Invalid session id" },
          };
        }
        return {
          canProceed: true,
          data: sessionData,
        };
      } catch (error) {
        return {
          canProceed: false,
          error: error.message,
        };
      }
    },

    validateSocketIdAndUpdateState: async (args, tenantDB) => {
      try {
        // check socket_id

        let query1 = `INSERT INTO socket_accounts (socket_id, account_id)
        SELECT $1, $2
        WHERE NOT EXISTS (
          SELECT 1 FROM socket_accounts WHERE socket_id = $1 AND account_id = $2
        );
        `;
        await global.pool.query(query1, [args.socket_id, args.accountId]);
        let query2 = `UPDATE user_session_activity SET session_state = $1,socket_id = $2 WHERE session_id = $3`;
        await tenantDB.query(query2, [
          args.session_state,
          args.socket_id,
          args.session_id,
        ]);

        return {
          canProceed: true,
          data: null,
        };
      } catch (error) {
        return {
          canProceed: false,
          error: error.message,
        };
      }
    },

    validateUserInUserTrackedData: async (args, tenantDB) => {
      const functionName = "validateUserInUserTrackedData";
      try {
        // validate user in tracked_data
        let { tracking_id, user_type } = args;
        const query1 = `
          SELECT * FROM tracked_users
          WHERE tracked_id = $1 AND user_type = $2
        `;

        const userData = await tenantDB.oneOrNone(query1, [
          tracking_id,
          user_type,
        ]);
        if (!userData) {
          return {
            canProceed: false,
            error: { message: "User Not Found In user_tracked_data" },
          };
        }
        return {
          canProceed: true,
          data: userData,
        };
      } catch (error) {
        return {
          canProceed: false,
          error: error,
        };
      }
    },

    validateChecklistId: async (args, tenantDB) => {
      const functionName = "validateChecklistId";
      try {
        const query1 = `
          SELECT checklist_id from checklist_live
          WHERE checklist_id = $1
          AND status = $2
        `;
        const { rows: checklistData } = await tenantDB.query(query1, [
          args.checklist_id,
          dbStatus.ENABLE,
        ]);

        if (!checklistData.length) {
          return {
            canProceed: false,
            error: { message: "Checklist Not Found" },
          };
        }
        return {
          canProceed: true,
          data: checklistData[0],
        };
      } catch (error) {
        return {
          canProceed: false,
          error: error,
        };
      }
    },

    validateChecklistPkey: async (args, tenantDB) => {
      const functionName = "validateChecklistPkey";
      try {
        const query1 = `
          SELECT checklist_id , progress from user_progress_checklist
          WHERE user_progress_checklist_id = $1
        `;
        const { rows: checklistData } = await tenantDB.query(query1, [
          args.p_key,
        ]);

        if (!checklistData.length) {
          return {
            canProceed: false,
            error: { message: "Checklist Progress Not Found" },
          };
        }
        return {
          canProceed: true,
          data: checklistData[0],
        };
      } catch (error) {
        return {
          canProceed: false,
          error: error,
        };
      }
    },

    getFeatureProgressReport: async (args, tenantDB) => {
      const functionName = "getFeatureProgressReport";
      try {
        let { user_id, user_type } = args;
        let query1 = `
        SELECT feature_type, JSON_AGG(progress ORDER BY created_at DESC) AS feature_progress
        FROM (
            SELECT 'checklist' AS feature_type, progress, created_at
            FROM user_progress_checklist
            WHERE user_id = $1 AND user_type = $2
        
          UNION ALL
        
          SELECT 'product_tour' AS feature_type, progress, created_at
          FROM user_progress_product_tour
           WHERE user_id = $1 AND user_type = $2
          
          UNION ALL
          
          SELECT 'nps' AS feature_type, json_build_object(
            'progress_json', progress_json,
            'completed_at', completed_at,
            'dismissed_at',dismissed_at
          ) as progress
          , created_at
            FROM user_progress_nps
           WHERE user_id = $1 AND user_type = $2
        ) AS subquery
        GROUP BY feature_type;
        
      `;
        const { rows: featureProgressData } = await tenantDB.query(query1, [
          user_id,
          user_type,
        ]);
        return {
          canProceed: true,
          data: featureProgressData,
        };
      } catch (error) {
        return {
          canProceed: false,
          error: error,
        };
      }
    },
  },
  eventHandlers: {
    trackCustomEvent: async (args, tenantDB) => {
      const functionName = "trackCustomEvent";
      try {
        // track attributes
        return tenantDB.tx(async (client) => {
          const trackAttributes =
            await userplusMethods.attribute.trackAttributesData(args, client);
          if (!trackAttributes.canProceed) {
            return trackAttributes;
          }
          let { event, data, fired_at, session_started_at } = args;
          let eventData =
            await userplusMethods.common.fetchingForeignDataFromRelationalTable(
              {
                tableName: "events",
                dataForUpsertion: {
                  name: event,
                  type: "custom",
                },
              },
              client
            );
          if (!eventData.canProceed) {
            return eventData;
          }
          let { page_url } = data
          const event_id = eventData.foreignData?.id;
          let pageData = await userplusMethods.common.fetchingForeignDataFromRelationalTable(
            {
              tableName: "pages",
              dataForUpsertion: {
                url: page_url,
              },
            },
            client
          );
          if (!pageData.canProceed) {
            return pageData;
          }
          const page_id = pageData.foreignData?.id;


         

          // track this event against the session
          const query2 = `
              INSERT INTO event_trackings (session_id, event_id, event_data,fired_at,domain_id,page_id,session_started_at_fk)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
          `;
          const params2 = [
            args.session_id,
            event_id,
            data,
            fired_at,
            args.domain_id,
            page_id,
            session_started_at
          ];

          await client.none(query2, params2);

          // update the user_tracked_data table
          const query3 = `
              UPDATE tracked_users
              SET last_seen_at = $1
              WHERE tracked_id = $2 AND user_type = $3
          `;
          const params3 = [
            new Date(),
            args.tracking_id,
            args.user_type,
          ];

          await client.none(query3, params3);

          return {
            canProceed: true,
            data: null,
          };
        });
      } catch (error) {
        return {
          canProceed: false,
          error: error,
        };
      }
    },

    trackPageView: async (args, tenantDB) => {
      const functionName = "trackPageView";
      try {
        const { session_id, data, domain_id, event, fired_at, session_started_at } = args;

        return tenantDB.tx(async (client) => {

          // insert this page in page table
          let getDataOfPage =
            await userplusMethods.common.fetchingForeignDataFromRelationalTable(
              {
                tableName: "pages",
                dataForUpsertion: {
                  url: data.page_url,
                },
              },
              client
            );
          if (!getDataOfPage.canProceed) {
            return getDataOfPage;
          }
          const page_id = getDataOfPage.foreignData?.id;

          // check if event is already present in event table
          let eventData =
            await userplusMethods.common.fetchingForeignDataFromRelationalTable(
              {
                tableName: "events",
                dataForUpsertion: {
                  name: event,
                  type: "system",
                },
              },
              client
            );
          if (!eventData.canProceed) {
            return eventData;
          }
          const event_id = eventData.foreignData?.id;
          const query1 = `
          UPDATE 
            tracked_users
          SET
           last_seen_at = $1,
           user_status = $2
          WHERE
           tracked_id = $3 AND user_type = $4
        `;

          const params = [
            new Date(),
            userActivityState.ACTIVE,
            args.tracking_id,
            args.user_type,
          ];
          await client.none(query1, params);
          const query2 = `
          SELECT
            sort_order, viewed_at,id as session_page_view_id,time_spent,ended_at
          FROM
            session_page_views
          WHERE
            session_id = $1
          ORDER BY
            sort_order DESC
          LIMIT  1
          `;
          const params2 = [session_id];
          const previousPageViews = await client.oneOrNone(query2, params2);
          let sort_order = previousPageViews?.sort_order + 1 || 1;

          const nowDate = new Date();

          // time_sent between the previous page_view and this page_view
          if (previousPageViews) {
            let time_spent_in_seconds =
              previousPageViews.time_spent !== null
                ? (nowDate.getTime() -
                  new Date(previousPageViews?.ended_at).getTime()) /
                1000 +
                previousPageViews?.time_spent
                : (nowDate.getTime() -
                  new Date(previousPageViews?.viewed_at).getTime()) /
                1000;

            await client.query(
              `
          UPDATE
            session_page_views
          SET
            time_spent = $1,
            ended_at = $3
          WHERE
            id = $2

          `,
              [
                parseInt(time_spent_in_seconds),
                previousPageViews?.session_page_view_id,
                nowDate.toISOString(),
              ]
            );
          }

          const query3 = `
          INSERT INTO session_page_views (session_id, page_id, sort_order, viewed_at,domain_id,session_started_at_fk)
          VALUES ($1, $2, $3, $4, $5, $6)
        `;
          const params3 = [
            session_id,
            page_id,
            sort_order,
            nowDate.toISOString(),
            domain_id,
            session_started_at
          ];
          await client.none(query3, params3);

          const query5 = `
          INSERT INTO event_trackings (session_id, event_id,fired_at,domain_id,page_id,session_started_at_fk)
          VALUES ($1, $2, $3, $4, $5,$6)
        `;
          const params5 = [session_id, event_id, fired_at, domain_id,page_id, session_started_at];
          await client.none(query5, params5);
          return {
            canProceed: true,
            data: null,
          };
        });
      } catch (error) {
        return {
          canProceed: false,
          error: error,
        };
      }
    },

    trackPinned: async (args, tenantDB) => {
      const functionName = "trackPinned";
      try {
        const { data, session_id, domain_id } = args;
        const query1 = `
          INSERT INTO event_tracking (session_id, event_id, tracked_data, fired_at,domain_id,pin_event_id)
          VALUES ($1, $2, $3, $4, $5 , $6)
        `;
        const params1 = [
          session_id,
          data.click_event_id,
          data,
          data.fired_at,
          domain_id,
          data.pin_event_id,
        ];
        await tenantDB.query(query1, params1);
        return {
          canProceed: true,
          data: null,
        };
      } catch (error) {
        return {
          canProceed: false,
          error: error,
        };
      }
    },

    trackSystemEvent: async (args, tenantDB) => {
      const functionName = "trackSystemEvent";
      try {
        if (args.event.toLowerCase() == "click") {
          if (!args.data.element_label) {
            return {
              canProceed: false,
              error: "Invalid Argument Passed",
            };
          }
        }
        // check if event is already present in event table
        let eventData =
          await userplusMethods.common.fetchingForeignDataFromRelationalTable(
            {
              tableName: "events",
              dataForUpsertion: {
                name: args.event,
                type: "system",
              },
            },
            tenantDB
          );
        if (!eventData.canProceed) {
          return eventData;
        }
        const event_id = eventData.foreignData?.id;

        const query1 = `
          INSERT INTO event_trackings (session_id, event_id, event_data, fired_at,domain_id,session_started_at_fk)
          VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const params1 = [
          args.session_id,
          event_id,
          args.data,
          args.fired_at,
          args.domain_id,
          args.session_started_at
        ];

        await tenantDB.none(query1, params1);
        return {
          canProceed: true,
          data: null,
        };
      } catch (error) {
        return {
          canProceed: false,
          error: error,
        };
      }
    },
  },
  attribute: {
    trackAttributesData: async (args, tenantDB) => {
      const functionName = "trackAttributesData";
      try {
        const { attributes, is_system_attribute = false } = args;

        // check attrubutes is exsit or not
        const query1 = `
           SELECT key
          FROM(
              SELECT unnest($1:: text[]) AS key
          ) AS t(key)
           WHERE NOT EXISTS(
              SELECT 1
               FROM up_attributes
               WHERE key = t.key
          ); `;
        const attributeNames = Object.keys(attributes);
        const params = [attributeNames];
        const notexistAttribute = await tenantDB.any(query1, params);

        await tenantDB.tx(async (client) => {

          // create if attributes not exist
          for (let i = 0; i < notexistAttribute?.length; i++) {
            let key = notexistAttribute[i].key;
            let type = attributes[key];
            //create if data_type not exist
            let query2 = `
              INSERT INTO data_types (name, key)
              VALUES ($1, $1)
              ON CONFLICT (key) DO UPDATE
              SET name = EXCLUDED.name
              RETURNING id;
            `;
            let params2 = [type];
            const data_type = await client.one(query2, params2);
            const data_type_id = data_type.id;
            // create attribute
            let query3 = `
                       INSERT INTO up_attributes (key, name, data_type_id, is_system_attribute)
                      VALUES ($1, $2, $3, $4)
                      ON CONFLICT (key) DO UPDATE
                      SET name = EXCLUDED.name,
                          data_type_id = EXCLUDED.data_type_id,
                          is_system_attribute = EXCLUDED.is_system_attribute;
              `;
            let params3 = [
              key,
              key,
              data_type_id,
              is_system_attribute
            ];
            await client.none(query3, params3);
          }
        });

        return {
          canProceed: true,
          data: null,
        };
      } catch (error) {
        return {
          canProceed: false,
          error: error,
        };
      }
    },
  },

};


const {
  dbStatus,
  dbPermission,
  otpType,
  pathOfService,
  pathOfServiceMui,
  emailTemplate,
  smsText,
  httpStatus,
  signJWTs,
  encrypt,
  decrypt,
  generateOTP,
  responseWithError,
  responseWithErrorAndMessage,
  responseRESTError,
  responseREST,
  responseWithData,
  responseRESTInvalidArgs,
  subscriptionMode,
  verifyUser,
  getTenantByAccountId,
} = common;

export {
  dbStatus,
  dbPermission,
  otpType,
  pathOfService,
  pathOfServiceMui,
  emailTemplate,
  smsText,
  httpStatus,
  signJWTs,
  encrypt,
  decrypt,
  generateOTP,
  responseWithError,
  responseWithErrorAndMessage,
  responseRESTError,
  responseREST,
  responseWithData,
  responseRESTInvalidArgs,
  subscriptionMode,
  verifyUser,
  getTenantByAccountId,
  userplusMethods
};
