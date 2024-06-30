import express from "express"; // Import express module
import dotenv from "dotenv"; // Import dotenv module
import cors from "cors"; // Import cors module
import connectDB from "./src/config/database.js"; // Import connectDB function
import cookieParser from 'cookie-parser'; // Import cookie-parser module
import { authRouter } from './src/routes/AuthRoutes.js'; // Import auth routes
import auctionRoutes from './src/routes/auctionRoutes.js'; // Import auction routes
import http from 'http'; // Import http module for creating server instance
import socketHandler from "./src/websocket/socketHandler.js"; // Import socketHandler function
import { usersRouter } from "./src/routes/UsersRoutes.js";
import { Server } from "socket.io"; // Import Server class from socket.io
import { ticketsRouter } from "./src/routes/ticketRoutes.js"; // Import ticket routes
import { webHookRouter } from "./src/routes/webhookRoutes.js"; // Create express appimport { ticketsRouter } from "./src/routes/ticketRoutes.js";
import { reportRouter } from "./src/routes/reportRoutes.js";

// Load env vars
dotenv.config();

const app = express();
const server = http.createServer(app); // Create server instance
const io = new Server(server, {
  cors: {
    origin: "*",// Allow the client to connect, must be changed in production
    methods: ["GET", "POST"], // Allow GET and POST requests
  }
}); // Create socket.io instance

// Connect to database
connectDB();

const corsOptions = {
  origin: 'http://localhost:4200', // Origen de tu aplicación Angular
  credentials: true // Permitir el uso de credenciales
};

// Enable CORS Middleware
app.use(cors(corsOptions));
// Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());

// Auth routes
app.use('/api/auth', authRouter);
app.use('/api/user', usersRouter);
// Ticket routes
app.use("/api/ticket", ticketsRouter);
app.use("api/ticket/webhook", webHookRouter)
// Auction routes
app.use('/api/auction', auctionRoutes);
app.use("/api/report", reportRouter);

// Route get request, to test the server
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Initialize WebSocket handler
socketHandler(io);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});