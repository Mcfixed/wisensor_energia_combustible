import apiClient from '../../../api/api'; 
import { Center, TimeRange } from '../types/index';

export const getFuelSummary = async (timeRange: TimeRange): Promise<Center[]> => {
  const response = await apiClient.get<Center[]>(
    '/fuel/summary',
    {
      params: {
        time_range: timeRange
      }
    }
  );
  return response.data;
};