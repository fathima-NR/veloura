import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    slug: String,
    name: String,
    price: Number,
    qty: Number,
    size: String,
    image: String,
    bestseller: Boolean,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true },
    name: { type: String, required: true },
    phone: String,
    items: [itemSchema],
    shippingAddress: {
      line1: String,
      city: String,
      region: String,
      postal: String,
      country: String,
    },
    subtotal: Number,
    discount: Number,
    shipping: Number,
    tax: Number,
    total: Number,
    promoCode: String,
    status: { type: String, default: "Placed" },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
