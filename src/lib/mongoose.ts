import mongoose from "mongoose";
import { Env } from "../config/env.config";

export async function connectToMongo() {
  const uri = Env.DATABASE_URL || "mongodb://localhost:27017/db";
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Mongo connection error:", err);
    throw err;
  }
}
