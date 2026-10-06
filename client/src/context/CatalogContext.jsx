import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { catalog } from "../../../shared/products.js";

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(catalog);

  useEffect(() => {
    let active = true;
    api("/products")
      .then((data) => {
        if (active && data.products?.length) setProducts(data.products);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({ products }), [products]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
