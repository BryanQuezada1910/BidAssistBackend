import express from 'express';

import { getAllAuctions, getAuctionById, getAuctionsByStatusAndCategory, createAuction, updateAuction, deleteAuction } from '../controllers/auctionController.js';
import { cache } from "../middlewares/cacheMiddleware.js";
import { validateUser } from "../middlewares/Auth.js";
import { generateAuctionsKey } from '../utils/keysUtils.js';

const router = express.Router();

// Routes for auctions
// GET /api/auctions
router.get('/', validateUser, cache(generateAuctionsKey), getAllAuctions);
// GET /api/auctions/:status/:category
router.get('/filters/', validateUser, getAuctionsByStatusAndCategory);
// GET /api/auctions/:id
router.get('/:id', validateUser, getAuctionById);
// POST /api/auctions
router.post('/', validateUser, createAuction);
// PUT /api/auctions/:id
router.put('/:id', validateUser, updateAuction);
// DELETE /api/auctions/:id
router.delete('/:id', validateUser, deleteAuction);

export default router;