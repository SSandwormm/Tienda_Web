import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";

const Home = lazy(() => import("../pages/Home.jsx"));
const Collections = lazy(() => import("../pages/Collections.jsx"));
const Shop = lazy(() => import("../pages/Shop.jsx"));
const ProductPage = lazy(() => import("../pages/ProductPage.jsx"));
const About = lazy(() => import("../pages/About.jsx"));
const Novedades = lazy(() => import("../pages/Novedades.jsx"));
const PrendasFuturas = lazy(() => import("../pages/PrendasFuturas.jsx"));
const Cart = lazy(() => import("../pages/Cart.jsx"));
const Checkout = lazy(() => import("../pages/Checkout.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const Register = lazy(() => import("../pages/Register.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

// Páginas protegidas
const Profile = lazy(() => import("../pages/Profile.jsx"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard.jsx"));

export default function AppRouter() {
  return (
    <Suspense fallback={<div className="page-loading">Cargando...</div>}>
      <Routes>
        {/* ── Públicas ── */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/colecciones" element={<Collections />} />
        <Route path="/tienda" element={<Shop />} />
        <Route path="/tienda/:category" element={<Shop />} />
        <Route path="/producto/:slug" element={<ProductPage />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/prendas-futuras" element={<PrendasFuturas />} />
        <Route path="/sobre-nosotros" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* ── Protegidas: requieren sesión ── */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* ── Protegidas: solo admin ── */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
