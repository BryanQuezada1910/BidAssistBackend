import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
  },
});

export default mongoose.model("Product", ProductSchema);
