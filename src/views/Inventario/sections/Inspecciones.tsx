import { Eye, Video, Image, AlertTriangle, FileText, Calendar, MapPin, Download, Filter, Play, Search, X } from "lucide-react";
import React, { useState } from "react";

export const Inspecciones = () => {
  // Datos de inspecciones
  const [inspecciones] = useState([
    {
      id: "INS-001",
      centro: "Alao",
      modulo: "Modulo-1",
      tipo: "Submarina",
      periodo: "Semanal",
      fecha: "2024-09-20",
      inspector: "María González",
      estado: "Completada",
      informe: {
        archivo: "informe_alao_mod1_20240920.pdf",
        tamaño: "2.4 MB",
        resumen: "Inspección rutinaria semanal. Estado general bueno."
      },
      video: {
        url: "https://ejemplo.com/videos/inspeccion_alao_mod1_20240920.mp4",
        duracion: "4:32",
        miniatura: "https://ejemplo.com/thumbnails/video_alao_mod1.jpg"
      },
      imagenes: [
        { url: "https://ejemplo.com/imagenes/alao_mod1_1.jpg", descripcion: "Boya principal - Norte" },
        { url: "https://ejemplo.com/imagenes/alao_mod1_2.jpg", descripcion: "Línea de fondeo - Sector 2" },
        { url: "https://ejemplo.com/imagenes/alao_mod1_3.jpg", descripcion: "Redes - Área central" }
      ],
      alertas: [
        { id: "ALT-001", elemento: "B015", tipo: "Crítica", descripcion: "Boya con fuga de aire", estado: "Pendiente" },
        { id: "ALT-002", elemento: "R023", tipo: "Media", descripcion: "Red con desgaste moderado", estado: "En proceso" }
      ],
      observaciones: "Se recomienda revisión de boya B015 en los próximos 3 días. Red R023 puede esperar mantenimiento programado."
    },
    {
      id: "INS-002",
      centro: "Puduguapi",
      modulo: "Modulo-3",
      tipo: "Superficial",
      periodo: "Mensual",
      fecha: "2024-09-18",
      inspector: "Carlos Rodríguez",
      estado: "Completada",
      informe: {
        archivo: "informe_puduguapi_mod3_20240918.pdf",
        tamaño: "3.1 MB",
        resumen: "Inspección mensual de estructura superficial. Hallazgos menores."
      },
      video: {
        url: "https://ejemplo.com/videos/inspeccion_puduguapi_mod3_20240918.mp4",
        duracion: "6:15",
        miniatura: "https://ejemplo.com/thumbnails/video_puduguapi_mod3.jpg"
      },
      imagenes: [
        { url: "https://ejemplo.com/imagenes/puduguapi_mod3_1.jpg", descripcion: "Estructura principal" },
        { url: "https://ejemplo.com/imagenes/puduguapi_mod3_2.jpg", descripcion: "Pasillos - Sector Oeste" }
      ],
      alertas: [
        { id: "ALT-003", elemento: "P045", tipo: "Baja", descripcion: "Pasador con oxidación superficial", estado: "Resuelta" }
      ],
      observaciones: "Estructura en buen estado general. Oxidación en pasador P045 ya tratada."
    },
    {
      id: "INS-003",
      centro: "Quenac",
      modulo: "Modulo-2",
      tipo: "Submarina",
      periodo: "Trimestral",
      fecha: "2024-09-15",
      inspector: "Ana López",
      estado: "Completada",
      informe: {
        archivo: "informe_quenac_mod2_20240915.pdf",
        tamaño: "4.2 MB",
        resumen: "Inspección trimestral exhaustiva. Múltiples hallazgos importantes."
      },
      video: {
        url: "https://ejemplo.com/videos/inspeccion_quenac_mod2_20240915.mp4",
        duracion: "12:45",
        miniatura: "https://ejemplo.com/thumbnails/video_quenac_mod2.jpg"
      },
      imagenes: [
        { url: "https://ejemplo.com/imagenes/quenac_mod2_1.jpg", descripcion: "Fondeo principal" },
        { url: "https://ejemplo.com/imagenes/quenac_mod2_2.jpg", descripcion: "Sistema de boyas completo" },
        { url: "https://ejemplo.com/imagenes/quenac_mod2_3.jpg", descripcion: "Redes - Vista general" },
        { url: "https://ejemplo.com/imagenes/quenac_mod2_4.jpg", descripcion: "Líneas secundarias" }
      ],
      alertas: [
        { id: "ALT-004", elemento: "B078", tipo: "Crítica", descripcion: "Boya completamente desinflada", estado: "Pendiente" },
        { id: "ALT-005", elemento: "L012", tipo: "Crítica", descripcion: "Línea de fondeo con severo desgaste", estado: "Pendiente" },
        { id: "ALT-006", elemento: "R156", tipo: "Media", descripcion: "Red con rotura parcial", estado: "En proceso" },
        { id: "ALT-007", elemento: "P089", tipo: "Baja", descripcion: "Pasador flojo", estado: "Resuelta" }
      ],
      observaciones: "Situación crítica en boya B078 y línea L012. Requiere atención inmediata. Red R156 necesita reparación programada."
    },
    {
      id: "INS-004",
      centro: "Alao",
      modulo: "Modulo-4",
      tipo: "Superficial",
      periodo: "Semanal",
      fecha: "2024-09-22",
      inspector: "María González",
      estado: "En Proceso",
      informe: {
        archivo: "informe_alao_mod4_20240922.pdf",
        tamaño: "1.8 MB",
        resumen: "Inspección semanal en progreso. Datos preliminares."
      },
      video: {
        url: "https://ejemplo.com/videos/inspeccion_alao_mod4_20240922.mp4",
        duracion: "3:45",
        miniatura: "https://ejemplo.com/thumbnails/video_alao_mod4.jpg"
      },
      imagenes: [
        { url: "https://ejemplo.com/imagenes/alao_mod4_1.jpg", descripcion: "Estructura nueva - Vista general" }
      ],
      alertas: [],
      observaciones: "Inspección en curso. Estructura nueva sin problemas detectados hasta el momento."
    },
    {
      id: "INS-005",
      centro: "Puduguapi2",
      modulo: "Modulo-1",
      tipo: "Submarina",
      periodo: "Mensual",
      fecha: "2024-09-10",
      inspector: "Roberto Silva",
      estado: "Completada",
      informe: {
        archivo: "informe_puduguapi2_mod1_20240910.pdf",
        tamaño: "2.9 MB",
        resumen: "Inspección mensual submarina. Condiciones estables."
      },
      video: {
        url: "https://ejemplo.com/videos/inspeccion_puduguapi2_mod1_20240910.mp4",
        duracion: "8:20",
        miniatura: "https://ejemplo.com/thumbnails/video_puduguapi2_mod1.jpg"
      },
      imagenes: [
        { url: "https://ejemplo.com/imagenes/puduguapi2_mod1_1.jpg", descripcion: "Sistema de anclaje" },
        { url: "https://ejemplo.com/imagenes/puduguapi2_mod1_2.jpg", descripcion: "Boyas de señalización" }
      ],
      alertas: [
        { id: "ALT-008", elemento: "B112", tipo: "Media", descripcion: "Boya con crecimiento de algas", estado: "En proceso" }
      ],
      observaciones: "Condiciones generales buenas. Programar limpieza de boya B112 para próximo mes."
    }
  ]);

  const tiposInspeccion = [
    { id: 'todas', label: 'Todas las Inspecciones' },
    { id: 'Submarina', label: 'Submarina' },
    { id: 'Superficial', label: 'Superficial' }
  ];

  const periodos = [
    { id: 'todos', label: 'Todos los períodos' },
    { id: 'Semanal', label: 'Semanal' },
    { id: 'Mensual', label: 'Mensual' },
    { id: 'Trimestral', label: 'Trimestral' }
  ];

  const estados = [
    { id: 'todos', label: 'Todos los estados' },
    { id: 'Completada', label: 'Completada' },
    { id: 'En Proceso', label: 'En Proceso' },
    { id: 'Pendiente', label: 'Pendiente' }
  ];

  const [filtroTipo, setFiltroTipo] = useState('todas');
  const [filtroPeriodo, setFiltroPeriodo] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [modalDetalles, setModalDetalles] = useState(false);
  const [modalVideo, setModalVideo] = useState(false);
  const [modalImagen, setModalImagen] = useState(false);
  const [inspeccionSeleccionada, setInspeccionSeleccionada] = useState<any>(null);
  const [mediaSeleccionada, setMediaSeleccionada] = useState<any>(null);

  // Filtrar inspecciones
  const inspeccionesFiltradas = inspecciones.filter(inspeccion => {
    const coincideTipo = filtroTipo === 'todas' || inspeccion.tipo === filtroTipo;
    const coincidePeriodo = filtroPeriodo === 'todos' || inspeccion.periodo === filtroPeriodo;
    const coincideEstado = filtroEstado === 'todos' || inspeccion.estado === filtroEstado;
    const coincideBusqueda = !busqueda || 
      inspeccion.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      inspeccion.centro.toLowerCase().includes(busqueda.toLowerCase()) ||
      inspeccion.modulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      inspeccion.inspector.toLowerCase().includes(busqueda.toLowerCase());
    
    return coincideTipo && coincidePeriodo && coincideEstado && coincideBusqueda;
  });

  // Estadísticas
  const estadisticas = {
    total: inspecciones.length,
    completadas: inspecciones.filter(i => i.estado === 'Completada').length,
    enProceso: inspecciones.filter(i => i.estado === 'En Proceso').length,
    alertasCriticas: inspecciones.flatMap(i => i.alertas).filter(a => a.tipo === 'Crítica').length,
    totalAlertas: inspecciones.flatMap(i => i.alertas).length
  };

  const abrirModalDetalles = (inspeccion: any) => {
    setInspeccionSeleccionada(inspeccion);
    setModalDetalles(true);
  };

  const abrirModalVideo = (inspeccion: any) => {
    setInspeccionSeleccionada(inspeccion);
    setMediaSeleccionada(inspeccion.video);
    setModalVideo(true);
  };

  const abrirModalImagen = (inspeccion: any, imagen: any) => {
    setInspeccionSeleccionada(inspeccion);
    setMediaSeleccionada(imagen);
    setModalImagen(true);
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'Completada': return 'bg-green-900/20 text-green-400';
      case 'En Proceso': return 'bg-yellow-900/20 text-yellow-400';
      case 'Pendiente': return 'bg-red-900/20 text-red-400';
      default: return 'bg-gray-900/20 text-gray-400';
    }
  };

  const getColorAlerta = (tipo: string) => {
    switch (tipo) {
      case 'Crítica': return 'bg-red-900/20 text-red-400';
      case 'Media': return 'bg-orange-900/20 text-orange-400';
      case 'Baja': return 'bg-yellow-900/20 text-yellow-400';
      default: return 'bg-gray-900/20 text-gray-400';
    }
  };

  const getColorEstadoAlerta = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return 'bg-red-900/20 text-red-400';
      case 'En proceso': return 'bg-yellow-900/20 text-yellow-400';
      case 'Resuelta': return 'bg-green-900/20 text-green-400';
      default: return 'bg-gray-900/20 text-gray-400';
    }
  };

  return (
    <>
      {/* Header con estadísticas */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <FileText size={20} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Informes de Inspección</h1>
            <p className="text-sm text-gray-400">Registro de inspecciones submarinas y superficiales</p>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          <div className="bg-gray-800/30 rounded p-3 text-center">
            <div className="text-white font-semibold text-sm">{estadisticas.total}</div>
            <div className="text-gray-400 text-xs">Total Inspecciones</div>
          </div>
          <div className="bg-green-500/10 rounded p-3 text-center">
            <div className="text-green-400 font-semibold text-sm">{estadisticas.completadas}</div>
            <div className="text-gray-400 text-xs">Completadas</div>
          </div>
          <div className="bg-yellow-500/10 rounded p-3 text-center">
            <div className="text-yellow-400 font-semibold text-sm">{estadisticas.enProceso}</div>
            <div className="text-gray-400 text-xs">En Proceso</div>
          </div>
          <div className="bg-red-500/10 rounded p-3 text-center">
            <div className="text-red-400 font-semibold text-sm">{estadisticas.alertasCriticas}</div>
            <div className="text-gray-400 text-xs">Alertas Críticas</div>
          </div>
          <div className="bg-orange-500/10 rounded p-3 text-center">
            <div className="text-orange-400 font-semibold text-sm">{estadisticas.totalAlertas}</div>
            <div className="text-gray-400 text-xs">Total Alertas</div>
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
                placeholder="Buscar por ID, centro, módulo o inspector..."
                className="block w-full pl-10 pr-3 py-1.5 bg-gray-dark text-xs text-gray-100 placeholder-gray-400 
                            focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent
                            transition-all duration-200 ease-in-out shadow-sm"
              />
            </div>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-xs text-gray-300 mb-1">
              Tipo de Inspección
            </label>
            <select 
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="block w-full px-2 py-1.5 bg-gray-dark text-xs text-gray-100 
                          focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
            >
              {tiposInspeccion.map(tipo => (
                <option key={tipo.id} value={tipo.id}>{tipo.label}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-xs text-gray-300 mb-1">
              Período
            </label>
            <select 
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              className="block w-full px-2 py-1.5 bg-gray-dark text-xs text-gray-100 
                          focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
            >
              {periodos.map(periodo => (
                <option key={periodo.id} value={periodo.id}>{periodo.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-3">
          <div className="w-full md:w-1/4">
            <label className="block text-xs text-gray-300 mb-1">
              Estado
            </label>
            <select 
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="block w-full px-2 py-1.5 bg-gray-dark text-xs text-gray-100 
                          focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
            >
              {estados.map(estado => (
                <option key={estado.id} value={estado.id}>{estado.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Inspecciones */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto border border-gray-700/40 flex-1 custom-scroll">
          <table className="min-w-full divide-y divide-gray-700 w-full">
            <thead className="sticky top-0 z-9 bg-gray-darkL shadow">
              <tr className="text-[10px]">
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/12">
                  ID
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/12">
                  Centro
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/12">
                  Módulo
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/12">
                  Tipo
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/12">
                  Período
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/12">
                  Fecha
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/12">
                  Estado
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/12">
                  Alertas
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/12">
                  Multimedia
                </th>
                <th className="px-2 py-1 text-right font-medium text-gray-300 uppercase tracking-wider w-1/12">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-dark divide-y divide-gray-700/50">
              {inspeccionesFiltradas.map((inspeccion) => (
                <tr
                  key={inspeccion.id}
                  className="hover:bg-gray-darkL transition-colors text-[11px]"
                >
                  <td className="px-2 py-0.5 whitespace-nowrap font-mono text-blue-400">
                    {inspeccion.id}
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap text-white">
                    <div className="flex items-center gap-1">
                      <MapPin size={8} className="text-gray-400" />
                      {inspeccion.centro}
                    </div>
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap text-gray-300">
                    {inspeccion.modulo}
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap">
                    <span className={`inline-flex text-[10px] leading-4 font-semibold rounded-full px-1.5 py-0.5 ${
                      inspeccion.tipo === 'Submarina' ? 'bg-blue-900/20 text-blue-400' : 'bg-green-900/20 text-green-400'
                    }`}>
                      {inspeccion.tipo}
                    </span>
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap text-gray-300">
                    {inspeccion.periodo}
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap text-gray-300">
                    <div className="flex items-center gap-1">
                      <Calendar size={8} className="text-gray-400" />
                      {inspeccion.fecha}
                    </div>
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap">
                    <span className={`inline-flex text-[10px] leading-4 font-semibold rounded-full px-1.5 py-0.5 ${getColorEstado(inspeccion.estado)}`}>
                      {inspeccion.estado}
                    </span>
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap">
                    <div className="flex flex-wrap gap-0.5">
                      {inspeccion.alertas.filter((a: any) => a.tipo === 'Crítica').length > 0 && (
                        <span className="bg-red-900/20 text-red-400 text-[8px] px-1 py-0.5 rounded">
                          {inspeccion.alertas.filter((a: any) => a.tipo === 'Crítica').length} crítica(s)
                        </span>
                      )}
                      {inspeccion.alertas.filter((a: any) => a.tipo === 'Media').length > 0 && (
                        <span className="bg-orange-900/20 text-orange-400 text-[8px] px-1 py-0.5 rounded">
                          {inspeccion.alertas.filter((a: any) => a.tipo === 'Media').length} media(s)
                        </span>
                      )}
                      {inspeccion.alertas.filter((a: any) => a.tipo === 'Baja').length > 0 && (
                        <span className="bg-yellow-900/20 text-yellow-400 text-[8px] px-1 py-0.5 rounded">
                          {inspeccion.alertas.filter((a: any) => a.tipo === 'Baja').length} baja(s)
                        </span>
                      )}
                      {inspeccion.alertas.length === 0 && (
                        <span className="text-gray-400 text-[8px]">Sin alertas</span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {inspeccion.video && (
                        <button 
                          className="text-red-400 hover:text-red-300 cursor-pointer"
                          onClick={() => abrirModalVideo(inspeccion)}
                          title="Ver video"
                        >
                          <Video size={20} />
                        </button>
                      )}
                      {inspeccion.imagenes.length > 0 && (
                        <span className="text-green-400 text-[10px]">
                          <Image size={12} className="inline mr-0.5" />
                          {inspeccion.imagenes.length}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        className="text-gray-400 hover:text-blue-400 p-0.5 rounded hover:bg-gray-700 cursor-pointer"
                        onClick={() => abrirModalDetalles(inspeccion)}
                        title="Ver detalles completos"
                      >
                        <Eye size={12} />
                      </button>
                      <button
                        className="text-gray-400 hover:text-green-400 p-0.5 rounded hover:bg-gray-700"
                        title="Descargar informe"
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {inspeccionesFiltradas.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-xs">
              <FileText size={24} className="mx-auto mb-2 text-gray-500" />
              No hay inspecciones con los filtros aplicados.
            </div>
          )}

          {/* Contador de resultados */}
          {inspeccionesFiltradas.length > 0 && (
            <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 px-2 py-1 text-xs text-gray-400">
              Mostrando {inspeccionesFiltradas.length} de {inspecciones.length} inspecciones
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles de Inspección */}
      {modalDetalles && inspeccionSeleccionada && (
        <div className="fixed inset-0 bg-gray-600/40 bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-darkL shadow-2xl w-full max-w-4xl border border-gray-700 rounded-lg">
            <div className="flex justify-between items-center p-3 border-b border-gray-700">
              <h3 className="text-sm font-semibold text-white">
                Detalles de Inspección - {inspeccionSeleccionada.id}
              </h3>
              <button
                onClick={() => setModalDetalles(false)}
                className="text-gray-400 hover:text-gray-300 p-0.5 rounded hover:bg-gray-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {/* Información básica */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-gray-400 text-[12px] uppercase mb-1">Información General</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Centro:</span>
                        <span className="text-white">{inspeccionSeleccionada.centro}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Módulo:</span>
                        <span className="text-white">{inspeccionSeleccionada.modulo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tipo:</span>
                        <span className="text-white">{inspeccionSeleccionada.tipo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Período:</span>
                        <span className="text-white">{inspeccionSeleccionada.periodo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Inspector:</span>
                        <span className="text-white">{inspeccionSeleccionada.inspector}</span>
                      </div>
                    </div>
                  </div>

                  {/* Informe */}
                  <div>
                    <h4 className="text-gray-400 text-[12px] uppercase mb-1">Informe</h4>
                    <div className="bg-gray-800/30 rounded p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-[12px]">{inspeccionSeleccionada.informe.archivo}</span>
                        <button className="text-green-400 hover:text-green-300">
                          <Download size={12} />
                        </button>
                      </div>
                      <p className="text-gray-400 text-[12px]">{inspeccionSeleccionada.informe.resumen}</p>
                      <div className="text-gray-500 text-[12px] mt-1">{inspeccionSeleccionada.informe.tamaño}</div>
                    </div>
                  </div>
                </div>

                {/* Alertas y Multimedia */}
                <div className="space-y-3">
                  {/* Alertas */}
                  <div>
                    <h4 className="text-gray-400 text-[12px] uppercase mb-1">
                      Alertas Generadas ({inspeccionSeleccionada.alertas.length})
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {inspeccionSeleccionada.alertas.map((alerta: any) => (
                        <div key={alerta.id} className="bg-gray-800/30 rounded p-2">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <span className="text-white text-[12px] font-mono">{alerta.elemento}</span>
                              <span className={`ml-1 text-[12px] px-1 py-0.5 rounded ${getColorAlerta(alerta.tipo)}`}>
                                {alerta.tipo}
                              </span>
                            </div>
                            <span className={`text-[9px] px-1 py-0.5 rounded ${getColorEstadoAlerta(alerta.estado)}`}>
                              {alerta.estado}
                            </span>
                          </div>
                          <p className="text-gray-400 text-[12px]">{alerta.descripcion}</p>
                        </div>
                      ))}
                      {inspeccionSeleccionada.alertas.length === 0 && (
                        <div className="text-gray-500 text-[12px] text-center py-2">No se generaron alertas</div>
                      )}
                    </div>
                  </div>

                  {/* Multimedia */}
                  <div>
                    <h4 className="text-gray-400 text-[10px] uppercase mb-1">Multimedia</h4>
                    <div className="flex gap-2">
                      {inspeccionSeleccionada.video && (
                        <button 
                          onClick={() => {
                            setModalDetalles(false);
                            abrirModalVideo(inspeccionSeleccionada);
                          }}
                          className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2 py-1 rounded text-[12px] transition-colors"
                        >
                          <Play size={20} />
                          Video ({inspeccionSeleccionada.video.duracion})
                        </button>
                      )}
                      <div className="text-green-400 text-[12px]">
                        <Image size={12} className="inline mr-1" />
                        {inspeccionSeleccionada.imagenes.length} imagen(es)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              {inspeccionSeleccionada.observaciones && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <h4 className="text-gray-400 text-[10px] uppercase mb-1">Observaciones</h4>
                  <p className="text-gray-300 text-xs">{inspeccionSeleccionada.observaciones}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Video */}
      {modalVideo && inspeccionSeleccionada && (
        <div className="fixed inset-0 bg-gray-900/90 bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-darkL shadow-2xl w-full max-w-4xl border border-gray-700 rounded-lg">
            <div className="flex justify-between items-center p-3 border-b border-gray-700">
              <h3 className="text-sm font-semibold text-white">
                Video - {inspeccionSeleccionada.id}
              </h3>
              <button
                onClick={() => setModalVideo(false)}
                className="text-gray-400 hover:text-gray-300 p-0.5 rounded hover:bg-gray-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4">
              <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Video size={48} className="text-red-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Reproductor de video</p>
                  <p className="text-gray-500 text-xs mt-1">{inspeccionSeleccionada.video.duracion} - {inspeccionSeleccionada.video.url}</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                <p><strong>Centro:</strong> {inspeccionSeleccionada.centro} | <strong>Módulo:</strong> {inspeccionSeleccionada.modulo}</p>
                <p><strong>Fecha:</strong> {inspeccionSeleccionada.fecha} | <strong>Inspector:</strong> {inspeccionSeleccionada.inspector}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Imagen */}
      {modalImagen && mediaSeleccionada && (
        <div className="fixed inset-0 bg-gray-900/90 bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-darkL shadow-2xl w-full max-w-4xl border border-gray-700 rounded-lg">
            <div className="flex justify-between items-center p-3 border-b border-gray-700">
              <h3 className="text-sm font-semibold text-white">
                Imagen - {inspeccionSeleccionada.id}
              </h3>
              <button
                onClick={() => setModalImagen(false)}
                className="text-gray-400 hover:text-gray-300 p-0.5 rounded hover:bg-gray-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4">
              <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Image size={48} className="text-green-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Visualizador de imagen</p>
                  <p className="text-gray-500 text-xs mt-1">{mediaSeleccionada.descripcion}</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                <p><strong>Descripción:</strong> {mediaSeleccionada.descripcion}</p>
                <p><strong>Centro:</strong> {inspeccionSeleccionada.centro} | <strong>Módulo:</strong> {inspeccionSeleccionada.modulo}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Inspecciones;