import { redisClient } from "../config/redis.js";
import zlib from "node:zlib"

const isRedisWorking = () => {
  // verify wheter there is an active connection
  // to a Redis server or not
  return redisClient.isReady;
}

export const writeCache = async (key, data, options) => {
  if (isRedisWorking()) {
    try {
      await redisClient.set(key, zlib.deflateRawSync(JSON.stringify(data)).toString("base64"), options);
    } catch (e) {
      console.error(`Failed to cache data for key=${key}`, e);
    }
  }
}

export const readCache = async (key) => {
  let cachedValue = undefined;
  if (isRedisWorking()) {
    // try to get the cached response from redis
    cachedValue = await redisClient.get(key);
    if (cachedValue) {
      // console.log(JSON.parse(zlib.inflateRawSync(Buffer.from(cachedValue, "base64"))))
      return JSON.parse(zlib.inflateRawSync(Buffer.from(cachedValue, "base64")));
    }
  }
}

export const clearCache = async (key) => {
  if (isRedisWorking()) {
    try {
      await redisClient.del(key);
    } catch (e) {
      console.error(`Failed to invalidated data for key=${key}`, e);
    }
  }
};