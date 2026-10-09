import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";
import {
  PRODUCT_TYPES,
  getProductType,
  getProductTypeLabel,
} from "../../config/productTypes.js";
import "../../styles/admin-products.css";

const PRODUCT_CATEGORIES = [
  { value: "novedades", label: "Novedades" },
  { value: "mas-vendido", label: "Mas-Vendido" },
  { value: "hombre", label: "Hombre" },
  { value: "mujer", label: "Mujer" },
  { value: "accesorios", label: "Accesorios" },
  { value: "general", label: "General" },
];

const createEmptyForm = () => ({
  name: "",
  description: "",
  product_type: "camiseta",
  material: "",
  price: "",
  stock: "",
  color: "",
  categories: ["novedades"],
  variants: {},
  images: [],
});

const imageToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 6;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const revokeImagePreview = (image) => {
  if (image?.preview?.startsWith("blob:")) {
    URL.revokeObjectURL(image.preview);
  }
};

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(createEmptyForm());
  const [imageError, setImageError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const imageInputRef = useRef(null);
  const imagesRef = useRef([]);

  const productType = getProductType(formData.product_type);
  const totalStock = useMemo(() => {
    if (productType.sizes.length) {
      return productType.sizes.reduce(
        (total, size) => total + (Number(formData.variants[size]?.stock) || 0),
        0,
      );
    }
    return Number(formData.stock) || 0;
  }, [formData.stock, formData.variants, productType.sizes]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    imagesRef.current = formData.images;
  }, [formData.images]);

  useEffect(() => () => imagesRef.current.forEach(revokeImagePreview), []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data.products || []);
    } catch (err) {
      setError("Error al cargar productos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCategoryToggle = (category) => {
    setFormData((prev) => {
      const selected = new Set(prev.categories || []);

      if (selected.has(category)) {
        selected.delete(category);
      } else {
        selected.add(category);
      }

      const nextCategories = Array.from(selected);
      return {
        ...prev,
        categories: nextCategories.length ? nextCategories : ["general"],
      };
    });
  };

  const handleTypeChange = (product_type) => {
    setFormData((prev) => ({
      ...prev,
      product_type,
      variants: {},
      stock: "",
    }));
    setFormErrors((prev) => ({ ...prev, product_type: "" }));
  };

  const addImages = async (files) => {
    const selectedFiles = Array.from(files || []);
    if (!selectedFiles.length) return;

    if (formData.images.length + selectedFiles.length > MAX_IMAGES) {
      setImageError(
        `Puedes cargar máximo ${MAX_IMAGES} imágenes por producto.`,
      );
      return;
    }

    const invalid = selectedFiles.find(
      (file) =>
        !ALLOWED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_SIZE,
    );
    if (invalid) {
      setImageError("Solo se aceptan imágenes JPG, PNG o WEBP de máximo 5 MB.");
      return;
    }

    try {
      const newImages = await Promise.all(
        selectedFiles.map(async (file) => ({
          id: `${file.name}-${file.lastModified}-${Math.random()}`,
          name: file.name,
          preview: URL.createObjectURL(file),
          dataUrl: await imageToDataUrl(file),
          file,
          isPrimary: false,
        })),
      );
      setFormData((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          ...newImages.map((image, index) => ({
            ...image,
            isPrimary: prev.images.length === 0 && index === 0,
          })),
        ],
      }));
      setImageError("");
      setFormErrors((prev) => ({ ...prev, images: "" }));
    } catch {
      setImageError("No se pudieron leer las imágenes seleccionadas.");
    }
  };

  const handleImageChange = (e) => addImages(e.target.files);

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    addImages(event.dataTransfer.files);
  };

  const setPrimaryImage = (id) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((image) => ({
        ...image,
        isPrimary: image.id === id,
      })),
    }));
  };

  const removeImage = (id) => {
    setFormData((prev) => {
      const removedImage = prev.images.find((image) => image.id === id);
      revokeImagePreview(removedImage);
      const images = prev.images
        .filter((image) => image.id !== id)
        .map((image) => ({ ...image }));
      if (images.length && !images.some((image) => image.isPrimary)) {
        images[0] = { ...images[0], isPrimary: true };
      }
      return { ...prev, images };
    });
  };

  const updateVariant = (size, value) => {
    setFormData((prev) => ({
      ...prev,
      variants: {
        ...prev.variants,
        [size]: {
          ...(prev.variants[size] || {}),
          size,
          stock: value,
        },
      },
    }));
  };

  const resetForm = () => {
    formData.images.forEach(revokeImagePreview);
    setFormData(createEmptyForm());
    setEditingId(null);
    setFormErrors({});
    setImageError("");
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "El nombre es obligatorio.";
    if (!formData.product_type) errors.product_type = "Elige un tipo.";
    if (!(Number(formData.price) > 0))
      errors.price = "El precio debe ser mayor a 0.";
    if (!formData.categories.length)
      errors.categories = "Elige al menos una categoría.";
    if (!formData.images.length) errors.images = "Agrega al menos una imagen.";

    const stocks = productType.sizes.length
      ? productType.sizes.map((size) =>
          Number(formData.variants[size]?.stock || 0),
        )
      : [Number(formData.stock)];
    if (stocks.some((stock) => !Number.isInteger(stock) || stock < 0)) {
      errors.stock = "El stock debe ser un número entero mayor o igual a 0.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      if (!validateForm()) {
        setSaving(false);
        return;
      }

      const variants = productType.sizes.length
        ? productType.sizes
            .map((size) => ({
              size,
              stock: Number(formData.variants[size]?.stock) || 0,
              color: formData.variants[size]?.color || "",
            }))
            .filter((variant) => formData.variants[variant.size]?.stock !== "")
        : [
            {
              size: "Única",
              stock: Number(formData.stock) || 0,
              color: formData.color,
            },
          ];

      const imageFiles = formData.images
        .map((image) => image.file)
        .filter(Boolean);
      const payload = {
        ...formData,
        variants,
        future_drop: false,
        stock: totalStock,
        image_url:
          formData.images.find((image) => image.isPrimary)?.preview ||
          formData.images[0]?.preview ||
          "/placeholder.svg",
        image:
          formData.images.find((image) => image.isPrimary)?.preview ||
          formData.images[0]?.preview ||
          "/placeholder.svg",
      };

      if (editingId) {
        await updateProduct(editingId, payload, imageFiles, token);
      } else {
        await createProduct(payload, imageFiles, token);
      }

      const keepType = e.nativeEvent.submitter?.name === "save-and-new";
      const savedType = formData.product_type;
      resetForm();
      if (keepType) {
        setFormData((prev) => ({ ...prev, product_type: savedType }));
      }
      await fetchProducts();
      setSuccess("Producto guardado correctamente.");
    } catch (err) {
      setError(
        err.message ||
          (editingId
            ? "No se pudo actualizar el producto."
            : "No se pudo guardar el producto."),
      );
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    const variants = Array.isArray(product.variants)
      ? product.variants.reduce((result, variant) => {
          result[variant.size] = variant;
          return result;
        }, {})
      : {};
    const productImages = Array.isArray(product.images)
      ? product.images
      : [product.image_url || product.image].filter(Boolean);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      product_type: product.product_type || "camiseta",
      material: product.material || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      color: product.color || "",
      categories: Array.isArray(product.categories)
        ? product.categories
        : ["novedades"],
      variants,
      images: productImages.map((image, index) => ({
        id: `${product.id}-${index}`,
        name: `Imagen ${index + 1}`,
        preview: typeof image === "string" ? image : image.preview,
        isPrimary: index === 0,
      })),
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await deleteProduct(id, token);
      await fetchProducts();
    } catch (err) {
      setError("Error al eliminar producto");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <h2>Productos</h2>
        <span className="admin-products-count">
          {products.length} {products.length === 1 ? "producto" : "productos"}
        </span>
      </div>

      {error && <div className="admin-error-msg">{error}</div>}
      {success && <div className="admin-success-msg">{success}</div>}

      <div className="admin-form-card">
        <div className="admin-form-heading">
          <h3>{editingId ? "Editar producto" : "Nuevo producto"}</h3>
          {editingId && (
            <button
              type="button"
              className="admin-cancel-btn"
              onClick={resetForm}
            >
              Cancelar edición
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="admin-product-form">
          <div className="admin-type-selector">
            <span className="admin-field-label">Tipo de producto</span>
            <div className="admin-type-options">
              {Object.entries(PRODUCT_TYPES).map(([value, type]) => (
                <button
                  key={value}
                  type="button"
                  className={`admin-type-chip ${formData.product_type === value ? "selected" : ""}`}
                  onClick={() => handleTypeChange(value)}
                >
                  {type.label}
                </button>
              ))}
            </div>
            {formErrors.product_type && (
              <small className="admin-field-error">
                {formErrors.product_type}
              </small>
            )}
          </div>

          <div className="admin-product-main-grid">
            <div className="admin-form-grid">
              <div className="admin-form-field">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {formErrors.name && (
                  <small className="admin-field-error">{formErrors.name}</small>
                )}
              </div>

              <div className="admin-form-field">
                <label htmlFor="price">Precio</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                {formErrors.price && (
                  <small className="admin-field-error">
                    {formErrors.price}
                  </small>
                )}
              </div>

              <div className="admin-form-field">
                <label htmlFor="material">Material</label>
                <input
                  id="material"
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="color">Color</label>
                <input
                  id="color"
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-image-uploader">
              <span className="admin-field-label">Imágenes del producto</span>
              <div
                className={`admin-dropzone ${dragActive ? "is-dragging" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => imageInputRef.current?.click()}
              >
                <strong>Arrastra imágenes aquí</strong>
                <span>o haz clic para seleccionarlas (máximo 5 MB)</span>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </div>
              {formData.images.length > 0 && (
                <div className="admin-image-previews">
                  {formData.images.map((image) => (
                    <div
                      className={`admin-image-preview ${image.isPrimary ? "is-primary" : ""}`}
                      key={image.id}
                    >
                      <img src={image.preview} alt={image.name} />
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(image.id)}
                      >
                        {image.isPrimary ? "Principal" : "Usar principal"}
                      </button>
                      <button
                        type="button"
                        className="admin-image-remove"
                        onClick={() => removeImage(image.id)}
                        aria-label={`Eliminar ${image.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {(imageError || formErrors.images) && (
                <small className="admin-field-error">
                  {imageError || formErrors.images}
                </small>
              )}
            </div>
          </div>

          <section className="admin-form-section">
            <div className="admin-section-heading">
              <span className="admin-field-label">Inventario por talla</span>
              <strong>Stock total: {totalStock}</strong>
            </div>
            {productType.sizes.length ? (
              <div className="admin-variant-grid">
                {productType.sizes.map((size) => (
                  <label className="admin-variant-field" key={size}>
                    <span>{size}</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.variants[size]?.stock ?? ""}
                      onChange={(event) =>
                        updateVariant(size, event.target.value)
                      }
                      placeholder="0"
                    />
                  </label>
                ))}
              </div>
            ) : (
              <div className="admin-form-field admin-single-stock">
                <label htmlFor="stock">Stock</label>
                <input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            )}
            {formErrors.stock && (
              <small className="admin-field-error">{formErrors.stock}</small>
            )}
          </section>

          <section className="admin-form-section">
            <div className="admin-section-heading">
              <span className="admin-field-label">Categorías</span>
              <span className="admin-section-hint">
                Selecciona una o varias
              </span>
            </div>
            <div className="category-checkboxes">
              {PRODUCT_CATEGORIES.map((category) => (
                <label key={category.value} className="category-checkbox">
                  <input
                    type="checkbox"
                    checked={(formData.categories || []).includes(
                      category.value,
                    )}
                    onChange={() => handleCategoryToggle(category.value)}
                  />
                  <span>{category.label}</span>
                </label>
              ))}
            </div>
            {formErrors.categories && (
              <small className="admin-field-error">
                {formErrors.categories}
              </small>
            )}
          </section>

          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-submit-btn"
              disabled={saving}
            >
              {saving
                ? editingId
                  ? "Actualizando..."
                  : "Guardando..."
                : editingId
                  ? "Guardar cambios"
                  : "Añadir Producto"}
            </button>
            {!editingId && (
              <button
                type="submit"
                name="save-and-new"
                className="admin-secondary-btn"
              >
                Añadir y crear otro
              </button>
            )}
            <button
              type="button"
              className="admin-cancel-btn"
              onClick={resetForm}
            >
              Limpiar
            </button>
            {editingId && (
              <button
                type="button"
                className="admin-cancel-btn"
                onClick={resetForm}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-products-grid-section">
        <div className="admin-products-section-header">
          <h3>Inventario</h3>
        </div>
        {loading && !saving ? (
          <p className="admin-empty-state">Cargando productos...</p>
        ) : (
          <div
            className="admin-product-table"
            role="table"
            aria-label="Productos del inventario"
          >
            <div className="admin-product-table-header" role="row">
              <span role="columnheader">Imagen</span>
              <span role="columnheader">Nombre</span>
              <span role="columnheader">Tipo</span>
              <span role="columnheader">Categoría</span>
              <span role="columnheader">Precio</span>
              <span role="columnheader">Stock</span>
              <span role="columnheader" className="admin-actions-column">
                Acciones
              </span>
            </div>

            {products.map((p) => (
              <div key={p.id} className="admin-product-row" role="row">
                <div className="admin-product-thumb" role="cell">
                  <img src={p.image_url} alt={p.name} />
                </div>
                <div className="admin-product-name" role="cell">
                  <strong>{p.name}</strong>
                  <small>{p.material || "Material no indicado"}</small>
                </div>
                <div className="admin-product-category" role="cell">
                  {getProductTypeLabel(p.product_type)}
                </div>
                <div className="admin-product-category" role="cell">
                  {p.categories && p.categories.length
                    ? p.categories.join(", ")
                    : p.category || "general"}
                </div>
                <div className="admin-product-price" role="cell">
                  ${p.price}
                </div>
                <div className="admin-product-stock" role="cell">
                  {p.stock}
                </div>
                <div className="admin-product-actions" role="cell">
                  <button className="edit-btn" onClick={() => handleEdit(p)}>
                    Editar
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(p.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <p className="no-products">No hay productos registrados.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
