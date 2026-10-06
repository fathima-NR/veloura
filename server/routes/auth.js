import { Router } from "express";
import { dbReady } from "../config/db.js";
import { User } from "../models/User.js";
import { requireAuth, signToken } from "../middleware/auth.js";

const router = Router();

function unavailable(res) {
  return res.status(503).json({
    message: "Sign-in is unavailable right now. Please try again shortly.",
  });
}

router.post("/register", async (req, res) => {
  if (!dbReady()) return unavailable(res);

  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!name || !email || !email.includes("@")) {
    return res.status(400).json({ message: "Enter your name and a valid email." });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Use at least 6 characters for your password." });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "An account with that email already exists." });

  const user = await User.create({ name, email, password });
  return res.status(201).json({ token: signToken(user._id.toString()), user: user.toSafe() });
});

router.post("/login", async (req, res) => {
  if (!dbReady()) return unavailable(res);

  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Those details do not match an account." });
  }

  return res.json({ token: signToken(user._id.toString()), user: user.toSafe() });
});

router.get("/me", requireAuth, async (req, res) => {
  if (!dbReady()) return unavailable(res);
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ message: "Please sign in again." });
  return res.json({ user: user.toSafe() });
});

export default router;
