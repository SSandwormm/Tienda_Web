import React from "react";
import ProductGrid from "../components/ui/ProductGrid";

export default function Category({
  catalogKey,
  title,
  description,
  showHero = true,
}) {
  return (
    <div>
      {showHero && (
        <header className="tienda-hero">
          <p className="tienda-breadcrumb">
            <a href="/">Inicio</a> / {title}
          </p>
          <h1>{title}</h1>
          {description && <p className="tienda-desc">{description}</p>}
        </header>
      )}

      <div className="novedades-header">
        <h2>{title}</h2>
        <span className="tienda-count" data-catalogo-count></span>
      </div>

      <ProductGrid catalogKey={catalogKey} />
    </div>
  );
}
