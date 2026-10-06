import express from "express";
import cors from "cors";
import { connectDB, ensureSeed } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";

const app = express();

app.use(
  cors({
    origin: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    await ensureSeed();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "veloura-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api", (_req, res) => {
  res.status(404).json({ message: "Not found." });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

export default app;
