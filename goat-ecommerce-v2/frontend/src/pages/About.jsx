import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function SobreNosotros() {
  return (
    <>
      <Header />

      <main className="about-page">
        {/* HERO */}
        <section className="about-hero">
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <span>GOATSTUDIOS</span>

            <h1>NUESTRA HISTORIA</h1>

            <p>
              Una exploración de identidad, diseño y movimiento nacida en el
              corazón de la cultura urbana.
            </p>
          </div>
        </section>

        {/* HISTORIA */}
        <section className="story-section">
          <div className="story-grid">
            <div className="story-image">
              <img src="../img/ferrari.jpeg" alt="GOAT" />
            </div>

            <div className="story-text">
              <span>01 / ORIGEN</span>

              <h2>LA VISIÓN DETRÁS DE GOAT.</h2>

              <p>
                GOAT nace como una propuesta de diseño independiente enfocada en
                la cultura urbana, el minimalismo y la autenticidad.
              </p>

              <p>
                Cada colección es desarrollada con atención al detalle y una
                narrativa propia.
              </p>
            </div>
          </div>
        </section>

        {/* SEGUNDA FILA */}
        <section className="story-section">
          <div className="story-grid reverse">
            <div className="story-image">
              <img src="../img/g63.jpeg" alt="GOAT" />
            </div>

            <div className="story-text">
              <span>02 / IDENTIDAD</span>

              <h2>MÁS QUE ROPA.</h2>

              <p>
                Creamos piezas que transmiten identidad, movimiento y expresión
                personal.
              </p>

              <p>
                GOAT representa una comunidad que encuentra significado en los
                detalles.
              </p>
            </div>
          </div>
        </section>

        {/* FRASE */}
        <section className="quote-section">
          <blockquote>
            "GOAT nace para quienes entienden que la verdadera identidad se
            construye en los detalles."
          </blockquote>

          <span>GOATSTUDIOS</span>
        </section>

        {/* PILARES */}
        <section className="pillars-section">
          <h2>Pilares de identidad</h2>

          <div className="pillars-grid">
            <article className="pillar-card">
              <h3>Materiales nobles</h3>

              <p>
                Seleccionamos materiales de calidad para garantizar durabilidad.
              </p>
            </article>

            <article className="pillar-card">
              <h3>Sostenibilidad</h3>

              <p>
                Producción consciente y enfoque responsable en cada colección.
              </p>
            </article>

            <article className="pillar-card">
              <h3>Diseño atemporal</h3>

              <p>Estética minimalista que permanece vigente con el tiempo.</p>
            </article>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <h2>ÚNETE AL ARCHIVO</h2>

          <p>Descubre nuevas colecciones antes que nadie.</p>

          <button>SUSCRIBIRME</button>
        </section>
      </main>
    </>
  );
}
