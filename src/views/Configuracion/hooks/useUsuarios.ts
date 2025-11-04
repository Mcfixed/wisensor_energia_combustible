import { useState, useEffect, useCallback } from 'react';
import { User, Company, UserCreate, UserUpdate, CompanyAssignment, UserRole } from '../types/appTypes';
import * as apiService from '../services/apiUserService';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga inicial de usuarios y compañías.
   */
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Realiza ambas peticiones en paralelo
      const [usersData, companiesData] = await Promise.all([
        apiService.getUsuarios(),
        apiService.getCompanies()
      ]);
      
      setUsuarios(usersData);
      setCompanies(companiesData);
      
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto para la carga inicial
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  /**
   * Crea un nuevo usuario y lo asigna a una compañía.
   */
  const addUsuario = async (
    userData: UserCreate, 
    assignmentData: { company_id: number; role: UserRole }
  ) => {
    try {
      // 1. Crear el usuario
      const nuevoUsuario = await apiService.createUsuario(userData);
      
      // 2. Si se creó OK y se seleccionó una compañía, asignarlo
      if (nuevoUsuario && assignmentData.company_id) {
        const fullAssignmentData: CompanyAssignment = {
          user_id: nuevoUsuario.id,
          company_id: assignmentData.company_id,
          role: assignmentData.role,
        };
        await apiService.assignCompanyToUser(fullAssignmentData);
      }
      
      // 3. Actualizar estado local
      setUsuarios(prev => [...prev, nuevoUsuario]);
      
    } catch (err) {
      setError((err as Error).message);
      // Re-lanzar error para que el formulario sepa que falló
      throw err;
    }
  };

  /**
   * Actualiza un usuario (email, password, is_active).
   */
  const editUsuario = async (userId: number, userData: UserUpdate) => {
    try {
      const usuarioActualizado = await apiService.updateUsuario(userId, userData);
      
      // Actualizar estado local
      setUsuarios(prev => 
        prev.map(u => (u.id === userId ? usuarioActualizado : u))
      );
      
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  /**
   * Desactiva un usuario (Soft Delete).
   */
  const removeUsuario = async (userId: number) => {
    try {
      const usuarioDesactivado = await apiService.deleteUsuario(userId);
      
      // Actualizar estado local
      setUsuarios(prev => 
        prev.map(u => (u.id === userId ? usuarioDesactivado : u))
      );
      
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  return {
    usuarios,
    companies,
    loading,
    error,
    fetchInitialData, // Para recargar si es necesario
    addUsuario,
    editUsuario,
    removeUsuario,
  };
};