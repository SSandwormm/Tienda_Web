// =========================================
// IMPORTACIONES
// =========================================

// React permite crear componentes.
// React.memo optimiza el rendimiento.
import React from "react";

// Componente que representa UNA tarjeta de producto.
import ProductCard from "./ProductCard.jsx";

// =========================================
// COMPONENTE ProductGrid
// =========================================
//
// Este componente muestra una colección
// de productos.
//
// Su única responsabilidad es:
//
// 1. Recibir un arreglo de productos.
// 2. Verificar si existen productos.
// 3. Recorrer el arreglo.
// 4. Crear una ProductCard por cada producto.
//
// Ejemplo:
//
// Producto 1
// Producto 2
// Producto 3
// Producto 4
//

function ProductGrid({
  // Lista de productos que recibimos desde
  // el componente padre.
  products,

  // Mensaje opcional cuando no existen productos.
  emptyMessage,
}) {
  /*
  =========================================
  VALIDAR SI EXISTEN PRODUCTOS
  =========================================

  Si:

  products = undefined

  o

  products = []

  entonces mostramos un mensaje.

  Esto evita errores al intentar recorrer
  un arreglo vacío.
  */

  if (!products || products.length === 0) {
    return (
      <div>
        {/* Si existe un mensaje personalizado
            lo mostramos.

            Si no existe, usamos el mensaje
            por defecto.
        */}

        {emptyMessage || "No hay productos en esta categoría."}
      </div>
    );
  }

  /*
  =========================================
  RENDER DEL GRID
  =========================================

  Si existen productos,

  recorremos el arreglo utilizando map().

  map() crea una ProductCard
  para cada producto.
  */

  return (
    <div className="product-grid">
      {/* Recorrer todos los productos */}

      {products.map((product) => (
        <ProductCard
          // Clave única para que React
          // identifique cada tarjeta.

          key={product.slug}
          // Enviamos el producto completo
          // al componente ProductCard.

          product={product}
        />
      ))}
    </div>
  );
}

/*
=========================================
OPTIMIZACIÓN CON React.memo
=========================================

Evita que ProductGrid vuelva a renderizarse
si las propiedades (props) no cambiaron.

Ejemplo:

Si el usuario abre el carrito,

ProductGrid NO necesita renderizarse otra vez
porque la lista de productos sigue siendo igual.

Esto mejora el rendimiento.
*/

export default React.memo(ProductGrid);
