import IORedis from "ioredis";

import { env } from "../config/env.js";

const RedisClient = IORedis as unknown as new (
  url: string,
  options: { maxRetriesPerRequest: null }
) => any;

export const redisConnection = new RedisClient(env.REDIS_URL, {
  maxRetriesPerRequest: null
});
