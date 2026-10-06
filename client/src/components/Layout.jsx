import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout() {
  const { pathname } = useLocation();
  const { toast } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      {toast ? <div className="toast">{toast}</div> : null}
    </>
  );
}
