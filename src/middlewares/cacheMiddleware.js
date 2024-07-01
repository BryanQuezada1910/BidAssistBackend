import { requestToKey, readCache } from "../services/redisService.js";

/**
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const cache = (generator) => {
  return async (req, res, next) => {
    const cachedValue = await readCache(generator(req));
    if (cachedValue) {
      try {
        // if it is JSON data, then return it
        console.log("\ndevolviendo datos desde la cache");
        return res.status(200).json(JSON.parse(cachedValue));
      } catch {
        // if it is not JSON data, then return it
        return res.status(200).send(cachedValue);
      }
    }
    next();
  };
}