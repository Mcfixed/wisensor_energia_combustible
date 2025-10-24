import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
function Header() {
  const navigate = useNavigate();
  const {user, logout} = useAuth();
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleLogout = async () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      await axios.post(`${apiUrl}/logout`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      logout(); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      logout();
    }
  };

  return (
    <header className="w-full py-1.5 px-3 bg-gray-darkL border-b border-gray-700">
      <div className="flex justify-between items-center text-gray-200">
        {/* Botón de retroceso*/}
        <button 
          onClick={handleGoBack}
          className="flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-150
                    bg-gray-dark hover:bg-gray-700/70 active:bg-gray-700
                    focus:outline-none cursor-pointer group"
          aria-label="Volver atrás"
        >
          <ChevronLeft size={18} className="text-gray-300 group-hover:text-white" />
          <span className="text-xs font-medium text-gray-300 group-hover:text-white hidden md:block">
            Volver
          </span>
        </button>

        {/* Título compacto */}
        <nav className="flex-1 flex justify-center">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-white flex items-center">
              {/* <span className="bg-red-dark/20 px-2 py-0.5 rounded-md mr-2 text-sm">WI</span> */}
              <span className='text-red-500'></span> ENERGIA
            </h1>
          </div>
        </nav>

        {/* Controles */}
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-full hover:bg-gray-700/50 transition-colors duration-150 relative">
            <Bell size={18} className="text-gray-300 hover:text-white" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-dark rounded-full"></span>
          </button>
          
          <button className="p-1.5 rounded-full hover:bg-gray-700/50 transition-colors duration-150">
            <Settings size={18} className="text-gray-300 hover:text-white" />
          </button>
          
          <div className="flex items-center gap-1 ml-1">
            <div className="h-7 w-7 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
              <User size={14} className="text-gray-300" />
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-medium text-white">{user?.name}</p>
            </div>
            <div><LogOut size={18} className='cursor-pointer hover:text-red-400 hover:bg-zinc-950/30 hover:rounded' onClick={handleLogout}/></div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;