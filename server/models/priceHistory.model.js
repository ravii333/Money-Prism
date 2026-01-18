import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  sellerName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

priceHistorySchema.index({ product: 1, timestamp: -1 });

export default mongoose.model("PriceHistory", priceHistorySchema);
