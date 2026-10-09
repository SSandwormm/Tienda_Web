import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page-section">
      <h1 className="section-title">404</h1>
      <p className="section-copy">Página no encontrada. Regresa a la tienda o a la página principal.</p>
      <Link to="/" className="button">
        Ir al inicio
      </Link>
    </section>
  );
}