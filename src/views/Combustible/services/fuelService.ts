// src/services/fuelService.ts
import apiClient from '../../../api/api'; // Asumo que apiClient está en src/services/apiClient.ts
import { Center, TimeRange } from '../types/index';

/**
 * Obtiene el resumen de todos los centros de combustible.
 * @param timeRange - El rango de tiempo (ej: "24h", "7d", "30d")
 */
export const getFuelSummary = async (timeRange: TimeRange): Promise<Center[]> => {
  const response = await apiClient.get<Center[]>(
    '/api/fuel/summary',
    {
      params: {
        time_range: timeRange
      }
    }
  );
  return response.data;
};