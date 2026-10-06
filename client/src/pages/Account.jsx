import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { money } from "../utils";

export default function Account() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    api("/orders/mine")
      .then((data) => setOrders(data.orders || []))
      .catch((error) => setMessage(error.message));
  }, [user]);

  if (!user) {
    return (
      <div className="wrap page empty">
        <p className="eyebrow">Account</p>
        <h1>Sign in to see your orders.</h1>
        <div className="hero-actions">
          <Link className="btn btn-fill" to="/login">
            Sign in
          </Link>
          <Link className="btn" to="/register">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap page">
      <header className="page-hero">
        <p className="eyebrow">Account</p>
        <h1>Hello, {user.name.split(" ")[0]}.</h1>
        <p>{user.email}</p>
        <button type="button" className="text-btn" onClick={logout}>
          Sign out
        </button>
      </header>
      <section>
        <h2>Orders</h2>
        {message ? <p className="hint">{message}</p> : null}
        {orders.length === 0 ? (
          <div className="empty inline">
            <p>You have no orders yet.</p>
            <Link className="btn" to="/shop">
              Shop the collection
            </Link>
          </div>
        ) : (
          <ul className="orders">
            {orders.map((order) => (
              <li key={order._id} className="order-card">
                <div>
                  <strong>#{String(order._id).slice(-8).toUpperCase()}</strong>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <p>{order.items.map((item) => item.name).join(", ")}</p>
                <div>
                  <span className="badge">{order.status}</span>
                  <strong>{money(order.total)}</strong>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
