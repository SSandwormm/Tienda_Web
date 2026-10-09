import React from "react";
import { Link } from "react-router-dom";

export default function OrdersTab() {
  return (
    <section className="profile-section profile-card profile-tab-card">
      <div className="profile-section-header">
        <h2>MIS PEDIDOS</h2>
      </div>
      <div className="profile-empty-state">
        <p>Aún no tienes pedidos registrados.</p>
        <Link to="/tienda" className="profile-cta">
          EXPLORAR TIENDA -&gt;
        </Link>
      </div>
    </section>
  );
}
