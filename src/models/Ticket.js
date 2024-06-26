import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "El título es obligatorio"],
  },
  description: {
    type: String,
    required: [true, "La descripción es obligatoria"],
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "El campo createdBy es obligatorio"],
    ref: "User",
  },
  support: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: {
    type: Date,
  },
});

export default mongoose.model("Ticket", TicketSchema);