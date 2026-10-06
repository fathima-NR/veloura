import { Router } from "express";
import { catalog, findProduct } from "../../shared/products.js";
import { dbReady } from "../config/db.js";
import { Product } from "../models/Product.js";

const router = Router();

function serialize(product) {
  const doc = product.toObject ? product.toObject() : product;
  return {
    ...doc,
    id: doc.slug,
    _id: undefined,
    __v: undefined,
  };
}

async function loadProducts() {
  if (!dbReady()) return catalog;
  const products = await Product.find().lean();
  return products.length ? products : catalog;
}

router.get("/", async (req, res) => {
  let products = await loadProducts();
  const category = String(req.query.category || "").toLowerCase();
  const q = String(req.query.q || "").trim().toLowerCase();
  const bestseller = req.query.bestseller === "true";

  if (category) products = products.filter((product) => product.category === category);
  if (bestseller) products = products.filter((product) => product.bestseller);
  if (q) {
    products = products.filter((product) =>
      [product.name, product.subtitle, product.category, product.description]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }

  res.json({
    products: products.map(serialize),
    source: dbReady() ? "mongodb" : "catalog",
  });
});

router.get("/:slug", async (req, res) => {
  if (dbReady()) {
    const product = await Product.findOne({ slug: req.params.slug }).lean();
    if (product) return res.json({ product: serialize(product) });
  }

  const fallback = findProduct(req.params.slug);
  if (!fallback) return res.status(404).json({ message: "That formula is not in the collection." });
  return res.json({ product: serialize(fallback) });
});

export default router;
