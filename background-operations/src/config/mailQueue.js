// // config/queueConfig.js
// import Bull from "bull";
// import { config } from "dotenv";
// import { REDIS_CHANNELS } from "../constant/variables.js";
// config();

// const REDIS_CONFIG = {
//   redis: {
//     host: process.env.REDIS_HOST || "localhost",
//     port: parseInt(process.env.REDIS_PORT) || 6379,
//     password: process.env.REDIS_PASSWORD,
//     tls: process.env.REDIS_TLS === "true" ? {} : undefined,
//     maxRetriesPerRequest: 3,
//     enableReadyCheck: false,
//   },
//   settings: {
//     lockDuration: 30000, // Lock timeout in ms (30 seconds)
//     stalledInterval: 30000, // How often check for stalled jobs
//     maxStalledCount: 2, // Max number of times a job can be marked as stalled
//     lockRenewTime: 15000, // Interval for lock renewal (15 seconds)
//   },
//   defaultJobOptions: {
//     attempts: 3, // Number of retry attempts
//     backoff: {
//       type: "exponential",
//       delay: 2000, // Initial delay between retries
//     },
//     timeout: 25000, // Job timeout (should be less than lockDuration)
//     removeOnComplete: true, // Remove jobs after completion
//     removeOnFail: false, // Keep failed jobs for inspection
//   },
// };

// // Function to initialize a queue with error handling
// export const createQueue = (name) => {
//   const queue = new Bull(name, REDIS_CONFIG);

//   // Global error handlers
//   queue.on("error", (error) => {
//     console.error(`Queue ${name} error:`, error);
//   });

//   queue.on("failed", (job, error) => {
//     console.error(`Job ${job.id} in ${name} failed:`, error);
//   });

//   queue.on("stalled", (job) => {
//     console.warn(`Job ${job.id} in ${name} is stalled`);
//   });

//   return queue;
// };

// // Initialize queues
// export const mailQueue = createQueue(REDIS_CHANNELS.MAIL_QUEUE);
// export const dbQueue = createQueue(REDIS_CHANNELS.DB_CREATION_QUEUE);
