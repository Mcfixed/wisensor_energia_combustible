import { 
  Company, Center, 
  Device, DeviceCreate, DeviceUpdate 
} from '../types/DeviceTypes';

// Asumimos que la URL base ya incluye /api
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

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detail = errorData.detail || `Error HTTP: ${response.status}`;
    throw new Error(detail);
  }
  
  return response.json() as Promise<T>;
}

// --- API de Jerarquía (Empresas y Centros) ---
// Nota: Estas son de los endpoints que creamos en los pasos anteriores

export const getCompanies = (): Promise<Company[]> => {
  // Asumimos que este endpoint devuelve Company[]
  return apiFetch<Company[]>('/api/companies');
};

export const getCentersByCompany = (companyId: number): Promise<Center[]> => {
  // Asumimos que este endpoint devuelve Center[]
  return apiFetch<Center[]>(`/api/companies/${companyId}/centers`);
};


// --- API de Dispositivos (Devices) ---

export const getDevicesByCenter = (centerId: number): Promise<Device[]> => {
  return apiFetch<Device[]>(`/api/devices/by_center/${centerId}`);
};

export const createDevice = (data: DeviceCreate): Promise<Device> => {
  return apiFetch<Device>('/api/devices', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateDevice = (id: number, data: DeviceUpdate): Promise<Device> => {
  return apiFetch<Device>(`/api/devices/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteDevice = (id: number): Promise<Device> => {
  return apiFetch<Device>(`/api/devices/${id}`, {
    method: 'DELETE',
  });
};