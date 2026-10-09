// Importa React para poder crear componentes.
import React from "react";

// Hook de React Router que permite saber en qué ruta (URL) está el usuario.
import { useLocation } from "react-router-dom";

// Componentes que forman la estructura principal de la aplicación.
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import CartDrawer from "./CartDrawer.jsx";

/*
|--------------------------------------------------------------------------
| RUTAS ESPECIALES
|--------------------------------------------------------------------------
|
| Aquí se definen las páginas que NO utilizarán el layout principal.
|
| AUTH_PATHS:
| Son las páginas de autenticación. No muestran Header ni Footer.
|
| STANDALONE_PATHS:
| Son páginas independientes que tampoco usan el layout completo.
|
*/

const AUTH_PATHS = ["/login", "/registro"];

const STANDALONE_PATHS = ["/perfil"];

/*
|--------------------------------------------------------------------------
| COMPONENTE AppLayout
|--------------------------------------------------------------------------
|
| Este componente es el "contenedor principal" de toda la aplicación.
|
| Su función es decidir qué elementos mostrar dependiendo de la página
| donde se encuentre el usuario.
|
| Ejemplo:
|
| Home
| ├── Header
| ├── Contenido
| ├── Footer
| └── Carrito
|
| Login
| └── Solo el formulario (sin Header ni Footer)
|
*/

export default function AppLayout({ children }) {
  // Obtiene información de la URL actual.
  // Ejemplo:
  // pathname = "/"
  // pathname = "/login"
  // pathname = "/productos"
  const { pathname } = useLocation();

  /*
  |--------------------------------------------------------------------------
  | VALIDACIONES DE RUTA
  |--------------------------------------------------------------------------
  */

  // Comprueba si la ruta actual pertenece a las páginas de autenticación.
  // Devuelve true o false.
  const isAuthPage = AUTH_PATHS.includes(pathname);

  // Comprueba si la página es independiente.
  //
  // También verifica si la URL comienza por "/admin".
  //
  // Ejemplos:
  //
  // /perfil           -> true
  // /admin            -> true
  // /admin/productos  -> true
  // /productos        -> false
  //
  const isStandalone =
    STANDALONE_PATHS.includes(pathname) || pathname.startsWith("/admin");

  /*
  |--------------------------------------------------------------------------
  | SI ES UNA PÁGINA ESPECIAL
  |--------------------------------------------------------------------------
  |
  | No se renderiza Header, Footer ni CartDrawer.
  | Solo se muestra el contenido de esa página.
  |
  */

  if (isAuthPage || isStandalone) {
    return children;
  }

  /*
  |--------------------------------------------------------------------------
  | LAYOUT PRINCIPAL
  |--------------------------------------------------------------------------
  |
  | Todas las demás páginas mostrarán:
  |
  | Header
  | Contenido
  | Footer (solo en Home)
  | CartDrawer
  |
  */

  return (
    <div className="app-shell">
      {/* Barra superior de navegación */}
      <Header />

      {/* Aquí se renderiza el contenido de cada página */}
      <main className="page-content">{children}</main>

      {/* Footer visible en todas las páginas principales */}
      <Footer />

      {/* Carrito lateral disponible en toda la tienda */}
      <CartDrawer />
    </div>
  );
}
