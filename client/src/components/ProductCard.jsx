import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { categoryLabel, money, useFallbackImage } from "../utils";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} className="media">
        {product.badge ? <span className="badge">{product.badge}</span> : null}
        <img src={product.image} alt={product.name} onError={useFallbackImage} />
      </Link>
      <div className="card-body">
        <p className="card-cat">{categoryLabel(product.category)}</p>
        <h3>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="subtitle">{product.subtitle}</p>
        <div className="card-row">
          <p className="price">
            {money(product.price)}
            {product.comparePrice ? <s>{money(product.comparePrice)}</s> : null}
          </p>
          <button type="button" className="text-btn" onClick={() => addItem(product, 1)}>
            Add to bag
          </button>
        </div>
      </div>
    </article>
  );
}
