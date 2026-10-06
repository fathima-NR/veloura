import { Router } from "express";
import { findProduct } from "../../shared/products.js";
import { quote, sizePrice } from "../../shared/pricing.js";
import { dbReady } from "../config/db.js";
import { Order } from "../models/Order.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

function normalizeItems(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      const product = findProduct(item?.slug);
      if (!product) return null;
      const size = product.sizes?.includes(item.size) ? item.size : product.sizes?.[0] || "";
      const qty = Math.min(8, Math.max(1, Number(item.qty) || 1));
      return {
        slug: product.slug,
        name: product.name,
        price: sizePrice(product, size),
        qty,
        size,
        image: product.image,
        bestseller: Boolean(product.bestseller),
      };
    })
    .filter(Boolean);
}

router.post("/", optionalAuth, async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const phone = String(req.body.phone || "").trim();
  const address = req.body.shippingAddress || {};
  const items = normalizeItems(req.body.items);

  if (!name || !email.includes("@")) {
    return res.status(400).json({ message: "Add your name and a valid email." });
  }
  if (!String(address.line1 || "").trim() || !String(address.city || "").trim()) {
    return res.status(400).json({ message: "Add a street address and city." });
  }
  if (!items.length) return res.status(400).json({ message: "Your bag is empty." });

  const totals = quote(items, req.body.promoCode);
  const payload = {
    user: req.userId || undefined,
    email,
    name,
    phone,
    items,
    shippingAddress: {
      line1: String(address.line1 || "").trim(),
      city: String(address.city || "").trim(),
      region: String(address.region || "").trim(),
      postal: String(address.postal || "").trim(),
      country: String(address.country || "United Arab Emirates").trim(),
    },
    ...totals,
    status: "Placed",
  };

  if (!dbReady()) {
    return res.status(201).json({
      order: {
        ...payload,
        _id: `VL-${Date.now().toString().slice(-8)}`,
        createdAt: new Date().toISOString(),
        persisted: false,
      },
    });
  }

  const order = await Order.create(payload);
  return res.status(201).json({ order });
});

router.get("/mine", requireAuth, async (req, res) => {
  if (!dbReady()) return res.json({ orders: [] });
  const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 }).lean();
  return res.json({ orders });
});

router.get("/:id", async (req, res) => {
  if (!dbReady() || !req.params.id.match(/^[a-f\d]{24}$/i)) {
    return res.status(404).json({ message: "Order not found." });
  }
  const order = await Order.findById(req.params.id).lean();
  if (!order) return res.status(404).json({ message: "Order not found." });
  return res.json({ order });
});

export default router;
