import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productService.js";
import FutureProductCard from "../components/product/FutureProductCard.jsx";
import { getFutureDropConfig } from "../services/futureDropService.js";

function getTimeLeft(target) {
  const diff = Math.max(0, target.getTime() - Date.now());

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(value) {
  return String(value).padStart(2, "0");
}

export default function PrendasFuturas() {
  const [dropTarget, setDropTarget] = useState(null);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(new Date()));
  const [email, setEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [futureProducts, setFutureProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFutureDropConfig()
      .then((config) => setDropTarget(config?.target_date || null))
      .catch((error) =>
        console.error("Error cargando la fecha del drop:", error),
      );
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(dropTarget ? new Date(dropTarget) : new Date()));
    }, 1000);

    setTimeLeft(getTimeLeft(dropTarget ? new Date(dropTarget) : new Date()));
    return () => clearInterval(timer);
  }, [dropTarget]);

  useEffect(() => {
    let active = true;

    async function loadFutureProducts() {
      try {
        setLoading(true);
        const data = await getProducts("prendas-futuras");
        if (active) {
          setFutureProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error cargando prendas futuras:", error);
        if (active) setFutureProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadFutureProducts();

    return () => {
      active = false;
    };
  }, []);

  const handleEarlyAccess = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setFormMessage("Ingresa un correo válido para unirte a la lista.");
      return;
    }

    setFormMessage("¡Listo! Te avisaremos cuando el drop esté disponible.");
    setEmail("");
  };

  return (
    <section className="future-page">
      <div className="future-page-inner">
        <div className="future-hero">
          <span className="future-eyebrow">SHOWROOM CONCEPTUAL</span>
          <h1>PRENDAS FUTURAS</h1>
          <p>
            Drops de edición limitada y prototipos de diseño. Explora el archivo
            en desarrollo y vota por tus favoritos para acelerar su producción.
          </p>

          <div
            className="future-countdown"
            aria-label="Cuenta regresiva para el próximo drop"
          >
            <div className="future-countdown-item">
              <strong>{pad(timeLeft.days)}</strong>
              <span>DÍAS</span>
            </div>
            <div className="future-countdown-item">
              <strong>{pad(timeLeft.hours)}</strong>
              <span>HORAS</span>
            </div>
            <div className="future-countdown-item">
              <strong>{pad(timeLeft.minutes)}</strong>
              <span>MINS</span>
            </div>
            <div className="future-countdown-item">
              <strong>{pad(timeLeft.seconds)}</strong>
              <span>SEGS</span>
            </div>
          </div>
        </div>

        <div className="future-archive">
          <h2>ARCHIVO EN DESARROLLO</h2>

          {loading ? (
            <div className="future-loading">Cargando prototipos...</div>
          ) : (
            <div className="prendas-futuras-grid">
              {futureProducts.length > 0 ? (
                futureProducts.map((item) => (
                  <FutureProductCard
                    key={item.id ?? item.slug}
                    product={item}
                  />
                ))
              ) : (
                <div className="future-empty-state">
                  Aún no hay prototipos marcados como prendas futuras.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="future-early-access">
          <h2>ACCESO ANTICIPADO PRIORITARIO</h2>
          <p>
            Únete a la lista prioritaria para recibir acceso exclusivo antes del
            lanzamiento público y enterarte primero de los nuevos prototipos.
          </p>

          <form className="future-form" onSubmit={handleEarlyAccess}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button type="submit" className="future-cta">
              UNIRSE A LA LISTA DE ESPERA
            </button>
          </form>

          {formMessage && <p className="future-form-message">{formMessage}</p>}
        </div>
      </div>
    </section>
  );
}
