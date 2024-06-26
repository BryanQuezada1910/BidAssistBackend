import express from 'express';
import auctionController from '../controllers/auctionController';

const router = express.Router();

// Routes for auctions
// GET /api/auctions
router.get('/', auctionController.getAllAuctions);
// GET /api/auctions/:id
router.get('/:id', auctionController.getAuctionById);
// POST /api/auctions
router.post('/', auctionController.createAuction);
// PUT /api/auctions/:id
router.patch('/:id', auctionController.updateAuction);
// DELETE /api/auctions/:id
router.delete('/:id', auctionController.deleteAuction);

export default router;
