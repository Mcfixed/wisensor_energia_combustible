import { 
  Company, Center, 
  Device, DeviceCreate, DeviceUpdate 
} from '../types/DeviceTypes';

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
  
  return response.json() as Promise<T>;
}

export const getCompanies = (): Promise<Company[]> => {
  return apiFetch<Company[]>('/companies');
};

export const getCentersByCompany = (companyId: number): Promise<Center[]> => {
  return apiFetch<Center[]>(`/companies/${companyId}/centers`);
};

export const getDevicesByCenter = (centerId: number): Promise<Device[]> => {
  return apiFetch<Device[]>(`/devices/by_center/${centerId}`);
};

export const createDevice = (data: DeviceCreate): Promise<Device> => {
  return apiFetch<Device>('/devices', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateDevice = (id: number, data: DeviceUpdate): Promise<Device> => {
  return apiFetch<Device>(`/devices/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteDevice = (id: number): Promise<Device> => {
  return apiFetch<Device>(`/devices/${id}`, {
    method: 'DELETE',
  });
};