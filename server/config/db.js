import dotenv from "dotenv";
import mongoose from "mongoose";
import { catalog } from "../../shared/products.js";
import { Product } from "../models/Product.js";

dotenv.config();

const globalCache = globalThis;
if (!globalCache.__veloura) {
  globalCache.__veloura = { conn: null, promise: null, seeded: false };
}

export function dbReady() {
  return mongoose.connection.readyState === 1;
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  const cache = globalCache.__veloura;
  if (cache.conn) return cache.conn;

  try {
    if (!cache.promise) {
      cache.promise = mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    }
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (error) {
    cache.promise = null;
    cache.conn = null;
    console.error("MongoDB connection failed:", error.message);
    return null;
  }
}

export async function ensureSeed() {
  if (!dbReady() || globalCache.__veloura.seeded) return;

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(catalog);
  }

  globalCache.__veloura.seeded = true;
}
