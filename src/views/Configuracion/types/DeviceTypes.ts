// --- ENUMS (de models/device.py) ---

export enum DeviceStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  MAINTENANCE = "maintenance",
  DO_NOT_DISPLAY = "do_not_display",
}

export enum DeviceType {
  ENERGIA = "energia",
  COMBUSTIBLE = "combustible",
}

// --- Interfaces de Jerarquía ---
// (Simplificadas, solo para navegación)

export interface Company {
  id: number;
  name: string;
}

export interface Center {
  id: number;
  name: string;
  company_id: number;
}

// --- Interfaces de Device (de schemas/device.py) ---

export interface Device {
  id: number;
  name: string;
  dev_eui: string;
  status: DeviceStatus;
  center_id: number;
  type: DeviceType;
}

export interface DeviceCreate {
  name: string;
  dev_eui: string;
  status: DeviceStatus;
  center_id: number;
  type: DeviceType;
}

export interface DeviceUpdate {
  name?: string;
  status?: DeviceStatus;
  type?: DeviceType;
  center_id?: number;
}