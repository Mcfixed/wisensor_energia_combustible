import { useState, useEffect, useCallback } from 'react';
// --- CORRECCIÓN DE RUTA ---
// Se asume que 'services' y 'types' son directorios base
// o que hay un alias de ruta configurado en tsconfig.json.
// Se quita el '../'
import { getDeviceDetailsList, getDeviceHistory } from '../services/apiDeviceService';
import { DeviceDetails, MongoHistoryRecord } from '../types/DeviceType';

// Este es el hook "cerebro" que tu componente 'Estadisticas.tsx' utiliza.
// Contiene toda la lógica de estado y de "cuándo" llamar a la API.

export const useEstadisticas = () => {
  // --- Estados ---
  const [deviceList, setDeviceList] = useState<DeviceDetails[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<DeviceDetails | null>(null);
  const [sensorHistory, setSensorHistory] = useState<MongoHistoryRecord[]>([]);
  const [timeRange, setTimeRange] = useState('1d'); // '1d', '7d', '30d'
  
  const [loadingList, setLoadingList] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- EFECTO 1: Cargar la lista de sensores (Solo 1 vez al montar) ---
  useEffect(() => {
    const fetchDeviceList = async () => {
      setLoadingList(true);
      setError(null);
      try {
        const data = await getDeviceDetailsList();
        setDeviceList(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar la lista de dispositivos.');
      } finally {
        setLoadingList(false);
      }
    };
    fetchDeviceList();
  }, []); // El array vacío [] significa "ejecutar solo una vez"

  // --- EFECTO 2: Cargar el historial (Cada vez que 'selectedSensor' o 'timeRange' cambien) ---
  useEffect(() => {
    // Si no hay sensor seleccionado, no hacer nada.
    if (!selectedSensor) {
      setSensorHistory([]); // Limpiar historial si se deselecciona
      return;
    }

    const fetchHistory = async () => {
      setLoadingHistory(true);
      setError(null);
      
      try {
        // Calcular fechas de inicio y fin
        const now = new Date();
        const endDate = now.toISOString();
        const startDate = new Date();

        if (timeRange === '7d') {
          startDate.setDate(now.getDate() - 7);
        } else if (timeRange === '30d') {
          startDate.setDate(now.getDate() - 30);
        } else { // '1d' por defecto
          startDate.setDate(now.getDate() - 1);
        }
        const startDateISO = startDate.toISOString();

        console.log(`Llamando a getDeviceHistory con: ${selectedSensor.dev_eui}, ${startDateISO}, ${endDate}`);
        
        // --- AQUÍ ESTABA EL ERROR ---
        // ¡La llamada a la API!
        // Antes: selectedSensor.dev_e_ui (incorrecto)
        // Ahora: selectedSensor.dev_eui  (correcto)
        const data = await getDeviceHistory(selectedSensor.dev_eui, startDateISO, endDate);
        setSensorHistory(data);

      } catch (err: any) {
        setError(err.message || 'Error al cargar el historial del sensor.');
        setSensorHistory([]); // Limpiar datos en caso de error
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [selectedSensor, timeRange]); // <- Dependencias: Se re-ejecuta si estas cambian

  // --- Manejadores (Funciones que el componente de Vista usa) ---

  const selectSensor = useCallback((sensor: DeviceDetails) => {
    setSelectedSensor(sensor);
    setSensorHistory([]); // Limpiar historial anterior
  }, []);

  const deselectSensor = useCallback(() => {
    setSelectedSensor(null);
    setSensorHistory([]);
  }, []);

  const handleTimeRangeChange = useCallback((range: string) => {
    setTimeRange(range);
  }, []);

  // --- Devolver todos los estados y funciones ---
  return {
    deviceList,
    selectedSensor,
    sensorHistory,
    timeRange,
    loadingList,
    loadingHistory,
    error,
    selectSensor,
    deselectSensor,
    handleTimeRangeChange,
  };
};