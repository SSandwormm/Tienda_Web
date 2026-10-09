// =========================================
// IMPORTACIONES
// =========================================

// React permite crear componentes.
import React, { useEffect, useRef, useState } from "react";

// NavLink permite navegar entre páginas sin recargar la aplicación.
// Además, puede marcar automáticamente el enlace activo.
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

// Hook del contexto de autenticación.
// Nos permite saber si existe un usuario que haya iniciado sesión.
import { useAuth } from "../../context/AuthContext.jsx";
import { useRole } from "../../hooks/useRole.js";

// Hook del contexto del carrito.
// Nos permite acceder a los productos que el usuario agregó al carrito.
import { useCart } from "../../context/CartContext.jsx";
import { getProducts } from "../../services/productService.js";
import {
  getSiteContent,
  SITE_CONTENT_KEYS,
  SITE_CONTENT_FALLBACKS,
} from "../../services/siteContentService.js";
import ProductCard from "../product/ProductCard.jsx";

const shopColumns = [
  {
    title: "Hombre",
    links: [
      "Más vendido",
      "Novedades",
      "Ver todo",
      "Buzos",
      "Camisetas",
      "Jeans",
    ],
    slug: "hombre",
  },
  {
    title: "Mujer",
    links: [
      "Más vendido",
      "Novedades",
      "Ver todo",
      "Sudaderas",
      "Camisetas",
      "Jeans",
    ],
    slug: "mujer",
  },
  {
    title: "Accesorios",
    links: [
      "Más vendido",
      "Novedades",
      "Ver todo",
      "Gorras",
      "Bolsos",
      "Calcetines",
    ],
    slug: "accesorios",
  },
];

const collectionCards = [
  {
    title: "Primavera / Verano",
    label: "Verano '26",
    id: "primavera-verano",
    contentKey: SITE_CONTENT_KEYS.collectionVerano,
  },
  {
    title: "Otoño / Invierno",
    label: "Drop 02",
    id: "otono-invierno",
    contentKey: SITE_CONTENT_KEYS.collectionInvierno,
  },
  {
    title: "Prendas Exclusiva",
    label: "Edición limitada",
    id: "prendas-exclusiva",
    contentKey: SITE_CONTENT_KEYS.collectionExclusiva,
  },
];

function ShopMenu({ featuredImage }) {
  return (
    <div className="mega-menu shop-menu">
      <div className="shop-links">
        {shopColumns.map((column) => (
          <div className="mega-column" key={column.title}>
            <h3>{column.title}</h3>
            {column.links.map((label) => (
              <Link key={label} to={`/tienda/${column.slug}`}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <Link to="/tienda/hombre" className="featured-product">
        <img src={featuredImage} alt="Camiseta GOAT" />
        <span>Camisetas</span>
      </Link>
    </div>
  );
}

function CollectionsMenu({ content }) {
  return (
    <div className="mega-menu collections-menu">
      <div className="collections-heading">
        <div>
          <p className="menu-kicker">GOAT / 2026</p>
          <h2>Temporada 2026</h2>
        </div>
        <Link to="/colecciones" className="all-collections-link">
          Ver todas las colecciones <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="collection-menu-grid">
        {collectionCards.map((card) => (
          <Link
            to={`/colecciones#${card.id}`}
            className="collection-menu-card"
            key={card.title}
          >
            <img src={content[card.contentKey]} alt="" />
            <span className="collection-menu-overlay" />
            <span className="collection-menu-copy">
              <strong>{card.title}</strong>
              <small>{card.label}</small>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// =========================================
// COMPONENTE HEADER
// =========================================
//
// Este componente representa la cabecera principal
// de toda la tienda.
//
// Está dividido en:
//
// 1. Barra superior (Top Bar)
// 2. Menú de navegación
// 3. Logo
// 4. Opciones del usuario
// 5. Botón del carrito
//

export default function Header() {
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isFuturePage = pathname === "/prendas-futuras";
  const { cart } = useCart();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [siteContent, setSiteContent] = useState(SITE_CONTENT_FALLBACKS);
  const searchInputRef = useRef(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    let active = true;

    getSiteContent().then((content) => {
      if (active) setSiteContent(content);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isSearchOpen) return;

    const controller = new AbortController();
    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const { products = [] } = await getProducts();
        if (!controller.signal.aborted) {
          setAllProducts(products);
        }
      } catch (error) {
        console.error("Error cargando productos para búsqueda:", error);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingProducts(false);
        }
      }
    };

    loadProducts();

    return () => controller.abort();
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const timer = setTimeout(() => {
      const query = searchTerm.trim().toLowerCase();

      if (!query) {
        setFilteredProducts([]);
        return;
      }

      const matches = allProducts.filter((product) => {
        const productName = String(product.name || "").toLowerCase();
        return productName.includes(query);
      });

      setFilteredProducts(matches);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, allProducts, isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      window.setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm("");
    setFilteredProducts([]);
  };

  const openProductFromSearch = (product) => {
    closeSearch();
    navigate(`/producto/${product.slug}`);
  };

  const hasResults =
    searchTerm.trim().length > 0 && filteredProducts.length > 0;
  const hasQuery = searchTerm.trim().length > 0;

  return (
    <>
      <header className={`site-header${isFuturePage ? " future-header" : ""}`}>
        {/* =====================================
          BARRA SUPERIOR
      ======================================

          Muestra un texto que se mueve
          continuamente de izquierda a derecha
          (Marquee).

          Se usan dos <span> iguales para que
          la animación sea infinita.
      */}

        <div className="top-bar">
          <div className="marquee-track">
            <span>
              ENVÍOS A TODA COLOMBIA | GOAT 2026 - SIEMPRE AGRADECIDO | ENVÍOS A
              TODA COLOMBIA | GOAT 2026 - SIEMPRE AGRADECIDO | ENVÍOS A TODA
              COLOMBIA | GOAT 2026 - SIEMPRE AGRADECIDO |
            </span>

            {/* Segundo texto para crear
              una animación continua */}

            <span>
              ENVÍOS A TODA COLOMBIA | GOAT 2026 - SIEMPRE AGRADECIDO | ENVÍOS A
              TODA COLOMBIA | GOAT 2026 - SIEMPRE AGRADECIDO | ENVÍOS A TODA
              COLOMBIA | GOAT 2026 - SIEMPRE AGRADECIDO |
            </span>
          </div>
        </div>

        {/* =====================================
          CONTENIDO PRINCIPAL DEL HEADER
      ====================================== */}

        <div className="header-inner">
          {/* =====================================
            MENÚ IZQUIERDO
        ======================================

            Contiene las principales
            categorías de la tienda.
        */}

          <nav className="nav-left">
            {/* Enlace a la tienda */}

            <div className="nav-dropdown">
              <NavLink to="/tienda">TIENDA</NavLink>
              <ShopMenu
                featuredImage={siteContent[SITE_CONTENT_KEYS.shopFeatured]}
              />
            </div>

            {/* Colecciones */}

            <div className="nav-dropdown">
              <NavLink to="/colecciones">COLECCIONES</NavLink>
              <CollectionsMenu content={siteContent} />
            </div>

            {/* Próximos lanzamientos */}

            <NavLink to="/prendas-futuras">PRENDAS FUTURAS</NavLink>

            {/* Información de la marca */}

            <NavLink to="/sobre-nosotros">SOBRE NOSOTROS</NavLink>
          </nav>

          {/* =====================================
            LOGO DE LA MARCA
        ======================================

            Al hacer clic vuelve
            a la página principal.
        */}

          <NavLink to="/" className="brand-logo">
            GOAT
          </NavLink>

          {/* =====================================
            MENÚ DERECHO
        ====================================== */}

          <div className="nav-right">
            {/* =====================================
              PERFIL O LOGIN
          ======================================

          Si existe un usuario logueado:

                PERFIL

          Si no existe:

                INGRESAR

          También cambia automáticamente
          la ruta.
          */}

            <NavLink to={user ? "/perfil" : "/login"}>
              {user ? "PERFIL" : "INGRESAR"}
            </NavLink>

            {isAdmin && <NavLink to="/admin/dashboard">ADMINISTRAR</NavLink>}

            {/* =====================================
              BOTÓN BUSCAR
          ======================================

          Actualmente solo es visual.

          Más adelante puede abrir un buscador
          de productos.
          */}

            <button
              type="button"
              className="header-link"
              onClick={() => setIsSearchOpen(true)}
            >
              BUSCAR
            </button>

            {/* =====================================
              BOTÓN DEL CARRITO
          ======================================

          Al hacer clic ocurre esto:

          1. Se dispara el evento "openCart"

          2. CartDrawer escucha ese evento

          3. CartDrawer cambia:

              open = true

          4. El carrito se abre.

          También muestra el número total
          de productos agregados.
          */}

            <button
              className="header-link cart-button"
              onClick={() => window.dispatchEvent(new Event("openCart"))}
            >
              CARRITO
              {/* Número total de productos */}
              <span className="cart-badge">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      {isSearchOpen && (
        <div
          className="search-overlay"
          onClick={closeSearch}
          role="dialog"
          aria-modal="true"
          aria-label="Buscar productos"
        >
          <div
            className={`search-panel${hasQuery ? " search-panel--expanded" : ""}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="search-close"
              onClick={closeSearch}
              aria-label="Cerrar búsqueda"
            >
              ×
            </button>

            <div className="search-panel-inner">
              <label className="search-label" htmlFor="global-product-search">
                Buscar productos
              </label>

              <input
                id="global-product-search"
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Escribe el nombre de un producto..."
                className="search-input"
              />

              <div className="search-results">
                {isLoadingProducts && hasQuery && (
                  <p className="search-empty">Buscando productos...</p>
                )}

                {!isLoadingProducts && hasQuery && !hasResults && (
                  <p className="search-empty">
                    No se encontraron productos para tu búsqueda.
                  </p>
                )}

                {hasResults && (
                  <div className="search-results-grid">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        variant="dark"
                        size="compact"
                        showBadge={false}
                        onCardClick={() => openProductFromSearch(product)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
