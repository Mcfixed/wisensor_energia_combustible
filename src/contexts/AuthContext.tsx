// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

// 1. Nueva interfaz para los roles (coincide con la API)
export interface UserRoleInCompany {
  company_id: number;
  company_name: string;
  role: 'admin' | 'editor' | 'viewer'; // Coincide con el Enum del backend
}

// 2. Nueva interfaz para el usuario (coincide con la API)
export interface BaseUser {
  id: number;
  email: string;
  is_active: boolean;
}

// 3. Actualizamos el tipo del Contexto
interface AuthContextType {
  user: BaseUser | null;
  roles: UserRoleInCompany[]; // Almacenamos los roles aquí
  isAuthenticated: boolean;
  login: (token: string, userData: BaseUser, rolesData: UserRoleInCompany[]) => void;
  logout: () => void;
  loading: boolean;
  token: string | null; // Es útil exponer el token
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<BaseUser | null>(null);
  const [roles, setRoles] = useState<UserRoleInCompany[]>([]); // Estado para roles
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    const storedRoles = localStorage.getItem('roles'); // Cargar roles
    
    if (storedToken && storedUser && storedRoles) {
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

  // 4. Actualizamos la función 'login'
  const login = (
    token: string, 
    userData: BaseUser, 
    rolesData: UserRoleInCompany[]
  ) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('roles', JSON.stringify(rolesData)); // Guardar roles
    
    setUser(userData);
    setRoles(rolesData);
    setToken(token);
  };

  // 5. Actualizamos 'logout'
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('roles'); // Limpiar roles
    setUser(null);
    setRoles([]);
    setToken(null);
  };

  const value = {
    user,
    roles, // 6. Exponemos los roles
    isAuthenticated: !!user,
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