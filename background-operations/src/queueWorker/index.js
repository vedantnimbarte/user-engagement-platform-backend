import {
  createWorker,
  initializeQueuesAndWorkers,
  createQueue,
} from "../config/queueManager.js";
import { REDIS_CHANNELS } from "../constant/variables.js";
import { createDb } from "./dbCreation.js";
import { sendDataOnMail } from "./mail.js";

//Workers for the queue with default settings
//TODO: Add more workers here
const queueWorkerFunctionMapping = {
  [REDIS_CHANNELS.DB_CREATION_QUEUE]: createDb,
  [REDIS_CHANNELS.MAIL_QUEUE]: sendDataOnMail,
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
