import apiClient from '../../../api/api';
import { DeviceSummary, DeviceDetailsResponse } from '../types/index';


export const getEnergySummary = async (timeRange: string): Promise<DeviceSummary[]> => {
  const response = await apiClient.get<DeviceSummary[]>(
    '/energy/summary',
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
    `/energy/details/${devEui}`,
    {
      params: {
        days: days 
      }
    }
  );
  return response.data;
};

export const updateKwhPriceByDevice = async (
  devEui: string,
  newPrice: number
): Promise<{ message: string; new_price: number }> => {
  
  const response = await apiClient.put(
    `/energy/price/${devEui}`,
    { price_kwh: newPrice } // Este es el body (CenterPriceUpdate)
  );
  
  return response.data;
};