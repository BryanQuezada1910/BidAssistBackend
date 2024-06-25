import { Router } from "express";
import { TicketController } from "../controllers/ticket.js";

export const ticketsRouter = Router();

ticketsRouter.get("/", TicketController.getAll);
ticketsRouter.get("/:id", TicketController.getById);
ticketsRouter.delete("/:id", TicketController.delete);
ticketsRouter.patch("/:id", TicketController.update);
ticketsRouter.post("/", TicketController.create);
