import { useState, useEffect, useCallback } from 'react';
import { getDeviceDetailsList, getDeviceHistory } from '../services/apiDeviceService';
import { DeviceDetails, MongoHistoryRecord } from '../types/DeviceType';



export const useEstadisticas = () => {
  const [deviceList, setDeviceList] = useState<DeviceDetails[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<DeviceDetails | null>(null);
  const [sensorHistory, setSensorHistory] = useState<MongoHistoryRecord[]>([]);
  const [timeRange, setTimeRange] = useState('1d'); // '1d', '7d', '30d'
  
  const [loadingList, setLoadingList] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  }, []); 

  useEffect(() => {
    if (!selectedSensor) {
      setSensorHistory([]); 
      return;
    }

    const fetchHistory = async () => {
      setLoadingHistory(true);
      setError(null);
      
      try {
        const now = new Date();
        const endDate = now.toISOString();
        const startDate = new Date();

        if (timeRange === '7d') {
          startDate.setDate(now.getDate() - 7);
        } else if (timeRange === '30d') {
          startDate.setDate(now.getDate() - 30);
        } else { 
          startDate.setDate(now.getDate() - 1);
        }
        const startDateISO = startDate.toISOString();

        console.log(`Llamando a getDeviceHistory con: ${selectedSensor.dev_eui}, ${startDateISO}, ${endDate}`);
        
        const data = await getDeviceHistory(selectedSensor.dev_eui, startDateISO, endDate);
        setSensorHistory(data);

      } catch (err: any) {
        setError(err.message || 'Error al cargar el historial del sensor.');
        setSensorHistory([]); 
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [selectedSensor, timeRange]);

  const selectSensor = useCallback((sensor: DeviceDetails) => {
    setSelectedSensor(sensor);
    setSensorHistory([]); 
  }, []);

  const deselectSensor = useCallback(() => {
    setSelectedSensor(null);
    setSensorHistory([]);
  }, []);

  const handleTimeRangeChange = useCallback((range: string) => {
    setTimeRange(range);
  }, []);

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