import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProducts } from "../services/productService.js";
import ProductGrid from "../components/product/ProductGrid.jsx";
import { CATEGORIES } from "../utils/constants.js";

export default function Shop() {
  const { category } = useParams();
  const selectedCategory = category || "hombre";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts(selectedCategory)
      .then((data) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const title =
    CATEGORIES.find((item) => item.slug === selectedCategory)?.label ||
    "Tienda";

  return (
    <section className="page-section shop-page">
      <div className="section-panel">
        <h1 className="section-title">{title}</h1>
        <p className="section-copy">
          Explora nuestras prendas para {title.toLowerCase()}.
        </p>
      </div>
      <div className="category-grid">
        {CATEGORIES.map((item) => (
          <Link key={item.slug} to={`/tienda/${item.slug}`} className="card">
            <h3>{item.label}</h3>
          </Link>
        ))}
      </div>
      <div className="page-section">
        <h2 className="section-title">Productos</h2>
        {loading ? (
          <div>Cargando productos...</div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </section>
  );
}
