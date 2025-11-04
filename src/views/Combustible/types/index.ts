export type TimeRange = '24h' | '7d' | '30d';

export interface SensorData {
  volume_L: number;
  percentage: number;
  pressure_Bar: number;
  sensor_ok: boolean;
  lastUpdate: string;
  latitude: number;
  longitude: number;
}


export interface Tank {
  id: string;
  name: string;
  capacity: number;
  fuelType: string;
  sensor: SensorData;
  centerId: string;
}


export interface Center {
  id: string;
  name: string;
  location: string;
  status: 'secure' | 'warning' | 'danger' | 'maintenance' | 'neutral';
  tanks: Tank[];
  totalCapacity: number;
  currentInventory: number;
}

export interface FuelSummary {
  totalCenters: number;
  totalTanks: number;
  totalInventory: number;
  activeTanks: number;
}