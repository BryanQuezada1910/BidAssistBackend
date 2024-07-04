// Importación de módulos
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from "socket.io";
import compression from "compression";
import helmet from "helmet";
import socketHandler from "./src/websocket/socketHandler.js";
import connectDB from "./src/config/database.js";
import { authRouter } from './src/routes/authRoutes.js';
import { auctionRouter } from './src/routes/auctionRoutes.js';
import { usersRouter } from "./src/routes/userRoutes.js";
import { ticketsRouter } from "./src/routes/ticketRoutes.js";
import { webHookRouter } from "./src/routes/webHookRoutes.js";
import { reportRouter } from "./src/routes/reportRoutes.js";

// Configuración de variables de entorno
dotenv.config();

// Creación de la aplicación Express
const app = express();
const server = http.createServer(app);

// Configuración de Socket.IO
const io = new Server(server);

// Conexión a la base de datos
connectDB();

// Middleware
app.use(compression()); // Compresión para mejorar el rendimiento
app.use(helmet()); // Mejoras de seguridad
// app.use(cors());
app.use(express.json()); // Parseo del body de las peticiones como JSON
app.use(cookieParser()); // Middleware para el manejo de cookies

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/user', usersRouter);
app.use('/api/ticket', ticketsRouter);
app.use('/api/webhook', webHookRouter);
app.use('/api/auction', auctionRouter);
app.use('/api/report', reportRouter);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Inicialización del manejo de WebSocket
socketHandler(io);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});