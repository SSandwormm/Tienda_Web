import React, { useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function Colecciones() {
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el)
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          200,
        );
    }
  }, []);

  return (
    <div className="colecciones-page">
      <Header />
      <main className="colecciones-main">
        <header className="colecciones-hero">
          <h1>Todas las Colecciones</h1>
          <p>
            Temporada 2026 — piezas de edición limitada, drops exclusivos y
            campañas por estación en un solo lugar.
          </p>
        </header>

        <section
          className="colecciones-grid"
          aria-label="Colecciones destacadas"
        >
          <a
            href="#primavera-verano"
            className="coleccion-card"
            id="card-primavera-verano"
          >
            <img src="/img/img_about2.png" alt="Colección Primavera Verano" />
            <div className="coleccion-card-overlay">
              <span className="coleccion-tag">Temporada 2026</span>
              <h2>Primavera / Verano</h2>
              <p>
                Tejidos ligeros, cortes relajados y paleta cálida para el verano
                '26.
              </p>
              <span className="coleccion-card-cta">Ver colección →</span>
            </div>
          </a>

          <a
            href="#otono-invierno"
            className="coleccion-card"
            id="card-otono-invierno"
          >
            <img
              src="/img/Virtualthreads (23).png"
              alt="Colección Otoño Invierno"
            />
            <div className="coleccion-card-overlay">
              <span className="coleccion-tag">Temporada 2026</span>
              <h2>Otoño / Invierno</h2>
              <p>
                Capas estructuradas, felpas pesadas y tonos neutros para el
                frío.
              </p>
              <span className="coleccion-card-cta">Ver colección →</span>
            </div>
          </a>

          <a
            href="#prendas-exclusiva"
            className="coleccion-card"
            id="card-prendas-exclusiva"
          >
            <img src="/img/Virtualthreads (28).png" alt="Prendas exclusivas" />
            <div className="coleccion-card-overlay">
              <span className="coleccion-tag">Edición limitada</span>
              <h2>Prendas Exclusiva</h2>
              <p>
                Prototipos y drops numerados disponibles solo por tiempo
                limitado.
              </p>
              <span className="coleccion-card-cta">Ver colección →</span>
            </div>
          </a>
        </section>

        <section
          className="coleccion-detalle"
          aria-label="Detalle de colecciones"
        >
          <article className="coleccion-detalle-item" id="primavera-verano">
            <div className="coleccion-detalle-header">
              <h2>Primavera / Verano</h2>
              <span>Drop 01 — 2026</span>
            </div>
            <div className="product-grid">
              <p className="tienda-empty">
                Productos de esta colección próximamente.
              </p>
            </div>
          </article>

          <article className="coleccion-detalle-item" id="otono-invierno">
            <div className="coleccion-detalle-header">
              <h2>Otoño / Invierno</h2>
              <span>Drop 02 — 2026</span>
            </div>
            <div className="product-grid">
              <p className="tienda-empty">
                Productos de esta colección próximamente.
              </p>
            </div>
          </article>

          <article className="coleccion-detalle-item" id="prendas-exclusiva">
            <div className="coleccion-detalle-header">
              <h2>Prendas Exclusiva</h2>
              <span>Edición limitada</span>
            </div>
            <div className="product-grid">
              <p className="tienda-empty">
                Productos de esta colección próximamente.
              </p>
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}
