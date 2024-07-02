import { redisClient } from "../config/redis.js";
import zlib from "node:zlib"
import { sha1 } from "object-hash";

export const requestToKeyPrueba = (req) => {
  // build a custom object to use as part of the Redis key

  const reqDataToHash = {
    id: user.role || user.id,
    query: req.query
  };

  // console.log(`key: ${req.originalUrl}@${sha1(reqDataToHash)}`)
  return `${req.originalUrl}@${sha1(reqDataToHash)}`;
}

export const requestToKey = (req, keysGenerator) => {
  // build a custom object to use as part of the Redis key

  const user = req.session;
  console.log("\nCreando key para: ", user.id)
  // console.log(`key: ${req.originalUrl}@${sha1(reqDataToHash)}`)

  // if (user.role === undefined) return keysGenerator.by(user.id);

  // return keysGenerator.all;

  // return `${user.role || user.id}:${sha1({
  //   id: user.role || user.id
  // })}`;
  console.log(keysGenerator.generate(user));
  return keysGenerator.generate(user);
}


export const clearCachePrueba = async (path) => {
  try {
    const keys = await redisClient.keys(`*${path}*`)

    for (let key of keys) {
      try {
        await redisClient.del(key);
        console.log(`\nCache key "${key}" invalidated`);
      } catch (e) {
        console.error(`Failed to invalidated data for key=${key}`, e);
      }
    }
  } catch (error) {
    console.error(`Failed to invalidated data`);
  }
}

const getkeys = () => {
  console.log("");
  redisClient.keys('*', (err, keys) => {
    if (err) {
      console.error('Error retrieving keys:', err);
      return;
    }

    if (keys.length === 0) {
      console.log('No keys found');
      redisClient.quit();
      return;
    }

    keys.forEach((key, index) => {
      redisClient.get(key, (err, value) => {
        if (err) {
          console.error(`Error retrieving value for key ${key}:`, err);
          return;
        }

        console.log(`Clave: ${key}, Valor: ${value}`);

        if (index === keys.length - 1) {
          redisClient.quit();
        }
      });
    });
  });
}

const isRedisWorking = () => {
  // verify wheter there is an active connection
  // to a Redis server or not
  return redisClient.isReady;
}

export const writeCache = async (key, data, options) => {
  if (isRedisWorking()) {
    try {
      await redisClient.set(key, zlib.deflateRawSync(JSON.stringify(data)).toString("base64"), options);
      console.log(`\nSucces to cache data for key=${key}`);
    } catch (e) {
      console.error(`Failed to cache data for key=${key}`, e);
    }
  }
}

export const readCache = async (key) => {
  let cachedValue = undefined;
  console.log("está redis? : ", isRedisWorking())
  if (isRedisWorking()) {
    // try to get the cached response from redis
    console.log("buscando data para la llave: ", key)
    cachedValue = await redisClient.get(key);
    if (cachedValue) {

      console.log("data encontrad")
      // console.log(JSON.parse(zlib.inflateRawSync(Buffer.from(cachedValue, "base64"))))
      return JSON.parse(zlib.inflateRawSync(Buffer.from(cachedValue, "base64")));
    }
  }
}

export const clearCache = async (key) => {
  if (isRedisWorking()) {
    try {
      await redisClient.del(key);
      console.log(`\nCache key "${key}" invalidated`);
    } catch (e) {
      console.error(`Failed to invalidated data for key=${key}`, e);
    }
  }
};