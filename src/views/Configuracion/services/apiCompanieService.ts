import { 
  Company, CompanyCreate, CompanyUpdate, 
  Center, CenterCreate, CenterUpdate 
} from '../types/EmpresaCenterTypes';

const API_URL = import.meta.env.VITE_API_BASE_URL;

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detail = errorData.detail || `Error HTTP: ${response.status}`;
    throw new Error(detail);
  }

  if (response.status === 204) {
    return {} as T;
  }
  return response.json() as Promise<T>;
}


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
  return apiFetch<Company>(`/companies/${id}`, {
    method: 'DELETE',
  });
};

// --- API de Centros ---

export const getCentersByCompany = (companyId: number): Promise<Center[]> => {
  return apiFetch<Center[]>(`/companies/${companyId}/centers`);
};

export const createCenter = (data: CenterCreate): Promise<Center> => {
  return apiFetch<Center>('/centers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateCenter = (id: number, data: CenterUpdate): Promise<Center> => {
  return apiFetch<Center>(`/centers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteCenter = (id: number): Promise<Center> => {
  return apiFetch<Center>(`/centers/${id}`, {
    method: 'DELETE',
  });
};