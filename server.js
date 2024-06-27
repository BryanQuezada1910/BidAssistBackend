import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/database.js";
import cookieParser from 'cookie-parser';
import { authRouter } from './src/routes/AuthRoutes.js';
import { ticketsRouter } from "./src/routes/ticketRoutes.js";
import { webHookRouter } from "./src/routes/webhookRoutes.js";
import { MailWrapper } from "./src/services/emailService.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Enable CORS Middleware
app.use(cors());
// Body parser
app.use(express.json());

app.use('/api/auth', authRouter);
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

MailWrapper.sendAuctionWinnerReceiptEmail(["ps19001@ues.edu.sv"], {
  "_id": "667bbf8b373cc83de833d34f",
  "title": "Subasta de una Casa",
  "description": "Casa de 3 habitaciones en un barrio tranquilo.",
  "product": {
    "name": "Casa en el barrio ABC",
    "images": ["https://imgix.cosentino.com/es/wp-content/uploads/2023/07/Lumire-70-Facade-MtWaverley-vic-1.jpg?auto=format%2Ccompress&ixlib=php-3.3.0", "https://creacionessv.com/wp-content/uploads/2022/02/CONSTRUCCION-DE-CASAS-EN-EL-SALVADOR-CONSTRUCTORA-CREACIONES-1-1024x576.jpg"]
  },
  "initialPrice": "150000",
  "minimunBid": "1000",
  "currentBid": "150000",
  "category": "Inmuebles",
  "startDate": "2024-07-05T08:00:00.000+00:00",
  "endDate": "2024-07-10T08:00:00.000+00:00"
})
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
