import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { authRouter } from './src/routes/AuthRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to DB"))
  .catch(error => console.error(error));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});