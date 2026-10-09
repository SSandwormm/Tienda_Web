import React from "react";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/format.js";
import { Link } from "react-router-dom";
import "../styles/cart.css";
import { getAvailableStock } from "../context/CartContext.jsx";

export default function Cart() {
  const {
    cart,
    subtotal,
    total,
    itemCount,
    hasStockIssues,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  if (cart.length === 0) {
    return (
      <section className="cart-page cart-empty">
        <h1>Carrito</h1>
        <p>Tu carrito está vacío.</p>
        <Link to="/tienda" className="cart-button">
          Explorar tienda <span aria-hidden="true">→</span>
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-main">
        <h1>Carrito</h1>
        <div className="cart-items" aria-label="Productos del carrito">
          {cart.map((item) => (
            <div
              className="cart-item-card"
              key={`${item.slug}-${item.size || "default"}-${item.color || "default"}`}
            >
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <Link to={`/producto/${item.slug}`} className="cart-item-name">
                  {item.name}
                </Link>
                <div className="cart-item-options">
                  <span>
                    Talla: {item.size || item.selectedSize || "Única"}
                  </span>
                  <span>Color: {item.color || "Único"}</span>
                </div>
                <span className="cart-item-price">
                  {formatPrice(item.price)}
                </span>
                <div className="cart-item-footer">
                  <div
                    className="cart-quantity"
                    aria-label={`Cantidad de ${item.name}`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.slug,
                          item.quantity - 1,
                          item.size,
                          item.color,
                        )
                      }
                      disabled={item.quantity <= 1}
                      aria-label="Reducir cantidad"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.slug,
                          item.quantity + 1,
                          item.size,
                          item.color,
                        )
                      }
                      disabled={item.quantity >= getAvailableStock(item)}
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                  <span className="cart-item-subtotal">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    className="cart-remove"
                    onClick={() =>
                      removeItem(
                        item.slug,
                        item.size || item.selectedSize,
                        item.color,
                      )
                    }
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="cart-summary">
        <h2>Resumen</h2>
        <div className="cart-summary-row">
          <span>Artículos</span>
          <span>{itemCount}</span>
        </div>
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="cart-summary-row cart-total-row">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Link
          to="/checkout"
          className="cart-button cart-checkout"
          aria-disabled={hasStockIssues}
          onClick={(event) => hasStockIssues && event.preventDefault()}
        >
          Finalizar compra
        </Link>
        {hasStockIssues && (
          <p className="cart-stock-warning">
            Ajusta las cantidades al stock disponible.
          </p>
        )}
        <Link to="/tienda" className="cart-continue">
          Seguir comprando
        </Link>
        <button
          className="cart-clear"
          onClick={() => window.confirm("¿Vaciar el carrito?") && clearCart()}
        >
          Vaciar carrito
        </button>
      </div>
    </section>
  );
}
