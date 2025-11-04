import apiClient from '../../../api/api';
import { DeviceSummary, DeviceDetailsResponse } from '../types/index';

/**
 * Obtiene el resumen de todos los dispositivos de energía,
 * incluyendo sus datos más recientes y un historial.
 * * @param timeRange - El rango de tiempo (ej: "1d", "7d", "30d")
 */
export const getEnergySummary = async (timeRange: string): Promise<DeviceSummary[]> => {
  const response = await apiClient.get<DeviceSummary[]>(
    '/api/energy/summary',
    {
      // Aquí añadimos el parámetro de consulta
      params: {
        time_range: timeRange
      }
    }
  );
  return response.data;
};
export const getEnergyDetails = async (
  devEui: string, 
  days: number = 30
): Promise<DeviceDetailsResponse> => {
  
  const response = await apiClient.get<DeviceDetailsResponse>(
    `/api/energy/details/${devEui}`, // Endpoint con parámetro de ruta
    {
      params: {
        days: days // Parámetro de consulta
      }
    }
  );
  return response.data;
};