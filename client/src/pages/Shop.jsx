import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCatalog } from "../context/CatalogContext";
import { categories } from "../../../shared/products.js";
import { categoryLabel } from "../utils";

export default function Shop() {
  const { products } = useCatalog();
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const query = (params.get("q") || "").trim();
  const sort = params.get("sort") || "featured";

  function update(next) {
    const merged = {
      category,
      q: query,
      sort,
      ...next,
    };
    const clean = {};
    Object.entries(merged).forEach(([key, value]) => {
      if (value) clean[key] = value;
    });
    if (clean.sort === "featured") delete clean.sort;
    setParams(clean);
  }

  const visible = useMemo(() => {
    let list = products.filter((product) => {
      const matchesCategory = !category || product.category === category;
      const haystack = `${product.name} ${product.subtitle} ${product.category} ${product.description}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "bestsellers") list = [...list].sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
    if (sort === "featured") list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [products, category, query, sort]);

  const title = category ? categoryLabel(category) : query ? "Search" : "The collection";

  return (
    <div className="wrap page">
      <header className="page-hero">
        <p className="eyebrow">Shop</p>
        <h1>{title}</h1>
        <p>
          {query
            ? `Formulas matching “${query}”.`
            : category
              ? `${categoryLabel(category)} from the edited collection.`
              : "Twelve edited formulas. Start with a serum, or take the morning set if you want the ritual already composed."}
        </p>
      </header>

      <div className="toolbar">
        <div className="chips" role="tablist" aria-label="Categories">
          <button type="button" className={`chip ${category === "" ? "on" : ""}`} onClick={() => update({ category: "" })}>
            All
          </button>
          {categories.map((item) => (
            <button
              key={item.slug}
              type="button"
              className={`chip ${category === item.slug ? "on" : ""}`}
              onClick={() => update({ category: item.slug })}
            >
              {item.name}
            </button>
          ))}
          <button
            type="button"
            className={`chip ${category === "hair" ? "on" : ""}`}
            onClick={() => update({ category: "hair" })}
          >
            Hair
          </button>
        </div>
        <label className="sort">
          Sort
          <select value={sort} onChange={(event) => update({ sort: event.target.value })}>
            <option value="featured">Featured</option>
            <option value="bestsellers">Best sellers</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <p className="results-meta">{visible.length === 1 ? "1 formula" : `${visible.length} formulas`}</p>

      {visible.length === 0 ? (
        <div className="empty">
          <h2>Nothing matches yet.</h2>
          <p>Try a serum, a cream, or clear the search.</p>
          <button type="button" className="btn" onClick={() => setParams({})}>
            Reset filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {visible.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
