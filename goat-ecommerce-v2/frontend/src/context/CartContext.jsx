import React, { createContext, useContext, useReducer, useEffect } from "react";
import { formatPrice } from "../utils/format.js";

const CartContext = createContext(null);

const getItemKey = (item) =>
  `${item.slug}-${item.size || item.selectedSize || "default"}-${item.color || "default"}`;

const getAvailableStock = (item) => {
  if (item.variantStock !== undefined) return Number(item.variantStock) || 0;

  const selectedSize = item.size || item.selectedSize;
  const variant = Array.isArray(item.variants)
    ? item.variants.find(
        (entry) =>
          entry.size === selectedSize &&
          (entry.color || "") === (item.color || ""),
      )
    : null;

  return variant ? Number(variant.stock) || 0 : Number(item.stock) || 0;
};

export { getAvailableStock };

function cartReducer(state, action) {
  switch (action.type) {
    case "INITIALIZE":
      return action.payload;
    case "ADD_ITEM": {
      const itemKey = getItemKey(action.payload);
      const existing = state.items.find((item) => getItemKey(item) === itemKey);
      const availableStock = getAvailableStock(action.payload);
      if (availableStock <= 0) return state;
      const items = existing
        ? state.items.map((item) =>
            getItemKey(item) === itemKey
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + 1, availableStock),
                }
              : item,
          )
        : [
            ...state.items,
            {
              ...action.payload,
              quantity: Math.min(1, availableStock),
              size: action.payload.size || action.payload.selectedSize || null,
            },
          ];
      return { ...state, items };
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter((item) => {
        const target = action.payload;
        return !(
          item.slug === target.slug &&
          (item.size || item.selectedSize || null) === (target.size || null) &&
          (item.color || "") === (target.color || "")
        );
      });
      return { ...state, items };
    }
    case "UPDATE_QUANTITY": {
      const items = state.items.map((item) => {
        const sameItem =
          item.slug === action.payload.slug &&
          (item.size || item.selectedSize) ===
            (action.payload.size ||
              action.payload.selectedSize ||
              item.size ||
              item.selectedSize) &&
          (item.color || "") === (action.payload.color || item.color || "");
        if (!sameItem) return item;
        const parsedQuantity = Number(action.payload.quantity);
        const requestedQuantity = Number.isFinite(parsedQuantity)
          ? Math.max(1, Math.floor(parsedQuantity))
          : 1;
        return {
          ...item,
          quantity: Math.min(requestedQuantity, getAvailableStock(item)),
        };
      });
      return { ...state, items };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

const initialState = { items: [] };

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const stored = localStorage.getItem("goat_cart");
    if (stored) {
      dispatch({ type: "INITIALIZE", payload: JSON.parse(stored) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("goat_cart", JSON.stringify(state));
  }, [state]);

  const addItem = (product) => dispatch({ type: "ADD_ITEM", payload: product });
  const removeItem = (slug, size = null, color = null) =>
    dispatch({ type: "REMOVE_ITEM", payload: { slug, size, color } });
  const updateQuantity = (slug, quantity, size = null, color = null) =>
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { slug, quantity, size, color },
    });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal;
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const hasStockIssues = state.items.some(
    (item) => item.quantity > getAvailableStock(item),
  );

  return (
    <CartContext.Provider
      value={{
        cart: state.items,
        subtotal,
        total,
        itemCount,
        hasStockIssues,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
