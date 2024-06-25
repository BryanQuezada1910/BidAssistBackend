import mongoose from "mongoose";
import Product from "./Product.js";

const enumCategory = [
  "Electronicos",
  "Fashion",
  "Hogar",
  "Juguetes",
  "Inmuebles",
  "Others",
];

const AuctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  product: {
    type: Product.schema,
    required: true,
  },
  initialPrice: {
    type: Number,
    required: true,
  },
  minimunBid: {
    type: Number,
    required: true,
  },
  finalPrice: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    enum: enumCategory,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  status: {
    type: String,
    default: "active",
  },
  chat: {
    messages: [{
      message: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
});

export default mongoose.model("Auction", AuctionSchema);
