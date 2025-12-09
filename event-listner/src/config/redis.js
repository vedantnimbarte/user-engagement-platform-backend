import Redis from "ioredis";
import { config } from "dotenv";
config();

// Redis Configuration
const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB || 0,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  reconnectOnError: (err) => {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
};

class RedisService {
  constructor() {
    if (!RedisService.instance) {
      this._redis = new Redis(redisConfig);
      this._subscriber = new Redis(redisConfig);

      // Handle connection events
      this._redis.on("connect", () => console.log("Redis client connected"));
      this._redis.on("error", (err) =>
        console.error("Redis client error:", err)
      );
      this._redis.on("ready", () => console.log("Redis client ready"));
      this._redis.on("end", () => console.log("Redis client connection ended"));

      // Set instance
      RedisService.instance = this;
    }

    return RedisService.instance;
  }

  // Get Redis client instance
  getClient() {
    return this._redis;
  }

  // Get subscriber instance (for pub/sub)
  getSubscriber() {
    return this._subscriber;
  }

  // Helper methods for common operations
  async set(key, value, expiry = null) {
    try {
      if (expiry) {
        return await this._redis.set(key, JSON.stringify(value), "EX", expiry);
      }
      return await this._redis.set(key, JSON.stringify(value));
    } catch (error) {
      console.error("Redis SET Error:", error);
      throw error;
    }
  }

  async get(key) {
    try {
      const value = await this._redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Redis GET Error:", error);
      throw error;
    }
  }

  async del(key) {
    try {
      return await this._redis.del(key);
    } catch (error) {
      console.error("Redis DEL Error:", error);
      throw error;
    }
  }

  async exists(key) {
    try {
      return await this._redis.exists(key);
    } catch (error) {
      console.error("Redis EXISTS Error:", error);
      throw error;
    }
  }

  async setHash(key, field, value) {
    try {
      return await this._redis.hset(key, field, JSON.stringify(value));
    } catch (error) {
      console.error("Redis HSET Error:", error);
      throw error;
    }
  }

  async getHash(key, field) {
    try {
      const value = await this._redis.hget(key, field);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Redis HGET Error:", error);
      throw error;
    }
  }

  async cache(key, callback, expiry = 3600) {
    try {
      const cached = await this.get(key);
      if (cached) return cached;

      const fresh = await callback();
      await this.set(key, fresh, expiry);
      return fresh;
    } catch (error) {
      console.error("Redis Cache Error:", error);
      throw error;
    }
  }

  async clearPattern(pattern) {
    try {
      const keys = await this._redis.keys(pattern);
      if (keys.length > 0) {
        return await this._redis.del(...keys);
      }
      return 0;
    } catch (error) {
      console.error("Redis Clear Pattern Error:", error);
      throw error;
    }
  }

  // Graceful shutdown
  async shutdown() {
    await this._redis.quit();
    await this._subscriber.quit();
  }

  // Add these new methods
  async publish(channel, message) {
    try {
      return await this._redis.publish(
        channel,
        typeof message === "string" ? message : JSON.stringify(message)
      );
    } catch (error) {
      console.error("Redis PUBLISH Error:", error);
      throw error;
    }
  }

  async subscribe(channel, callback) {
    try {
      return await this._subscriber.subscribe(channel, callback);
    } catch (error) {
      console.error("Redis SUBSCRIBE Error:", error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const redisService = new RedisService();

// Make it global
global.$redis = redisService;

export default redisService;
