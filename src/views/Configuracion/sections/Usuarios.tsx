import { useState } from 'react';
import { Edit, Trash2, Plus, X, User, Mail, ShieldCheck, ShieldAlert } from 'lucide-react';
import { User as UserType, Company, UserRole } from '../types/appTypes';
import { useUsuarios } from '../hooks/useUsuarios'; 

// Valores iniciales para el formulario
const initialFormData = {
  email: "",
  password: "",
  is_active: true,
  company_id: 0,
  role: "viewer" as UserRole,
};

export const Usuarios = () => {
  // --- Permisos y Estado del Hook ---// Asumiendo que tienes estos// Asumiendo que tienes estos

  // Usamos el hook para manejar toda la lógica de datos
  const { 
    usuarios, 
    companies, 
    loading, 
    error, 
    addUsuario, 
    editUsuario, 
    removeUsuario 
  } = useUsuarios();

  // --- Estado del Modal y Formulario ---
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEdicion, setModalEdicion] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UserType | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Roles disponibles para el dropdown
  const rolesDisponibles: UserRole[] = ["admin", "manager", "viewer"];

  // --- Manejadores de Eventos ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'company_id' ? parseInt(value) : value
      }));
    }
  };

  const abrirModalNuevo = () => {
    setFormData({ ...initialFormData, company_id: companies[0]?.id || 0 });
    setModalAbierto(true);
    setModalEdicion(false);
    setFormError(null);
    setUsuarioSeleccionado(null);
  };

  const abrirModalEdicion = (usuario: UserType) => {
    setUsuarioSeleccionado(usuario);
    setFormData({
      email: usuario.email,
      password: "", // Password nunca se precarga
      is_active: usuario.is_active,
      company_id: 0, // Deshabilitado en edición
      role: "viewer" as UserRole, // Deshabilitado en edición
    });
    setModalAbierto(true);
    setModalEdicion(true);
    setFormError(null);
  };

  const cerrarModales = () => {
    setModalAbierto(false);
    setUsuarioSeleccionado(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (modalEdicion && usuarioSeleccionado) {
        // --- Lógica de Edición ---
        const updateData: { email?: string; password?: string; is_active?: boolean } = {
          email: formData.email,
          is_active: formData.is_active,
        };
        // Solo incluir password si se escribió uno nuevo
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        await editUsuario(usuarioSeleccionado.id, updateData);

      } else {
        // --- Lógica de Creación ---
        if (!formData.password) {
          setFormError("La contraseña es obligatoria para nuevos usuarios.");
          setIsSubmitting(false);
          return;
        }

        const createData = {
          email: formData.email,
          password: formData.password,
        };
        
        const assignmentData = {
          company_id: formData.company_id,
          role: formData.role,
        };

        await addUsuario(createData, assignmentData);
      }

      setModalAbierto(false);
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres desactivar este usuario?")) {
      try {
        await removeUsuario(id);
      } catch (err) {
        setFormError((err as Error).message); // Mostrar error si falla
      }
    }
  };

  // --- Renderizado ---

  if (loading && usuarios.length === 0) {
    return (
      <div className="p-4 h-full flex items-center justify-center">
        <div className="text-white">Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 h-full flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <div className="w-full mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
          <div>
            <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
            <p className="text-gray-400 text-sm">Administra los usuarios del sistema</p>
          </div>
          
            <button
              onClick={abrirModalNuevo}
              className="bg-red-dark hover:bg-red-dark/90 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Nuevo Usuario
            </button>
           
        </div>

        {/* Tabla */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto rounded-lg border border-gray-700 flex-1">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-darkL">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usuario (Email)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-gray-dark divide-y divide-gray-700">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-darkL transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                          <User size={18} className="text-gray-300" />
                        </div>
                        <div className="text-sm font-medium text-white">{usuario.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${usuario.is_active
                          ? 'bg-green-900/30 text-green-400 border border-green-800'
                          : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
                        {usuario.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      
                        <button
                          onClick={() => abrirModalEdicion(usuario)}
                          className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-gray-700/50 transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                      
                      
                        <button
                          onClick={() => handleEliminar(usuario.id)}
                          className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700/50 transition-colors"
                          title="Desactivar"
                        >
                          <Trash2 size={16} />
                        </button>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-gray-600/40 bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-darkL rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
              <form onSubmit={handleSubmit}>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">
                      {modalEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </h2>
                    <button
                      type="button"
                      onClick={cerrarModales}
                      className="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {formError && (
                    <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md mb-4 text-sm">
                      {formError}
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                      Contraseña {modalEdicion ? '(Dejar en blanco para no cambiar)' : '*'}
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                      required={!modalEdicion} // Requerido solo al crear
                    />
                  </div>

                  {/* --- Asignación de Compañía (SOLO AL CREAR) --- */}
                  <fieldset disabled={modalEdicion} className="space-y-4">
                    <div className="mb-4">
                      <label htmlFor="company_id" className="block text-sm font-medium text-gray-300 mb-1">
                        Empresa (Asignación inicial)
                        {modalEdicion && <span className="text-xs text-gray-500"> (No se puede editar aquí)</span>}
                      </label>
                      <select
                        id="company_id"
                        name="company_id"
                        value={formData.company_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark disabled:opacity-50"
                      >
                        <option value={0}>Seleccionar empresa...</option>
                        {companies.map((empresa) => (
                          <option key={empresa.id} value={empresa.id}>
                            {empresa.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
                        Rol (Asignación inicial)
                        {modalEdicion && <span className="text-xs text-gray-500"> (No se puede editar aquí)</span>}
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark disabled:opacity-50"
                      >
                        {rolesDisponibles.map((rol) => (
                          <option key={rol} value={rol}>
                            {rol.charAt(0).toUpperCase() + rol.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </fieldset>

                  {/* --- Estado (SOLO AL EDITAR) --- */}
                  {modalEdicion && (
                    <div className="mb-6">
                      <label className="flex items-center text-sm font-medium text-gray-300">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={formData.is_active}
                          onChange={handleChange}
                          className="h-4 w-4 rounded border-gray-700 bg-gray-dark text-red-dark focus:ring-red-dark"
                        />
                        <span className="ml-2">Usuario Activo</span>
                      </label>
                    </div>
                  )}

                </div>

                {/* Footer del Modal */}
                <div className="flex justify-end space-x-3 p-4 bg-gray-darkL/50 border-t border-gray-700 rounded-b-lg">
                  <button
                    type="button"
                    onClick={cerrarModales}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-dark rounded-md text-white hover:bg-red-dark/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Guardando...' : (modalEdicion ? 'Actualizar' : 'Guardar')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};