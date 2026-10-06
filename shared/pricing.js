export const FREE_SHIPPING_AT = 75;
export const SHIPPING_FEE = 8;
export const TAX_RATE = 0.05;

export const PROMOS = {
  GLOW30: { rate: 0.3, bestsellersOnly: true, label: "30% off best sellers" },
  WELCOME10: { rate: 0.1, bestsellersOnly: false, label: "10% off your order" },
};

export function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

export function sizePrice(product, size) {
  const base = Number(product.price) || 0;
  if (size === "50 ml") return Math.round(base * 1.35);
  return base;
}

export function quote(items, promoCode) {
  const code = String(promoCode || "").trim().toUpperCase();
  const promo = PROMOS[code] || null;
  const subtotal = round2(items.reduce((sum, item) => sum + item.price * item.qty, 0));
  const discount = round2(
    items.reduce((sum, item) => {
      if (!promo) return sum;
      if (promo.bestsellersOnly && !item.bestseller) return sum;
      return sum + item.price * item.qty * promo.rate;
    }, 0)
  );
  const merchandise = round2(Math.max(0, subtotal - discount));
  const shipping = merchandise === 0 || merchandise >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;
  const tax = round2(merchandise * TAX_RATE);
  const total = round2(merchandise + shipping + tax);
  const untilFreeShipping = merchandise === 0 ? 0 : Math.max(0, round2(FREE_SHIPPING_AT - merchandise));

  return {
    subtotal,
    discount,
    shipping,
    tax,
    total,
    promoCode: promo ? code : "",
    promoLabel: promo?.label || "",
    untilFreeShipping,
  };
}
