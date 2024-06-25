import ticketModel from "../models/Ticket.js";
import { isValidObjectId } from "mongoose";
import userModel from "../models/User.js";
export class TicketController {

  static async getAll(req, res) {
    try {
      const { user: userId } = req.query;

      if (!isValidObjectId(userId)) return res.status(400).send({ message: "Invalid user ID" });

      const tickets = await ticketModel.find({ userId });
      if (!tickets.length) return res.status(404).send({ message: "No tickets found for the given user" });

      return res.status(200).json(tickets);
    } catch (error) {
      res.status(500).send({ error: "Internal Server Error" });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(user)) return res.status(400).send({ message: "Invalid ID" });

      const ticket = await ticketModel.findById(id);

      if (!ticket) return res.status(404).json({ error: "Ticket not found" });

      return res.status(200).json(ticket);
    } catch (error) {
      return res.status(500).send({ error: "Internal Server Error" })
    }
  }

  static async create(req, res) {
    try {
      const { user: userId } = req.query;

      if (!isValidObjectId(userId)) return res.status(400).send({ message: "Invalid user ID" });

      const user = userModel.findById(userId);

      if (!user) return res.status(404).json({ error: "User not found" });

      const newTicket = ticketModel({
        ...req.body,
        priority: (user.IsSuscribed) ? "medium" : undefined,
        createdBy: userId,
      });

      await newTicket.save();

      return res.status(201).json(newTicket);
    } catch (error) {
      if (err.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation Error",
          errors: Object.values(err.errors).map(error => error.message),
        });
      }

      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

  static async delete(req, res) {

    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) return res.status(400).send({ message: "Invalid ticket ID" });

      const ticket = await ticketModel.findByIdAndDelete(id)

      if (!ticket) return res.status(404).json({ error: "Ticket not found" });

      return res.status(200).json({ message: "Deleted Ticket" });
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

  static async update(req, res) {

    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }

    const { id } = req.params;

    try {

      if (!isValidObjectId(id)) return res.status(400).send({ message: "Invalid ticket ID" });

      const ticketToUpdate = await ticketModel.findById(id);

      if (!ticketToUpdate) return res.status(404).json({ error: "Ticket not found" });

      const { title, description } = req.body;

      ticketToUpdate.title = title;
      ticketToUpdate.description = description;

      await ticketToUpdate.save();

      return res.status(200).json(ticketToUpdate);
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

} 