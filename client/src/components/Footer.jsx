import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    if (!email.includes("@")) return;
    setJoined(true);
  }

  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <p className="logo">Veloura</p>
          <p>Botanical formulas, clinically minded. A beauty house for skin that prefers a quieter kind of glow.</p>
          <form className="news-form" onSubmit={onSubmit}>
            <label htmlFor="news-email">Notes from the house</label>
            {joined ? (
              <p className="joined">You are on the list. We will write when a ritual is ready.</p>
            ) : (
              <div className="news-row">
                <input
                  id="news-email"
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <button className="btn btn-light btn-small" type="submit">
                  Join
                </button>
              </div>
            )}
          </form>
        </div>
        <div>
          <h3>Shop</h3>
          <Link to="/shop">The collection</Link>
          <Link to="/shop?category=serums">Serums</Link>
          <Link to="/shop?category=moisturizers">Moisturizers</Link>
          <Link to="/shop?category=spf">SPF</Link>
          <Link to="/shop?sort=bestsellers">Best sellers</Link>
        </div>
        <div>
          <h3>Care</h3>
          <Link to="/about#shipping">Shipping</Link>
          <Link to="/about#returns">Returns</Link>
          <Link to="/about#faq">Questions</Link>
          <Link to="/cart">Your bag</Link>
        </div>
        <div>
          <h3>House</h3>
          <Link to="/about">Our story</Link>
          <Link to="/account">Account</Link>
          <Link to="/login">Sign in</Link>
          <a href="mailto:hello@veloura.com">hello@veloura.com</a>
        </div>
      </div>
      <div className="wrap fine">
        <span>© {new Date().getFullYear()} Veloura. All rights reserved.</span>
        <span>Clean formulas · Cruelty-free · Free shipping over $75</span>
      </div>
    </footer>
  );
}
