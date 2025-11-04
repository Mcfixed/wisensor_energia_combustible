import { useState, useEffect } from 'react';
import { getEnergySummary } from '../services/energiaService';
import { DeviceSummary } from '../types';

export const useEnergyData = (timeRange: string) => {
  const [devices, setDevices] = useState<DeviceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (isBackgroundRefresh = false) => { 
      try {
        if (!isBackgroundRefresh) setLoading(true);
        
        const data = await getEnergySummary(timeRange);
        setDevices(data);
        setError(null);
      } catch (err) {
        console.error("Error al obtener datos de energía:", err);
        setError("No se pudieron cargar los datos. Intente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData(false); 
    const intervalId = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(intervalId);
    
  }, [timeRange]); 

  return { devices, loading, error };
};
