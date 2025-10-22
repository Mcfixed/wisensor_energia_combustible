//NO UTILIZADO!!!!!!!
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { Dashboard } from "./views/Dashboard/Dashboard";
import Configuracion from "./views/Configuracion/Configuracion";
import { Login } from "./views/login/Login";
import { Empresas } from "./views/Configuracion/sections/Empresas";
import { Centros } from "./views/Configuracion/sections/Centros";
import { Usuarios } from "./views/Configuracion/sections/Usuarios";
import { RolesPermisos } from "./views/Configuracion/sections/RolesPermisos";
import { Inventario } from "./views/Inventario/Inventario";
import { InventarioConf } from "./views/Configuracion/sections/InventarioConf";
import { Alertas } from "./views/Alertas/Alertas";
import { Inspecciones } from "./views/Inspecciones/Inspecciones";
import { Reportes } from "./views/Reportes/Reportes";
import { Estadisticas } from "./views/Estadisticas/Estadisticas";
import { Dashboard2 } from "./views/Dashboard/Dashboard2";
import { Combustible } from "./views/Combustible/Combustible";
import { Energia } from "./views/Energia/Energia";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard2" element={<Dashboard2 />} />
        <Route path="/alertas" element={<Alertas/>} />
        <Route path="/inspecciones" element={<Inspecciones/>} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
        <Route path="/combustible" element={<Combustible />} />
        <Route path="/energia" element={<Energia />} />

        <Route path="/configuracion/empresas" element={<Empresas />} />
        <Route path="/configuracion/centros" element={<Centros />} />
        <Route path="/configuracion/usuarios" element={<Usuarios />} />
        <Route path="/configuracion/roles-permisos" element={<RolesPermisos />} />
        <Route path="/configuracion/inventario" element={<InventarioConf />} />
        <Route path="/inventario" element={<Inventario />} />
      </Route>
    </Routes>
  );
}
