import { User, UserCreate, UserUpdate, Company, CompanyAssignment } from '../types/appTypes';

// Obtén la URL base de tus variables de entorno
const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Función helper para manejar las peticiones fetch y parsear el JSON.
 * Maneja errores de red y respuestas HTTP no exitosas.
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // Aquí podrías agregar headers de autenticación, ej:
    // 'Authorization': `Bearer ${getToken()}`
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detail = errorData.detail || `Error HTTP: ${response.status} ${response.statusText}`;
    throw new Error(detail);
  }

  if (response.status === 204 || options.method === 'DELETE') {
    return null as T; 
  }

  return response.json() as Promise<T>;
}

export const getUsuarios = (): Promise<User[]> => {
  return apiFetch<User[]>('/users');
};

export const createUsuario = (userData: UserCreate): Promise<User> => {
  return apiFetch<User>('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const updateUsuario = (userId: number, userData: UserUpdate): Promise<User> => {
  return apiFetch<User>(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  });
};


export const deleteUsuario = (userId: number): Promise<User> => {
  return apiFetch<User>(`/users/${userId}`, {
    method: 'DELETE', 
  });
};


export const getCompanies = (): Promise<Company[]> => {

  return apiFetch<Company[]>('/companies');
};

export const assignCompanyToUser = (assignmentData: CompanyAssignment): Promise<any> => {
  return apiFetch('/companies/assign', {
    method: 'POST',
    body: JSON.stringify(assignmentData),
  });
};
