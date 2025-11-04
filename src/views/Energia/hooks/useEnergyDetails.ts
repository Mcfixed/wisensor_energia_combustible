// hooks/useEnergyDetails.ts
import { useState, useEffect } from 'react';
import { getEnergyDetails } from '../services/energiaService';
import { DeviceDetailsResponse } from '../types/index';

export const useEnergyDetails = (devEui: string | null) => {
  const [data, setData] = useState<DeviceDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!devEui) {
      setLoading(false);
      return;
    }

    const fetchData = async () => { 
      try {
        setLoading(true);
        setError(null);
        
        const result = await getEnergyDetails(devEui, 30); 
        setData(result);
        
      } catch (err) {
        console.error("Error al obtener detalles de energía:", err);
        setError("No se pudieron cargar los detalles del dispositivo.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    
  }, [devEui]); 

  return { data, loading, error };
};