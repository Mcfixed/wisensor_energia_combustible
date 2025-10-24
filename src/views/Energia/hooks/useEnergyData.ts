import { useState, useEffect } from 'react';
import { getEnergySummary } from '../services/energiaService';
import { DeviceSummary } from '../types';

export const useEnergyData = () => {
  const [devices, setDevices] = useState<DeviceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- NUEVO: Estado para el rango de tiempo ---
  const [timeRange, setTimeRange] = useState("1d"); // Default a 1 día

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // --- MODIFICADO: Pasa el timeRange a la llamada ---
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

    fetchData();

    // Recargar datos cada 30 segundos (para el rango seleccionado)
    const intervalId = setInterval(fetchData, 30000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
    
  // --- MODIFICADO: El hook se re-ejecuta si 'timeRange' cambia ---
  }, [timeRange]); 

  // --- MODIFICADO: Exponer el estado y la función para cambiarlo ---
  return { devices, loading, error, timeRange, setTimeRange };
};