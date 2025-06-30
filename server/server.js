import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDatabase from "./config/database.js";

import searchRoutes from "./routes/search.js";
import productRoutes from "./routes/products.js";
import alertRoutes from "./routes/alerts.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));

await connectToDatabase();

app.use("/api/search", searchRoutes);
app.use("/api/products", productRoutes);
app.use("/api/alerts", alertRoutes);

app.get("/", (req, res) => {
  res.send("Price Aggregator API is running");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
