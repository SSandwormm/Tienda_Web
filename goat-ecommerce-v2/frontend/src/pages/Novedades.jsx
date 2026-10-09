import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productService.js";
import ProductGrid from "../components/product/ProductGrid.jsx";

export default function Novedades() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts("novedades")
      .then((data) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page-section novedades-page">
      <div className="section-panel">
        <h1 className="section-title">Novedades</h1>
        <p className="section-copy">
          Descubre los lanzamientos más recientes de GOAT Studios.
        </p>
      </div>
      {loading ? (
        <div className="page-loading">Cargando novedades...</div>
      ) : (
        <ProductGrid products={products} />
      )}
    </section>
  );
}
