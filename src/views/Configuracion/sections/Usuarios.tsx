import { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, X, User, Mail } from 'lucide-react';
import { Empresa, Usuario } from '../../../types/Trazabilidad';
import { usePermission } from '../../../hooks/rolesypermisos/usePermission';

export const Usuarios = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const crearUsuarios = usePermission("crear usuarios");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEdicion, setModalEdicion] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    idEmpresa: 0
  });

  // obtener usuarios desde la API
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/usuario`)
        const empresasResponse = await fetch(`${apiUrl}/empresa`)

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const dataEmpresas = await empresasResponse.json();

        if (!data.res || !data.data) {
          throw new Error("No se encontraron usuarios");
        }

        setUsuarios(data.data);
        setEmpresas(dataEmpresas.data);
        setLoading(false);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsuarios();
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
      name: '',
      email: '',
      password: '',
      idEmpresa: 0
    });
    setModalAbierto(true);
    setModalEdicion(false);
  };

  const abrirModalEdicion = (usuario: Usuario) => {
    // Convertir id a string para el formulario
    setUsuarioSeleccionado(usuario);
    setFormData({
      id: usuario.id.toString(), // number → string
      name: usuario.name,
      email: usuario.email,
      password: usuario.password,
      idEmpresa: usuario.idEmpresa
    });
    setModalAbierto(true);
    setModalEdicion(true);
  };

  const cerrarModales = () => {
    setModalAbierto(false);
    setUsuarioSeleccionado(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (modalEdicion && usuarioSeleccionado) {
        // Actualizar usuario existente
        const response = await fetch(`${apiUrl}/usuario/${usuarioSeleccionado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            idEmpresa: formData.idEmpresa
          })
        });

        const updatedUsuario = await response.json();

        if (!response.ok) {
          throw new Error('Error al actualizar el usuario');
        }


        // Actualizar el estado local
        setUsuarios(usuarios.map(c =>
          c.id === usuarioSeleccionado.id ? updatedUsuario.data : c
        ));
      } else {
        // Crear nuevo usuario
        const response = await fetch(`${apiUrl}/usuario`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            idEmpresa: formData.idEmpresa
          })
        });

        if (!response.ok) {
          throw new Error('Error al crear el usuario');
        }

        const nuevoUsuario = await response.json();

        // Agregar el nuevo usuario al estado local
        setUsuarios([...usuarios, nuevoUsuario.data]);
      }

      setModalAbierto(false);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  const eliminarRegistro = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/usuario/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }
      setUsuarios(usuarios.filter(c => c.id !== id));
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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

  // const getRolIcon = (rol: string) => {
  //   switch (rol) {
  //     case 'Administrador': return <Shield size={16} className="mr-2 text-purple-400" />;
  //     case 'Editor': return <Edit size={16} className="mr-2 text-blue-400" />;
  //     default: return <User size={16} className="mr-2 text-gray-400" />;
  //   }
  // };

  return (
    <div className="p-4 h-full">
      <div className="w-full mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
          <div>
            <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
            <p className="text-gray-400 text-sm">Administra los usuarios del sistema</p>
          </div>
          {crearUsuarios&&(<button
            onClick={abrirModalNuevo}
            className="bg-red-dark hover:bg-red-dark/90 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Nuevo Usuario
          </button>)}
          
        </div>

        {/* Tabla */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto rounded-lg border border-gray-700 flex-1">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-darkL">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Empresa</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th> */}
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
                        <div className="text-sm font-medium text-white">{usuario.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <Mail size={16} className="mr-2 text-gray-400" />
                        {usuario.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{usuario.empresa?.nombre}</td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRolIcon(usuario.rol)}
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${usuario.rol === 'Administrador' ? 'bg-purple-900/30 text-purple-400 border border-purple-800' :
                            usuario.rol === 'Editor' ? 'bg-blue-900/30 text-blue-400 border border-blue-800' :
                              'bg-gray-700/30 text-gray-400 border border-gray-600'}`}>
                          {usuario.rol}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${usuario.estado === 'Activo'
                          ? 'bg-green-900/30 text-green-400 border border-green-800'
                          : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
                        {usuario.estado}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      not authorized
                      {/* <button
                        onClick={() => abrirModalEdicion(usuario)}
                        className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-gray-700/50 transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button> */}
                      {/* <button
                        onClick={() => eliminarRegistro(usuario.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700/50 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button> */}
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
                    {modalEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}
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
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                      required
                    />
                  </div>

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
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
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

                  {/* <div className="mb-4">
                    <label htmlFor="rol" className="block text-sm font-medium text-gray-300 mb-1">
                      Rol *
                    </label>
                    <select
                      id="rol"
                      name="rol"
                      value={formData.rol}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                      required
                    >
                      <option value="Administrador">Administrador</option>
                      <option value="Editor">Editor</option>
                      <option value="Usuario">Usuario</option>
                    </select>
                  </div> */}

                  {/* <div className="mb-6">
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-300 mb-1">
                      Estado *
                    </label>
                    <select
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-dark border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-dark focus:border-red-dark"
                      required
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div> */}

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