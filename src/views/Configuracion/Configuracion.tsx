import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const Configuracion = () => {
  const { roles } = useAuth();
  // Función para comprobar si el usuario tiene un rol específico en una empresa
  const hasRole = (companyId: number, roleName: string) => {
    return roles.some(
      (r) => r.company_id === companyId && r.role === roleName
    );
  };
  return (
    <div className="w-full h-screen p-2 bg-dark-osc">
      <div className="h-full bg-gray-dark border border-gray-700/40 relative overflow-hidden">
        {/* Título */}
        <div className="p-6 border-b border-gray-700/40">
          <h1 className="text-2xl font-bold text-white">
            Configuración del sistema{" "}
            <span className="text-red-dark">WISENSOR</span>
          </h1>
          <p className="text-gray-400 mt-1">Gestión completa del sistema</p>
        </div>

        {/* Tarjetas de configuración */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-6">
          {/* Tarjeta Empresas */}
            {hasRole(1, 'admin') && (
            <Link to="/configuracion/empresas" className="group">
              <div className="h-full border border-gray-700/40 bg-dark-osc p-5 transition-all duration-300 hover:border-red-dark/50 hover:bg-dark-osc/70 hover:shadow-lg">
                <div className="flex flex-col h-full">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-red-dark transition-colors">
                    Empresas
                  </h3>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-3"></div>
                  <p className="text-gray-400 text-sm flex-1">
                    Administración de empresas asociadas
                  </p>
                  <div className="mt-4 text-red-dark font-medium flex items-center group-hover:translate-x-1 transition-transform">
                    Acceder
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Tarjeta Centros */}
          
          
          

          {/* Tarjeta Usuarios */}
          

          {hasRole(1, 'admin') && (
          <Link to="/configuracion/usuarios" className="group">
            <div className="h-full border border-gray-700/40 bg-dark-osc p-5 transition-all duration-300 hover:border-red-dark/50 hover:bg-dark-osc/70 hover:shadow-lg">
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-red-dark transition-colors">
                  Usuarios
                </h3>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-3"></div>
                <p className="text-gray-400 text-sm flex-1">
                  Administración de usuarios del sistema
                </p>
                <div className="mt-4 text-red-dark font-medium flex items-center group-hover:translate-x-1 transition-transform">
                  Acceder
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </div>
          </Link>
          )}
          {hasRole(1, 'admin') && (
          <Link to="/configuracion/sensores" className="group">
            <div className="h-full border border-gray-700/40 bg-dark-osc p-5 transition-all duration-300 hover:border-red-dark/50 hover:bg-dark-osc/70 hover:shadow-lg">
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-red-dark transition-colors">
                  Sensores
                </h3>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-3"></div>
                <p className="text-gray-400 text-sm flex-1">
                  Administración de sensores del sistema
                </p>
                <div className="mt-4 text-red-dark font-medium flex items-center group-hover:translate-x-1 transition-transform">
                  Acceder
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </div>
          </Link>
          )}
          {hasRole(1, 'admin') && (
          <Link to="/configuracion/estadisticas" className="group">
            <div className="h-full border border-gray-700/40 bg-dark-osc p-5 transition-all duration-300 hover:border-red-dark/50 hover:bg-dark-osc/70 hover:shadow-lg">
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-red-dark transition-colors">
                  Estadísticas
                </h3>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-3"></div>
                <p className="text-gray-400 text-sm flex-1">
                  Administración de estadísticas del sistema
                </p>
                <div className="mt-4 text-red-dark font-medium flex items-center group-hover:translate-x-1 transition-transform">
                  Acceder
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </div>
          </Link>
          )}
          
        </div>
      </div>
    </div>
  );
};
export default Configuracion;
