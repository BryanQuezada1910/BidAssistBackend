import { createClient } from "redis";


export let redisClient = null;

export const createRedisClient = async () => {
  const redisURL = process.env.REDIS_URI;
  try {
    redisClient = createClient({
      username: process.env.REDIS_USER,
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        key: process.env.REDIS_KEY,
        connectTimeout: 40000
      }
    });
    // connect to the Redis server
    await redisClient.connect();
    console.log(`Connected to Redis successfully!`);
  } catch (e) {
    console.error(`Connection to Redis failed with error:`);
    console.error(e);
  }
}