import React from "react";
import { Link } from "react-router-dom";

const collections = [
  {
    id: "primavera-verano",
    title: "Primavera / Verano",
    description:
      "Capas ligeras, colores naturales y cortes relajados para la temporada cálida.",
  },
  {
    id: "otono-invierno",
    title: "Otoño / Invierno",
    description: "Prendas versátiles con textura, abrigos y sudaderas premium.",
  },
  {
    id: "prendas-exclusiva",
    title: "Prendas exclusivas",
    description:
      "Ediciones limitadas pensadas para clientes que buscan piezas únicas.",
  },
];

export default function Collections() {
  return (
    <section className="page-section collections-page">
      <div className="section-panel">
        <h1 className="section-title">Colecciones</h1>
        <p className="section-copy">
          Explora nuestras colecciones por temporada y descubre las piezas
          pensadas para cada momento.
        </p>
      </div>
      <div className="collection-grid">
        {collections.map((item) => (
          <article id={item.id} key={item.id} className="collection-card">
            <div className="collection-image-placeholder">{item.title}</div>
            <div className="card-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link
                to={`/colecciones#${item.id}`}
                className="link-button secondary"
              >
                Ver colección
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
