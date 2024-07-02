import { requestToKey, readCache } from "../services/redisService.js";

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
    // not-registed:auctions -> todos  los auctions que están en progreso

    console.log("entrando a cache")
    const cachedValue = await readCache(generator(req));
    if (cachedValue) {
      try {
        // if it is JSON data, then return it
        console.log("\ndevolviendo datos desde la cache");
        return res.status(200).json(JSON.parse(cachedValue));
      } catch (error) {
        console.log(error)
        // if it is not JSON data, then return it
        return res.status(200).send(cachedValue);
      }
    }
    console.log("saliendo de cache");
    next();
  };
}