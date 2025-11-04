import { DeviceDetails, MongoHistoryRecord } from '../types/DeviceType';

// --- CORRECCIÓN DE ADVERTENCIA 'import.meta' ---
// Verificamos si 'import.meta.env' está disponible.
// Si no lo está (como sugiere la advertencia), usamos un string vacío ''
// como fallback. Esto funciona perfectamente para rutas relativas
// (ej: fetch('/api/devices/details') usará el mismo dominio).
const API_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : '';

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${getToken()}`
  };
  const config = { ...options, headers: { ...defaultHeaders, ...options.headers } };
  
  const url = `${API_URL}${endpoint}`;
  console.log(`[API Fetch] ${options.method || 'GET'} ${url}`); // <-- Log para ver la URL

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detail = errorData.detail || `Error HTTP: ${response.status}`;
    console.error(`[API Error] ${url}`, detail); // <-- Log de error
    throw new Error(detail);
  }
  
  // Si la respuesta es 204 No Content (p.ej. un DELETE), no intentes parsear JSON
  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

/**
 * (Vista 1) Obtiene la lista de todos los sensores con su jerarquía.
 */
export const getDeviceDetailsList = (): Promise<DeviceDetails[]> => {
  return apiFetch<DeviceDetails[]>('/api/devices/details');
};

/**
 * (Vista 2) Obtiene el historial de un sensor de MongoDB.
 */
export const getDeviceHistory = (
  devEui: string,     // <-- El parámetro es 'devEui' (camelCase)
  startDate: string,  // ISO String
  endDate: string     // ISO String
): Promise<MongoHistoryRecord[]> => {
  // Construimos los query parameters
  const params = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
  });

  // --- CORRECCIÓN ---
  // El nombre de la variable en el template string debe coincidir con el parámetro.
  // Antes: ${dev_eui} (undefined)
  // Ahora: ${devEui}  (correcto)
  return apiFetch<MongoHistoryRecord[]>(`/api/devices/${devEui}/history?${params.toString()}`);
};