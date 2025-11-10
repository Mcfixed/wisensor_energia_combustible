// src/api/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
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

// Interceptor de Respuesta (Versión corregida)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        console.error("No hay refresh token. Cerrando sesión.");
        logout(); 
        return Promise.reject(error);
      }

      try {
        const rs = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/token/refresh`, 
          {}, 
          {
            headers: { Authorization: `Bearer ${refreshToken}` }, 
          }
        );

        const { access_token } = rs.data;

        localStorage.setItem('access_token', access_token);
        
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        if (originalRequest?.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        
        // Reintentamos la llamada original - CORREGIDO
        return apiClient(originalRequest);

      } catch (_error) {
        console.error("¡Falló el refresco del token! Cerrando sesión.");
        logout(); 
        return Promise.reject(_error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;