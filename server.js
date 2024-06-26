import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/database.js";
import cookieParser from 'cookie-parser';
import { authRouter } from './src/routes/AuthRoutes.js';
import auctionRoutes from './src/routes/auctionRoutes.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

// Enable CORS Middleware
app.use(cors());
// Body parser
app.use(express.json());
// Load env vars
dotenv.config();

// Auth routes
app.use('/api/auth', authRouter);
// Auction routes
app.use('/api/auctions', auctionRoutes);

// Connect to database
connectDB();

// Route get request, to test the server
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
