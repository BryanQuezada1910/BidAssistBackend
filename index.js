import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import cors from 'cors';

const app = express();

// Load env vars
dotenv.config();

// Enable CORS Middleware
app.use(cors());
// Body parser
app.use(express.json());

// Connect to database
connectDB();

// Route get request, to test the server
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});