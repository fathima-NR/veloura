import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="wrap page">
      <header className="page-hero">
        <p className="eyebrow">Our story</p>
        <h1>A smaller shelf, on purpose.</h1>
        <p className="lede">
          Veloura is a skincare house with a smaller shelf on purpose. Fewer formulas, better textures, and a ritual you can actually keep.
        </p>
      </header>

      <section className="story-grid">
        <img
          src="/images/set.jpg"
          alt="Skincare bottles arranged on stone"
        />
        <div>
          <h2>What we make</h2>
          <p>
            Serums for brightness, creams for the barrier, a cleanser that does not squeak, and a mineral veil you can wear every morning.
          </p>
          <p>
            Each formula has one job. We would rather you love three steps than collect a shelf of bottles you never finish.
          </p>
          <Link className="btn" to="/shop">
            Shop the collection
          </Link>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="section-head">
          <h2>Questions</h2>
        </div>
        <div className="accord">
          <details id="shipping" open>
            <summary>Shipping</summary>
            <p>Orders of $75 or more ship free. Below that, a flat $8 is added at checkout. We send a confirmation to the email on your order.</p>
          </details>
          <details id="returns">
            <summary>Returns</summary>
            <p>If a formula is not for you, contact us within 30 days of delivery and we will help you return it.</p>
          </details>
          <details>
            <summary>Payment</summary>
            <p>Pay when your order arrives. We do not ask for a card number at checkout.</p>
          </details>
          <details>
            <summary>Accounts</summary>
            <p>Create an account to save your details and see past orders. You can also check out as a guest.</p>
          </details>
        </div>
      </section>
    </div>
  );
}
