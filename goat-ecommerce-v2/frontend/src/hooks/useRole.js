// =========================================
// IMPORTACIONES
// =========================================

// Hook del contexto de autenticación.
//
// Nos permite acceder a toda la información
// del usuario que inició sesión.
import { useAuth } from "../context/AuthContext";

/*
=========================================
HOOK PERSONALIZADO useRole
=========================================

Este hook simplifica el acceso
a la información relacionada con
los permisos del usuario.

En lugar de escribir en cada componente:

const { user, role, isAdmin } = useAuth();

simplemente hacemos:

const { user, role, isAdmin } = useRole();

Esto hace el código más limpio
y reutilizable.
*/

export function useRole() {
  /*
  =========================================
  OBTENER DATOS DEL CONTEXTO
  =========================================

  useAuth() devuelve toda la información
  del usuario autenticado.

  user     -> Información del usuario.

  role     -> Rol del usuario.

  isAdmin  -> true si el usuario
              es administrador.

  Ejemplo:

  user = {
      id: 1,
      name: "Juan"
  }

  role = "admin"

  isAdmin = true
  */

  const {
    user,

    role,

    isAdmin,
  } = useAuth();

  /*
  =========================================
  RETORNAR LOS DATOS
  =========================================

  Este hook devuelve un objeto con la
  información que otros componentes
  necesitan para controlar permisos
  o mostrar contenido según el rol.
  */

  return {
    role,

    isAdmin,

    user,
  };
}
