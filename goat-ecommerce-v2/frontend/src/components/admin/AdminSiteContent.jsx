import React, { useEffect, useState } from "react";
import {
  getSiteContent,
  SITE_CONTENT_KEYS,
  SITE_CONTENT_FALLBACKS,
  uploadSiteContentImage,
} from "../../services/siteContentService";
import "../../styles/admin-site-content.css";

const CONTENT_ITEMS = [
  {
    key: SITE_CONTENT_KEYS.shopFeatured,
    title: "Camisetas",
    description: "Imagen destacada del menú Tienda.",
  },
  {
    key: SITE_CONTENT_KEYS.collectionVerano,
    title: "Primavera / Verano",
    description: "Tarjeta de colección Verano '26.",
  },
  {
    key: SITE_CONTENT_KEYS.collectionInvierno,
    title: "Otoño / Invierno",
    description: "Tarjeta de colección Drop 02.",
  },
  {
    key: SITE_CONTENT_KEYS.collectionExclusiva,
    title: "Prendas Exclusiva",
    description: "Tarjeta de colección de edición limitada.",
  },
];

export default function AdminSiteContent() {
  const [content, setContent] = useState(SITE_CONTENT_FALLBACKS);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadContent() {
      setContent(await getSiteContent());
      setLoading(false);
    }

    loadContent();
  }, []);

  const handleUpload = async (key, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSavingKey(key);
      setError("");
      setSuccess("");
      const imageUrl = await uploadSiteContentImage(key, file);
      setContent((current) => ({ ...current, [key]: imageUrl }));
      setSuccess("Imagen actualizada correctamente.");
    } catch (uploadError) {
      setError(uploadError.message || "No se pudo actualizar la imagen.");
    } finally {
      setSavingKey(null);
      event.target.value = "";
    }
  };

  return (
    <section className="admin-site-content">
      <div className="admin-site-content-header">
        <div>
          <p className="admin-products-kicker">Panel</p>
          <h2>Contenido del Header</h2>
          <p>Gestiona las imágenes de los menús desplegables.</p>
        </div>
      </div>

      {error && <div className="admin-error-msg">{error}</div>}
      {success && <div className="admin-success-msg">{success}</div>}

      {loading ? (
        <p className="admin-empty-state">Cargando contenido...</p>
      ) : (
        <div className="admin-site-content-grid">
          {CONTENT_ITEMS.map((item) => (
            <article className="admin-site-content-card" key={item.key}>
              <div className="admin-site-content-preview">
                <img src={content[item.key]} alt={item.title} />
              </div>
              <div className="admin-site-content-card-body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <label className="admin-site-content-upload">
                  <span>
                    {savingKey === item.key
                      ? "Subiendo..."
                      : "Reemplazar imagen"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={savingKey !== null}
                    onChange={(event) => handleUpload(item.key, event)}
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
