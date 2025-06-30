import dotenv from "dotenv";

const envFile = `.env.${process.env.NODE_ENV || "development"}.local`;
dotenv.config({ path: envFile });

export const DB_URI = process.env.MONGODB_URI;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 5000;
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
