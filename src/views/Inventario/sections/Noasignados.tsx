import { Eye, History, Package, Search, AlertTriangle, MapPin, Warehouse, X } from "lucide-react";
import React, { useState } from "react";

export const Noasignados = () => {
  // Elementos no asignados (en bodega)
  const [elementosNoAsignados] = useState([
    // Boyas en bodega
    { 
      id: "B101", 
      nombre: "boya1", 
      tipo: "boyas", 
      estado: "Disponible", 
      cantidad: 1, 
      fechaIngreso: "2024-08-15", 
      ubicacion: "Bodega Principal", 
      condicion: "Nuevo",
      historial: [
        { id: 1, tipo: "compra", descripcion: "Comprado en lote B-2024", fecha: "2024-08-10", usuario: "compras1", detalles: "Lote de 50 boyas nuevas" },
        { id: 2, tipo: "ingreso", descripcion: "Ingresado a bodega", fecha: "2024-08-15", usuario: "bodega1", detalles: "Ubicación: Estante B-12" }
      ]
    },
    { 
      id: "B102", 
      nombre: "boya2", 
      tipo: "boyas", 
      estado: "En reparación", 
      cantidad: 1, 
      fechaIngreso: "2024-07-22", 
      ubicacion: "Taller Mantenimiento", 
      condicion: "Reparación",
      historial: [
        { id: 1, tipo: "compra", descripcion: "Comprado en lote B-2023", fecha: "2023-11-20", usuario: "compras1", detalles: "Lote de 30 boyas" },
        { id: 2, tipo: "baja_centro", descripcion: "Retirado del centro Alao", fecha: "2024-07-15", usuario: "tecnico3", detalles: "Daño por impacto" },
        { id: 3, tipo: "ingreso", descripcion: "Ingresado a taller", fecha: "2024-07-22", usuario: "bodega2", detalles: "Para reparación" }
      ]
    },
    { 
      id: "B103", 
      nombre: "boya3", 
      tipo: "boyas", 
      estado: "Disponible", 
      cantidad: 1, 
      fechaIngreso: "2024-09-01", 
      ubicacion: "Bodega Secundaria", 
      condicion: "Nuevo",
      historial: [
        { id: 1, tipo: "compra", descripcion: "Compra individual", fecha: "2024-08-28", usuario: "compras2", detalles: "Reposición de stock" },
        { id: 2, tipo: "ingreso", descripcion: "Ingresado a bodega", fecha: "2024-09-01", usuario: "bodega1", detalles: "Ubicación: Estante C-05" }
      ]
    },

    // Redes en bodega
    { 
      id: "R035", 
      nombre: "red35", 
      tipo: "redes", 
      estado: "Disponible", 
      cantidad: 1, 
      fechaIngreso: "2024-06-10", 
      ubicacion: "Bodega Principal", 
      condicion: "Nuevo",
      historial: [
        { id: 1, tipo: "compra", descripcion: "Comprado en lote R-2024", fecha: "2024-05-30", usuario: "compras1", detalles: "Lote de 20 redes" },
        { id: 2, tipo: "ingreso", descripcion: "Ingresado a bodega", fecha: "2024-06-10", usuario: "bodega1", detalles: "Ubicación: Estante R-08" }
      ]
    },
    { 
      id: "R056", 
      nombre: "red56", 
      tipo: "redes", 
      estado: "En inspección", 
      cantidad: 1, 
      fechaIngreso: "2024-08-30", 
      ubicacion: "Área Control Calidad", 
      condicion: "Usado",
      historial: [
        { id: 1, tipo: "compra", descripcion: "Comprado en lote R-2022", fecha: "2022-10-15", usuario: "compras1", detalles: "Lote de 15 redes" },
        { id: 2, tipo: "baja_centro", descripcion: "Retirado del centro Puduguapi", fecha: "2024-08-25", usuario: "tecnico2", detalles: "Rotación programada" },
        { id: 3, tipo: "ingreso", descripcion: "Ingresado a control calidad", fecha: "2024-08-30", usuario: "calidad1", detalles: "Para inspección y limpieza" }
      ]
    },
    { 
      id: "R057", 
      nombre: "red57", 
      tipo: "redes", 
      estado: "Disponible", 
      cantidad: 1, 
      fechaIngreso: "2024-09-12", 
      ubicacion: "Bodega Principal", 
      condicion: "Reacondicionado",
      historial: [
        { id: 1, tipo: "compra", descripcion: "Comprado en lote R-2021", fecha: "2021-12-10", usuario: "compras1", detalles: "Lote de 25 redes" },
        { id: 2, tipo: "baja_centro", descripcion: "Retirado del centro Quenac", fecha: "2024-08-20", usuario: "tecnico4", detalles: "Fin de ciclo productivo" },
        { id: 3, tipo: "reparacion", descripcion: "Reacondicionamiento completo", fecha: "2024-09-05", usuario: "taller1", detalles: "Reparación y limpieza completa" },
        { id: 4, tipo: "ingreso", descripcion: "Ingresado a bodega", fecha: "2024-09-12", usuario: "bodega1", detalles: "Listo para reasignación" }
      ]
    },

    // Pasillos en bodega
    { 
      id: "P346", 
      nombre: "pasillo346", 
      tipo: "pasillos", 
      estado: "Disponible", 
      cantidad: 1, 
      fechaIngreso: "2024-07-05", 
      ubicacion: "Patio Almacenamiento", 
      condicion: "Nuevo",
      historial: [
        { id: 1, tipo: "compra", descripcion: "Compra proyecto expansión", fecha: "2024-06-20", usuario: "proyectos1", detalles: "Material para nueva línea" },
        { id: 2, tipo: "ingreso", descripcion: "Ingresado a patio", fecha: "2024-07-05", usuario: "bodega3", detalles: "Ubicación: Sector Exterior" }
      ]
    },
    { 
      id: "P347", 
      nombre: "pasillo347", 
      tipo: "pasillos", 
      estado: "En mantenimiento", 
      cantidad: 1, 
      fechaIngreso: "2024-08-18", 
      ubicacion: "Taller Estructuras", 
      condicion: "Reparación",
      historial: [
        { id: 1, tipo: "compra", descripcion: "Comprado en lote P-2023", fecha: "2023-09-15", usuario: "compras1", detalles: "Lote de 10 pasillos" },
        { id: 2, tipo: "baja_centro", descripcion: "Retirado del centro Alao", fecha: "2024-08-10", usuario: "tecnico1", detalles: "Daño estructural leve" },
        { id: 3, tipo: "ingreso", descripcion: "Ingresado a taller", fecha: "2024-08-18", usuario: "bodega2", detalles: "Para reforzamiento estructural" }
      ]
    },

    // Pasadores en bodega
    { 
      id: "PS201", 
      nombre: "pasador201", 
      tipo: "pasadores", 
      estado: "Disponible", 
      cantidad: 50, 
      fechaIngreso: "2024-09-01", 
      ubicacion: "Bodega Principal", 
      condicion: "Nuevo",
      historial: [
        { id: 1, tipo: "compra", descripcion: "Compra stock mensual", fecha: "2024-08-25", usuario: "compras1", detalles: "Lote de 200 pasadores" },
        { id: 2, tipo: "ingreso", descripcion: "Ingresado a bodega", fecha: "2024-09-01", usuario: "bodega1", detalles: "Ubicación: Estante P-15" }
      ]
    },
    { 
      id: "PS202", 
      nombre: "pasador202", 
      tipo: "pasadores", 
      estado: "Disponible", 
      cantidad: 25, 
      fechaIngreso: "2024-08-10", 
      ubicacion: "Bodega Secundaria", 
      condicion: "Reacondicionado",
      historial: [
        { id: 1, tipo: "compra", descripcion: "Comprado en lote PS-2022", fecha: "2022-11-30", usuario: "compras1", detalles: "Lote de 100 pasadores" },
        { id: 2, tipo: "recuperacion", descripcion: "Recuperado de centro", fecha: "2024-07-28", usuario: "tecnico2", detalles: "Retirado por actualización" },
        { id: 3, tipo: "reacondicionado", descripcion: "Reacondicionado", fecha: "2024-08-05", usuario: "taller1", detalles: "Limpieza y pintura" },
        { id: 4, tipo: "ingreso", descripcion: "Ingresado a bodega", fecha: "2024-08-10", usuario: "bodega1", detalles: "Listo para reuso" }
      ]
    },

    // Líneas de fondeo en bodega
    { 
      id: "L089", 
      nombre: "linea89", 
      tipo: "lineas", 
      estado: "Disponible", 
      cantidad: 1, 
      fechaIngreso: "2024-07-30", 
      ubicacion: "Bodega Cableado", 
      condicion: "Nuevo",
      historial: [
        { id: 1, tipo: "compra", descripcion: "Compra específica proyecto", fecha: "2024-07-15", usuario: "proyectos2", detalles: "Línea especial 200m" },
        { id: 2, tipo: "ingreso", descripcion: "Ingresado a bodega", fecha: "2024-07-30", usuario: "bodega2", detalles: "Ubicación: Carrete L-04" }
      ]
    },
    { 
      id: "L090", 
      nombre: "linea90", 
      tipo: "lineas", 
      estado: "En evaluación", 
      cantidad: 1, 
      fechaIngreso: "2024-09-05", 
      ubicacion: "Laboratorio Pruebas", 
      condicion: "Usado",
      historial: [
        { id: 1, tipo: "compra", descripcion: "Comprado en lote L-2023", fecha: "2023-04-18", usuario: "compras1", detalles: "Lote de 8 líneas" },
        { id: 2, tipo: "baja_centro", descripcion: "Retirado del centro Puduguapi2", fecha: "2024-08-28", usuario: "tecnico3", detalles: "Fin de vida útil operativa" },
        { id: 3, tipo: "ingreso", descripcion: "Ingresado a laboratorio", fecha: "2024-09-05", usuario: "calidad2", detalles: "Para evaluación de reuso" }
      ]
    }
  ]);

  const tiposElementos = [
    { id: 'todos', label: 'Todos los Elementos', icon: '' },
    { id: 'boyas', label: 'Boyas', icon: '' },
    { id: 'redes', label: 'Redes', icon: '' },
    { id: 'pasadores', label: 'Pasadores', icon: '' },
    { id: 'lineas', label: 'Líneas de Fondeo', icon: '' },
    { id: 'pasillos', label: 'Pasillos', icon: '' },
  ];

  const estadosFiltro = [
    { id: 'todos', label: 'Todos los estados' },
    { id: 'Disponible', label: 'Disponible' },
    { id: 'En reparación', label: 'En reparación' },
    { id: 'En inspección', label: 'En inspección' },
    { id: 'En mantenimiento', label: 'En mantenimiento' },
    { id: 'En evaluación', label: 'En evaluación' }
  ];

  const [tipoActivo, setTipoActivo] = useState<string>('todos');
  const [estadoActivo, setEstadoActivo] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [modalDetalles, setModalDetalles] = useState(false);
  const [modalHistorial, setModalHistorial] = useState(false);
  const [elementoSeleccionado, setElementoSeleccionado] = useState<any>(null);

  const abrirModalDetalles = (elemento: any) => {
    setElementoSeleccionado(elemento);
    setModalDetalles(true);
  };

  const abrirModalHistorial = (elemento: any) => {
    setElementoSeleccionado(elemento);
    setModalHistorial(true);
  };

  // Filtrar elementos
  const elementosFiltrados = elementosNoAsignados.filter(elemento => {
    const coincideTipo = tipoActivo === 'todos' || elemento.tipo === tipoActivo;
    const coincideEstado = estadoActivo === 'todos' || elemento.estado === estadoActivo;
    const coincideBusqueda = !busqueda || 
      elemento.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      elemento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      elemento.ubicacion.toLowerCase().includes(busqueda.toLowerCase());
    
    return coincideTipo && coincideEstado && coincideBusqueda;
  });

  // Estadísticas
  const estadisticas = {
    total: elementosNoAsignados.length,
    disponibles: elementosNoAsignados.filter(e => e.estado === 'Disponible').length,
    enReparacion: elementosNoAsignados.filter(e => e.estado === 'En reparación').length,
    enInspeccion: elementosNoAsignados.filter(e => e.estado === 'En inspección').length,
  };

  // Iconos para tipos de eventos del historial
  const getIconoEvento = (tipo: string) => {
    switch (tipo) {
      case 'compra': return '';
      case 'ingreso': return '';
      case 'baja_centro': return '';
      case 'reparacion': return '';
      case 'reacondicionado': return '';
      case 'recuperacion': return '';
      default: return '';
    }
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'Disponible': return 'bg-green-900/20 text-green-400';
      case 'En reparación': return 'bg-orange-900/20 text-orange-400';
      case 'En inspección': return 'bg-yellow-900/20 text-yellow-400';
      case 'En mantenimiento': return 'bg-blue-900/20 text-blue-400';
      case 'En evaluación': return 'bg-purple-900/20 text-purple-400';
      default: return 'bg-gray-900/20 text-gray-400';
    }
  };

  const getColorCondicion = (condicion: string) => {
    switch (condicion) {
      case 'Nuevo': return 'bg-green-900/20 text-green-400';
      case 'Usado': return 'bg-yellow-900/20 text-yellow-400';
      case 'Reacondicionado': return 'bg-blue-900/20 text-blue-400';
      case 'Reparación': return 'bg-orange-900/20 text-orange-400';
      default: return 'bg-gray-900/20 text-gray-400';
    }
  };

  return (
    <>
      {/* Header con estadísticas */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Warehouse size={20} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Elementos No Asignados</h1>
            <p className="text-sm text-gray-400">Inventario en bodega y talleres</p>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-800/30 rounded p-3 text-center">
            <div className="text-white font-semibold text-sm">{estadisticas.total}</div>
            <div className="text-gray-400 text-xs">Total</div>
          </div>
          <div className="bg-green-500/10 rounded p-3 text-center">
            <div className="text-green-400 font-semibold text-sm">{estadisticas.disponibles}</div>
            <div className="text-gray-400 text-xs">Disponibles</div>
          </div>
          <div className="bg-orange-500/10 rounded p-3 text-center">
            <div className="text-orange-400 font-semibold text-sm">{estadisticas.enReparacion}</div>
            <div className="text-gray-400 text-xs">En Reparación</div>
          </div>
          <div className="bg-yellow-500/10 rounded p-3 text-center">
            <div className="text-yellow-400 font-semibold text-sm">{estadisticas.enInspeccion}</div>
            <div className="text-gray-400 text-xs">En Inspección</div>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="mb-4">
        <div className="flex flex-wrap md:flex-nowrap items-end gap-3">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por ID, nombre o ubicación..."
                className="block w-full pl-10 pr-3 py-1.5 bg-gray-dark text-xs text-gray-100 placeholder-gray-400 
                            focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent
                            transition-all duration-200 ease-in-out shadow-sm"
              />
            </div>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-xs text-gray-300 mb-1">
              Tipo de Elemento
            </label>
            <select 
              value={tipoActivo}
              onChange={(e) => setTipoActivo(e.target.value)}
              className="block w-full px-2 py-1.5 bg-gray-dark text-xs text-gray-100 
                          focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
            >
              {tiposElementos.map(tipo => (
                <option key={tipo.id} value={tipo.id}>{tipo.label}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-xs text-gray-300 mb-1">
              Estado
            </label>
            <select 
              value={estadoActivo}
              onChange={(e) => setEstadoActivo(e.target.value)}
              className="block w-full px-2 py-1.5 bg-gray-dark text-xs text-gray-100 
                          focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
            >
              {estadosFiltro.map(estado => (
                <option key={estado.id} value={estado.id}>{estado.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pestañas de Tipos de Elementos */}
      <div className="mb-2">
        <div className="flex space-x-1 overflow-x-auto pb-1">
          {tiposElementos.map((tipo) => (
            <button
              key={tipo.id}
              onClick={() => setTipoActivo(tipo.id)}
              className={`flex items-center gap-1.5 py-1 px-3 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                tipoActivo === tipo.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
              }`}
            >
              <span className="text-[10px]">{tipo.icon}</span>
              {tipo.label}
              <span className="text-[10px] bg-gray-600/50 px-1 py-0.5 rounded">
                {tipo.id === 'todos' 
                  ? elementosNoAsignados.length 
                  : elementosNoAsignados.filter(e => e.tipo === tipo.id).length
                }
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Elementos No Asignados */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto border border-gray-700/40 flex-1 custom-scroll">
          <table className="min-w-full divide-y divide-gray-700 w-full">
            <thead className="sticky top-0 z-9 bg-gray-darkL shadow">
              <tr className="text-[10px]">
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/8">
                  ID
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/8">
                  Nombre
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/8">
                  Tipo
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/8">
                  Estado
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/8">
                  Condición
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/8">
                  Ubicación
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/8">
                  Ingreso
                </th>
                <th className="px-2 py-1 text-right font-medium text-gray-300 uppercase tracking-wider w-1/8">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-dark divide-y divide-gray-700/50">
              {elementosFiltrados.map((elemento) => (
                <tr
                  key={elemento.id}
                  className="hover:bg-gray-darkL transition-colors text-[11px]"
                >
                  <td className="px-2 py-0.5 whitespace-nowrap font-mono text-blue-400">
                    {elemento.id}
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap text-white">
                    {elemento.nombre}
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-0.5 text-gray-300">
                      {elemento.tipo === 'boyas' && ''}
                      {elemento.tipo === 'redes' && ''}
                      {elemento.tipo === 'pasadores' && ''}
                      {elemento.tipo === 'lineas' && ''}
                      {elemento.tipo === 'pasillos' && ''}
                      <span className="capitalize">{elemento.tipo}</span>
                    </span>
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap">
                    <span className={`inline-flex text-[10px] leading-4 font-semibold rounded-full px-1.5 py-0.5 ${getColorEstado(elemento.estado)}`}>
                      {elemento.estado}
                    </span>
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap">
                    <span className={`inline-flex text-[10px] leading-4 font-semibold rounded-full px-1.5 py-0.5 ${getColorCondicion(elemento.condicion)}`}>
                      {elemento.condicion}
                    </span>
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap text-gray-300">
                    <div className="flex items-center gap-0.5">
                      <MapPin size={8} className="text-gray-400" />
                      {elemento.ubicacion}
                    </div>
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap text-gray-300">
                    {elemento.fechaIngreso}
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        className="text-gray-400 hover:text-blue-400 p-0.5 rounded hover:bg-gray-700 cursor-pointer"
                        onClick={() => abrirModalDetalles(elemento)}
                        title="Ver detalles"
                      >
                        <Eye size={12} />
                      </button>
                      <button
                        className="text-gray-400 hover:text-purple-400 p-0.5 rounded hover:bg-gray-700 cursor-pointer"
                        onClick={() => abrirModalHistorial(elemento)}
                        title="Ver historial"
                      >
                        <History size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {elementosFiltrados.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-xs">
              <Package size={24} className="mx-auto mb-2 text-gray-500" />
              No hay elementos no asignados con los filtros aplicados.
            </div>
          )}

          {/* Contador de resultados */}
          {elementosFiltrados.length > 0 && (
            <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 px-2 py-1 text-xs text-gray-400">
              Mostrando {elementosFiltrados.length} de {elementosNoAsignados.length} elementos no asignados
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles */}
      {modalDetalles && elementoSeleccionado && (
        <div className="fixed inset-0 bg-gray-600/40 bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-darkL shadow-2xl w-full max-w-md border border-gray-700 rounded-lg">
            <div className="flex justify-between items-center p-3 border-b border-gray-700">
              <h3 className="text-sm font-semibold text-white">
                Detalles del Elemento
              </h3>
              <button
                onClick={() => setModalDetalles(false)}
                className="text-gray-400 hover:text-gray-300 p-0.5 rounded hover:bg-gray-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400 text-[10px]">ID:</p>
                    <p className="text-white font-mono">{elementoSeleccionado.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px]">Nombre:</p>
                    <p className="text-white">{elementoSeleccionado.nombre}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px]">Tipo:</p>
                    <p className="text-white capitalize">{elementoSeleccionado.tipo}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px]">Estado:</p>
                    <p className={`${getColorEstado(elementoSeleccionado.estado)} inline-block px-1.5 py-0.5 rounded text-[10px]`}>
                      {elementoSeleccionado.estado}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px]">Condición:</p>
                    <p className={`${getColorCondicion(elementoSeleccionado.condicion)} inline-block px-1.5 py-0.5 rounded text-[10px]`}>
                      {elementoSeleccionado.condicion}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px]">Cantidad:</p>
                    <p className="text-white">{elementoSeleccionado.cantidad}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px]">Ubicación:</p>
                    <p className="text-white flex items-center gap-1">
                      <MapPin size={10} />
                      {elementoSeleccionado.ubicacion}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px]">Ingreso:</p>
                    <p className="text-white">{elementoSeleccionado.fechaIngreso}</p>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-700">
                  <h4 className="text-xs font-medium text-white mb-1">Acciones</h4>
                  <div className="flex gap-1">
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs">
                      Asignar a Centro
                    </button>
                    <button 
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-1 px-2 rounded text-xs"
                      onClick={() => {
                        setModalDetalles(false);
                        abrirModalHistorial(elementoSeleccionado);
                      }}
                    >
                      Ver Historial
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Historial */}
      {modalHistorial && elementoSeleccionado && (
        <div className="fixed inset-0 bg-gray-600/40 bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-darkL shadow-2xl w-full max-w-2xl border border-gray-700 rounded-lg">
            <div className="flex justify-between items-center p-3 border-b border-gray-700">
              <h3 className="text-sm font-semibold text-white">
                Historial - {elementoSeleccionado.nombre} ({elementoSeleccionado.id})
              </h3>
              <button
                onClick={() => setModalHistorial(false)}
                className="text-gray-400 hover:text-gray-300 p-0.5 rounded hover:bg-gray-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {elementoSeleccionado.historial.map((evento: any) => (
                  <div key={evento.id} className="flex items-start gap-2 p-2 bg-gray-800/30 rounded text-xs">
                    <div className="flex-shrink-0 mt-0.5 text-sm">
                      {getIconoEvento(evento.tipo)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-white font-medium capitalize">{evento.descripcion}</span>
                        <span className="text-gray-400 text-[10px]">{evento.fecha}</span>
                      </div>
                      <p className="text-gray-400 mt-0.5">{evento.detalles}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-500 text-[10px]">Por: {evento.usuario}</span>
                        <span className="text-gray-500 text-[10px] capitalize">{evento.tipo}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Noasignados;