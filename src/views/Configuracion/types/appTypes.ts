// Asegúrate de que estos valores coincidan con tu Enum de Python
export type UserRole = "admin" | "manager" | "viewer";

// Basado en el schema User en user.py
export interface User {
  id: number;
  email: string;
  is_active: boolean;
}

// Basado en el schema UserCreate
export interface UserCreate {
  email: string;
  password: string;
}

// Basado en el schema UserUpdate
export interface UserUpdate {
  email?: string;
  password?: string;
  is_active?: boolean;
}

// Basado en el schema Company (asumiendo)
export interface Company {
  id: number;
  name: string;
}

// Basado en el schema CompanyAssignment
export interface CompanyAssignment {
  user_id: number;
  company_id: number;
  role: UserRole;
}

// Para el formulario, combinando datos
export interface UserFormData {
  email: string;
  password?: string; // Opcional al editar
  is_active: boolean;
  company_id: number; // Para la asignación
  role: UserRole; // Para la asignación
}
