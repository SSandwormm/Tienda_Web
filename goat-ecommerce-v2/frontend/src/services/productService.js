import { supabase } from "../lib/supabase";

async function getAuthenticatedToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("Inicia sesión de nuevo");
  return session.access_token;
}

/**
 * Obtener todos los productos desde el backend Express
 */
export const getProducts = async (category = null) => {
  try {
    const url = category
      ? `http://localhost:4000/api/products?category=${category}`
      : "http://localhost:4000/api/products";

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    const products = Array.isArray(data.products)
      ? data.products
      : Array.isArray(data)
        ? data
        : [];

    return {
      products: products
        .filter(
          (product) =>
            category === "prendas-futuras" ||
            !Boolean(product.future_drop ?? product.is_future_drop),
        )
        .map((product) => ({
          ...product,
          id: product.id ?? product.slug,
          categories: Array.isArray(product.categories)
            ? product.categories
            : typeof product.category === "string" && product.category
              ? [product.category]
              : ["general"],
          category: product.category || product.categories?.[0] || "general",
          future_drop: Boolean(product.future_drop ?? product.is_future_drop),
          is_future_drop: Boolean(
            product.is_future_drop ?? product.future_drop,
          ),
          image_url: product.image_url || product.image || "/placeholder.svg",
        })),
    };
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
};

const normalizeCategories = (productData = {}) => {
  if (Array.isArray(productData.categories) && productData.categories.length) {
    return productData.categories.filter(Boolean);
  }

  if (typeof productData.category === "string" && productData.category.trim()) {
    return [productData.category];
  }

  return ["general"];
};

const normalizeImages = (productData = {}) => {
  if (Array.isArray(productData.images)) {
    return productData.images
      .map((image) =>
        typeof image === "string" ? image : image?.dataUrl || image?.preview,
      )
      .filter(Boolean);
  }

  return [productData.image_url || productData.image].filter(Boolean);
};

const normalizeVariants = (productData = {}) => {
  if (!Array.isArray(productData.variants)) return [];

  return productData.variants.map((variant) => ({
    size: String(variant.size || "Única"),
    color: String(variant.color || ""),
    stock: Math.max(0, Number(variant.stock) || 0),
    sku: variant.sku || null,
  }));
};

/**
 * Crear un producto en el backend Express
 */
export const createProduct = async (productData, imageFile = null, token) => {
  try {
    const accessToken = await getAuthenticatedToken();
    const categories = normalizeCategories(productData);
    const futureDrop = Boolean(productData?.future_drop);
    if (futureDrop && !categories.includes("prendas-futuras")) {
      categories.push("prendas-futuras");
    }

    const payload = {
      ...productData,
      categories,
      category: categories[0] || "general",
      future_drop: futureDrop,
      product_type: productData?.product_type || "accesorio",
      variants: normalizeVariants(productData),
      images: normalizeImages(productData),
      price: Number(productData?.price) || 0,
      stock: Number(productData?.stock) || 0,
      image_url:
        productData?.image_url ||
        normalizeImages(productData)[0] ||
        "/placeholder.svg",
    };

    const response = await fetch("http://localhost:4000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data.product ?? data;
  } catch (err) {
    console.error("Error creating product:", err);
    throw err;
  }
};

/**
 * Actualizar un producto existente en el backend Express
 */
export const updateProduct = async (
  id,
  productData,
  imageFile = null,
  token,
) => {
  try {
    const accessToken = await getAuthenticatedToken();
    const categories = normalizeCategories(productData);
    const futureDrop = Boolean(productData?.future_drop);
    if (futureDrop && !categories.includes("prendas-futuras")) {
      categories.push("prendas-futuras");
    }

    const payload = {
      ...productData,
      categories,
      category: categories[0] || productData?.category || "general",
      future_drop: futureDrop,
      product_type: productData?.product_type || "accesorio",
      variants: normalizeVariants(productData),
      images: normalizeImages(productData),
      price: Number(productData?.price) || 0,
      stock: Number(productData?.stock) || 0,
      image_url:
        productData?.image_url ||
        normalizeImages(productData)[0] ||
        "/placeholder.svg",
    };

    const response = await fetch(`http://localhost:4000/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data.product ?? data;
  } catch (err) {
    console.error("Error updating product:", err);
    throw err;
  }
};

/**
 * Eliminar un producto por id desde el backend Express
 */
export const deleteProduct = async (id, token) => {
  try {
    const accessToken = await getAuthenticatedToken();
    const response = await fetch(`http://localhost:4000/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.status === 204 ? true : await response.json();
  } catch (err) {
    console.error("Error deleting product:", err);
    throw err;
  }
};

export const voteForProduct = async (id, userId) => {
  try {
    const response = await fetch(
      `http://localhost:4000/api/products/${id}/vote`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.product ?? data;
  } catch (err) {
    console.error("Error voting product:", err);
    throw err;
  }
};

/**
 * Obtener un producto por slug desde el backend Express
 */
export const getProductBySlug = async (slug) => {
  try {
    const response = await fetch(`http://localhost:4000/api/products/${slug}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching product:", err);
    throw err;
  }
};
