import { money } from "../utils";

export default function Summary({ totals, promoCode }) {
  return (
    <div className="summary-lines">
      <div className="summary-row">
        <span>Subtotal</span>
        <span>{money(totals.subtotal)}</span>
      </div>
      {totals.discount > 0 ? (
        <div className="summary-row discount">
          <span>Discount {promoCode ? `(${promoCode})` : ""}</span>
          <span>−{money(totals.discount)}</span>
        </div>
      ) : null}
      <div className="summary-row">
        <span>Shipping</span>
        <span>{totals.shipping === 0 ? "Complimentary" : money(totals.shipping)}</span>
      </div>
      <div className="summary-row">
        <span>Tax</span>
        <span>{money(totals.tax)}</span>
      </div>
      <div className="summary-row total">
        <span>Total</span>
        <span>{money(totals.total)}</span>
      </div>
    </div>
  );
}
