// =========================================
// IMPORTACIONES
// =========================================

// React permite crear componentes.
import React from "react";

// ProductGrid se encarga de mostrar
// la cuadrícula de productos.
import ProductGrid from "./ProductGrid.jsx";

// =========================================
// COMPONENTE ProductSection
// =========================================
//
// Este componente representa una sección
// completa de productos.
//
// Su responsabilidad es:
//
// 1. Mostrar un título.
// 2. Mostrar una descripción (opcional).
// 3. Mostrar una cuadrícula de productos.
//
// Ejemplo:
//
// NUEVOS LANZAMIENTOS
// ----------------------
// Texto descriptivo
//
// [Producto]
// [Producto]
// [Producto]
//
//

function ProductSection({
  // Título de la sección.
  title,

  // Descripción opcional.
  description,

  // Lista de productos.
  products,

  // Mensaje cuando no existan productos.
  emptyMessage,
}) {
  // =========================================
  // RENDER DEL COMPONENTE
  // =========================================

  return (
    <section className="product-section">
      {/* =====================================
          ENCABEZADO DE LA SECCIÓN
      ====================================== */}

      <div className="section-header">
        {/* Título */}

        <h2 className="section-title">{title}</h2>

        {/* =====================================
            DESCRIPCIÓN
        ======================================

        Solo se muestra si existe.

        Si description es undefined
        React no renderiza nada.
        */}

        {description && <p className="section-description">{description}</p>}
      </div>

      {/* =====================================
          GRID DE PRODUCTOS
      ======================================

      ProductGrid recibe:

      products

      y crea automáticamente
      una ProductCard por cada producto.
      */}

      <ProductGrid products={products} emptyMessage={emptyMessage} />
    </section>
  );
}

/*
=========================================
OPTIMIZACIÓN CON React.memo
=========================================

React.memo evita volver a renderizar
esta sección si sus propiedades
(title, description o products)
no cambiaron.

Esto mejora el rendimiento,
especialmente cuando existen
muchas secciones de productos.
*/

export default React.memo(ProductSection);
