import React, { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import AppRouter from "./routes/AppRouter.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <AppLayout>
            <AppRouter />
          </AppLayout>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
