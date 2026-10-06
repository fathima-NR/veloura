import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { quote, sizePrice } from "../../../shared/pricing.js";

const CartContext = createContext(null);
const KEY = "veloura_cart";

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "{}");
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      promoCode: parsed.promoCode || "",
    };
  } catch {
    return { items: [], promoCode: "" };
  }
}

export function CartProvider({ children }) {
  const [state, setState] = useState(loadCart);
  const [toast, setToast] = useState("");
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const totals = useMemo(() => quote(state.items, state.promoCode), [state]);
  const count = state.items.reduce((sum, item) => sum + item.qty, 0);

  const value = useMemo(
    () => ({
      items: state.items,
      promoCode: state.promoCode,
      totals,
      count,
      toast,
      promoError,
      addItem(product, qty = 1, size) {
        const chosen = size || product.sizes?.[0] || "";
        const id = `${product.slug}__${chosen}`;
        const price = sizePrice(product, chosen);
        setState((prev) => {
          const existing = prev.items.find((item) => item.id === id);
          const items = existing
            ? prev.items.map((item) =>
                item.id === id ? { ...item, qty: Math.min(8, item.qty + qty) } : item
              )
            : [
                ...prev.items,
                {
                  id,
                  slug: product.slug,
                  name: product.name,
                  image: product.image,
                  size: chosen,
                  price,
                  qty,
                  bestseller: Boolean(product.bestseller),
                },
              ];
          return { ...prev, items };
        });
        setToast(`${product.name} added to bag`);
      },
      updateQty(id, qty) {
        setState((prev) => ({
          ...prev,
          items: prev.items
            .map((item) => (item.id === id ? { ...item, qty: Math.min(8, Math.max(1, qty)) } : item))
            .filter((item) => item.qty > 0),
        }));
      },
      remove(id) {
        setState((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));
      },
      applyPromo(code) {
        const next = String(code || "").trim().toUpperCase();
        const result = quote(state.items, next);
        if (!next || !result.promoCode) {
          setPromoError("Try GLOW30 or WELCOME10.");
          return false;
        }
        setPromoError("");
        setState((prev) => ({ ...prev, promoCode: result.promoCode }));
        setToast(`${result.promoLabel} applied`);
        return true;
      },
      clearPromo() {
        setPromoError("");
        setState((prev) => ({ ...prev, promoCode: "" }));
      },
      clear() {
        setState({ items: [], promoCode: "" });
      },
    }),
    [state, totals, count, toast, promoError]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
