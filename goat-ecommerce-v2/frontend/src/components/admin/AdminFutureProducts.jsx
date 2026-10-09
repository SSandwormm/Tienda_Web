import React, { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../services/productService.js";
import "../../styles/admin-products.css";
import {
  getFutureDropConfig,
  saveFutureDropConfig,
} from "../../services/futureDropService.js";

const emptyForm = {
  name: "",
  description: "",
  tag: "",
  drop_label: "",
  image_url: "",
};

function readImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminFutureProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [savingTarget, setSavingTarget] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const result = await getProducts("prendas-futuras");
      setProducts(result.products || []);
    } catch {
      setError("No se pudieron cargar las prendas futuras.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    getFutureDropConfig()
      .then((config) => {
        if (config?.target_date) {
          setTargetDate(config.target_date.slice(0, 16));
        }
      })
      .catch(() => setError("No se pudo cargar la fecha del contador."));
  }, []);

  const saveTarget = async (event) => {
    event.preventDefault();
    try {
      setSavingTarget(true);
      setError("");
      const config = await saveFutureDropConfig(targetDate);
      setTargetDate(config.target_date.slice(0, 16));
    } catch (saveError) {
      setError(
        saveError.message || "No se pudo guardar la fecha del contador.",
      );
    } finally {
      setSavingTarget(false);
    }
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!editingId && products.length >= 3) {
      setError("Ya alcanzaste el máximo de 3 prendas futuras activas.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const image = await readImage(form.imageFile);
      const payload = {
        ...form,
        image_url: image || form.image_url || "/placeholder.svg",
        categories: ["prendas-futuras"],
        category: "prendas-futuras",
        future_drop: true,
      };
      if (editingId) await updateProduct(editingId, payload);
      else await createProduct(payload);
      reset();
      await load();
    } catch (saveError) {
      setError(saveError.message || "No se pudo guardar la prenda.");
    } finally {
      setSaving(false);
    }
  };

  const edit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      tag: product.tag || product.badge || "",
      drop_label: product.drop_label || product.drop || "",
      image_url: product.image_url || product.image || "",
    });
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar esta prenda futura?")) return;
    await deleteProduct(id);
    await load();
  };

  return (
    <section className="admin-products">
      <div className="admin-products-header">
        <div>
          <p className="admin-products-kicker">Showroom</p>
          <h2>Prendas Futuras</h2>
        </div>
        <span className="admin-products-count">
          {products.length} / 3 activas
        </span>
      </div>
      {error && <div className="admin-error-msg">{error}</div>}
      <div className="admin-form-card">
        <h3>Cuenta regresiva principal</h3>
        <form onSubmit={saveTarget} className="admin-product-form">
          <div className="admin-form-field">
            <label htmlFor="future-drop-target">Fecha y hora objetivo</label>
            <input
              id="future-drop-target"
              type="datetime-local"
              value={targetDate}
              onChange={(event) => setTargetDate(event.target.value)}
              required
            />
          </div>
          <div className="admin-form-actions">
            <button
              className="admin-submit-btn"
              type="submit"
              disabled={savingTarget}
            >
              {savingTarget ? "Guardando..." : "Guardar contador"}
            </button>
          </div>
        </form>
      </div>
      <div className="admin-form-card">
        <h3>{editingId ? "Editar prenda futura" : "Añadir prenda futura"}</h3>
        <form onSubmit={submit} className="admin-product-form">
          <div className="admin-form-grid">
            <label className="admin-form-field">
              Nombre
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                required
              />
            </label>
            <label className="admin-form-field">
              Tag sobre imagen
              <input
                name="tag"
                value={form.tag}
                onChange={updateField}
                placeholder="PRUEBA DE FIT"
                required
              />
            </label>
            <label className="admin-form-field">
              Drop
              <input
                name="drop_label"
                value={form.drop_label}
                onChange={updateField}
                placeholder="DROP 04 / JUNIO"
                required
              />
            </label>
            <label className="admin-form-field admin-form-field-wide">
              Descripción
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows="3"
                required
              />
            </label>
            <label className="file-label">
              <span className="admin-field-label">Imagen del producto</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    imageFile: event.target.files?.[0],
                  }))
                }
              />
            </label>
          </div>
          <div className="admin-form-actions">
            <button
              className="admin-submit-btn"
              type="submit"
              disabled={saving || (!editingId && products.length >= 3)}
            >
              {saving
                ? "Guardando..."
                : editingId
                  ? "Guardar cambios"
                  : products.length >= 3
                    ? "Límite alcanzado"
                    : "Publicar prenda"}
            </button>
            {editingId && (
              <button
                className="admin-cancel-btn"
                type="button"
                onClick={reset}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="admin-products-grid-section">
        <div className="admin-products-section-header">
          <h3>Prototipos activos</h3>
        </div>
        {loading ? (
          <p className="admin-empty-state">Cargando prendas...</p>
        ) : (
          products.map((product) => (
            <div className="admin-product-row" key={product.id}>
              <div className="admin-product-thumb">
                <img
                  src={product.image_url || product.image}
                  alt={product.name}
                />
              </div>
              <div className="admin-product-name">
                <strong>{product.name}</strong>
                <small>{product.tag || product.badge}</small>
              </div>
              <div className="admin-product-category">
                {product.votes || 0} votos
              </div>
              <div className="admin-product-actions">
                <button className="edit-btn" onClick={() => edit(product)}>
                  Editar
                </button>
                <button
                  className="delete-btn"
                  onClick={() => remove(product.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
