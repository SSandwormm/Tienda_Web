import React from "react";
import ProductCard from "./ProductCard.jsx";

function renderSimpleGrid(products) {
  return (
    <div className="simple-grid">
      {products.map((product) => (
        <div className="editorial-product-cell" key={product.slug}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

function renderEditorialBlock(products, largeOnLeft) {
  return (
    <div
      className={`editorial-product-block${largeOnLeft ? " editorial-product-block--large-left" : ""}`}
    >
      {products.map((product, index) => (
        <div
          className={`editorial-product-cell editorial-product-item item-${index + 1}`}
          key={product.slug}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

export default function EditorialProductGrid({
  products = [],
  largeOnLeft = false,
  simple = false,
}) {
  if (products.length === 0) {
    return <div>No hay productos en esta categoría.</div>;
  }

  if (simple) {
    return (
      <div className="simple-grid">
        {products.map((product) => (
          <div className="editorial-product-cell" key={product.slug}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    );
  }

  const blocks = [];
  for (let index = 0; index < products.length; index += 13) {
    const block = products.slice(index, index + 13);
    blocks.push(
      block.length === 13
        ? renderEditorialBlock(block, largeOnLeft)
        : renderSimpleGrid(block),
    );
  }

  return <div className="editorial-product-grid">{blocks}</div>;
}
