import express from "express";
import { getAuctionReport } from "../controllers/reportController.js";

const reportRouter = express.Router();

reportRouter.get("/auctions", getAuctionReport);

export { reportRouter };
