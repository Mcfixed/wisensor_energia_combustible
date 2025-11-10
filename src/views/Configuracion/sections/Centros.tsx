import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { Centro, Empresa } from '../../../types/Trazabilidad'; // Asegúrate de importar tu interfaz Centro
import { usePermission } from "../../../hooks/rolesypermisos/usePermission";

export const Centros = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const crearCentros = usePermission("crear centros");
  const [centros, setCentros] = useState<Centro[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEdicion, setModalEdicion] = useState(false);
  const [_, setModalArtefacto] = useState<string | null>(null);
  const [centroSeleccionado, setCentroSeleccionado] = useState<Centro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    codigo: "",
    idEmpresa: ""
  });

  const abrirModalArtefacto = (tipoArtefacto: string, centro: Centro) => {
    setCentroSeleccionado(centro);
    setModalArtefacto(tipoArtefacto);
  };

  // Obtener centros desde la API
  useEffect(() => {
    const fetchCentros = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/centro`)
        const empresasResponse = await fetch(`${apiUrl}/empresa`)

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const dataEmpresas = await empresasResponse.json();

        if (!data.res || !data.data) {
          throw new Error("No se encontraron centros");
        }

        setCentros(data.data);
        setEmpresas(dataEmpresas.data);
        setLoading(false);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCentros();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const abrirModalNuevo = () => {
    setFormData({
      id: "",
      nombre: "",
      codigo: "",
      idEmpresa: ""
    });
    setModalAbierto(true);
    setModalEdicion(false);
  };

  const abrirModalEdicion = (centro: Centro) => {
    setCentroSeleccionado(centro);
    setFormData({
      id: centro.id.toString(),
      nombre: centro.nombre,
      codigo: centro.codigo,
      idEmpresa: centro.idEmpresa.toString()
    });
    setModalAbierto(true);
    setModalEdicion(true);
  };

  const cerrarModales = () => {
    setModalAbierto(false);
    setCentroSeleccionado(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (modalEdicion && centroSeleccionado) {
        // Actualizar centro existente
        const response = await fetch(`${apiUrl}/centro/${centroSeleccionado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.nombre,
            codigo: formData.codigo
          })
        });

        const updatedCentro = await response.json();

        if (!response.ok) {
          throw new Error('Error al actualizar el centro');
        }


        // Actualizar el estado local
        setCentros(centros.map(c =>
          c.id === centroSeleccionado.id ? updatedCentro.data : c
        ));
      } else {
        // Crear nuevo centro
        const response = await fetch(`${apiUrl}/centro`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.nombre,
            codigo: formData.codigo,
            fecha: new Date().toISOString().split('T')[0],
            idEmpresa: 1
          })
        });

        if (!response.ok) {
          throw new Error('Error al crear el centro');
        }

        const nuevoCentro = await response.json();

        // Agregar el nuevo centro al estado local
        setCentros([...centros, nuevoCentro.data]);
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
      const response = await fetch(`${apiUrl}/centro/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el centro');
      }

      setCentros(centros.filter(c => c.id !== id));
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && centros.length === 0) {
    return (
      <div className="p-4 h-full flex items-center justify-center">
        <div className="text-white">Cargando centros...</div>
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
            <h1 className="text-2xl font-bold text-white">Gestión de Centros</h1>
            <p className="text-gray-400 text-sm">Administra los centros de operación</p>
          </div>
          {crearCentros&&(<button
            onClick={abrirModalNuevo}
            className="bg-red-dark hover:bg-red-dark/90 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Agregar Centro
          </button>)}
          
        </div>

        {/* Tabla */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto rounded-lg border border-gray-700 flex-1">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-darkL">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Artefactos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Fecha Creación
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-dark divide-y divide-gray-700">
                {centros.map((centro) => (
                  <tr key={centro.id} className="hover:bg-gray-darkL transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {centro.nombre}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {centro.codigo}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {centro.empresa?.nombre || 'N/A'}
                    </td>

                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex justify-center items-center gap-2 flex-wrap">
                        <button
                          onClick={() => abrirModalArtefacto('modulo', centro)}
                          className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-xs transition-colors cursor-pointer border border-gray-600"
                        >
                          {"Módulo"}
                        </button>
                        <button
                          onClick={() => abrirModalArtefacto('pasillos', centro)}
                          className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-xs transition-colors cursor-pointer border border-gray-600"
                        >
                          {"Pasillos"}
                        </button>
                        <button
                          onClick={() => abrirModalArtefacto('pasadores', centro)}
                          className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-xs transition-colors cursor-pointer border border-gray-600"
                        >
                          {"Pasadores"}
                        </button>
                        <button
                          onClick={() => abrirModalArtefacto('boyas', centro)}
                          className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-xs transition-colors cursor-pointer border border-gray-600"
                        >
                          {"Boyas"}
                        </button>
                        <button
                          onClick={() => abrirModalArtefacto('redes', centro)}
                          className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-xs transition-colors cursor-pointer border border-gray-600"
                        >
                          {"Redes"}
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(centro.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => abrirModalEdicion(centro)}
                        className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-gray-700/50 transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => eliminarRegistro(centro.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700/50 transition-colors"
                        title="Eliminar"
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

        {/* Modal para Centro (Crear/Editar) */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-gray-600/40 bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-darkL rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {modalEdicion ? "Editar Centro" : "Nuevo Centro"}
                  </h2>
                  <button
                    onClick={cerrarModales}
                    className="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Código *
                    </label>
                    <input
                      type="text"
                      name="codigo"
                      value={formData.codigo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="empresa" className="block text-sm font-medium text-gray-300 mb-1">Empresa</label>
                    <select
                      id="empresa"
                      name="idEmpresa"
                      value={formData.idEmpresa}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                    >
                      {empresas.map((empresa) => (
                        <option key={empresa.id} value={empresa.id}>
                          {empresa.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={cerrarModales}
                      className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-dark rounded-md text-white hover:bg-red-dark/90 transition-colors"
                    >
                      {modalEdicion ? "Actualizar" : "Guardar"}
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

export default Centros;