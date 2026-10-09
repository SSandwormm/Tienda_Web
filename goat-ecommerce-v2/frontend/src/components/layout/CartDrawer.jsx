// ================================
// IMPORTACIONES
// ================================

// React y Hooks
// useState -> Guarda estados (abierto/cerrado)
// useEffect -> Ejecuta código cuando ocurre algún cambio
import React, { useEffect, useState } from "react";

// Hook personalizado que nos da acceso al carrito global.
// Desde aquí obtenemos los productos, subtotal, total y funciones del carrito.
import { useCart } from "../../context/CartContext.jsx";

// Función para formatear números como moneda COP.
// Ejemplo: 120000 -> $120.000
import { formatPrice } from "../../utils/format.js";

// Link permite navegar entre páginas sin recargar el navegador.
import { Link } from "react-router-dom";

// Estilos exclusivos del carrito lateral.
import "../../styles/cartdrawer.css";

// =========================================
// COMPONENTE DEL CARRITO LATERAL (DRAWER)
// =========================================
export default function CartDrawer() {
  /*
  =========================================
  DATOS DEL CONTEXTO DEL CARRITO
  =========================================

  useCart() devuelve toda la información del carrito.

  cart            -> Lista de productos.
  subtotal        -> Suma de todos los productos.
  total           -> Total final.
  removeItem()    -> Elimina un producto.
  updateQuantity()-> Cambia la cantidad de un producto.
  */

  const { cart, subtotal, total, removeItem, updateQuantity } = useCart();

  /*
  =========================================
  ESTADO DEL DRAWER
  =========================================

  open = false -> Carrito cerrado.

  open = true -> Carrito abierto.
  */

  const [open, setOpen] = useState(false);

  /*
  =========================================
  ESCUCHAR EL EVENTO "openCart"
  =========================================

  Desde cualquier parte de la aplicación se puede ejecutar:

      window.dispatchEvent(new Event("openCart"))

  Cuando eso ocurra, este componente abrirá automáticamente
  el carrito.

  El return elimina el evento cuando el componente deja
  de existir para evitar fugas de memoria.
  */

  useEffect(() => {
    // Función que abre el carrito
    const onOpenCart = () => setOpen(true);

    // Escuchar el evento
    window.addEventListener("openCart", onOpenCart);

    // Limpiar el evento cuando el componente se destruya
    return () => {
      window.removeEventListener("openCart", onOpenCart);
    };
  }, []);

  /*
  =========================================
  BLOQUEAR EL SCROLL DE LA PÁGINA
  =========================================

  Cuando el carrito está abierto, el usuario no puede hacer
  scroll sobre la página que está detrás.

  open = true
      overflow = hidden

  open = false
      overflow = normal
  */

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // =========================================
  // RENDER DEL COMPONENTE
  // =========================================

  return (
    <>
      {/* =====================================
          OVERLAY OSCURO
          =====================================

          Es el fondo oscuro detrás del carrito.

          Si el carrito está abierto se agrega
          la clase "cart-overlay-show".

          Al hacer clic sobre el overlay
          el carrito se cierra.
      */}

      <div
        className={`cart-overlay ${open ? "cart-overlay-show" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* =====================================
          DRAWER LATERAL
          =====================================

          Panel que entra desde la derecha.

          Cuando open = true
          agrega la clase "cart-open"
          para mostrar la animación.
      */}

      <aside className={`cart-drawer ${open ? "cart-open" : ""}`}>
        {/* =====================================
            HEADER DEL CARRITO
        ====================================== */}

        <div className="cart-header">
          {/* Título */}
          <h2>TU CARRITO</h2>

          {/* Botón para cerrar el carrito */}
          <button className="cart-close" onClick={() => setOpen(false)}>
            CERRAR ✕
          </button>
        </div>

        {/* =====================================
            CONTENIDO DEL CARRITO
        ====================================== */}

        <div className="cart-content">
          {/* Si el carrito está vacío... */}

          {cart.length === 0 ? (
            <div className="empty-cart">
              {/* Icono */}
              <div className="empty-icon">🛒</div>

              {/* Mensaje */}
              <p>Tu carrito esta vacío</p>

              {/* Botón para cerrar el carrito */}
              <button className="explore-btn" onClick={() => setOpen(false)}>
                SEGUIR EXPLORANDO
              </button>
            </div>
          ) : (
            <>
              {/* =====================================
                  LISTA DE PRODUCTOS
              ======================================

                  map() recorre todos los productos
                  del carrito y crea un bloque
                  para cada uno.
              */}

              {cart.map((item) => (
                <div key={item.slug} className="cart-product">
                  {/* Imagen del producto.
                      Si no existe, usa una imagen por defecto.
                  */}

                  <img src={item.image || "/placeholder.svg"} alt={item.name} />

                  {/* Información del producto */}

                  <div className="cart-product-info">
                    {/* Nombre */}
                    <h4>{item.name}</h4>

                    {/* Precio */}
                    <p>{formatPrice(item.price)}</p>

                    <div className="qty-row">
                      {/* =====================================
                          INPUT DE CANTIDAD
                      ======================================

                      El usuario puede cambiar la cantidad.

                      Cada vez que escribe un número,
                      updateQuantity() actualiza
                      el carrito.
                      */}

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.slug, Number(e.target.value))
                        }
                      />

                      {/* Botón para eliminar el producto */}

                      <button onClick={() => removeItem(item.slug)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* =====================================
            FOOTER DEL CARRITO
        ====================================== */}

        <div className="cart-footer">
          {/* Subtotal */}

          <div className="summary-row">
            <span>Subtotal</span>

            <span>{formatPrice(subtotal)}</span>
          </div>

          {/* Envío */}

          <div className="summary-row">
            <span>Envío</span>

            <span className="free">GRATIS</span>
          </div>

          {/* Total */}

          <div className="summary-row total-row">
            <span>Total</span>

            <span>{formatPrice(total)}</span>
          </div>

          {/* Información adicional */}

          <p className="shipping-note">
            Envío prioritario gratuito a toda Colombia.
          </p>

          {/* =====================================
              BOTÓN CHECKOUT
          ======================================

          Lleva al usuario a la página
          del proceso de compra.

          Antes de navegar se cierra
          el carrito.
          */}

          <Link
            to="/checkout"
            className="checkout-btn"
            onClick={() => setOpen(false)}
          >
            FINALIZAR COMPRA
          </Link>
        </div>
      </aside>
    </>
  );
}
