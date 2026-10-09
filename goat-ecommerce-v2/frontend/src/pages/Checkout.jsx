import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { submitOrder } from '../services/orderService.js';
import { formatPrice } from '../utils/format.js';

export default function Checkout() {
  const { user, token } = useAuth();
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  if (!user) {
    return (
      <section className="page-section">
        <h1 className="section-title">Finalizar compra</h1>
        <p>Debes iniciar sesión para completar tu pedido.</p>
      </section>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('Procesando orden...');

    try {
      await submitOrder({ items: cart, total }, token);
      clearCart();
      navigate('/');
    } catch (error) {
      setMessage('No se pudo procesar el pedido. Intenta de nuevo.');
    }
  };

  return (
    <section className="page-section checkout-panel">
      <h1 className="section-title">Finalizar compra</h1>
      <p className="section-copy">Revisa tu pedido y confirma tu compra segura.</p>
      <div className="cart-summary">
        <p>Productos: {cart.length}</p>
        <p>Total: {formatPrice(total)}</p>
      </div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <button className="button" type="submit">
          Confirmar compra
        </button>
      </form>
      {message && <p className="alert">{message}</p>}
    </section>
  );
}