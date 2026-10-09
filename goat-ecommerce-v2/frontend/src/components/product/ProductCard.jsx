import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { voteForProduct } from "../../services/productService.js";
import { formatPrice } from "../../utils/format.js";
import FlipButton from "../ui/FlipButton.jsx";
import {
  getProductType,
  getProductVariants,
} from "../../config/productTypes.js";

function ProductCard({
  product,
  variant = "default",
  mode = "default",
  size = "default",
  onCardClick,
  showBadge = true,
  showQuickAdd = true,
}) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [votes, setVotes] = useState(Number(product.votes) || 0);
  const [voted, setVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [quickAdded, setQuickAdded] = useState(false);

  const isFutureDrop = Boolean(product.future_drop ?? product.is_future_drop);
  const productType = getProductType(product.product_type);
  const variants = productType.sizes.length ? getProductVariants(product) : [];
  const hasSizeVariants = variants.length > 0;
  const hasAvailableStock = hasSizeVariants
    ? variants.some((variant) => variant.stock > 0)
    : Number(product.stock) > 0;
  const selectedVariant = variants.find(
    (variant) => variant.size === selectedSize,
  );
  const canAddSelected = hasSizeVariants
    ? Boolean(selectedVariant && selectedVariant.stock > 0)
    : hasAvailableStock;
  const isCompactSize = size === "compact";

  const handleMouseLeave = () => {
    setSelectedSize("");
  };

  const handleAddToCart = () => {
    if (!canAddSelected) return;

    addItem({
      ...product,
      size: hasSizeVariants ? selectedSize : null,
      selectedSize: hasSizeVariants ? selectedSize : null,
      variantStock: hasSizeVariants ? selectedVariant.stock : product.stock,
    });

    setSelectedSize("");
  };

  const handleVote = async () => {
    if (voting || voted) return;

    try {
      setVoting(true);
      const updated = await voteForProduct(product.id);
      setVotes(Number(updated.votes) || votes + 1);
      setVoted(true);
    } catch (error) {
      console.error("No se pudo registrar el voto:", error);
    } finally {
      setVoting(false);
    }
  };

  const handleQuickAdd = () => {
    const selected = selectedSize || product.selectedSize || null;
    const variant = variants.find((item) => item.size === selected);
    if (hasSizeVariants && (!variant || variant.stock <= 0)) return;
    if (!hasSizeVariants && !hasAvailableStock) return;
    addItem({
      ...product,
      size: selected,
      selectedSize: selected,
      variantStock: variant?.stock ?? product.stock,
    });

    setQuickAdded(true);
    window.setTimeout(() => setQuickAdded(false), 900);
  };

  const isVotingMode = mode === "voting";

  return (
    <article
      className={`product-card${variant === "dark" ? " product-card--dark" : ""}${isVotingMode || isCompactSize ? " product-card--compact" : ""}${isCompactSize ? " product-card--search" : ""}`}
      onMouseLeave={handleMouseLeave}
      onClick={onCardClick}
    >
      <div className="product-media">
        {showBadge && isFutureDrop && product.badge && (
          <span className="badge">{product.badge}</span>
        )}

        <Link to={`/producto/${product.slug}`} className="product-image-link">
          <img
            className="product-image"
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            loading="lazy"
          />
        </Link>

        {!isVotingMode && !isFutureDrop && hasSizeVariants && (
          <div className="product-card-hover">
            <div className="product-sizes" aria-label="Seleccionar talla">
              {variants.map((variant) => (
                <button
                  key={variant.size}
                  type="button"
                  className={`size-chip ${selectedSize === variant.size ? "selected" : ""}${variant.stock <= 0 ? " is-sold-out" : ""}`}
                  disabled={variant.stock <= 0}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setSelectedSize(variant.size);
                  }}
                  aria-pressed={selectedSize === variant.size}
                >
                  {variant.size}
                </button>
              ))}
            </div>

            <FlipButton
              variant="product"
              className="product-add-flip"
              disabled={!canAddSelected}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleAddToCart();
              }}
              front={hasAvailableStock ? "AÑADIR" : "AGOTADO"}
              back="AÑADIR +"
            />
          </div>
        )}

        {!isVotingMode && !isFutureDrop && !hasSizeVariants && (
          <div className="product-card-hover">
            <FlipButton
              variant="product"
              className="product-add-flip"
              disabled={!canAddSelected}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleAddToCart();
              }}
              front={hasAvailableStock ? "AÑADIR" : "AGOTADO"}
              back="AÑADIR +"
            />
          </div>
        )}
      </div>

      <div className="product-info">
        <Link to={`/producto/${product.slug}`} className="product-title">
          {product.name}
        </Link>

        <div className="product-info-row">
          {!isFutureDrop && (
            <p className="product-price">{formatPrice(product.price)}</p>
          )}

          {isCompactSize && showQuickAdd && !isFutureDrop && (
            <button
              type="button"
              className={`product-quick-add${quickAdded ? " added" : ""}`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleQuickAdd();
              }}
              aria-label={`Agregar ${product.name} al carrito`}
              title="Agregar al carrito"
              disabled={!canAddSelected}
            >
              {quickAdded ? "✓" : hasAvailableStock ? "🛒" : "Agotado"}
            </button>
          )}
        </div>
      </div>

      {isVotingMode && (
        <div className="product-card-vote">
          <button
            type="button"
            className={`product-like-btn${voted ? " selected" : ""}`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleVote();
            }}
            disabled={voting || voted}
            aria-label={voted ? "Voto registrado" : "Me gusta este producto"}
            aria-pressed={voted}
          >
            <span aria-hidden="true">{voted ? "♥" : "♡"}</span>
            <span>{votes}</span>
          </button>
        </div>
      )}
    </article>
  );
}

export default React.memo(ProductCard);
