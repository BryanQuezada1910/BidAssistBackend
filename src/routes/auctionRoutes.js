import express from 'express';
import { getAllAuctions, getAuctionById, createAuction, updateAuction, deleteAuction } from '../controllers/auctionController.js';

const router = express.Router();

// Routes for auctions
// GET /api/auctions
router.get('/', getAllAuctions);
// GET /api/auctions/:id
router.get('/:id', getAuctionById);
// POST /api/auctions
router.post('/', createAuction);
// PUT /api/auctions/:id
router.patch('/:id', updateAuction);
// DELETE /api/auctions/:id
router.delete('/:id', deleteAuction);

export default router;
