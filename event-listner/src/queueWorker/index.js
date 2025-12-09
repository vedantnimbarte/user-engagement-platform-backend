import { identify } from "../api/services/identify.service.js";
import { autoDeactivatingSessions, deactivatingSession, manageSession, trackDataInDB } from "../api/services/tracking.service.js";
import {
  createWorker,
  initializeQueuesAndWorkers,
  createQueue,
} from "../config/queueManager.js";
import { REDIS_CHANNELS } from "../constant/variables.js";

//Workers for the queue with default settings
//TODO: Add more workers here
const queueWorkerFunctionMapping = {
  [REDIS_CHANNELS.UP_TRACKING_QUEUE]: async (job) => {
    const { process } = job;
    switch (process) {
      case "page_view":
        return await trackDataInDB(job);
      case "deactivate":
        return await deactivatingSession(job);
      case "manage_session":   
        return await manageSession(job);
      case "identify":
        return await identify(job);
      case "auto-deactivate":
        return await autoDeactivatingSessions(job);
      default:
        return;
    }
  }
};

initializeQueuesAndWorkers(queueWorkerFunctionMapping);

//NOTE: comment initializeQueuesAndWorkers and uncomment this for test or debug process function of any queue,
//once successful add that function in mapping
// createQueue(REDIS_CHANNELS.DB_CREATION_QUEUE);
// createWorker(
//   REDIS_CHANNELS.DB_CREATION_QUEUE,
//   async (job) => {
//     try {
//       console.log(
//         `Processing job ${job.id} in queue ${REDIS_CHANNELS.MAIL_QUEUE}`
//       );
//       await job.updateProgress(0);
//       const result = await createDb(job.data);
//       await job.updateProgress(100);
//       return { success: true, result };
//     } catch (error) {
//       console.error(
//         `Error processing job ${job.id} in queue ${REDIS_CHANNELS.MAIL_QUEUE}:`,
//         error
//       );
//       const enrichedError = new Error(`Processing failed: ${error.message}`);
//       enrichedError.originalError = error;
//       enrichedError.jobId = job.id;
//       enrichedError.queueName = REDIS_CHANNELS.MAIL_QUEUE;
//       throw enrichedError;
//     }
//   }
//   // getQueueConcurrency(queueName)
// );
