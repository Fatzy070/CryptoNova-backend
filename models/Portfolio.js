// models/Portfolio.js
import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coin: { type: String, required: true },
  quantity: { type: Number, required: true },
  buyPrice: { type: Number, required: true }, // when added
  totalValue: { type: Number, required: true }, // quantity * buyPrice
}, { timestamps: true });

export default mongoose.model("Portfolio", portfolioSchema);
