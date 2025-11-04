// hooks/useEnergyDetails.ts
import { useState, useEffect } from 'react';
import { getEnergyDetails } from '../services/energiaService';
import { DeviceDetailsResponse } from '../types/index';

export const useEnergyDetails = (devEui: string | null) => {
  const [data, setData] = useState<DeviceDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // No hacer nada si no tenemos un EUI
    if (!devEui) {
      setLoading(false);
      return;
    }

    const fetchData = async () => { 
      try {
        setLoading(true);
        setError(null);
        
        const result = await getEnergyDetails(devEui, 30); // Pedimos 30 días
        setData(result);
        
      } catch (err) {
        console.error("Error al obtener detalles de energía:", err);
        setError("No se pudieron cargar los detalles del dispositivo.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // No necesitamos un intervalo aquí, ya que los datos históricos
    // no cambian tan frecuentemente como los de "resumen".
    // Si quisieras un refresh, lo añadirías aquí.
    
  }, [devEui]); // Se vuelve a ejecutar solo si el EUI cambia

  return { data, loading, error };
};