import { useState, useEffect, useCallback, useMemo } from 'react';
import { getFuelSummary } from '../services/fuelService'; 
import { Center, Tank, TimeRange, FuelSummary } from '../types';

export const useFuelData = () => {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h"); 

  const fetchData = useCallback(async () => {
    try {
      if (!centers.length) {
        setLoading(true);
      }
      const data = await getFuelSummary(timeRange);
      setCenters(data);
      setError(null);
    } catch (err) {
      console.error("Error al obtener datos de combustible:", err);
      setError("No se pudieron cargar los datos. Intente más tarde.");
    } finally {
      if (loading) setLoading(false);
    }
  }, [timeRange, centers.length, loading]); 

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, [fetchData]); 

  const allTanks = useMemo(() => centers.flatMap(center => center.tanks), [centers]);
  
  const summary: FuelSummary = useMemo(() => {
    const totalInventory = allTanks.reduce((sum, tank) => sum + tank.sensor.volume_L, 0);
    const activeTanks = allTanks.filter(tank => tank.sensor.sensor_ok).length;
    return {
      totalCenters: centers.length,
      totalTanks: allTanks.length,
      totalInventory: totalInventory,
      activeTanks: activeTanks,
    };
  }, [centers, allTanks]);

  return { 
    centers, 
    allTanks, 
    summary, 
    loading, 
    error, 
    timeRange, 
    setTimeRange,
    refreshData: fetchData 
  };
};