import { DeviceDetails, MongoHistoryRecord } from '../types/DeviceType';

const API_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : '';

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  const config = { ...options, headers: { ...defaultHeaders, ...options.headers } };
  
  const url = `${API_URL}${endpoint}`;
  console.log(`[API Fetch] ${options.method || 'GET'} ${url}`); 

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detail = errorData.detail || `Error HTTP: ${response.status}`;
    console.error(`[API Error] ${url}`, detail); 
    throw new Error(detail);
  }
  
  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export const getDeviceDetailsList = (): Promise<DeviceDetails[]> => {
  return apiFetch<DeviceDetails[]>('/api/devices/details');
};

export const getDeviceHistory = (
  devEui: string,    
  startDate: string,  
  endDate: string     
): Promise<MongoHistoryRecord[]> => {
  const params = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
  });

  return apiFetch<MongoHistoryRecord[]>(`/api/devices/${devEui}/history?${params.toString()}`);
};