// import mongoose from "mongoose";

// const priceAlertSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true,
//   },
//   targetPrice: {
//     type: Number,
//     required: true,
//   },
//   isActive: { // Set to false after the notification is sent
//     type: Boolean,
//     default: true,
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('PriceAlert', priceAlertSchema);