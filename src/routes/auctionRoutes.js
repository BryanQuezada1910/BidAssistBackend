import express from 'express';

import { getAllAuctions, getAuctionById, createAuction, updateAuction, deleteAuction } from '../controllers/auctionController.js';
import { cache } from "../middlewares/cacheMiddleware.js";
import { validateUser } from "../middlewares/authMiddleware.js";
import { generateAuctionsKey } from '../utils/keysUtils.js';

export const auctionRouter = express.Router();

// Routes for auctions
// GET /api/auctions
auctionRouter.get('/', validateUser(['Admin', true, false]), cache(generateAuctionsKey), getAllAuctions);
// GET /api/auctions/:id
auctionRouter.get('/:id', validateUser(['Admin', true, false]), getAuctionById);
// POST /api/auctions
auctionRouter.post('/', validateUser([true]), createAuction);
// PUT /api/auctions/:id
auctionRouter.put('/:id', validateUser(['Admin', true]), updateAuction);
// DELETE /api/auctions/:id
auctionRouter.delete('/:id', validateUser(['Admin', true]), deleteAuction);
