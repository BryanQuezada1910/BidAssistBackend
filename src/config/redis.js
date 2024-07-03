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
        connectTimeout: 40000,
        tls: true,
        rejectUnauthorized: false,
        reconnectStrategy: function (retries) {
          if (retries > 40) {
            console.log("Too many attempts to reconnect. Redis connection was terminated");
            return new Error("Too many retries.");
          } else {
            return retries * 500;
          }
        }
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis client error', err);
    });

    redisClient.on('reconnecting', () => {
      console.log('Reconnecting to Redis...');
    });

    redisClient.on('end', () => {
      console.log('Disconnected from Redis');
    });

    // connect to the Redis server
    await redisClient.connect();
    console.log(`Connected to Redis successfully!`);
  } catch (e) {
    console.error(`Connection to Redis failed with error:`);
    console.error(e);
  }
};
