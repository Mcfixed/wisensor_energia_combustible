import { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { Comuna, Empresa } from '../../../types/Trazabilidad';
import { usePermission } from '../../../hooks/rolesypermisos/usePermission';

export const Empresas = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const crearEmpresa = usePermission("crear empresas");
  const [empresas, setEmpresa] = useState<Empresa[]>([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<Empresa | null>(null);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEdicion, setModalEdicion] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    rut: '',
    contacto: '',
    correoElectronico: '',
    direccion: '',
    idComuna: 0
  });

  // Obtener empresas desde la API
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/empresa`)
        const responseComunas = await fetch(`${apiUrl}/comuna`)

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const dataComunas = await responseComunas.json();

        if (!data.res || !data.data || !dataComunas.res || !dataComunas.data) {
          throw new Error("No se encontraron empresas");
        }


        setEmpresa(data.data);
        setComunas(dataComunas.data);
        setLoading(false);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const abrirModalNuevo = () => {
    setFormData({
      id: '',
      nombre: '',
      rut: '',
      contacto: '',
      correoElectronico: '',
      direccion: '',
      idComuna: 0
    });
    setModalAbierto(true);
    setModalEdicion(false);
  };

  const abrirModalEdicion = (empresa: Empresa) => {
    setEmpresaSeleccionada(empresa);
    setFormData({
      id: empresa.id.toString(), // number → string
      nombre: empresa.nombre,
      rut: empresa.rut,
      contacto: empresa.contacto,
      correoElectronico: empresa.correoElectronico,
      direccion: empresa.direccion,
      idComuna: empresa.idComuna
    });
    setModalAbierto(true);
    setModalEdicion(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (modalEdicion && empresaSeleccionada) {
        // Convertir formData.id a number para actualizar
        // Actualizar empresa
        const response = await fetch(`${apiUrl}/empresa/${empresaSeleccionada.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.nombre,
            rut: formData.rut,
            correoElectronico: formData.correoElectronico,
            contacto: formData.contacto,
            direccion: formData.direccion,
            idComuna: formData.idComuna
          })
        });


        const updatedEmpresa = await response.json();

        if (!response.ok) {
          throw new Error('Error al actualizar el centro');
        }


        // Actualizar el estado local
        setEmpresa(empresas.map(c =>
          c.id === empresaSeleccionada.id ? updatedEmpresa.data : c
        ));
      } else {
        // nueva empresa
        console.log(formData);
        const response = await fetch(`${apiUrl}/empresa`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.nombre,
            rut: formData.rut,
            correoElectronico: formData.correoElectronico,
            contacto: formData.contacto,
            direccion: formData.direccion,
            idComuna: formData.idComuna
          })
        });

        if (!response.ok) {
          throw new Error('Error al crear el centro');
        }

        const nuevoEmpresa = await response.json();

        // Agregar el nuevo centro al estado local
        setEmpresa([...empresas, nuevoEmpresa.data]);
      }

      setModalAbierto(false);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarRegistro = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/empresa/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el centro');
      }
      setEmpresa(empresas.filter(c => c.id !== id));
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }

  };


  if (loading && empresas.length === 0) {
    return (
      <div className="p-4 h-full flex items-center justify-center">
        <div className="text-white">Cargando empresas...</div>
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
            <h1 className="text-2xl font-bold text-white">Gestión de Empresas</h1>
            <p className="text-gray-400 text-sm">Administra las empresas asociadas al sistema</p>
          </div>
          {crearEmpresa&&(
            <button
            onClick={abrirModalNuevo}
            className="bg-red-dark hover:bg-red-dark/90 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Agregar Empresa
          </button>)}
          
        </div>

        {/* Tabla */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto rounded-lg border border-gray-700 flex-1">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-darkL">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">R.U.T</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Correo Electronico</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contacto</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Direccion</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Comuna</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-gray-dark divide-y divide-gray-700">
                {empresas.map((registro) => (
                  <tr key={registro.id} className="hover:bg-gray-darkL transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{registro.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{registro.rut}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{registro.correoElectronico}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{registro.contacto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{registro.direccion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{registro.comuna?.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {/* <button
                        onClick={() => abrirModalEdicion(registro)}
                        className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-gray-700/50 transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => eliminarRegistro(registro.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700/50 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button> */}
                      not authorized
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
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {modalEdicion ? 'Editar Empresa' : 'Nueva Empresa'}
                  </h2>
                  <button
                    onClick={() => setModalAbierto(false)}
                    className="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">Nombre *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="rut" className="block text-sm font-medium text-gray-300 mb-1">RUT *</label>
                    <input
                      type="text"
                      id="rut"
                      name="rut"
                      value={formData.rut}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="correoElectronico" className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                    <input
                      type="correoElectronico"
                      id="correoElectronico"
                      name="correoElectronico"
                      value={formData.correoElectronico}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="contacto" className="block text-sm font-medium text-gray-300 mb-1">Contacto *</label>
                    <input
                      type="number"
                      id="contacto"
                      name="contacto"
                      value={formData.contacto}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="direccion" className="block text-sm font-medium text-gray-300 mb-1">Direccion *</label>
                    <input
                      type="text"
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                      required
                    />
                  </div>


                  <div className="mb-4">
                    <label htmlFor="comuna" className="block text-sm font-medium text-gray-300 mb-1">Comuna</label>
                    <select
                      id="comuna"
                      name="idComuna"
                      value={formData.idComuna}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                    >
                      {comunas.map((comuna) => (
                        <option key={comuna.id} value={comuna.id}>
                          {comuna.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={() => setModalAbierto(false)}
                      className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-dark rounded-md text-white hover:bg-red-dark/90 transition-colors"
                    >
                      {modalEdicion ? 'Actualizar' : 'Guardar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};