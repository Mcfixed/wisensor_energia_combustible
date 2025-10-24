import apiClient from './api';
import { DeviceSummary } from '../types';

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