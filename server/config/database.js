import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV;

if (!DB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.<development|production>.local",
  );
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`Connected to MongoDB [${NODE_ENV}]`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDatabase;
