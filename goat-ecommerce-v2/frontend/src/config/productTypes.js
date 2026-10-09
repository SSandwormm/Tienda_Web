export const PRODUCT_TYPES = {
  camiseta: { label: "Camiseta", sizes: ["XS", "S", "M", "L", "XL"] },
  buzo: { label: "Buzo", sizes: ["XS", "S", "M", "L", "XL"] },
  balaclava: { label: "Balaclava", sizes: ["Única", "S/M"] },
  bolso: { label: "Bolso", sizes: [] },
  gafas: { label: "Gafas", sizes: [] },
  joya: { label: "Joya", sizes: ["Única", "Personalizada"] },
  accesorio: { label: "Accesorio", sizes: [] },
};

export const getProductType = (type) =>
  PRODUCT_TYPES[type] || PRODUCT_TYPES.accesorio;

export const getProductTypeLabel = (type) =>
  PRODUCT_TYPES[type]?.label || type || "Sin tipo";

export const getProductVariants = (product) => {
  if (!Array.isArray(product?.variants)) return [];

  return product.variants
    .map((variant) => ({
      ...variant,
      size: String(variant.size || "Única"),
      stock: Math.max(0, Number(variant.stock) || 0),
    }))
    .filter((variant) => variant.size);
};

export const hasProductSizes = (product) =>
  getProductVariants(product).length > 0;
