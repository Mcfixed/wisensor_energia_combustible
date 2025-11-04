import apiClient from '../../../api/api';
import { DeviceSummary, DeviceDetailsResponse } from '../types/index';


export const getEnergySummary = async (timeRange: string): Promise<DeviceSummary[]> => {
  const response = await apiClient.get<DeviceSummary[]>(
    '/api/energy/summary',
    {
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
    `/api/energy/details/${devEui}`,
    {
      params: {
        days: days 
      }
    }
  );
  return response.data;
};