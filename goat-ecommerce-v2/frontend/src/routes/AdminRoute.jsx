import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useRole } from "../hooks/useRole.js";

/**
 * AdminRoute — protege rutas exclusivas de administrador.
 * Si no está logueado → /login
 * Si está logueado pero no es admin → /perfil
 */
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const { isAdmin } = useRole();

  if (loading) {
    return <div className="page-loading">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="page-section" role="alert">
        <h1>Acceso denegado</h1>
        <p>Tu perfil no tiene permisos de administrador.</p>
        <Link to="/tienda" className="button">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return children;
}
