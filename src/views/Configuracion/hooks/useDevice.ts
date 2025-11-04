import { useState, useEffect, useCallback } from 'react';
import { Company, Center, Device, DeviceCreate, DeviceUpdate } from '../types/DeviceTypes';
import * as api from '../services/apiDeviceService';

export const useDevices = () => {
  // Listas para las 3 columnas
  const [companies, setCompanies] = useState<Company[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);

  // Estado de selección
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [selectedCenterId, setSelectedCenterId] = useState<number | null>(null);

  // Estados de UI
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingCenters, setLoadingCenters] = useState(false);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Carga Inicial de Compañías ---
  const fetchCompanies = useCallback(async () => {
    try {
      setLoadingCompanies(true);
      setError(null);
      const data = await api.getCompanies();
      setCompanies(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingCompanies(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // --- Selección y Carga de Centros ---
  const selectCompany = useCallback(async (companyId: number | null) => {
    if (selectedCompanyId === companyId) return; // No recargar si ya está seleccionado

    setSelectedCompanyId(companyId);
    setSelectedCenterId(null); // Reseteamos la selección de centro
    setDevices([]); // Limpiamos la lista de dispositivos

    if (companyId === null) {
      setCenters([]);
      return;
    }
    
    try {
      setLoadingCenters(true);
      setError(null);
      const data = await api.getCentersByCompany(companyId);
      setCenters(data);
    } catch (err) {
      setError((err as Error).message);
      setCenters([]);
    } finally {
      setLoadingCenters(false);
    }
  }, [selectedCompanyId]);

  // --- Selección y Carga de Dispositivos ---
  const selectCenter = useCallback(async (centerId: number | null) => {
    if (selectedCenterId === centerId) return; // No recargar
    
    setSelectedCenterId(centerId);

    if (centerId === null) {
      setDevices([]);
      return;
    }

    try {
      setLoadingDevices(true);
      setError(null);
      const data = await api.getDevicesByCenter(centerId);
      setDevices(data);
    } catch (err) {
      setError((err as Error).message);
      setDevices([]);
    } finally {
      setLoadingDevices(false);
    }
  }, [selectedCenterId]);

  // --- Refrescar la lista de dispositivos (después de CUD) ---
  const refreshDevices = () => {
    if (selectedCenterId) {
      selectCenter(selectedCenterId);
    }
  }

  // --- Handlers de Dispositivos (CRUD) ---
  // (Estos no actualizan el estado localmente, solo refrescan la lista)
  
  const addDevice = async (data: DeviceCreate) => {
    await api.createDevice(data);
    // Refrescamos la lista del centro al que se añadió
    // (si es el seleccionado, se verá el cambio)
    if (data.center_id === selectedCenterId) {
      refreshDevices();
    }
  };

  const editDevice = async (id: number, data: DeviceUpdate) => {
    await api.updateDevice(id, data);
    refreshDevices();
  };

  const removeDevice = async (id: number) => {
    await api.deleteDevice(id);
    refreshDevices();
  };

  return {
    // Columnas
    companies,
    centers,
    devices,
    // Selección
    selectedCompanyId,
    selectedCenterId,
    // Carga
    loadingCompanies,
    loadingCenters,
    loadingDevices,
    // Estado
    error,
    // Acciones
    selectCompany,
    selectCenter,
    addDevice,
    editDevice,
    removeDevice,
  };
};