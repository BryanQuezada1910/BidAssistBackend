import { createClient } from "redis";

export let redisClient = null;

export const createRedisClient = async () => {
  const redisURL = process.env.REDIS_URI;
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });

    // connect to the Redis server
    await redisClient.connect();
    console.log(`Connected to Redis successfully!`);
  } catch (e) {
    console.error(`Connection to Redis failed with error:`);
    console.error(e);
  }
};
