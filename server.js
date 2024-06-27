import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/database.js";
import cookieParser from 'cookie-parser';
import { authRouter } from './src/routes/AuthRoutes.js';
import { ticketsRouter } from "./src/routes/ticketRoutes.js";
import { webHookRouter } from "./src/routes/webhookRoutes.js";
import { usersRouter } from "./src/routes/UsersRoutes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Enable CORS Middleware
app.use(cors());
// Body parser
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/user', usersRouter);
app.use("/api/ticket", ticketsRouter);
app.use("api/ticket/webhook", webHookRouter)

// Load env vars
dotenv.config();

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
