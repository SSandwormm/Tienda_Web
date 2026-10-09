// =========================================
// IMPORTACIONES
// =========================================

// React permite crear componentes.
import React from "react";

// NavLink -> Navegar entre categorías sin recargar la página.
// Navigate -> Redireccionar automáticamente.
// useParams -> Obtener los parámetros de la URL.
import { NavLink, Navigate, useParams } from "react-router-dom";

// Componente que muestra los productos del catálogo.
import Category from "../../pages/Category";

// Hook personalizado que contiene toda la lógica
// del layout de la tienda.
import useShopLayout from "../../hooks/useShopLayout";

// =========================================
// COMPONENTE ShopLayout
// =========================================
//
// Este componente organiza la estructura
// de la tienda.
//
// Dependiendo de la categoría:
//
// Hombre
// Mujer
// Accesorios
//
// Muestra:
//
// - Sidebar (menú lateral)
// o
// - Header superior
//
// Además renderiza los productos de la categoría.
//

export default function ShopLayout() {
  /*
  =========================================
  PARÁMETROS DE LA URL
  =========================================

  useParams() obtiene los parámetros
  enviados por React Router.

  Ejemplo:

  /tienda/hombre/ver-todo

  section = "hombre"

  slug = "ver-todo"

  Si no existen,
  se usan estos valores por defecto.

  */

  const { section = "hombre", slug = "ver-todo" } = useParams();

  /*
  =========================================
  HOOK PERSONALIZADO
  =========================================

  useShopLayout() recibe la sección
  y la categoría actual.

  Devuelve toda la información necesaria
  para construir la página.

  isValid      -> ¿Existe esa categoría?
  sectionLabel -> Texto de la sección.
  title        -> Título mostrado.
  links        -> Lista de enlaces.
  useSidebar   -> ¿Mostrar menú lateral?
  fallback     -> Ruta a la que redireccionar.
  */

  const {
    isValid,

    sectionLabel,

    title,

    links,

    useSidebar,

    fallback,
  } = useShopLayout(section, slug);

  /*
  =========================================
  VALIDACIÓN DE RUTA
  =========================================

  Si la categoría no existe,

  React redirecciona automáticamente
  a una ruta válida.

  Ejemplo:

  /tienda/hombre/xxxxx

  ↓

  /tienda/hombre/ver-todo
  */

  if (!isValid) {
    return <Navigate to={fallback} replace />;
  }

  /*
  =========================================
  RENDER DEL LAYOUT
  =========================================
  */

  return (
    <div className="tienda-page">
      {/* Contenedor principal */}

      <div className={`tienda-main ${useSidebar ? "tienda-layout" : ""}`}>
        {/* =====================================
            SI EXISTE SIDEBAR
        ====================================== */}

        {useSidebar ? (
          <aside className="tienda-side">
            {/* Nombre de la sección */}

            <p className="tienda-ubicacion">{sectionLabel}</p>

            {/* Título principal */}

            <h1 className="tienda-titulo">{title}</h1>

            {/* ===============================
                MENÚ LATERAL
            ================================ */}

            <nav className="tienda-rapido" aria-label="Ir rápido">
              {/* Recorre todas las categorías */}

              {links.map((link) => (
                <NavLink
                  key={link.file}
                  to={`/tienda/${section}/${link.file}`}
                  className={({ isActive }) =>
                    "tienda-rapido-link" + (isActive ? " is-active" : "")
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </aside>
        ) : (
          /*
          =====================================
          HEADER SUPERIOR
          =====================================

          Si no hay Sidebar,

          el título y las categorías
          aparecen arriba del catálogo.
          */

          <section className="tienda-header-inline">
            <h1 className="tienda-titulo tienda-titulo-inline">{title}</h1>

            <nav
              className="tienda-rapido tienda-rapido-inline"
              aria-label="Ir rápido"
            >
              {/* Crear enlaces */}

              {links.map((link) => (
                <NavLink
                  key={link.file}
                  to={`/tienda/${section}/${link.file}`}
                  className={({ isActive }) =>
                    "tienda-rapido-link" + (isActive ? " is-active" : "")
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </section>
        )}

        {/* =====================================
            CATÁLOGO DE PRODUCTOS
        ======================================

        Aquí se renderiza el componente
        Category.

        Recibe:

        catalogKey -> categoría actual

        title -> título mostrado

        showHero -> mostrar banner
                    cuando no existe Sidebar

        */}

        <section className="tienda-catalog">
          <Category catalogKey={slug} title={title} showHero={!useSidebar} />
        </section>
      </div>
    </div>
  );
}
