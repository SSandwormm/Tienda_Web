import React, { useEffect, useState, useRef } from "react";
import { getProducts } from "../services/productService.js";
import EditorialProductGrid from "../components/product/EditorialProductGrid.jsx";
import SectionHeader from "../components/layout/SectionHeader.jsx";
import { getCarouselImages } from "../services/carouselService.js";

const SCROLL_FRAMES = Array.from(
  { length: 40 },
  (_, i) =>
    `http://localhost:4000/uploads/scroll-animation/video_${String(i).padStart(3, "0")}.jpg`,
);

export default function Home() {
  const [masVendido, setMasVendido] = useState([]);
  const [novedades, setNovedades] = useState([]);
  const [disponible, setDisponible] = useState([]);
  const [precioEspecial, setPrecioEspecial] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getProducts("mas-vendido").then((data) =>
        setMasVendido(data.products || []),
      ),
      getProducts("novedades").then((data) =>
        setNovedades(data.products || []),
      ),
      getProducts("disponible").then((data) =>
        setDisponible(data.products || []),
      ),
      getProducts("precio-especial").then((data) =>
        setPrecioEspecial(data.products || []),
      ),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getCarouselImages()
      .then(setCarouselImages)
      .catch((error) => console.error("Error cargando carrusel:", error));
  }, []);

  // Precargar imágenes
  useEffect(() => {
    SCROLL_FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Animación de scroll - con throttle para mejor performance
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!heroRef.current) return;

          const heroRect = heroRef.current.getBoundingClientRect();
          const heroHeight = heroRect.height;
          const scrollProgress = Math.max(
            0,
            Math.min(1, -heroRect.top / heroHeight),
          );
          const frameIndex = Math.min(
            SCROLL_FRAMES.length - 1,
            Math.floor(scrollProgress * SCROLL_FRAMES.length),
          );

          setCurrentFrame(frameIndex);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-page">
      {/* Scroll Animation Hero */}
      <section className="hero-fullscreen" ref={heroRef}>
        <img
          src={SCROLL_FRAMES[currentFrame]}
          alt="Scroll animation"
          className="hero-image"
        />
        <div className="hero-content">
          <h1 className="hero-eyebrow">GOAT STUDIOS</h1>
          <span className="scroll-text">SCROLL PARA ANIMAR</span>
        </div>
      </section>

      {/* Novedades */}
      <section className="page-section">
        <SectionHeader title="Novedades" to="/novedades" />
        {loading ? (
          <div className="page-loading">Cargando novedades...</div>
        ) : (
          <EditorialProductGrid products={novedades} />
        )}
      </section>

      <section
        className="home-image-carousel"
        aria-label="Galería de novedades"
      >
        <div className="home-image-carousel-track">
          {carouselImages.map((item, index) => (
            <figure
              className="home-image-carousel-slide"
              key={item.id || item.image_url}
            >
              <img
                src={item.image_url}
                alt={item.overlay_text || `Editorial GOAT ${index + 1}`}
                loading="lazy"
              />
              {item.overlay_text && (
                <figcaption>{item.overlay_text}</figcaption>
              )}
            </figure>
          ))}
        </div>
      </section>

      {/* Más Vendido */}
      <section className="page-section">
        <SectionHeader
          title="Más vendido"
          to="/tienda/mas-vendido"
          description="Descubre los favoritos de nuestra comunidad."
        />
        {loading ? (
          <div className="page-loading">Cargando productos...</div>
        ) : (
          <EditorialProductGrid products={masVendido} largeOnLeft />
        )}
      </section>

      <section className="page-section">
        <SectionHeader title="Disponible" to="/tienda/disponible" />
        {loading ? (
          <div className="page-loading">Cargando productos...</div>
        ) : (
          <EditorialProductGrid products={disponible} simple />
        )}
      </section>

      <section className="page-section">
        <SectionHeader title="Precio especial" to="/tienda/precio-especial" />
        {loading ? (
          <div className="page-loading">Cargando productos...</div>
        ) : (
          <EditorialProductGrid products={precioEspecial} simple />
        )}
      </section>
    </div>
  );
}
