import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { money, useFallbackImage } from "../utils";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "Our Story" },
];

export default function Header() {
  const { count, items, totals, updateQty, remove } = useCart();
  const { user } = useAuth();
  const [bagOpen, setBagOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setBagOpen(false);
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") {
        setBagOpen(false);
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onSearch(event) {
    event.preventDefault();
    const next = query.trim();
    navigate(next ? `/shop?q=${encodeURIComponent(next)}` : "/shop");
  }

  return (
    <>
    <header className="header">
      <div className="announcement">
        Up to 30% off best sellers with code <strong>GLOW30</strong>
        <span aria-hidden="true"> · </span>
        Complimentary shipping over $75
      </div>
      <div className="header-inner">
        <button
          type="button"
          className="menu-btn"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <Link to="/" className="logo" aria-label="Veloura home">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2c1.2 4.2 4.2 6.4 4.2 10.2a4.2 4.2 0 1 1-8.4 0C7.8 8.4 10.8 6.2 12 2z" />
          </svg>
          Veloura
        </Link>

        <nav className="nav" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
          <Link to="/shop?sort=bestsellers">Best Sellers</Link>
        </nav>

        <div className="header-actions">
          <button type="button" className="icon-btn" aria-label="Search" onClick={() => setSearchOpen((open) => !open)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16.5 20 20.5" />
            </svg>
          </button>
          <Link to={user ? "/account" : "/login"} className="icon-btn" aria-label={user ? "Account" : "Sign in"}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5.5 19.2c1.4-3 3.6-4.4 6.5-4.4s5.1 1.4 6.5 4.4" />
            </svg>
          </Link>
          <button type="button" className="icon-btn bag-btn" aria-label="Open bag" onClick={() => setBagOpen(true)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.5 8.5h11l-.8 11h-9.4l-.8-11z" />
              <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
            </svg>
            {count > 0 ? <span className="bag-count">{count}</span> : null}
          </button>
        </div>
      </div>

      {searchOpen ? (
        <form className="search-bar" onSubmit={onSearch}>
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search serums, creams, SPF…"
            aria-label="Search the collection"
          />
          <button className="btn btn-fill btn-small" type="submit">
            Search
          </button>
        </form>
      ) : null}

      {menuOpen ? (
        <nav className={`mobile-nav ${menuOpen ? "open" : ""}`} aria-label="Mobile" hidden={!menuOpen}>
          {links.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
          <Link to="/shop?sort=bestsellers">Best Sellers</Link>
          <Link to={user ? "/account" : "/login"}>{user ? "Account" : "Sign in"}</Link>
        </nav>
      ) : null}

    </header>
      {bagOpen ? <button className="backdrop" aria-label="Close bag" onClick={() => setBagOpen(false)} /> : null}
      <aside className={`drawer ${bagOpen ? "open" : ""}`} aria-hidden={!bagOpen}>
        <div className="drawer-head">
          <h2>Your bag</h2>
          <button type="button" className="icon-btn" aria-label="Close bag" onClick={() => setBagOpen(false)}>
            ×
          </button>
        </div>
        {items.length === 0 ? (
          <div className="drawer-empty">
            <p>Your bag is waiting for its first formula.</p>
            <Link to="/shop" className="btn btn-fill">
              Shop the collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="drawer-items">
              {items.map((item) => (
                <li key={item.id} className="drawer-item">
                  <img src={item.image} alt="" onError={useFallbackImage} />
                  <div>
                    <strong>{item.name}</strong>
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
                  <span>{money(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="drawer-foot">
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>{money(totals.subtotal)}</strong>
              </div>
              <Link to="/cart" className="btn">
                View bag
              </Link>
              <Link to="/checkout" className="btn btn-fill">
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
