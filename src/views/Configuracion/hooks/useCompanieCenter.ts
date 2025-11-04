import { useState, useEffect, useCallback } from 'react';
import { Company, Center, CompanyCreate, CompanyUpdate, CenterCreate, CenterUpdate } from '../types/EmpresaCenterTypes';
// Asumimos que apiService está en la misma carpeta y tiene las funciones
import * as api from '../services/apiCompanieService'; 

export const useEmpresasYCentros = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Carga Inicial de Compañías (que ya traen sus centros) ---
  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCompanies();
      setCompanies(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // --- Handlers de Compañías ---
  const addCompany = async (data: CompanyCreate) => {
    const newCompany = await api.createCompany(data);
    // Añadimos la nueva compañía al estado (con centros vacíos)
    setCompanies(prev => [...prev, { ...newCompany, centers: [] }]);
  };

  const editCompany = async (id: number, data: CompanyUpdate) => {
    const updatedCompany = await api.updateCompany(id, data);
    // Actualizamos solo el nombre de la compañía en el estado
    setCompanies(prev => 
      prev.map(c => (c.id === id ? { ...c, name: updatedCompany.name } : c))
    );
  };

  const removeCompany = async (id: number) => {
    await api.deleteCompany(id);
    setCompanies(prev => prev.filter(c => c.id !== id));
  };

  // --- Handlers de Centros ---
  const addCenter = async (data: CenterCreate) => {
    const newCenter = await api.createCenter(data);
    // Buscamos la compañía y añadimos el nuevo centro a su lista
    setCompanies(prev => 
      prev.map(c => 
        c.id === data.company_id 
          ? { ...c, centers: [...c.centers, newCenter] }
          : c
      )
    );
  };

  const editCenter = async (id: number, data: CenterUpdate) => {
    const updatedCenter = await api.updateCenter(id, data);
    // Doble map: encontramos la compañía, luego el centro, y lo actualizamos
    setCompanies(prev => 
      prev.map(c => 
        c.id === updatedCenter.company_id
          ? { ...c, centers: c.centers.map(center => 
              center.id === id ? updatedCenter : center
            )}
          : c
      )
    );
  };

  const removeCenter = async (id: number, companyId: number) => {
    await api.deleteCenter(id);
    // Buscamos la compañía y filtramos el centro eliminado
    setCompanies(prev => 
      prev.map(c => 
        c.id === companyId
          ? { ...c, centers: c.centers.filter(center => center.id !== id) }
          : c
      )
    );
  };

  return {
    companies,
    loading,
    error,
    addCompany,
    editCompany,
    removeCompany,
    addCenter,
    editCenter,
    removeCenter,
  };
};