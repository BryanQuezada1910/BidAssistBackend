import mongoose from "mongoose";

const enumCategory = [
  "Electronicos",
  "Fashion",
  "Hogar",
  "Juguetes",
  "Inmuebles",
  "Others",
];

const messageSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

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
    name: {
      type: String,
      required: true,
    },
    images: [{
      type: String,
      required: true,
    }],
  },
  initialPrice: {
    type: Number,
    required: true,
  },
  minimunBid: {
    type: Number,
    required: true,
  },
  currentBider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  currentBid: {
    type: Number,
    required: true,
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
  ownerUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bidders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  status: {
    type: String,
    default: "active", // active, in progress, finished
  },
  chat: {
    messages: [messageSchema],
  },
});

export default mongoose.model("Auction", AuctionSchema);
