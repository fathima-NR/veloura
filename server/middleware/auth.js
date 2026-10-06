import jwt from "jsonwebtoken";

function secret() {
  return process.env.JWT_SECRET || "veloura-dev-secret";
}

export function signToken(userId) {
  return jwt.sign({ id: userId }, secret(), { expiresIn: "7d" });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ message: "Please sign in to continue." });

  try {
    const payload = jwt.verify(token, secret());
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ message: "Your session expired. Please sign in again." });
  }
}

export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return next();
  try {
    const payload = jwt.verify(token, secret());
    req.userId = payload.id;
  } catch {
    req.userId = null;
  }
  next();
}
