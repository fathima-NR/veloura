import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: String,
    stars: Number,
    text: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subtitle: String,
    price: { type: Number, required: true },
    comparePrice: Number,
    category: { type: String, required: true },
    badge: String,
    bestseller: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    sizes: [String],
    rating: Number,
    reviewCount: Number,
    stock: Number,
    image: String,
    hoverImage: String,
    description: String,
    details: String,
    ingredients: String,
    howTo: String,
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
