// // config/queueProcessor.js
// import { mailQueue, dbQueue } from "./mailQueue.js";
// import { createDb } from "../api/services/dbCreation.js";
// import { sendDataOnMail } from "../api/services/emailSending.js";

// // Utility function for job processing
// const processJob = async (jobHandler, job) => {
//   try {
//     job.progress(0);

//     // Execute the job handler
//     // await jobHandler(job.data);

//     job.progress(100);
//     await job.moveToCompleted("done", true);

//     return { success: true };
//   } catch (error) {
//     const errorMessage = error?.message || "Unknown error occurred";
//     console.error(`Job ${job.id} failed:`, errorMessage);

//     // If job has remaining attempts, it will be retried automatically
//     if (job.attemptsMade < job.opts.attempts) {
//       throw error; // This will trigger a retry
//     }

//     await job.moveToFailed({ message: errorMessage }, true);
//     return { success: false, error: errorMessage };
//   }
// };

// // Mail Queue Processing
// mailQueue.process(async (job) => {
//   console.log(`Processing mail job ${job.id}:`, job.data);
//   return processJob(sendDataOnMail, job);
// });

// // Database Queue Processing
// dbQueue.process(async (job) => {
//   console.log(`Processing database job ${job.id}:`, job.data);
//   return processJob(createDb, job);
// });

// // Enhanced event listeners
// const setupQueueEvents = (queue, queueName) => {
//   queue.on("completed", (job, result) => {
//     console.log(`${queueName} job ${job.id} completed with result:`, result);
//   });

//   queue.on("failed", (job, error) => {
//     console.error(
//       `${queueName} job ${job.id} failed with error:`,
//       error.message
//     );
//   });

//   queue.on("progress", (job, progress) => {
//     console.log(`${queueName} job ${job.id} is ${progress}% complete`);
//   });

//   queue.on("stalled", (job) => {
//     console.warn(`${queueName} job ${job.id} has stalled`);
//   });
// };

// setupQueueEvents(mailQueue, "Mail");
// setupQueueEvents(dbQueue, "Database");

// // Graceful shutdown
// const gracefulShutdown = async () => {
//   console.log("Shutting down queues...");
//   await Promise.all([mailQueue.close(), dbQueue.close()]);
//   console.log("Queues shut down successfully");
//   process.exit(0);
// };

// process.on("SIGTERM", gracefulShutdown);
// process.on("SIGINT", gracefulShutdown);

// export { mailQueue, dbQueue };
