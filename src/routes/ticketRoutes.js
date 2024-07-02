import { Router } from "express";

import { TicketController } from "../controllers/ticketController.js";
import { cache } from "../middlewares/cacheMiddleware.js";
import { validateUser } from "../middlewares/authMiddleware.js";
import { generateTicketsKey } from "../utils/keysUtils.js";


export const ticketsRouter = Router();

ticketsRouter.get("/", validateUser(['Admin', true, false]), cache(generateTicketsKey), TicketController.getAll);
ticketsRouter.get("/:id", validateUser(['Admin', true, false]), TicketController.getById);
ticketsRouter.delete("/:id", validateUser(['Admin', true, false]), TicketController.delete);
ticketsRouter.patch("/:id", validateUser(['Admin', true, false]), TicketController.update);
ticketsRouter.post("/", validateUser([true, false]), TicketController.create);
