import pkg from "bullmq";
const { Queue, Worker, QueueEvents } = pkg;
import IORedis from "ioredis";
import dotenv from "dotenv";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { ExpressAdapter } from "@bull-board/express";

dotenv.config();

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || "",
  // db: process.env.REDIS_DB || 0,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  reconnectOnError: (err) => {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
};

// Redis connection management
let redisConnection = null;

const getNewRedisConnection = () => {
  if (!redisConnection || !redisConnection.status) {
    redisConnection = new IORedis(redisConfig);
    redisConnection.on("error", (error) => {
      console.error("Redis connection error:", error);
      redisConnection = null;
    });
  }
  return redisConnection;
};

// Default job options
const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 2000,
  },
  removeOnComplete: {
    count: 100,
  },
  removeOnFail: false,
  timeout: 30000,
};

// Store for queues, workers, and events
const store = {
  queues: new Map(),
  workers: new Map(),
  queueEvents: new Map(),
};

// Queue creation and management
const createQueue = (queueName, options = {}) => {
  if (!store.queues.has(queueName)) {
    const queue = new Queue(queueName, {
      connection: getNewRedisConnection(),
      defaultJobOptions: { ...defaultJobOptions, ...options },
    });

    queue.on("error", (error) => {
      console.error(`Queue ${queueName} error:`, error);
    });

    store.queues.set(queueName, queue);

    const queueEvents = new QueueEvents(queueName, {
      connection: getNewRedisConnection(),
    });

    setupQueueEvents(queueEvents, queueName);
    store.queueEvents.set(queueName, queueEvents);
  }
  return store.queues.get(queueName);
};

const setupQueueEvents = (queueEvents, queueName) => {
  queueEvents.on("waiting", ({ jobId }) => {
    console.log(`Job ${jobId} is waiting in queue ${queueName}`);
  });

  queueEvents.on("active", ({ jobId }) => {
    console.log(`Job ${jobId} is now active in queue ${queueName}`);
  });

  queueEvents.on("completed", ({ jobId }) => {
    console.log(`Job ${jobId} completed in queue ${queueName}`);
  });
};

// Worker creation and management
const createWorker = (queueName, processor, concurrency) => {
  if (!store.workers.has(queueName)) {
    const worker = new Worker(queueName, processor, {
      connection: getNewRedisConnection(),
      // concurrency,
    });

    setupWorkerEvents(worker, queueName);
    store.workers.set(queueName, worker);
  }
  return store.workers.get(queueName);
};

const setupWorkerEvents = (worker, queueName) => {
  worker.on("completed", (job) => {
    console.log(`Job ${job.id} in queue ${queueName} completed`);
  });

  worker.on("failed", (job, error) => {
    console.error(`Job ${job.id} in queue ${queueName} failed:`, error);
  });

  worker.on("stalled", (jobId) => {
    console.warn(`Job ${jobId} in queue ${queueName} has stalled`);
  });

  worker.on("error", (error) => {
    console.error(`Worker error in queue ${queueName}:`, error);
  });
};

// Job management
const addJob = async (queueName, data, options = {}) => {
  const queue = store.queues.get(queueName);
  if (!queue) {
    throw new Error(`Queue ${queueName} not found`);
  }

  try {
    const job = await queue.add(data?.jobName || "default", data, options);
    return job;
  } catch (error) {
    console.error(`Failed to add job to queue ${queueName}:`, error);
    throw error;
  }
};

// const getQueueConcurrency = (queueName) => {
//   const concurrencySettings = {
//     [REDIS_CHANNELS.DB_CREATION_QUEUE]: 1,
//     [REDIS_CHANNELS.MAIL_QUEUE]: 5,
//     default: 3,
//   };
//   return concurrencySettings[queueName] || concurrencySettings.default;
// };

const initializeQueuesAndWorkers = async (queueWorkerFunctionMapping) => {
  try {
    const initPromises = Object.entries(queueWorkerFunctionMapping).map(
      async ([queueName, processorFunction]) => {
        try {
          createQueue(queueName);

          const worker = createWorker(
            queueName,
            async (job) => {
              try {
                console.log(`Processing job ${job.id} in queue ${queueName}`);
                await job.updateProgress(0);
                const result = await processorFunction(job.data);
                await job.updateProgress(100);
                return { success: true, result };
              } catch (error) {
                console.error(
                  `Error processing job ${job.id} in queue ${queueName}:`,
                  error
                );
                const enrichedError = new Error(
                  `Processing failed: ${error.message}`
                );
                enrichedError.originalError = error;
                enrichedError.jobId = job.id;
                enrichedError.queueName = queueName;
                throw enrichedError;
              }
            }
            // getQueueConcurrency(queueName)
          );

          console.log(`Initialized queue and worker for: ${queueName}`);
          return { queueName, status: "initialized" };
        } catch (error) {
          console.error(`Failed to initialize queue ${queueName}:`, error);
          return { queueName, status: "failed", error };
        }
      }
    );

    const results = await Promise.allSettled(initPromises);
    const failedQueues = results
      .filter((r) => r.value?.status === "failed")
      .map((r) => r.value.queueName);

    if (failedQueues.length > 0) {
      throw new Error(
        `Failed to initialize queues: ${failedQueues.join(", ")}`
      );
    }

    // initialized = true;
    console.log("All queues and workers initialized successfully");
  } catch (error) {
    console.error("Error initializing queues and workers:", error);
    throw error;
  }
};

const shutdownQueueManager = async () => {
  try {
    console.log("Initiating graceful shutdown...");

    const closePromises = [
      ...Array.from(store.queues.values()).map((queue) => queue.close()),
      ...Array.from(store.workers.values()).map((worker) => worker.close()),
      ...Array.from(store.queueEvents.values()).map((events) => {
        events.removeAllListeners();
        return events.close();
      }),
    ];

    await Promise.all(closePromises);
    console.log("All queues and workers closed successfully");
  } catch (error) {
    console.error("Error during shutdown:", error);
    throw error;
  }
};

const startDashboard = () => {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath("/ui");
  createBullBoard({
    queues: Array.from(store.queues.values()).map(
      (queue) => new BullMQAdapter(queue)
    ),
    serverAdapter,
  });
  return serverAdapter;
};

export {
  initializeQueuesAndWorkers,
  shutdownQueueManager,
  createWorker,
  createQueue,
  startDashboard,
};
