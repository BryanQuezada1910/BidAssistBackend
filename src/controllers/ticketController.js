import { isValidObjectId } from "mongoose";

import { writeCache, clearCache } from "../services/redisService.js";
import ticketModel from "../models/Ticket.js";
import userModel from "../models/User.js";
import { generateTicketsKey } from "../utils/keysUtils.js";


/**
 * Controller class for managing tickets.
 */
export class TicketController {

  /**
   * Retrieves all tickets optionally filtered by userId.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Object} - JSON response with tickets data or error message.
   */
  static async getAll(req, res) {
    try {
      const user = req.session;

      // Validate userId format
      if (user && !isValidObjectId(user.id)) {
        return res.status(400).send({ message: "Invalid user" });
      }

      // Fetch tickets based on userId filter if provided, otherwise fetch all tickets
      const tickets = await ticketModel.find(user.role === "Admin" ? {} : { createdBy: user.id }).lean();

      // Handle case where no tickets are found
      if (!tickets.length) return res.status(404).send({ message: "No tickets found" });



      await writeCache(generateTicketsKey(req), tickets, {
        EX: 21600, // 6 horas
      });

      // Return tickets data
      return res.status(200).json(tickets);
    } catch (error) {
      // Handle server errors
      res.status(500).send({ message: "Internal Server Error" });
      console.error(error);
    }
  }

  /**
   * Retrieves a ticket by its ID.
   * @param {Object} req - Express request object containing ticket ID as a parameter.
   * @param {Object} res - Express response object.
   * @returns {Object} - JSON response with ticket data or error message.
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      // Find ticket by ID
      const ticket = await ticketModel.findById(id).lean();

      // Handle case where ticket is not found
      if (!ticket) return res.status(404).json({ message: "Ticket not found" });

      // Return ticket data
      return res.status(200).json(ticket);
    } catch (error) {
      // Handle server errors
      return res.status(500).send({ message: "Internal Server Error" });
      console.error(error);
    }
  }

  /**
   * Creates a new ticket for a specified user.
   * @param {*} req - Express request object containing user ID in query and ticket data in body.
   * @param {*} res - Express response object.
   * @returns {Object} - JSON response with created ticket data or error message.
   */
  static async create(req, res) {

    const userId = req.session.id;

    try {
      // Validate user ID format
      if (!isValidObjectId(userId)) return res.status(400).send({ message: "Invalid user ID" });

      // Find user by ID
      const user = await userModel.findById(userId).lean();
      // Handle case where user is not found
      if (!user) return res.status(404).json({ error: "User not found" });

      // Create new ticket instance
      const newTicket = ticketModel({
        ...req.body,
        priority: (user.isSuscribed) ? "medium" : undefined,
        createdBy: userId
      });

      // Save new ticket to database
      await newTicket.save();


      await clearCache("Admin:tickets");
      await clearCache(generateTicketsKey(req));
      // Return created ticket data
      return res.status(201).json(newTicket);
    } catch (error) {
      // Handle validation errors
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation Error",
          errors: Object.values(error.errors).map(error => error.message),
        });
      }

      // Handle server errors
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

  /**
   * Deletes a ticket by its ID.
   * @param {*} req - Express request object containing ticket ID as a parameter.
   * @param {*} res - Express response object.
   * @returns {Object} - JSON response with success message or error message.
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;

      // Validate ticket ID format
      if (!isValidObjectId(id)) return res.status(400).send({ message: "Invalid ticket ID" });

      // Find and delete ticket by ID
      const ticket = await ticketModel.findByIdAndDelete(id);

      // Handle case where ticket is not found
      if (!ticket) return res.status(404).json({ error: "Ticket not found" });

      await clearCache("Admin:tickets");
      await clearCache(generateTicketsKey(req));

      // Return success message

      return res.status(200).json({ message: "Deleted Ticket" });
    } catch (error) {
      // Handle server errors
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

  /**
   * Updates a ticket by its ID.
   * @param {*} req - Express request object containing ticket ID as a parameter and updated ticket data in body.
   * @param {*} res - Express response object.
   * @returns {Object} - JSON response with updated ticket data or error message.
   */
  static async update(req, res) {
    const { id } = req.params;

    // Validate ticket ID format
    if (!isValidObjectId(id)) return res.status(400).send({ message: "Invalid ticket ID" });

    try {
      // Update ticket by ID with new data
      const ticket = await ticketModel.findByIdAndUpdate(id, req.body).lean();

      // Handle case where ticket is not found
      if (!ticket) return res.status(404).json({ error: "Ticket not found" });


      await clearCache(generateTicketsKey(req));
      await clearCache("Admin:tickets");

      // Return updated ticket data
      return res.status(200).json(ticket);
    } catch (error) {
      // Handle server errors
      console.error(error)
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

}
