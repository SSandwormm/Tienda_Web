import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import AdminProducts from "../../components/admin/AdminProducts.jsx";
import AdminSiteContent from "../../components/admin/AdminSiteContent.jsx";
import AdminFutureProducts from "../../components/admin/AdminFutureProducts.jsx";
import AdminCarousel from "../../components/admin/AdminCarousel.jsx";
import "../../styles/dashboard.css";

/* ─────────────────────────────────────────
   Navegación del sidebar
   Cada item tiene id, label e icono.
   Para escalar: agrega más items aquí.
───────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "overview", label: "RESUMEN", icon: "◈" },
  { id: "products", label: "PRODUCTOS", icon: "▣" },
  { id: "site-content", label: "CONTENIDO DEL HEADER", icon: "▤" },
  { id: "future-products", label: "PRENDAS FUTURAS", icon: "◇" },
  { id: "carousel", label: "CARRUSEL", icon: "▧" },
  { id: "orders", label: "PEDIDOS", icon: "◫" },
  { id: "users", label: "USUARIOS", icon: "◉" },
];

/* ─────────────────────────────────────────
   Tarjetas de estadísticas
   value: "—" hasta conectar datos reales de Supabase
───────────────────────────────────────── */
const STATS = [
  { label: "USUARIOS", value: "—", sub: "Total registrados", color: "#d4c29a" },
  { label: "PEDIDOS", value: "—", sub: "Este mes", color: "#a8c5a0" },
  { label: "PRODUCTOS", value: "—", sub: "En catálogo", color: "#a0b5c5" },
];

/* ─────────────────────────────────────────
   Secciones del overview (accesos rápidos)
───────────────────────────────────────── */
const SECTIONS = [
  {
    id: "products",
    title: "PRODUCTOS",
    description: "Gestiona el catálogo de prendas, precios, stock e imágenes.",
  },
  {
    id: "future-products",
    title: "PRENDAS FUTURAS",
    description: "Publica y administra hasta tres prototipos para votación.",
  },
  {
    id: "orders",
    title: "PEDIDOS",
    description:
      "Revisa y actualiza el estado de todos los pedidos de clientes.",
  },
  {
    id: "users",
    title: "USUARIOS",
    description: "Administra cuentas, roles de acceso y datos de clientes.",
  },
];

class AdminProductsErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error en la sección Productos:", error, errorInfo);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="dashboard-coming-soon" role="alert">
        <h2>Ocurrió un error en Productos</h2>
        <p>{this.state.error.message || "Error inesperado en el módulo."}</p>
        <button className="dashboard-section-btn" onClick={this.props.onRetry}>
          Reintentar
        </button>
      </div>
    );
  }
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [productsBoundaryKey, setProductsBoundaryKey] = useState(0);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const currentNavItem = NAV_ITEMS.find((n) => n.id === activeSection);

  return (
    <div className="dashboard-page">
      {/* ── Sidebar ── */}
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-brand">
          GOAT
        </Link>

        <nav className="dashboard-nav" aria-label="Navegación admin">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              id={`dashboard-nav-${item.id}`}
              className={`dashboard-nav-item ${
                activeSection === item.id ? "active" : ""
              }`}
              onClick={() => setActiveSection(item.id)}
              aria-current={activeSection === item.id ? "page" : undefined}
            >
              <span className="dashboard-nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="dashboard-sidebar-footer">
          <Link to="/perfil" className="dashboard-profile-link">
            MI PERFIL
          </Link>
          <button className="dashboard-logout" onClick={handleLogout}>
            CERRAR SESIÓN
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-topbar">
          <div>
            <h1 className="dashboard-title">{currentNavItem?.label}</h1>
            <p className="dashboard-subtitle">{user?.email}</p>
          </div>
          <span className="dashboard-badge">ADMIN</span>
        </div>

        {/* ── Resumen (overview) ── */}
        {activeSection === "overview" && (
          <div className="dashboard-section-content">
            {/* Stat cards */}
            <div className="dashboard-stats">
              {STATS.map((stat) => (
                <div className="dashboard-stat-card" key={stat.label}>
                  <div className="stat-value" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-sub">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Quick access */}
            <div className="dashboard-sections">
              {SECTIONS.map((sec) => (
                <div className="dashboard-section-card" key={sec.id}>
                  <h3>{sec.title}</h3>
                  <p>{sec.description}</p>
                  <button
                    className="dashboard-section-btn"
                    onClick={() => setActiveSection(sec.id)}
                  >
                    IR A {sec.title} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Secciones escalables ── */}
        {activeSection === "products" && (
          <AdminProductsErrorBoundary
            key={productsBoundaryKey}
            onRetry={() => setProductsBoundaryKey((key) => key + 1)}
          >
            <AdminProducts />
          </AdminProductsErrorBoundary>
        )}
        {activeSection === "site-content" && <AdminSiteContent />}
        {activeSection === "future-products" && <AdminFutureProducts />}
        {activeSection === "carousel" && <AdminCarousel />}

        {activeSection !== "overview" &&
          activeSection !== "products" &&
          activeSection !== "site-content" &&
          activeSection !== "future-products" &&
          activeSection !== "carousel" && (
            <div className="dashboard-coming-soon">
              <div className="coming-soon-icon" aria-hidden="true">
                ◈
              </div>
              <h2>PRÓXIMAMENTE</h2>
              <p>
                Esta sección está lista para conectar datos reales de Supabase.
                Cada módulo se puede desarrollar de forma independiente.
              </p>
            </div>
          )}
      </main>
    </div>
  );
}
