import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Summary from "../components/Summary";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const empty = {
  name: "",
  email: "",
  phone: "",
  line1: "",
  city: "",
  region: "",
  postal: "",
  country: "United Arab Emirates",
};

export default function Checkout() {
  const { user } = useAuth();
  const { items, totals, promoCode, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ...empty,
    name: user?.name || "",
    email: user?.email || "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function setField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await api("/orders", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          promoCode,
          items,
          shippingAddress: {
            line1: form.line1,
            city: form.city,
            region: form.region,
            postal: form.postal,
            country: form.country,
          },
        }),
      });
      clear();
      navigate("/order/confirmation", { state: { order: data.order } });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (!items.length) {
    return (
      <div className="wrap page empty">
        <h1>Your bag is empty.</h1>
        <Link className="btn" to="/shop">
          Return to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap page">
      <header className="page-hero">
        <p className="eyebrow">Checkout</p>
        <h1>Where should we send it?</h1>
      </header>
      <form className="checkout-grid" onSubmit={onSubmit}>
        <div className="form">
          <div className="row-2">
            <label className="field">
              Full name
              <input name="name" required value={form.name} onChange={setField} />
            </label>
            <label className="field">
              Email
              <input name="email" type="email" required value={form.email} onChange={setField} />
            </label>
          </div>
          <label className="field">
            Phone
            <input name="phone" value={form.phone} onChange={setField} placeholder="05x xxx xxxx" />
          </label>
          <label className="field">
            Address
            <input name="line1" required value={form.line1} onChange={setField} placeholder="Building, street" />
          </label>
          <div className="row-2">
            <label className="field">
              City
              <input name="city" required value={form.city} onChange={setField} />
            </label>
            <label className="field">
              Region
              <input name="region" value={form.region} onChange={setField} placeholder="Emirate or state" />
            </label>
          </div>
          <div className="row-2">
            <label className="field">
              Postal code
              <input name="postal" value={form.postal} onChange={setField} />
            </label>
            <label className="field">
              Country
              <select name="country" value={form.country} onChange={setField}>
                <option>United Arab Emirates</option>
                <option>Saudi Arabia</option>
                <option>Qatar</option>
                <option>India</option>
                <option>United Kingdom</option>
                <option>United States</option>
              </select>
            </label>
          </div>
          <div className="pay-note">
            <strong>Cash on delivery</strong>
            <p>Pay when your order arrives. We do not ask for a card number here.</p>
          </div>
          {error ? <p className="error">{error}</p> : null}
          <button className="btn btn-fill" type="submit" disabled={submitting}>
            {submitting ? "Placing order…" : `Place order · ${totals.total.toFixed(2)} USD`}
          </button>
        </div>
        <aside className="summary">
          <h2>Your order</h2>
          <ul className="mini-lines">
            {items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.name} × {item.qty}
                </span>
              </li>
            ))}
          </ul>
          <Summary totals={totals} promoCode={promoCode} />
        </aside>
      </form>
    </div>
  );
}
