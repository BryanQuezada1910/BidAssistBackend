import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/database.js";
import cookieParser from 'cookie-parser';
import { authRouter } from './src/routes/AuthRoutes.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

// Enable CORS Middleware
app.use(cors());
// Body parser
app.use(express.json());

app.use('/api/auth', authRouter);

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
