// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
// Importamos el servicio y los nuevos tipos
import * as authService from '../views/login/services/authService'; 
import { LoginData } from '../views/login/services/authService';

// (Tus interfaces BaseUser y UserRoleInCompany quedan igual)
export interface UserRoleInCompany { /* ... */ }
export interface BaseUser { /* ... */ }

// 1. Actualizamos el Contexto
interface AuthContextType {
  user: BaseUser | null;
  roles: UserRoleInCompany[];
  isAuthenticated: boolean;
  // La firma de login cambia: ahora toma credenciales
  login: (email: string, password: string) => Promise<void>; 
  logout: () => void;
  loading: boolean;
  token: string | null; // El access_token
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<BaseUser | null>(null);
  const [roles, setRoles] = useState<UserRoleInCompany[]>([]);
  const [token, setToken] = useState<string | null>(null);
  // NOTA: No necesitamos guardar el refresh_token en el ESTADO de React,
  // porque los componentes nunca lo usan. Solo vive en localStorage.
  const [loading, setLoading] = useState(true);

  // 2. useEffect actualizado para cargar todo desde localStorage
  useEffect(() => {
    setLoading(true);
    const storedToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');
    const storedUser = localStorage.getItem('user');
    const storedRoles = localStorage.getItem('roles');
    
    // Solo nos autenticamos si tenemos TODOS los datos
    if (storedToken && storedRefreshToken && storedUser && storedRoles) {
      try {
        setUser(JSON.parse(storedUser));
        setRoles(JSON.parse(storedRoles));
        setToken(storedToken);
      } catch (error) {
        console.error('Error al parsear datos de sesión', error);
        logout(); // Limpiar si hay un error
      }
    }
    setLoading(false);
  }, []);

  // 3. ¡Función 'login' REFACTORIZADA!
  // Ahora es la responsable de la lógica
  const login = async (email: string, password: string) => {
    try {
      // Llama al servicio, que hace todo el trabajo sucio
      const data: LoginData = await authService.loginWithCredentials(email, password);

      // Si el servicio tuvo éxito, guardamos todo
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken); // <-- ¡Guardamos el refresh token!
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('roles', JSON.stringify(data.roles));
      
      // Y actualizamos el estado de React
      setUser(data.user);
      setRoles(data.roles);
      setToken(data.accessToken);

    } catch (error) {
      // Si el servicio falló, limpiamos todo y lanzamos el error
      // para que el componente Login lo atrape y muestre.
      logout();
      throw error; 
    }
  };

  // 4. 'logout' actualizado para limpiar TODO
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token'); // <-- ¡Limpiamos el refresh token!
    localStorage.removeItem('user');
    localStorage.removeItem('roles');
    setUser(null);
    setRoles([]);
    setToken(null);
  };

  const value = {
    user,
    roles,
    isAuthenticated: !!user && !!token, // Más robusto
    login,
    logout,
    loading,
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};