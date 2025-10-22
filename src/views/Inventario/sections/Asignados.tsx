import { Battery, Cloud, Eye, Package, Search, Shield, X, History, AlertTriangle, Calendar, Wrench, ShoppingCart, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Registro, FormData } from "../../../assets/types/Inventario";

export const Asignados = () => {
  const [centros, setCentros] = useState<Registro[]>([
    { id: 1, nombre: "Alao", estado: "Activo" },
    { id: 2, nombre: "Puduguapi", estado: "Activo" },
    { id: 3, nombre: "Quenac", estado: "Inactivo" },
    { id: 4, nombre: "Puduguapi2", estado: "Activo" },
    { id: 5, nombre: "Errazuriz", estado: "Inactivo" },
  ]);

  // Función para generar historial de elementos
  const generarHistorial = (elementoId: string) => {
    const historialBase = [
      {
        id: 1,
        tipo: "compra",
        descripcion: "Elemento adquirido",
        fecha: "2024-01-15",
        usuario: "admin",
        detalles: "Compra inicial del elemento"
      },
      {
        id: 2,
        tipo: "instalacion",
        descripcion: "Instalación en módulo",
        fecha: "2024-01-20",
        usuario: "tecnico1",
        detalles: "Instalación completada exitosamente"
      }
    ];

    // Agregar mantenimientos periódicos
    const mantenimientos = Array.from({ length: 3 }, (_, i) => ({
      id: i + 3,
      tipo: "mantenimiento",
      descripcion: `Mantenimiento preventivo ${i + 1}`,
      fecha: `2024-0${i + 3}-15`,
      usuario: "tecnico2",
      detalles: "Mantenimiento rutinario realizado"
    }));

    // Agregar algunas alertas o roturas
    const incidentes = [
      {
        id: 6,
        tipo: "alerta",
        descripcion: "Alerta de desgaste",
        fecha: "2024-05-10",
        usuario: "sistema",
        detalles: "Se detectó desgaste normal del material"
      },
      {
        id: 7,
        tipo: "reparacion",
        descripcion: "Reparación menor",
        fecha: "2024-06-22",
        usuario: "tecnico3",
        detalles: "Reparación de componente menor"
      }
    ];

    return [...historialBase, ...mantenimientos, ...incidentes];
  };

  // Función para calcular alerta de vida útil
  const calcularAlertaVidaUtil = (fechaInstalacion: string, vidaUtilMeses: number = 24) => {
    const fechaInstalacionObj = new Date(fechaInstalacion);
    const fechaActual = new Date();
    const mesesTranscurridos = (fechaActual.getFullYear() - fechaInstalacionObj.getFullYear()) * 12 + 
                              (fechaActual.getMonth() - fechaInstalacionObj.getMonth());
    const mesesRestantes = vidaUtilMeses - mesesTranscurridos;
    
    if (mesesRestantes <= 0) {
      return { tipo: "vencido", mensaje: "Vida útil vencida", meses: 0 };
    } else if (mesesRestantes <= 3) {
      return { tipo: "critico", mensaje: `Le quedan ${mesesRestantes} meses de vida útil`, meses: mesesRestantes };
    } else if (mesesRestantes <= 6) {
      return { tipo: "advertencia", mensaje: `Le quedan ${mesesRestantes} meses de vida útil`, meses: mesesRestantes };
    } else {
      return { tipo: "normal", mensaje: `Vida útil: ${mesesRestantes} meses restantes`, meses: mesesRestantes };
    }
  };

  // Función para generar muchos elementos de ejemplo
  const generarElementos = (centroId: number, tipo: string, cantidad: number) => {
    const vidaUtilPorTipo = {
      boyas: 24, // 2 años
      redes: 18, // 1.5 años
      pasadores: 36, // 3 años
      lineas: 12, // 1 año
      pasillos: 48 // 4 años
    };

    return Array.from({ length: cantidad }, (_, i) => {
      const fechaInstalacion = `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`;
      const alerta = calcularAlertaVidaUtil(fechaInstalacion, vidaUtilPorTipo[tipo as keyof typeof vidaUtilPorTipo]);
      
      return {
        id: `${tipo.charAt(0).toUpperCase()}${centroId}${String(i + 1).padStart(3, '0')}`,
        nombre: `${tipo}${i + 1}`,
        modulo: `Modulo-${Math.floor(i / 20) + 1}`,
        estado: i % 10 === 0 ? "Inactivo" : "Activo",
        cantidad: 1,
        fechaInstalacion: fechaInstalacion,
        fechaMantenimiento: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
        historial: generarHistorial(`${tipo}${i + 1}`),
        alerta: alerta
      };
    });
  };

  // Datos de inventario organizados por centro y tipo con muchos elementos
  const inventarioPorCentro = {
    1: {
      nombre: "Alao",
      elementos: {
        boyas: generarElementos(1, 'boya', 60),
        redes: generarElementos(1, 'red', 25),
        pasadores: generarElementos(1, 'pasador', 80),
        lineas: generarElementos(1, 'linea', 15),
        pasillos: generarElementos(1, 'pasillo', 8)
      }
    },
    2: {
      nombre: "Puduguapi",
      elementos: {
        boyas: generarElementos(2, 'boya', 45),
        redes: generarElementos(2, 'red', 30),
        pasadores: generarElementos(2, 'pasador', 65),
        lineas: generarElementos(2, 'linea', 12),
        pasillos: generarElementos(2, 'pasillo', 6)
      }
    },
    3: {
      nombre: "Quenac",
      elementos: {
        boyas: generarElementos(3, 'boya', 35),
        redes: generarElementos(3, 'red', 20),
        pasadores: generarElementos(3, 'pasador', 50),
        lineas: generarElementos(3, 'linea', 8),
        pasillos: generarElementos(3, 'pasillo', 4)
      }
    }
  };

  const tiposElementos = [
    { id: 'boyas', label: 'Boyas', icon: '' },
    { id: 'redes', label: 'Redes', icon: '' },
    { id: 'pasadores', label: 'Pasadores', icon: '' },
    { id: 'lineas', label: 'Líneas de Fondeo', icon: '' },
    { id: 'pasillos', label: 'Pasillos', icon: '' },
  ];

  const [centroActivo, setCentroActivo] = useState<number>(1);
  const [tipoActivo, setTipoActivo] = useState<string>('boyas');
  const [modalArtefacto, setModalArtefacto] = useState(false);
  const [modalHistorial, setModalHistorial] = useState(false);
  const [elementoSeleccionado, setElementoSeleccionado] = useState<any>(null);
  const [busqueda, setBusqueda] = useState('');

  const abrirModalArtefacto = (elemento: any) => {
    setElementoSeleccionado(elemento);
    setModalArtefacto(true);
  };

  const abrirModalHistorial = (elemento: any) => {
    setElementoSeleccionado(elemento);
    setModalHistorial(true);
  };

  const elementosDelCentro = inventarioPorCentro[centroActivo]?.elementos || {};
  let elementosDelTipo = elementosDelCentro[tipoActivo] || [];

  // Aplicar filtro de búsqueda
  if (busqueda) {
    elementosDelTipo = elementosDelTipo.filter(elemento => 
      elemento.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      elemento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      elemento.modulo.toLowerCase().includes(busqueda.toLowerCase())
    );
  }

  // Calcular estadísticas
  const estadisticasCentro = {
    totalElementos: Object.values(elementosDelCentro).flat().length,
    elementosActivos: Object.values(elementosDelCentro).flat().filter((e: any) => e.estado === "Activo").length,
    elementosInactivos: Object.values(elementosDelCentro).flat().filter((e: any) => e.estado === "Inactivo").length,
  };

  // Iconos para tipos de eventos del historial
  const getIconoEvento = (tipo: string) => {
    switch (tipo) {
      case 'compra': return <ShoppingCart size={12} className="text-green-400" />;
      case 'instalacion': return <Wrench size={12} className="text-blue-400" />;
      case 'mantenimiento': return <Wrench size={12} className="text-yellow-400" />;
      case 'reparacion': return <Wrench size={12} className="text-orange-400" />;
      case 'alerta': return <AlertTriangle size={12} className="text-red-400" />;
      case 'baja': return <Trash2 size={12} className="text-gray-400" />;
      default: return <History size={12} className="text-gray-400" />;
    }
  };

  return (
    <>
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
                placeholder="Buscar elementos por ID, nombre o módulo..."
                className="block w-full pl-10 pr-3 py-1.5 bg-gray-dark text-xs text-gray-100 placeholder-gray-400 
                            focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent
                            transition-all duration-200 ease-in-out shadow-sm"
              />
            </div>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-xs text-gray-300 mb-1">
              Empresa
            </label>
            <select className="block w-full px-2 py-1.5 bg-gray-dark text-xs text-gray-100 
                          focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent">
              <option value="">Todos</option>
              <option value="opcion1">eo</option>
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-xs text-gray-300 mb-1">
              Estado
            </label>
            <select className="block w-full px-2 py-1.5 bg-gray-dark text-xs text-gray-100 
                          focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent">
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pestañas de Centros - Más compactas */}
      <div className="mb-3">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-1">
            {centros.map((centro) => (
              <button
                key={centro.id}
                onClick={() => setCentroActivo(centro.id)}
                className={`py-1.5 px-3 text-xs font-medium rounded-t transition-colors duration-200 cursor-pointer ${
                  centroActivo === centro.id
                    ? "bg-gray-700 text-white border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Package size={12} />
                  {centro.nombre}
                  <span className={`text-[10px] px-1 py-0.5 rounded-full ${
                    centro.estado === "Activo" 
                      ? "bg-green-400/10 text-green-400" 
                      : "bg-red-400/10 text-red-400"
                  }`}>
                    {centro.estado}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Información del centro seleccionado - Más compacta */}
        {inventarioPorCentro[centroActivo] && (
          <div className="mt-2 p-2 bg-gray-800/30 rounded text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {inventarioPorCentro[centroActivo].nombre}
                </h3>
                <p className="text-gray-400">Centro de operaciones</p>
              </div>
              <div className="flex gap-3">
                <div className="text-center">
                  <div className="text-white font-semibold">{estadisticasCentro.totalElementos}</div>
                  <div className="text-gray-400">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-semibold">{estadisticasCentro.elementosActivos}</div>
                  <div className="text-gray-400">Activos</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 font-semibold">{estadisticasCentro.elementosInactivos}</div>
                  <div className="text-gray-400">Inactivos</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pestañas de Tipos de Elementos - Más compactas */}
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
                {elementosDelCentro[tipo.id]?.length || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Elementos - Super compacta */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto border border-gray-700/40 flex-1 custom-scroll">
          <table className="min-w-full divide-y divide-gray-700 w-full">
            <thead className="sticky top-0 z-9 bg-gray-darkL shadow">
              <tr className="text-[10px]">
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/6">
                  ID
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/6">
                  Nombre
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/6">
                  Módulo
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/6">
                  Estado
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/6">
                  Alerta
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-300 uppercase tracking-wider w-1/6">
                  Instalación
                </th>
                <th className="px-2 py-1 text-right font-medium text-gray-300 uppercase tracking-wider w-1/6">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-dark divide-y divide-gray-700/50">
              {elementosDelTipo.map((elemento) => (
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
                  <td className="px-2 py-0.5 whitespace-nowrap text-gray-300">
                    {elemento.modulo}
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap">
                    <span
                      className={`inline-flex text-[10px] leading-4 font-semibold rounded-full px-1.5 py-0.5 ${
                        elemento.estado === "Activo"
                          ? "bg-green-900/20 text-green-400"
                          : "bg-red-900/20 text-red-400"
                      }`}
                    >
                      {elemento.estado}
                    </span>
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap">
                    {elemento.alerta.tipo !== 'normal' && (
                      <span
                        className={`inline-flex items-center gap-0.5 text-[10px] leading-4 font-semibold rounded-full px-1.5 py-0.5 ${
                          elemento.alerta.tipo === 'vencido'
                            ? "bg-red-900/20 text-red-400"
                            : elemento.alerta.tipo === 'critico'
                            ? "bg-orange-900/20 text-orange-400"
                            : "bg-yellow-900/20 text-yellow-400"
                        }`}
                        title={elemento.alerta.mensaje}
                      >
                        <AlertTriangle size={8} />
                        {elemento.alerta.meses}m
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap text-gray-300">
                    {elemento.fechaInstalacion}
                  </td>
                  <td className="px-2 py-0.5 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        className="text-gray-400 hover:text-blue-400 p-0.5 rounded hover:bg-gray-700"
                        onClick={() => abrirModalArtefacto(elemento)}
                        title="Ver detalles"
                      >
                        <Eye size={12} />
                      </button>
                      <button
                        className="text-gray-400 hover:text-purple-400 p-0.5 rounded hover:bg-gray-700"
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
          
          {elementosDelTipo.length === 0 && (
            <div className="text-center py-4 text-gray-400 text-xs">
              {busqueda ? 'No se encontraron elementos con los filtros aplicados.' : 'No hay elementos de este tipo en el centro seleccionado.'}
            </div>
          )}

          {/* Contador de resultados */}
          {elementosDelTipo.length > 0 && (
            <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 px-2 py-1 text-xs text-gray-400">
              Mostrando {elementosDelTipo.length} elementos
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles - Compacto */}
      {modalArtefacto && elementoSeleccionado && (
        <div className="fixed inset-0 bg-gray-600/40 bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-darkL shadow-2xl w-full max-w-sm border border-gray-700 rounded-lg">
            <div className="flex justify-between items-center p-3 border-b border-gray-700">
              <h3 className="text-sm font-semibold text-white">
                Detalles del Elemento
              </h3>
              <button
                onClick={() => setModalArtefacto(false)}
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
                    <p className="text-white capitalize">{tipoActivo}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px]">Módulo:</p>
                    <p className="text-white">{elementoSeleccionado.modulo}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px]">Estado:</p>
                    <p className={`${
                      elementoSeleccionado.estado === "Activo" 
                        ? "text-green-400" 
                        : "text-red-400"
                    }`}>
                      {elementoSeleccionado.estado}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px]">Cantidad:</p>
                    <p className="text-white">{elementoSeleccionado.cantidad}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px]">Instalación:</p>
                    <p className="text-white">{elementoSeleccionado.fechaInstalacion}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px]">Mantenimiento:</p>
                    <p className="text-white">{elementoSeleccionado.fechaMantenimiento}</p>
                  </div>
                </div>
                
                {/* Alerta de vida útil */}
                {elementoSeleccionado.alerta.tipo !== 'normal' && (
                  <div className={`p-2 rounded text-xs ${
                    elementoSeleccionado.alerta.tipo === 'vencido'
                      ? "bg-red-900/20 border border-red-500/30"
                      : elementoSeleccionado.alerta.tipo === 'critico'
                      ? "bg-orange-900/20 border border-orange-500/30"
                      : "bg-yellow-900/20 border border-yellow-500/30"
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle size={12} className={
                        elementoSeleccionado.alerta.tipo === 'vencido' ? "text-red-400" :
                        elementoSeleccionado.alerta.tipo === 'critico' ? "text-orange-400" : "text-yellow-400"
                      } />
                      <span className={
                        elementoSeleccionado.alerta.tipo === 'vencido' ? "text-red-300" :
                        elementoSeleccionado.alerta.tipo === 'critico' ? "text-orange-300" : "text-yellow-300"
                      }>
                        {elementoSeleccionado.alerta.mensaje}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="pt-2 border-t border-gray-700">
                  <h4 className="text-xs font-medium text-white mb-1">Acciones</h4>
                  <div className="flex gap-1">
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs">
                      Editar
                    </button>
                    <button 
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-1 px-2 rounded text-xs"
                      onClick={() => {
                        setModalArtefacto(false);
                        abrirModalHistorial(elementoSeleccionado);
                      }}
                    >
                      Historial
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
                    <div className="flex-shrink-0 mt-0.5">
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
export default Asignados;