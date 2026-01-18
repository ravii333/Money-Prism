import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema({
  price: Number,
  date: { type: Date, default: Date.now },
});

const sellerSubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  productURL: { type: String, required: true, unique: true },
  price: { type: Number },
  lastUpdated: { type: Date, default: Date.now },
  priceHistory: [priceHistorySchema],
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    normalizedName: { type: String, required: true, index: true },
    imageURL: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    sellers: [sellerSubSchema],
    currentLowestPrice: { type: Number, default: null },
    historicalLowestPrice: { type: Number, default: null },
    historicalHighestPrice: { type: Number, default: null },
  },
  { timestamps: true },
);

productSchema.methods.updateAggregatePrices = function () {
  if (!this.sellers || this.sellers.length === 0) {
    this.currentLowestPrice = null;
    return;
  }
  const sortedSellers = [...this.sellers].sort((a, b) => a.price - b.price);
  this.currentLowestPrice = sortedSellers[0].price;

  let historicalLow = Infinity,
    historicalHigh = -Infinity;
  this.sellers.forEach((seller) => {
    seller.priceHistory.forEach((historyEntry) => {
      if (historyEntry.price < historicalLow)
        historicalLow = historyEntry.price;
      if (historyEntry.price > historicalHigh)
        historicalHigh = historyEntry.price;
    });
  });

  this.historicalLowestPrice =
    historicalLow === Infinity ? null : historicalLow;
  this.historicalHighestPrice =
    historicalHigh === -Infinity ? null : historicalHigh;
};

export default mongoose.model("Product", productSchema);
