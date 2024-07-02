import { readCache } from "../services/redisService.js";

/**
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const cache = (generator) => {
  return async (req, res, next) => {
    // Admin:tickets -> todos los tickets de todos los usuarios
    // ID:tickets -> todos  los tickets para ese Usuario
    // Admin:auctions -> todos los auctions de todos los usuarios

    const cachedValue = await readCache(generator(req));
    if (cachedValue) {
      return res.status(200).json(cachedValue);
    }
    next();
  };
}