// src/views/login/Login.tsx

// --- IMPORTACIONES ---
// Tus importaciones originales
import { ArrowBigRightDash, LogIn, Mail, Lock } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Version from "../../components/Version";
// Importación añadida para redirigir
import { useNavigate } from "react-router-dom"; 

export const Login = () => {
  // --- ESTADO ---
  const { login } = useAuth();
  const navigate = useNavigate(); // Hook para redirigir

  // Cambiado a string simple para manejar mejor los errores
  const [error, setError] = useState<string | null>(null); 
  // Estado para deshabilitar el botón mientras se loguea
  const [isLoading, setIsLoading] = useState(false); 

  // --- LÓGICA DE LOGIN (MODIFICADA) ---
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;

    try {
      // --- PASO 1: Obtener el Token (Formato x-www-form-urlencoded) ---
      const tokenParams = new URLSearchParams();
      tokenParams.append('username', email); // La API espera 'username'
      tokenParams.append('password', password);

      const tokenResponse = await axios.post(
        `${apiUrl}/api/token`, // Endpoint de Token
        tokenParams, // Datos como form-data
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token } = tokenResponse.data;

      // --- PASO 2: Con el token, obtener Usuario y Roles (en paralelo) ---
      const authHeader = { 'Authorization': `Bearer ${access_token}` };

      // axios.all ejecuta ambas peticiones al mismo tiempo
      const [userResponse, rolesResponse] = await axios.all([
        axios.get(`${apiUrl}/api/users/me`, { headers: authHeader }),
        axios.get(`${apiUrl}/api/users/me/roles`, { headers: authHeader })
      ]);

      const userData = userResponse.data;
      const rolesData = rolesResponse.data;

      // --- PASO 3: Llamar al login del Context con TODOS los datos ---
      login(access_token, userData, rolesData);

      // --- PASO 4: Redirigir al Dashboard ---
      navigate('/');

    } catch (err: any) {
      // --- Manejo de Errores ---
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          setError("Email o contraseña incorrectos.");
        } else {
          setError("Ocurrió un error en el servidor. Intente más tarde.");
        }
      } else {
        setError("No se pudo conectar al servidor.");
      }
      console.error(err);
    } finally {
      setIsLoading(false); // Quitar el estado de "cargando"
    }
  };


  // --- TU JSX (SIN CAMBIOS, EXCEPTO EL BOTÓN Y EL ERROR) ---
  return (
    <div className="flex h-screen bg-gray-darkL text-white">
      {/* Panel izquierdo con imagen (solo en pantallas grandes) */}
      <div className="hidden lg:flex lg:w-2/3 bg-gray-800">
        <div
          className="h-full w-full bg-cover bg-center rounded-tr-2xl rounded-br-2xl"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1665661906179-c31475b473df?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.0.3')",
          }}
        >
          <div className="h-full bg-black/60 flex flex-col justify-between p-10 rounded-tr-2xl rounded-br-2xl">
            <div>
              <h2 className="text-3xl font-bold text-white">AST</h2>
              <p className="text-gray-300 mt-1">
                <span className="text-red-dark font-bold">WI</span>
                <span className="font-medium">SENSOR ENERGIA Y COMBUSTIBLE</span>
                <span className="text-gray-400 text-sm"><Version /></span>
              </p>
            </div>
            <div className="text-sm text-gray-400">
              Sistema de monitoreo de sensores de energia y combustible
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho con formulario */}
      <div className="relative flex flex-1 items-center justify-center p-6 overflow-hidden">
        <div className="relative w-full max-w-md">
          {/* Encabezado */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-4 rounded-3xl bg-gradient-to-r from-transparent via-red-400/5 to-transparent filter blur-sm"></div>
          </div>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-4xl font-bold">
                <span className="text-red-dark">WI</span>SENSOR
                <div className="absolute  left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400/50 to-transparent" />
              </h1>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-gray-700/40 p-3 rounded-full mb-3">
                <ArrowBigRightDash className="h-10 w-10 text-gray-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-100">
                Iniciar Sesión
              </h2>

              <p className="text-gray-400 mt-1">
                Ingresa tus credenciales para acceder al sistema
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form
            method="POST"
            className="space-y-6 bg-gray-darkL border border-gray-700 rounded-2xl p-8 shadow-lg"
            onSubmit={handleLogin}
          >
            {/* --- MENSAJE DE ERROR AÑADIDO --- */}
            {error && (
              <div className="p-3 text-center text-sm text-red-400 bg-red-900/30 border border-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email" // Añadido para que el 'e.target.email' funcione mejor
                  className="w-full pl-10 pr-4 py-3 bg-gray-dark border-l-2 border-gray-600 rounded-lg focus:ring-1 focus:ring-red-dark focus:border-red-dark outline-none transition"
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password" // Añadido
                  className="w-full pl-10 pr-4 py-3 bg-gray-dark border-l-2 border-gray-600 rounded-lg focus:ring-1 focus:ring-red-dark focus:border-red-dark outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* --- BOTÓN MODIFICADO (para deshabilitar y mostrar carga) --- */}
            <button
              type="submit"
              disabled={isLoading} // Deshabilitado mientras carga
              className="w-full bg-red-dark/80 hover:bg-red-dark text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-wait"
            >
              <LogIn className="h-5 w-5" />
              {isLoading ? 'Ingresando...' : 'Ingresar al sistema'}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-700 pt-4">
            <p>
              © {new Date().getFullYear()} Wisensor. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;