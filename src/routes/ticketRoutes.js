import { Router } from "express";

import { TicketController } from "../controllers/ticketController.js";
import { cache } from "../middlewares/cacheMiddleware.js";
import { validateUser } from "../middlewares/Auth.js";
import { generateTicketsKey } from "../utils/keysUtils.js";


export const ticketsRouter = Router();
ticketsRouter.get("/", validateUser, cache(generateTicketsKey), TicketController.getAll);
ticketsRouter.get("/:id", validateUser, TicketController.getById);
ticketsRouter.delete("/:id", validateUser, TicketController.delete);
ticketsRouter.patch("/:id", validateUser, TicketController.update);
ticketsRouter.post("/", validateUser, TicketController.create);
