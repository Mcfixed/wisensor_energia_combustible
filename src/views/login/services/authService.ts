// src/services/authService.ts
import axios from "axios";
// Importamos el apiClient CON interceptores para las llamadas *después* del login
import apiClient from "../../../api/api"; 
import { BaseUser, UserRoleInCompany } from "../../../contexts/AuthContext";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

/**
 * Define la respuesta esperada de tu endpoint /api/token
 * (Asegúrate de que coincida con tu schema de FastAPI)
 */
interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

/**
 * Define la respuesta que nuestro servicio entregará al AuthContext
 */
export interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: BaseUser;
  roles: UserRoleInCompany[];
}

/**
 * Función principal de login.
 * Realiza las 3 llamadas a la API (token, user, roles)
 */
export const loginWithCredentials = async (email: string, password: string): Promise<LoginData> => {
  try {
    // --- PASO 1: Obtener Tokens (usando axios base) ---
    const tokenParams = new URLSearchParams();
    tokenParams.append('username', email); // La API espera 'username'
    tokenParams.append('password', password);

    const tokenResponse = await axios.post<TokenResponse>(
      `${apiUrl}/api/token`,
      tokenParams,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    // --- PASO 2: Configurar el header para las siguientes llamadas ---
    // Usaremos el apiClient (con interceptores) para esto.
    // Le seteamos el token manualmente la primera vez.
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    // --- PASO 3: Obtener Usuario y Roles (en paralelo) ---
    const [userResponse, rolesResponse] = await Promise.all([
      apiClient.get<BaseUser>(`${apiUrl}/api/users/me`),
      apiClient.get<UserRoleInCompany[]>(`${apiUrl}/api/users/me/roles`)
    ]);

    // --- PASO 4: Devolver todo el paquete de datos ---
    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      user: userResponse.data,
      roles: rolesResponse.data,
    };

  } catch (err: any) {
    // Reformatear el error para que el componente lo muestre
    if (axios.isAxiosError(err) && err.response) {
      if (err.response.status === 401) {
        throw new Error("Email o contraseña incorrectos.");
      } else {
        throw new Error("Ocurrió un error en el servidor. Intente más tarde.");
      }
    }
    throw new Error("No se pudo conectar al servidor.");
  }
};
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('roles');
  
  // Opcional: Redirigir al login
  // window.location.href = '/login'; 
  // Es mejor que el AuthContext maneje la redirección
};