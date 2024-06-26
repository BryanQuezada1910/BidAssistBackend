import express from "express"; // Import express module
import dotenv from "dotenv"; // Import dotenv module
import cors from "cors"; // Import cors module
import connectDB from "./src/config/database.js"; // Import connectDB function
import cookieParser from 'cookie-parser'; // Import cookie-parser module
import { authRouter } from './src/routes/AuthRoutes.js'; // Import auth routes
import auctionRoutes from './src/routes/auctionRoutes.js'; // Import auction routes
import http from 'http'; // Import http module for creating server instance
import socketHandler from "./src/websocket/socketHandler.js"; // Import socketHandler function
import { Server } from "socket.io"; // Import Server class from socket.io

// Load env vars
dotenv.config();

// Create express app
const app = express();
const server = http.createServer(app); // Create server instance
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
}); // Create socket.io instance

// Connect to database
connectDB();

// Enable CORS Middleware
app.use(cors());
// Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());

// Auth routes
app.use('/api/auth', authRouter);
// Auction routes
app.use('/api/auction', auctionRoutes);

// Route get request, to test the server
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Initialize WebSocket handler
socketHandler(io);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});