// src/api/api.ts
import axios, { AxiosError } from 'axios';
// (Asegúrate de que esta ruta sea correcta)
import { logout } from '../views/login/services/authService';


const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptor para añadir el token a CADA petición
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Interceptor de Respuesta (Versión limpia)
apiClient.interceptors.response.use(
  
  (response) => {
    // Si la respuesta es exitosa, solo devuélvela.
    return response;
  },
  
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // @ts-ignore
    if (error.response?.status === 401 && !originalRequest._retry) {
      // @ts-ignore
      originalRequest._retry = true;
      
      // (Hemos quitado el console.warn de aquí porque es una operación normal)

      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        // ¡ESTE ES UN ERROR REAL! Lo mantenemos.
        console.error("No hay refresh token. Cerrando sesión.");
        logout(); 
        return Promise.reject(error);
      }

      try {
        // Intento de Refresco
        const rs = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/token/refresh`, 
          {}, 
          {
            headers: { Authorization: `Bearer ${refreshToken}` }, 
          }
        );

        // (Hemos quitado los console.log de éxito de aquí)

        const { access_token } = rs.data;

        localStorage.setItem('access_token', access_token);
        
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        if (originalRequest?.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        
        // Reintentamos la llamada original
        return apiClient(originalRequest);

      } catch (_error) {
        
        // ¡ESTE TAMBIÉN ES UN ERROR REAL! Lo mantenemos.
        console.error("¡Falló el refresco del token! (El refresh token puede haber expirado). Cerrando sesión.");
        logout(); 
        return Promise.reject(_error);
      }
    }

    // Para cualquier otro error (500, 404, etc.), lo devolvemos
    return Promise.reject(error);
  }
);

export default apiClient;