
export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface DeviceInfo {
  deviceName: string;
  devEui: string;
  location: string;
  applicationName: string;
  deviceProfileName: string;
}

interface EnergyObject {
  agg_activePower: number;
  phaseA_activePower: number;
  phaseB_activePower: number;
  phaseC_activePower: number;
  agg_reactivePower: number;
  phaseA_reactivePower: number;
  phaseB_reactivePower: number;
  phaseC_reactivePower: number;
  agg_apparentPower: number;
  phaseA_apparentPower: number;
  phaseB_apparentPower: number;
  phaseC_apparentPower: number;
  agg_voltage: number;
  phaseA_voltage: number;
  phaseB_voltage: number;
  phaseC_voltage: number;
  agg_current: number;
  phaseA_current: number;
  phaseB_current: number;
  phaseC_current: number;
  agg_activeEnergy: number;
  phaseA_activeEnergy: number;
  phaseB_activeEnergy: number;
  phaseC_activeEnergy: number;
  agg_reactiveEnergy: number;
  phaseA_reactiveEnergy: number;
  phaseB_reactiveEnergy: number;
  phaseC_reactiveEnergy: number;
  agg_apparentEnergy: number;
  phaseA_apparentEnergy: number;
  phaseB_apparentEnergy: number;
  phaseC_apparentEnergy: number;
  agg_powerFactor: number;
  phaseA_powerFactor: number;
  phaseB_powerFactor: number;
  phaseC_powerFactor: number;
  agg_frequency: number;
  agg_thdI: number;
  phaseA_thdI: number;
  phaseB_thdI: number;
  phaseC_thdI: number;
  phaseA_thdU: number;
  phaseB_thdU: number;
  phaseC_thdU: number;
  model: number;
  address: number;
}

interface HistoricalDataPoint {
  time: string;
  value: number;
}

interface DeviceHistoricalData {
  consumption: HistoricalDataPoint[];
  voltage: HistoricalDataPoint[];
  current: HistoricalDataPoint[];
  power: HistoricalDataPoint[];
  powerFactor: HistoricalDataPoint[];
  frequency: HistoricalDataPoint[];
  thd: HistoricalDataPoint[];
  reactivePower: HistoricalDataPoint[];
  apparentPower: HistoricalDataPoint[];
}

interface DeviceAlert {
  id: number;
  type: 'warning' | 'info' | 'error';
  message: string;
  timestamp: string;
}

export interface DeviceSummary {
  _id: { $oid: string };
  time: string;
  deviceInfo: DeviceInfo;
  object: EnergyObject;
  historicalData: {
    daily: DeviceHistoricalData;
    monthly: DeviceHistoricalData;
  };
  dailyConsumption: number;
  alerts: DeviceAlert[];
  final_energy_counter: number;
}

export interface DailyConsumptionPoint {
  date: string;     
  consumption: number; 
}
export interface MonthlyConsumptionPoint {
  date: string;  
  month_name: string; 
  consumption: number; 
}

export interface DeviceDetailsResponse {
  deviceInfo: DeviceInfo;
  
  dailyConsumption: DailyConsumptionPoint[];
  totalConsumptionLast30Days: number;
  avgDailyConsumption: number;
  
  monthlyConsumption: MonthlyConsumptionPoint[];
  price_kwh: number;
}
// En la parte superior del archivo, define los tipos
export interface ConsumptionGaugeProps {
  value: number;
  max?: number;
  label: string;
  size?: "small" | "medium" | "large";
  color?: "green" | "blue" | "yellow" | "purple" | "red";
}