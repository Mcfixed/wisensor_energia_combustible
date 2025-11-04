// (De models/device.py)
export enum DeviceType {
  ENERGIA = "energia",
  COMBUSTIBLE = "combustible",
}
export enum DeviceStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  MAINTENANCE = "maintenance",
  DO_NOT_DISPLAY = "do_not_display",
}

// (De schemas/device.py -> DeviceDetails)
export interface DeviceDetails {
  id: number;
  name: string;
  dev_eui: string;
  type: DeviceType;
  status: DeviceStatus;
  center_id: number;
  center_name: string;
  company_id: number;
  company_name: string;
}

// (De schemas/device.py -> MongoHistoryRecord)
export interface MongoHistoryRecord {
  time: string; // ISO Date String
  object: any; // El 'object' de Mongo (será parseado en el frontend)
}

// Para el selector de fechas
export type TimeRange = '1d' | '7d' | '30d' | '365d' | 'custom';