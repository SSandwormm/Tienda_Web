import React, { useEffect, useState } from "react";
import {
  getCarouselImages,
  saveCarouselImage,
  updateCarouselText,
} from "../../services/carouselService.js";
import "../../styles/admin-site-content.css";

const EMPTY_ITEMS = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  image_url: "",
  overlay_text: "",
  display_order: index + 1,
}));

export default function AdminCarousel() {
  const [items, setItems] = useState(EMPTY_ITEMS);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getCarouselImages()
      .then((rows) => {
        setItems(
          EMPTY_ITEMS.map(
            (empty) => rows.find((row) => row.id === empty.id) || empty,
          ),
        );
      })
      .catch((loadError) =>
        setError(loadError.message || "No se pudo cargar el carrusel."),
      )
      .finally(() => setLoading(false));
  }, []);

  const updateText = (id, value) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, overlay_text: value } : item,
      ),
    );
  };

  const saveText = async (item) => {
    if (!item.image_url) return;
    try {
      setSavingId(item.id);
      setError("");
      await updateCarouselText(item.id, item.overlay_text);
      setSuccess("Carrusel actualizado correctamente.");
    } catch (saveError) {
      setError(saveError.message || "No se pudo guardar el texto.");
    } finally {
      setSavingId(null);
    }
  };

  const upload = async (item, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setSavingId(item.id);
      setError("");
      const saved = await saveCarouselImage(item.id, file, item.overlay_text);
      setItems((current) =>
        current.map((entry) => (entry.id === item.id ? saved : entry)),
      );
      setSuccess("Imagen del carrusel actualizada.");
    } catch (uploadError) {
      setError(uploadError.message || "No se pudo subir la imagen.");
    } finally {
      setSavingId(null);
      event.target.value = "";
    }
  };

  return (
    <section className="admin-site-content">
      <div className="admin-site-content-header">
        <div>
          <p className="admin-products-kicker">Panel</p>
          <h2>Carrusel de Novedades</h2>
          <p>Administra las seis imágenes y sus textos superpuestos.</p>
        </div>
      </div>
      {error && <div className="admin-error-msg">{error}</div>}
      {success && <div className="admin-success-msg">{success}</div>}
      {loading ? (
        <p className="admin-empty-state">Cargando carrusel...</p>
      ) : (
        <div className="admin-site-content-grid">
          {items.map((item, index) => (
            <article className="admin-site-content-card" key={item.id}>
              <div className="admin-site-content-preview">
                {item.image_url ? (
                  <img src={item.image_url} alt={`Carrusel ${index + 1}`} />
                ) : (
                  <span>Imagen {index + 1}</span>
                )}
              </div>
              <div className="admin-site-content-card-body">
                <h3>Imagen {index + 1}</h3>
                <input
                  value={item.overlay_text || ""}
                  onChange={(event) => updateText(item.id, event.target.value)}
                  placeholder="Texto superpuesto opcional"
                />
                <button
                  type="button"
                  className="admin-submit-btn"
                  disabled={savingId === item.id || !item.image_url}
                  onClick={() => saveText(item)}
                >
                  {savingId === item.id ? "Guardando..." : "Guardar texto"}
                </button>
                <label className="admin-site-content-upload">
                  <span>
                    {savingId === item.id
                      ? "Subiendo..."
                      : "Subir / reemplazar imagen"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={savingId !== null}
                    onChange={(event) => upload(item, event)}
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
