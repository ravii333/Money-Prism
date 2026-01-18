import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDatabase from "./config/database.js";
import { startAlertScheduler } from "./services/cronService.js";
import productRoutes from "./routes/products.js";
import alertRoutes from "./routes/alerts.js";
import userRoutes from "./routes/user.js"; 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

await connectToDatabase();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json()); 

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/users", userRoutes);

startAlertScheduler();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
