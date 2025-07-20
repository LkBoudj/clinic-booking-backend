import mongoose from "mongoose";

import logger from "../lib/logger";

import { Env } from "./env.config";

const MONGO_URI = Env.DATABASE_URL;

export const connectToDatabase = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(MONGO_URI);
    logger.info("✅ Connected to MongoDB");
  } catch (error) {
    logger.error("❌ Failed to connect to MongoDB", error);
    process.exit(1); // Exit on failure
  }
};

export const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log("🔵 Disconnected from MongoDB");
  } catch (err) {
    console.error("🔴 Failed to disconnect from MongoDB", err);
  }
};
