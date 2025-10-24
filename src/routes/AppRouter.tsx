
// src/routes/AppRouter.jsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/Layout';
import Login from '../views/login/Login';
import { Dashboard } from '../views/Dashboard/Dashboard';
import { Combustible } from '../views/Combustible/Combustible';
import { Energia } from '../views/Energia/Energia';
import Configuracion from '../views/Configuracion/Configuracion';
import { Empresas } from '../views/Configuracion/sections/Empresas';
import { Usuarios } from '../views/Configuracion/sections/Usuarios';
import { RolesPermisos } from '../views/Configuracion/sections/RolesPermisos';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Energia />} />
        <Route path="/combustible" element={<Combustible />} />
        <Route path="/energia" element={<Energia />} />


        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/configuracion/empresas" element={<Empresas />} />
        <Route path="/configuracion/usuarios" element={<Usuarios />} />
        <Route path="/configuracion/roles-permisos" element={<RolesPermisos />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;