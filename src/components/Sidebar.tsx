import {Settings,  Zap,  } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
/* BatteryCharging, Fuel, */
function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { path: "/energia", icon: Zap, label: "Energia" },
    /* { path: "/combustible", icon: Fuel, label: "Combustible" }, */
    /* { path: "/monitoreo", icon:BatteryCharging, label: "Sistema" }, */
    { path: "/configuracion", icon: Settings, label: "Configuración" }
  ];

  return (
    <aside className="sidebar bg-gray-darkL h-screen flex-shrink-0 flex flex-col border-r border-gray-700/40 fixed z-10">
      {/* Logo */}
      <div className="py-1 border-b border-gray-700 flex justify-center">
        <div className="bg-gray-700/30 rounded p-2 min-w-[2.5rem] flex justify-center">
          <img src="/assets/ASTlogo.png" alt="Logo AST" className="h-6 min-h-[1.5rem]" />
        </div>
      </div>

      {/* Menú */}
      <nav className="flex-1 overflow-y-auto no-scrollbar pt-4">
        <ul className="px-2 space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center text-sm p-3 rounded-lg transition-colors group ${
                  location.pathname === item.path 
                    ? 'bg-red-dark/20 text-white' 
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <item.icon 
                  size={20} 
                  className={`flex-shrink-0 ${
                    location.pathname === item.path ? 'text-red-dark' : 'text-gray-400'
                  }`} 
                />
                <span className="sidebar-text ml-3 opacity-0 w-0 overflow-hidden transition-all duration-200">
                  {item.label}
                </span>
                {location.pathname === item.path && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-red-dark opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer del sidebar */}
      <div className="p-4 border-t border-gray-700 flex items-center justify-center">
        <span className="sidebar-wisensor text-sm font-medium">
          <span className="text-red-dark">WI</span>
          <span className="text-gray-300">SENSOR</span>
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;