import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  priority: {
    type: String,
    default: "low",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "createdByModel",
  },
  createdByModel: {
    type: String,
    required: true,
    enum: ["Organization", "User"],
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