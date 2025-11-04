// --- Center ---
// (Este no cambia)
export interface Center {
  id: number;
  name: string;
  company_id: number;
}

export interface CenterCreate {
  name: string;
  company_id: number;
}

export interface CenterUpdate {
  name?: string;
}

// --- Company ---
// (Este SÍ cambia)
export interface Company {
  id: number;
  name: string;
  centers: Center[]; // <-- Ahora los centros son parte de la empresa
}

export interface CompanyCreate {
  name: string;
}

export interface CompanyUpdate {
  name?: string;
}