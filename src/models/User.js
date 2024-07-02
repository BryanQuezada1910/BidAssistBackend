import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Auction from "./Auction.js";
import Ticket from "./Ticket.js";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  refreshToken: {
    type: String,
  },
  isSuscribed: {
    type: Boolean
  },
});

UserSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

UserSchema.pre('findOneAndDelete', async function (next) {
  try {
    await Auction.deleteMany({ ownerUser: this.getQuery()._id });
    await Ticket.deleteMany({ createdBy: this.getQuery()._id });
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("User", UserSchema);
