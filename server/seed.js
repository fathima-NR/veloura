import dotenv from "dotenv";
import { connectDB, dbReady, ensureSeed } from "./config/db.js";
import mongoose from "mongoose";

dotenv.config();

const connection = await connectDB();
if (!connection || !dbReady()) {
  console.log("Add MONGODB_URI to .env, then run npm run seed again.");
  process.exit(0);
}

await ensureSeed();
console.log("Catalog is ready.");
await mongoose.disconnect();
