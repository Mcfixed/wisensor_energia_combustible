import { 
  Company, CompanyCreate, CompanyUpdate, 
  Center, CenterCreate, CenterUpdate 
} from '../types/EmpresaCenterTypes';

// Asegúrate de que VITE_API_BASE_URL esté en tu .env
// Ej: VITE_API_BASE_URL=http://127.0.0.1:8000/api
const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Función helper para manejar las peticiones fetch.
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${getToken()}` // Añadir auth si es necesario
  };

  const config = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  };

  // Asumimos que la URL base ya incluye /api
  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detail = errorData.detail || `Error HTTP: ${response.status}`;
    throw new Error(detail);
  }

  if (response.status === 204) {
    return {} as T; // Para respuestas 'No Content'
  }
  
  // Tu API (DELETE) devuelve el objeto eliminado, así que siempre parseamos JSON
  return response.json() as Promise<T>;
}

// --- API de Compañías ---

export const getCompanies = (): Promise<Company[]> => {
  return apiFetch<Company[]>('/companies');
};

export const createCompany = (data: CompanyCreate): Promise<Company> => {
  return apiFetch<Company>('/companies', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateCompany = (id: number, data: CompanyUpdate): Promise<Company> => {
  return apiFetch<Company>(`/companies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteCompany = (id: number): Promise<Company> => {
  return apiFetch<Company>(`/api/companies/${id}`, {
    method: 'DELETE',
  });
};

// --- API de Centros ---

export const getCentersByCompany = (companyId: number): Promise<Center[]> => {
  return apiFetch<Center[]>(`/api/companies/${companyId}/centers`);
};

export const createCenter = (data: CenterCreate): Promise<Center> => {
  return apiFetch<Center>('/api/centers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateCenter = (id: number, data: CenterUpdate): Promise<Center> => {
  return apiFetch<Center>(`/api/centers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteCenter = (id: number): Promise<Center> => {
  return apiFetch<Center>(`/api/centers/${id}`, {
    method: 'DELETE',
  });
};