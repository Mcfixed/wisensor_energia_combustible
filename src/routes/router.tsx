import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Dashboard } from "../views/Dashboard/Dashboard";
import Configuracion from "../views/Configuracion/Configuracion";
import Login from "../views/login/Login";
import { Empresas } from "../views/Configuracion/sections/Empresas";
import { useAuth } from "../contexts/AuthContext";
import { Alertas } from "../views/Alertas/Alertas";
import { Inspecciones } from "../views/Inspecciones/Inspecciones";
import { Reportes } from "../views/Reportes/Reportes";
import { Estadisticas } from "../views/Estadisticas/Estadisticas";
import Centros from "../views/Configuracion/sections/Centros";
import { Usuarios } from "../views/Configuracion/sections/Usuarios";
import { RolesPermisos } from "../views/Configuracion/sections/RolesPermisos";
import { InventarioConf } from "../views/Configuracion/sections/InventarioConf";
import { Inventario } from "../views/Inventario/Inventario";
import { Dashboard2 } from "../views/Dashboard/Dashboard2";
import { Energia } from "../views/Energia/Energia";
import { Combustible } from "../views/Combustible/Combustible";
import { Combustible1 } from "../views/Combustible/Combustible1";
import { Combustible2 } from "../views/Combustible/Combustible2";
import { Energia2 } from "../views/Energia/Energia2";
import { Combustible3 } from "../views/Combustible/Combustible3";
import { Energia1 } from "../views/Energia/Energia1";
import { AnalisisMarino } from "../views/Estadisticas/AnalisisMarino";

//rutas protegidas
function AuthorizedRoute({
  children,
  requiredPermission,
}: {
  children: React.ReactNode;
  requiredPermission?: string;
}) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // cuando no hay permisos
  if (requiredPermission && !user?.permisos?.includes(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

//invitados
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

export default createBrowserRouter([
  {
    path: "/login",
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard2",
        element: <Dashboard2 />,
      },
      {
        path: "/alertas",
        element: (
          <AuthorizedRoute requiredPermission="ver alertas">
            <Alertas />
          </AuthorizedRoute>
        ),
      },
      {
        path: "/inspecciones",
        element: (
            <Inspecciones />
        ),
      },
      {
        path: "/configuracion",
        element: (
            <Configuracion />
        ),
      },
      {
        path: "/reportes",
        element: (
            <Reportes />
        ),
      },
      {
        path: "/estadisticas",
        element: (
            <Estadisticas />
        ),
      },
      {
        path: "/analisismarino",
        element: (
            <AnalisisMarino />
        ),
      },
      {
        path: "/combustible",
        element: (
            <Combustible />
        ),
      },
      {
        path: "/combustible1",
        element: (
            <Combustible1 />
        ),
      },
      {
        path: "/combustible2",
        element: (
            <Combustible2 />
        ),
      },
      {
        path: "/combustible3",
        element: (
            <Combustible3 />
        ),
      },
      {
        path: "/energia2",
        element: (
            <Energia2 />
        ),
      },
      {
        path: "/energia",
        element: (
            <Energia />
        ),
      },
      {
        path: "/energia1",
        element: (
            <Energia1 />
        ),
      },
      {
        path: "/configuracion/empresas",
        element: (
            <Empresas />
        ),
      },
      {
        path: "/configuracion/centros",
        element: (
            <Centros />
        ),
      },
      {
        path: "/configuracion/usuarios",
        element: (
            <Usuarios />
        ),
      },
      {
        path: "/configuracion/roles-permisos",
        element: (
            <RolesPermisos />
        ),
      },
      {
        path: "/configuracion/inventario",
        element: (
            <InventarioConf />
        ),
      },
      {
        path: "/inventario",
        element: (
            <Inventario />
        ),
      },
    ],
  },
  // Ruta all para redirigir si no existe
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
