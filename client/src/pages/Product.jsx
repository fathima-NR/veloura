import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Stars from "../components/Stars";
import { useCart } from "../context/CartContext";
import { useCatalog } from "../context/CatalogContext";
import { sizePrice } from "../../../shared/pricing.js";
import { categoryLabel, money, useFallbackImage } from "../utils";

export default function Product() {
  const { slug } = useParams();
  const { products } = useCatalog();
  const { addItem } = useCart();
  const product = products.find((item) => item.slug === slug);
  const [size, setSize] = useState(product?.sizes?.[0] || "");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setSize(product?.sizes?.[0] || "");
    setQty(1);
  }, [slug, product]);

  if (!product) {
    return (
      <div className="wrap page empty">
        <h1>That formula has left the shelf.</h1>
        <Link className="btn" to="/shop">
          Back to the collection
        </Link>
      </div>
    );
  }

  const chosen = product.sizes?.includes(size) ? size : product.sizes?.[0] || "";
  const price = sizePrice(product, chosen);
  const compare = product.comparePrice && chosen === "50 ml" ? Math.round(product.comparePrice * 1.35) : product.comparePrice;
  const related = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 4);

  return (
    <div className="wrap page">
      <p className="crumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`}>{categoryLabel(product.category)}</Link>
      </p>
      <article className="pdp">
        <div className="pdp-gallery">
          <img src={product.image} alt={product.name} onError={useFallbackImage} />
        </div>
        <div className="pdp-info">
          <p className="eyebrow">{categoryLabel(product.category)}</p>
          <h1>{product.name}</h1>
          <p className="subtitle">{product.subtitle}</p>
          <p className="rating-line">
            <Stars value={product.rating} />
            <span>
              {product.rating} · {product.reviewCount} reviews
            </span>
          </p>
          <p className="price large">
            {money(price)}
            {compare ? <s>{money(compare)}</s> : null}
          </p>
          <p className="lede">{product.description}</p>

          {product.sizes?.length > 1 ? (
            <div className="size-row" role="group" aria-label="Size">
              {product.sizes.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`size ${chosen === option ? "on" : ""}`}
                  onClick={() => setSize(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <p className="size-note">Size · {chosen}</p>
          )}

          <div className="buy-row">
            <div className="qty">
              <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
                −
              </button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((value) => Math.min(8, value + 1))} aria-label="Increase quantity">
                +
              </button>
            </div>
            <button type="button" className="btn btn-fill" onClick={() => addItem(product, qty, chosen)}>
              Add to bag
            </button>
          </div>
          <p className="stock">{product.stock} in the atelier</p>

          <div className="accord">
            <details open>
              <summary>The formula</summary>
              <p>{product.details}</p>
            </details>
            <details>
              <summary>Ingredients</summary>
              <p>{product.ingredients}</p>
            </details>
            <details>
              <summary>How to use</summary>
              <p>{product.howTo}</p>
            </details>
          </div>
        </div>
      </article>

      {product.reviews?.length ? (
        <section className="section">
          <div className="section-head">
            <h2>Notes from clients</h2>
          </div>
          <div className="quotes">
            {product.reviews.map((review) => (
              <blockquote key={review.name} className="quote">
                <Stars value={review.stars} />
                <p>{review.text}</p>
                <footer>{review.name}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="section">
          <div className="section-head">
            <h2>Worn with</h2>
            <Link to={`/shop?category=${product.category}`} className="text-link">
              More in {categoryLabel(product.category)}
            </Link>
          </div>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
