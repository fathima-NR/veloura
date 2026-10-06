import { useState } from "react";
import { Link } from "react-router-dom";
import Summary from "../components/Summary";
import { useCart } from "../context/CartContext";
import { money, useFallbackImage } from "../utils";

export default function Cart() {
  const { items, totals, promoCode, promoError, updateQty, remove, applyPromo, clearPromo } = useCart();
  const [code, setCode] = useState(promoCode);

  if (!items.length) {
    return (
      <div className="wrap page empty">
        <p className="eyebrow">Bag</p>
        <h1>Your bag is empty.</h1>
        <p>The best sellers are a gentle place to begin.</p>
        <Link className="btn btn-fill" to="/shop?sort=bestsellers">
          Shop best sellers
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap page">
      <header className="page-hero">
        <p className="eyebrow">Bag</p>
        <h1>Your ritual, gathered.</h1>
      </header>
      <div className="cart-layout">
        <ul className="lines">
          {items.map((item) => (
            <li key={item.id} className="line">
              <img src={item.image} alt="" onError={useFallbackImage} />
              <div>
                <h2>
                  <Link to={`/product/${item.slug}`}>{item.name}</Link>
                </h2>
                <p>{item.size}</p>
                <div className="qty">
                  <button type="button" onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease quantity">
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase quantity">
                    +
                  </button>
                </div>
                <button type="button" className="text-btn" onClick={() => remove(item.id)}>
                  Remove
                </button>
              </div>
              <strong>{money(item.price * item.qty)}</strong>
            </li>
          ))}
        </ul>
        <aside className="summary">
          <h2>Summary</h2>
          {totals.untilFreeShipping > 0 ? (
            <p className="free-note">You are {money(totals.untilFreeShipping)} away from complimentary shipping.</p>
          ) : (
            <p className="free-note">Complimentary shipping is included.</p>
          )}
          <form
            className="promo-row"
            onSubmit={(event) => {
              event.preventDefault();
              applyPromo(code);
            }}
          >
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Gift code"
              aria-label="Gift code"
            />
            <button className="btn btn-small" type="submit">
              Apply
            </button>
          </form>
          {promoError ? <p className="error">{promoError}</p> : null}
          {promoCode ? (
            <button type="button" className="text-btn" onClick={clearPromo}>
              Remove {promoCode}
            </button>
          ) : (
            <p className="hint">Try GLOW30 on best sellers, or WELCOME10 on the order.</p>
          )}
          <Summary totals={totals} promoCode={promoCode} />
          <Link className="btn btn-fill" to="/checkout">
            Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
