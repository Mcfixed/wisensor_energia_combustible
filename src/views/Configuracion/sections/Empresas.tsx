import { useState } from 'react';
import { Edit, Trash2, Plus, X, Building, MapPin, Loader2 } from 'lucide-react';
import { useEmpresasYCentros } from '../hooks/useCompanieCenter';
import { Company, Center } from '../types/EmpresaCenterTypes';
// Ajusta la ruta a tu hook de permisos
import { usePermission } from '../../../hooks/rolesypermisos/usePermission'; 

export const Empresas = () => {
  // --- Permisos (Ejemplos) ---
  const crearEmpresa = usePermission("crear empresas");
  const crearCentro = usePermission("crear centros");
  const placeholderPermissions = {
    editarEmpresa: true,
    eliminarEmpresa: true,
    editarCentro: true,
    eliminarCentro: true,
  };

  // --- Hook de Lógica ---
  const {
    companies,
    loading,
    error,
    addCompany,
    editCompany,
    removeCompany,
    addCenter,
    editCenter,
    removeCenter,
  } = useEmpresasYCentros();

  // --- Estados de los Modales ---
  const [modalEmpresa, setModalEmpresa] = useState<Company | 'new' | null>(null);
  const [formEmpresaName, setFormEmpresaName] = useState('');
  
  const [modalCentro, setModalCentro] = useState<Center | 'new' | null>(null);
  const [formCentroName, setFormCentroName] = useState('');
  const [formCentroCompanyId, setFormCentroCompanyId] = useState<number | null>(null);
  
  // *** INICIO DE LA CORRECCIÓN ***
  // Nuevo estado para saber si el modal de centro se abrió en modo "global"
  const [isCentroGlobalAdd, setIsCentroGlobalAdd] = useState(false);
  // *** FIN DE LA CORRECCIÓN ***
  
  const [formError, setFormError] = useState<string | null>(null);

  // --- Handlers de Modales (Empresa) ---
  const abrirModalEmpresa = (empresa: Company | 'new') => {
    setModalEmpresa(empresa);
    setFormEmpresaName(empresa === 'new' ? '' : empresa.name);
    setFormError(null);
  };
  const cerrarModalEmpresa = () => setModalEmpresa(null);

  const handleSubmitEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmpresaName) return;
    setFormError(null);
    try {
      if (modalEmpresa === 'new') {
        await addCompany({ name: formEmpresaName });
      } else if (modalEmpresa) {
        await editCompany(modalEmpresa.id, { name: formEmpresaName });
      }
      cerrarModalEmpresa();
    } catch (err) {
      setFormError((err as Error).message);
    }
  };
  
  const handleEliminarEmpresa = async (empresa: Company) => {
    // Validacion: No permitir borrar empresa si tiene centros
    if (empresa.centers.length > 0) {
      // Usa un modal más bonito si tienes uno
      alert("Error: No puedes eliminar una empresa que tiene centros asignados. Primero elimina los centros.");
      return;
    }
    if (window.confirm(`¿Seguro que quieres eliminar la empresa "${empresa.name}"?`)) {
      try {
        await removeCompany(empresa.id);
      } catch (err) {
         window.alert("Error al eliminar: " + (err as Error).message);
      }
    }
  };

  // --- Handlers de Modales (Centro) ---
  const abrirModalCentro = (centro: Center | 'new', company?: Company) => {
    setModalCentro(centro);
    setFormCentroName(centro === 'new' ? '' : centro.name);
    setFormError(null);

    // *** INICIO DE LA CORRECCIÓN ***
    if (centro === 'new') {
      if (company) {
        // --- Flujo 2: Botón de Fila (Req 5) ---
        // La compañía está pre-fijada
        setFormCentroCompanyId(company.id);
        setIsCentroGlobalAdd(false);
      } else {
        // --- Flujo 1: Botón Global (Req 4) ---
        // Mostraremos el dropdown, pre-seleccionamos la primera empresa
        setFormCentroCompanyId(companies[0]?.id || null); 
        setIsCentroGlobalAdd(true); // Le decimos al modal que muestre el <select>
      }
    } else {
      // --- Flujo 3: Editar Centro ---
      // Modo edición, la compañía es fija
      setFormCentroCompanyId(centro.company_id);
      setIsCentroGlobalAdd(false);
    }
    // *** FIN DE LA CORRECCIÓN ***
  };
  
  const cerrarModalCentro = () => setModalCentro(null);

  const handleSubmitCentro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCentroName || !formCentroCompanyId) {
      setFormError("Nombre y empresa son requeridos.");
      return;
    }
    setFormError(null);
    try {
      if (modalCentro === 'new') {
        await addCenter({ name: formCentroName, company_id: formCentroCompanyId });
      } else if (modalCentro) {
        // Solo permitimos editar el nombre
        await editCenter(modalCentro.id, { name: formCentroName });
      }
      cerrarModalCentro();
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  const handleEliminarCentro = async (centro: Center) => {
    if (window.confirm(`¿Seguro que quieres eliminar el centro "${centro.name}"?`)) {
      try {
        await removeCenter(centro.id, centro.company_id);
      } catch (err) {
        window.alert("Error al eliminar: " + (err as Error).message);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4 h-full flex items-center justify-center text-white">
        <Loader2 className="animate-spin mr-2" /> Cargando datos...
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header y Botones Globales (Req 4) */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700/40">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Empresas y Centros</h1>
          <p className="text-gray-400 text-sm">Administra las empresas y sus centros operativos.</p>
        </div>
        <div className="space-x-2">
          
            <button
              onClick={() => abrirModalEmpresa('new')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus size={18} className="mr-2" /> Nueva Empresa
            </button>
          
          
            <button
              onClick={() => abrirModalCentro('new')} // Flujo 1
              className="bg-red-dark hover:bg-red-dark/90 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus size={18} className="mr-2" /> Nuevo Centro
            </button>
          
        </div>
      </div>
      
      {error && (
         <div className="p-4 mb-4 text-red-300 bg-red-900/50 border border-red-700 rounded-lg">Error: {error}</div>
      )}

      {/* Tabla (Req 1, 2, 3) */}
      <div className="flex-1 overflow-auto border border-gray-700/40">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-darkL">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Empresa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Centros</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-dark divide-y divide-gray-700">
            {companies.map((empresa) => (
              <tr key={empresa.id} className="hover:bg-gray-darkL transition-colors">
                
                <td className="px-6 py-4 whitespace-nowrap align-top">
                  <div className="flex items-center">
                    <Building size={18} className="mr-3 text-gray-400" />
                    <span className="text-white font-medium">{empresa.name}</span>
                  </div>
                </td>
                
                <td className="px-6 py-4 align-top">
                  {/* (Req 3) Columna de Centros */}
                  <div className="flex flex-wrap gap-2">
                    {empresa.centers.length === 0 && (
                      <span className="text-xs text-gray-500">Sin centros</span>
                    )}
                    {empresa.centers.map(centro => (
                      <div key={centro.id} className="group relative flex items-center bg-gray-700 text-gray-200 text-xs px-2 py-1 rounded-full">
                        <MapPin size={12} className="mr-1 text-red-dark" />
                        {centro.name}
                        {/* Mini-acciones de centro */}
                        <div className="absolute left-0 bottom-full mb-1 flex-col p-1 bg-gray-darkL rounded border border-gray-600 shadow-lg opacity-0 group-hover:opacity-100 group-hover:flex z-10 transition-opacity">
                          {placeholderPermissions.editarCentro && 
                            <button onClick={() => abrirModalCentro(centro, empresa)} className="text-blue-400 hover:bg-gray-700 p-1 rounded"><Edit size={14} /></button>}
                          {placeholderPermissions.eliminarCentro && 
                            <button onClick={() => handleEliminarCentro(centro)} className="text-red-400 hover:bg-gray-700 p-1 rounded"><Trash2 size={14} /></button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 align-top">
                  {/* (Req 5) Botón de fila "Agregar Centro" */}
                  {placeholderPermissions.crearCentro && (
                    <button
                      onClick={() => abrirModalCentro('new', empresa)} // Flujo 2
                      className="text-green-400 hover:text-green-300 p-1 rounded hover:bg-gray-700/50"
                      title="Agregar Centro"
                    >
                      <MapPin size={16} />
                    </button>
                  )}
                  {placeholderPermissions.editarEmpresa && (
                    <button
                      onClick={() => abrirModalEmpresa(empresa)}
                      className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-gray-700/50"
                      title="Editar Empresa"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                  {placeholderPermissions.eliminarEmpresa && (
                    <button
                      onClick={() => handleEliminarEmpresa(empresa)}
                      className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700/50"
                      title="Eliminar Empresa"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODALES --- */}

      {/* Modal de Empresa (Crear/Editar) */}
      {(modalEmpresa) && (
        <div className="fixed inset-0 bg-gray-600/40 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-darkL rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
            <form onSubmit={handleSubmitEmpresa}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {modalEmpresa === 'new' ? 'Nueva Empresa' : 'Editar Empresa'}
                  </h2>
                  <button type="button" onClick={cerrarModalEmpresa} className="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-gray-700">
                    <X size={20} />
                  </button>
                </div>
                {formError && <div className="text-red-400 text-sm mb-2">{formError}</div>}
                <label htmlFor="empresaName" className="block text-sm font-medium text-gray-300 mb-1">Nombre *</label>
                <input
                  type="text"
                  id="empresaName"
                  value={formEmpresaName}
                  onChange={(e) => setFormEmpresaName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark"
                  required autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3 p-4 bg-gray-darkL/50 border-t border-gray-700 rounded-b-lg">
                <button type="button" onClick={cerrarModalEmpresa} className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-red-dark rounded-md text-white hover:bg-red-dark/90">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Centro (Crear/Editar) */}
      {(modalCentro) && (
        <div className="fixed inset-0 bg-gray-600/40 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-darkL rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
            <form onSubmit={handleSubmitCentro}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {modalCentro === 'new' ? 'Nuevo Centro' : 'Editar Centro'}
                  </h2>
                  <button type="button" onClick={cerrarModalCentro} className="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-gray-700">
                    <X size={20} />
                  </button>
                </div>
                {formError && <div className="text-red-400 text-sm mb-2">{formError}</div>}
                
                {/* *** INICIO DE LA CORRECCIÓN *** */}
                {/* Selector de Empresa (Req 4) o Texto Fijo (Req 5 / Editar) */}
                <div className="mb-4">
                  <label htmlFor="centroEmpresa" className="block text-sm font-medium text-gray-300 mb-1">Empresa *</label>
                  {isCentroGlobalAdd ? (
                    // Flujo 1: (Botón Global) Muestra el dropdown
                    <select
                      id="centroEmpresa"
                      value={formCentroCompanyId || ''}
                      onChange={(e) => setFormCentroCompanyId(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark"
                    >
                      {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  ) : (
                    // Flujo 2 o 3: (Botón Fila o Editar) Muestra texto fijo
                    <p className="text-white font-semibold p-2 bg-gray-dark rounded-md">
                      {companies.find(c => c.id === formCentroCompanyId)?.name || '...'}
                    </p>
                  )}
                </div>
                {/* *** FIN DE LA CORRECCIÓN *** */}

                <div className="mb-4">
                  <label htmlFor="centroName" className="block text-sm font-medium text-gray-300 mb-1">Nombre del Centro *</label>
                  <input
                    type="text"
                    id="centroName"
                    value={formCentroName}
                    onChange={(e) => setFormCentroName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark"
                    required autoFocus
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-4 bg-gray-darkL/50 border-t border-gray-700 rounded-b-lg">
                <button type="button" onClick={cerrarModalCentro} className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-red-dark rounded-md text-white hover:bg-red-dark/90">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};