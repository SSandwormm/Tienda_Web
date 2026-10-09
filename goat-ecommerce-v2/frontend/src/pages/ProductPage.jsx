import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug, getProducts } from "../services/productService.js";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/format.js";
import ProductCard from "../components/product/ProductCard.jsx";
import { getProductType, getProductVariants } from "../config/productTypes.js";

const normalizeGalleryImages = (productItem = []) => {
  const imageSource =
    productItem.gallery_images ||
    productItem.images ||
    productItem.image_gallery ||
    productItem.image_url ||
    productItem.image ||
    "/placeholder.svg";

  if (Array.isArray(imageSource)) {
    return imageSource.filter(Boolean);
  }

  return [imageSource].filter(Boolean);
};

export default function ProductPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);

  const productType = getProductType(product?.product_type);
  const variants = productType.sizes.length ? getProductVariants(product) : [];
  const hasSizeVariants = variants.length > 0;
  const selectedVariant = variants.find(
    (variant) => variant.size === selectedSize,
  );
  const hasAvailableStock = hasSizeVariants
    ? variants.some((variant) => variant.stock > 0)
    : Number(product?.stock) > 0;
  const canAdd = hasSizeVariants
    ? Boolean(selectedVariant && selectedVariant.stock > 0)
    : hasAvailableStock;

  useEffect(() => {
    setLoading(true);
    getProductBySlug(slug)
      .then((data) => setProduct(data.product))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!product) return;

    const normalizedImages = normalizeGalleryImages(product);
    setGalleryImages(normalizedImages);
    setSelectedImage(normalizedImages[0] || "/placeholder.svg");

    const loadSuggestions = async () => {
      const { products = [] } = await getProducts();
      const purchasableProducts = products.filter(
        (item) => !Boolean(item.future_drop ?? item.is_future_drop),
      );

      const sameCategory = purchasableProducts.filter((item) => {
        const sameProduct = item.slug === product.slug;
        const sameCategoryMatch =
          item.category === product.category ||
          (Array.isArray(item.categories) &&
            item.categories.includes(product.category));

        return !sameProduct && sameCategoryMatch;
      });

      const allOtherProducts = purchasableProducts.filter(
        (item) => item.slug !== product.slug,
      );

      const categorySuggestions = sameCategory.slice(0, 4);
      const fallbackSuggestions = allOtherProducts.slice(0, 4);
      const mergedSuggestions = [...categorySuggestions, ...fallbackSuggestions]
        .filter(
          (item, index, arr) =>
            arr.findIndex((candidate) => candidate.slug === item.slug) ===
            index,
        )
        .slice(0, 4);

      setRelatedProducts(categorySuggestions);
      setSuggestedProducts(mergedSuggestions);
    };

    loadSuggestions();
  }, [product]);

  const handleAddToCart = () => {
    if (!canAdd) return;

    addItem({
      ...product,
      size: hasSizeVariants ? selectedSize : null,
      selectedSize: hasSizeVariants ? selectedSize : null,
      variantStock: selectedVariant?.stock ?? product.stock,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  if (loading) {
    return <div className="page-loading">Cargando producto...</div>;
  }

  if (!product) {
    return <div className="page-section">Producto no encontrado.</div>;
  }

  const isFutureDrop = Boolean(product.future_drop ?? product.is_future_drop);

  return (
    <>
      <section className="page-section product-detail-page">
        <div className="product-detail-shell">
          <div className="product-detail-gallery">
            <div
              className="product-detail-thumbs"
              aria-label="Miniaturas del producto"
            >
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={`product-detail-thumb${selectedImage === image ? " active" : ""}`}
                  onClick={() => setSelectedImage(image)}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} vista ${index + 1}`}
                  />
                </button>
              ))}
            </div>

            <div className="product-detail-main">
              <img
                src={selectedImage || product.image || "/placeholder.svg"}
                alt={product.name}
                className="product-detail-image"
              />
            </div>
          </div>

          <div className="product-detail-info">
            <div className="product-detail-info-inner">
              <div className="product-detail-topline">
                <span className="product-detail-category">
                  {(isFutureDrop && product.badge) ||
                    product.category ||
                    "NOVEDADES"}
                </span>
              </div>

              <h1>{product.name}</h1>
              {!isFutureDrop && (
                <p className="product-detail-price">
                  {formatPrice(product.price)}
                </p>
              )}

              {!isFutureDrop && hasSizeVariants && (
                <div className="detail-size-block">
                  <span className="detail-size-label">Talla</span>
                  <div className="product-sizes product-sizes--detail">
                    {variants.map((variant) => (
                      <button
                        key={variant.size}
                        type="button"
                        className={`size-chip ${selectedSize === variant.size ? "selected" : ""}${variant.stock <= 0 ? " is-sold-out" : ""}`}
                        disabled={variant.stock <= 0}
                        onClick={() => setSelectedSize(variant.size)}
                        aria-pressed={selectedSize === variant.size}
                      >
                        {variant.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!isFutureDrop && (
                <button
                  type="button"
                  className="product-add-btn product-add-btn--detail"
                  disabled={!canAdd}
                  onClick={handleAddToCart}
                >
                  {added
                    ? "Añadido"
                    : hasAvailableStock
                      ? "Añadir al carrito"
                      : "Agotado"}
                </button>
              )}

              {!isFutureDrop && (
                <button
                  type="button"
                  className="product-detail-fast-checkout"
                  aria-label="Pago rápido"
                >
                  Pago rápido
                </button>
              )}

              {added && (
                <p className="product-detail-confirmation">
                  Producto agregado al carrito.
                </p>
              )}

              <div className="product-detail-description">
                <p>
                  {product.description ||
                    "Un diseño pensado para quienes buscan estilo y comodidad en cada día."}
                </p>
              </div>

              {relatedProducts.length > 0 && (
                <div className="product-detail-suggestions">
                  <div className="product-detail-suggestions-header">
                    <h2>Completa el look</h2>
                  </div>

                  <div className="product-detail-suggestions-grid">
                    {relatedProducts.map((item) => (
                      <ProductCard
                        key={item.slug}
                        product={item}
                        size="compact"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {suggestedProducts.length > 0 && (
        <section className="page-section product-detail-related-section">
          <div className="section-panel section-panel-with-action product-detail-related-header">
            <div className="section-heading">
              <h2 className="section-title">También te puede interesar</h2>
            </div>
          </div>

          <div className="product-detail-related-grid">
            {suggestedProducts.slice(0, 4).map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
