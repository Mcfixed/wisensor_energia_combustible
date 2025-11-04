// src/views/combustible/types/index.ts

/**
 * Define el rango de tiempo para las consultas de la API
 * Coincide con el TimeRange del backend y el estado de React
 */
export type TimeRange = '24h' | '7d' | '30d';

/**
 * Datos del sensor (derivados del 'object' de Mongo)
 * Coincide con la 'interface SensorData' de React
 */
export interface SensorData {
  volume_L: number;
  percentage: number;
  pressure_Bar: number;
  sensor_ok: boolean;
  lastUpdate: string;
  latitude: number;
  longitude: number;
}

/**
 * Un tanque individual (S0, S1, o S2)
 * Coincide con la 'interface Tank' de React
 */
export interface Tank {
  id: string;
  name: string;
  capacity: number;
  fuelType: string;
  sensor: SensorData;
  centerId: string;
}

/**
 * El objeto principal del centro (agrupa tanques)
 * Coincide con la 'interface Center' de React
 */
export interface Center {
  id: string;
  name: string;
  location: string;
  status: 'secure' | 'warning' | 'danger' | 'maintenance' | 'neutral';
  tanks: Tank[];
  totalCapacity: number;
  currentInventory: number;
}

/**
 * Objeto resumen para el Header
 */
export interface FuelSummary {
  totalCenters: number;
  totalTanks: number;
  totalInventory: number;
  activeTanks: number;
}