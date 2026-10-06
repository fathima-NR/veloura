import { Link, useLocation } from "react-router-dom";
import { money } from "../utils";

export default function Confirmation() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="wrap page empty">
        <h1>No receipt open.</h1>
        <p>When you place an order, the confirmation stays on this page.</p>
        <Link className="btn" to="/shop">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap page confirm">
      <p className="eyebrow">Order placed</p>
      <h1>Thank you, {order.name.split(" ")[0]}.</h1>
      <p className="lede">
        Receipt <strong>{String(order._id).slice(-8).toUpperCase()}</strong> is on its way to {order.email}. We will pack the ritual with care.
      </p>
      <ul className="lines confirm-lines">
        {order.items.map((item) => (
          <li key={`${item.slug}-${item.size}`} className="line slim">
            <div>
              <strong>{item.name}</strong>
              <p>
                {item.size} · Qty {item.qty}
              </p>
            </div>
            <span>{money(item.price * item.qty)}</span>
          </li>
        ))}
      </ul>
      <p className="total-line">Total {money(order.total)}</p>
      <div className="hero-actions">
        <Link className="btn btn-fill" to="/shop">
          Continue shopping
        </Link>
        <Link className="btn" to="/account">
          View account
        </Link>
      </div>
    </div>
  );
}
