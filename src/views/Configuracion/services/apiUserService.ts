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
    const errorData = await response.json().catch(() => ({})); // Intenta parsear error
    const detail = errorData.detail || `Error HTTP: ${response.status} ${response.statusText}`;
    throw new Error(detail);
  }

  // Si el método es DELETE o la respuesta no tiene contenido (204)
  if (response.status === 204 || options.method === 'DELETE') {
    return null as T; // O un objeto vacío, según prefieras
  }

  return response.json() as Promise<T>;
}

// --- Servicios de Usuarios ---

export const getUsuarios = (): Promise<User[]> => {
  return apiFetch<User[]>('/api/users');
};

export const createUsuario = (userData: UserCreate): Promise<User> => {
  return apiFetch<User>('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const updateUsuario = (userId: number, userData: UserUpdate): Promise<User> => {
  return apiFetch<User>(`/api/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  });
};

/**
 * Desactiva un usuario (Soft Delete)
 */
export const deleteUsuario = (userId: number): Promise<User> => {
  const updateData: UserUpdate = { is_active: false };
  return apiFetch<User>(`/api/users/${userId}`, {
    method: 'DELETE', // Tu endpoint usa DELETE, pero la lógica era de soft-delete
    // Si el endpoint DELETE hace soft-delete, está bien.
    // Si el endpoint DELETE borra de verdad, y quieres soft-delete,
    // deberías llamar a updateUsuario(userId, { is_active: false })
  });
  // Nota: Tu endpoint DELETE /users/{user_id} hacía un soft-delete.
  // Es mejor práctica que un DELETE haga delete, y un PATCH haga soft-delete.
  // Por ahora, sigo tu implementación de endpoint.
};

// --- Servicios de Compañías ---

export const getCompanies = (): Promise<Company[]> => {
  // Asumiendo que tienes un endpoint /companies
  // Si tu endpoint es /empresa, cámbialo aquí.
  return apiFetch<Company[]>('/api/companies');
};

export const assignCompanyToUser = (assignmentData: CompanyAssignment): Promise<any> => {
  return apiFetch('/api/companies/assign', {
    method: 'POST',
    body: JSON.stringify(assignmentData),
  });
};
