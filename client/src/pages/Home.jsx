import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCatalog } from "../context/CatalogContext";
import { categories } from "../../../shared/products.js";
import { useFallbackImage } from "../utils";

const benefits = [
  { title: "Considered formulas", text: "Short ingredient lists. Each step has a job, and nothing is there for the label." },
  { title: "Barrier first", text: "Ceramides, centella, and quiet textures for skin that flushes or feels tight." },
  { title: "A finish you can wear", text: "Serums that sit under tint. SPF with a soft glow instead of a white cast." },
  { title: "Thirty unhurried days", text: "If a formula is not yours, send it back within 30 days. We would rather you love it." },
];

export default function Home() {
  const { products } = useCatalog();
  const bestsellers = products.filter((product) => product.bestseller).slice(0, 4);
  const featured = products.filter((product) => product.featured).slice(0, 8);

  return (
    <>
      <section className="hero-banner">
        <div className="hero-copy">
          <p className="eyebrow">Veloura skincare</p>
          <h1>Skincare that cares, beauty that shines.</h1>
          <p className="lede">
            Clean formulas for a calmer, brighter complexion. Serums, creams, and daily care, made to feel as good as they look.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-fill" to="/shop">
              Shop now
            </Link>
            <Link className="btn" to="/about">
              Our story
            </Link>
          </div>
        </div>
        <div className="hero-photo">
          <img src="/images/hero.jpg" alt="A woman with glowing skin beside fresh green leaves" onError={useFallbackImage} />
        </div>
      </section>

      <section className="trust wrap">
        <article>
          <strong>Clean formulas</strong>
          <p>Short lists, chosen for skin.</p>
        </article>
        <article>
          <strong>Dermatologist minded</strong>
          <p>Textures made for daily wear.</p>
        </article>
        <article>
          <strong>Cruelty-free</strong>
          <p>Never tested on animals.</p>
        </article>
        <article>
          <strong>Free shipping</strong>
          <p>On orders over $75.</p>
        </article>
      </section>

      <section className="section wrap">
        <div className="section-head center">
          <p className="eyebrow">Browse</p>
          <h2>Shop by category</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link key={category.slug} to={`/shop?category=${category.slug}`} className="category-card">
              <img src={category.image} alt="" onError={useFallbackImage} />
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap">
        <div className="promo">
          <div className="promo-copy">
            <p className="eyebrow light">This week</p>
            <h2>Up to 30% off best sellers.</h2>
            <p>Use code GLOW30 at checkout. It applies to the formulas our clients finish first.</p>
            <Link className="btn btn-light" to="/shop?sort=bestsellers">
              Shop best sellers
            </Link>
          </div>
          <div className="promo-visual">
            <img src={bestsellers[0]?.image} alt="A Veloura best seller" onError={useFallbackImage} />
          </div>
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">The edit</p>
            <h2>Featured products</h2>
          </div>
          <Link to="/shop?sort=bestsellers" className="text-link">
            View all
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="section wrap ritual">
        <div className="ritual-copy">
          <p className="eyebrow">Four quiet steps</p>
          <h2>Morning, in order.</h2>
          <p>Cleanse the night away, treat what you want to change, seal the water in, then protect the work. That is the whole method.</p>
          <Link className="btn" to="/product/the-morning-ritual-set">
            Shop the set
          </Link>
        </div>
        <ol className="steps">
          {[
            ["01", "Cleanse", "Rosewater Milk Cleanser"],
            ["02", "Treat", "Luminous Peptide Serum"],
            ["03", "Moisturize", "Cloud Veil Moisturizer"],
            ["04", "Protect", "Daily Mineral Veil SPF 50"],
          ].map(([index, title, name]) => (
            <li key={index} className="step">
              <span>{index}</span>
              <div>
                <strong>{title}</strong>
                <p>{name}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section wrap">
        <div className="section-head center">
          <p className="eyebrow">Formula benefits</p>
          <h2>What the ritual is for.</h2>
        </div>
        <div className="benefits">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="benefit">
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section wrap editorial">
        <img src="/images/set.jpg" alt="Veloura serum, cream, and cleanser arranged together" onError={useFallbackImage} />
        <div className="editorial-copy">
          <p className="eyebrow">From the journal</p>
          <h2>Skin, unhurried.</h2>
          <p>
            Veloura started as a small studio ritual: fewer bottles, better textures, and language that tells you what a formula does. The collection is still edited that way.
          </p>
          <Link className="text-link" to="/about">
            Read the story
          </Link>
        </div>
      </section>
    </>
  );
}
