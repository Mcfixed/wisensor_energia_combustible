import { useState } from "react";
import { 
  Anchor, Fish, Waves, Thermometer, Droplets, 
  Eye, EyeOff, FileText, MapPin, Globe, 
  Calendar, TrendingUp, AlertTriangle, 
  CheckCircle, XCircle, Clock, Filter,
  BarChart3, Settings, Database
} from 'lucide-react';
import { CardProps, StatusDefaultProps } from "../../assets/types/Estadisticas";

function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`flex-1 h-full overflow-hidden bg-gray-darkL rounded-lg border border-gray-700 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function StatusIndicator({ status, text }: StatusDefaultProps) {
  const statusConfig = {
    optimal: { color: "text-green-400", bg: "bg-green-400/10", icon: <CheckCircle className="w-3 h-3" /> },
    warning: { color: "text-yellow-400", bg: "bg-yellow-400/10", icon: <AlertTriangle className="w-3 h-3" /> },
    critical: { color: "text-red-400", bg: "bg-red-400/10", icon: <XCircle className="w-3 h-3" /> },
    monitoring: { color: "text-blue-400", bg: "bg-blue-400/10", icon: <Eye className="w-3 h-3" /> }
  };
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusConfig[status].bg} ${statusConfig[status].color}`}>
      {statusConfig[status].icon}
      {text}
    </div>
  );
}

export const AnalisisMarino = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSensitive, setShowSensitive] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState("Centro Norte");
  
  const centros = [
    { id: 1, nombre: "Centro Norte", ubicacion: "45°12'34\"S 73°15'22\"W", estado: "optimal" },
    { id: 2, nombre: "Centro Sur", ubicacion: "46°45'12\"S 74°33'45\"W", estado: "warning" },
    { id: 3, nombre: "Centro Este", ubicacion: "44°58'15\"S 72°48'33\"W", estado: "optimal" },
    { id: 4, nombre: "Centro Oeste", ubicacion: "45°33'27\"S 75°12'18\"W", estado: "critical" }
  ];

  const alertasAmbientales = [
    { id: 1, tipo: "Bajo oxígeno", centro: "Centro Sur", nivel: "warning", tiempo: "15 min ago", parametro: "O₂: 4.2 mg/L" },
    { id: 2, tipo: "Temperatura crítica", centro: "Centro Oeste", nivel: "critical", tiempo: "32 min ago", parametro: "Temp: 18.7°C" },
    { id: 3, tipo: "Floración algal", centro: "Centro Norte", nivel: "warning", tiempo: "1 hr ago", parametro: "Chl-a: 15.2 μg/L" },
    { id: 4, tipo: "pH estable", centro: "Centro Este", nivel: "optimal", tiempo: "2 hr ago", parametro: "pH: 7.8" }
  ];

  const parametrosCentro = [
    { id: 1, nombre: "Centro Norte", salinidad: "32.5 ppm", temperatura: "12.4°C", oxigeno: "6.8 mg/L", ph: "7.8" },
    { id: 2, nombre: "Centro Sur", salinidad: "31.8 ppm", temperatura: "13.1°C", oxigeno: "4.2 mg/L", ph: "7.6" },
    { id: 3, nombre: "Centro Este", salinidad: "33.1 ppm", temperatura: "11.9°C", oxigeno: "7.1 mg/L", ph: "7.8" },
    { id: 4, nombre: "Centro Oeste", salinidad: "30.9 ppm", temperatura: "18.7°C", oxigeno: "5.3 mg/L", ph: "7.4" }
  ];

  const tabs = [
    { id: 0, label: "Parámetros", content: "Parámetros ambientales" },
    { id: 1, label: "Biometrías", content: "Datos biométricos" },
    { id: 2, label: "Reportes", content: "Reportes de centro" },
    { id: 3, label: "Configuración", content: "Ajustes de monitoreo" },
  ];

  const centroSeleccionado = parametrosCentro.find(c => c.nombre === selectedCenter);

  return (
    <main className="flex-1 h-screen overflow-hidden p-2 bg-gray-dark">
      <div className="flex flex-col h-full gap-2">
        {/* Header */}
        <div className="h-16 flex gap-2">
          <Card className="w-64 flex items-center px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Fish className="w-4 h-4 text-blue-500" />
              </div>
              <h1 className="text-lg font-semibold text-white">Marine Analytics</h1>
            </div>
          </Card>
          
          <Card className="flex-1 flex items-center px-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-green-500/20">
                    <Waves className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Estado general</p>
                    <p className="text-sm font-medium text-white">Óptimo</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-blue-500/20">
                    <Thermometer className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Temperatura avg</p>
                    <p className="text-sm font-medium text-white">14.1°C</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-yellow-500/20">
                    <Droplets className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Oxígeno avg</p>
                    <p className="text-sm font-medium text-white">6.1 mg/L</p>
                  </div>
                </div>

                {/* Selector de centro */}
                <div className="flex items-center gap-2">
                  <select 
                    value={selectedCenter}
                    onChange={(e) => setSelectedCenter(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white"
                  >
                    {centros.map(centro => (
                      <option key={centro.id} value={centro.nombre}>
                        {centro.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowSensitive(!showSensitive)}
                  className="flex items-center gap-1 text-xs text-gray-300 hover:text-white"
                >
                  {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showSensitive ? "Ocultar datos" : "Mostrar datos"}
                </button>
                <div className="h-4 w-px bg-gray-600"></div>
                <div className="flex items-center gap-1 text-xs text-gray-300">
                  <Clock className="w-4 h-4" />
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex gap-2">
          {/* Columna izquierda - Métricas y gráficos */}
          <div className="w-2/3 flex flex-col gap-2">
            {/* Fila superior - Parámetros ambientales */}
            <div className="h-1/3 flex gap-2">
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-blue-400" />
                      Parámetros Ambientales
                    </h2>
                    <StatusIndicator status="optimal" text="Estable" />
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div className="bg-gray-dark rounded p-2 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-green-400">{centroSeleccionado?.temperatura}</div>
                      <div className="text-xs text-gray-400 mt-1">Temperatura</div>
                      <div className="w-full h-1 mt-2 bg-gray-700 rounded-full">
                        <div className="h-1 rounded-full bg-green-400" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-yellow-400">{centroSeleccionado?.oxigeno}</div>
                      <div className="text-xs text-gray-400 mt-1">Oxígeno Disuelto</div>
                      <div className="w-full h-1 mt-2 bg-gray-700 rounded-full">
                        <div className="h-1 rounded-full bg-yellow-400" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-purple-400">{centroSeleccionado?.salinidad}</div>
                      <div className="text-xs text-gray-400 mt-1">Salinidad</div>
                      <div className="w-full h-1 mt-2 bg-gray-700 rounded-full">
                        <div className="h-1 rounded-full bg-purple-400" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-green-400" />
                      Calidad de Agua
                    </h2>
                    <StatusIndicator status="warning" text="Alerta menor" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="bg-gray-dark rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">pH</span>
                        <span className="text-xs font-medium text-white">{centroSeleccionado?.ph}</span>
                      </div>
                      <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                        <div className="h-1.5 rounded-full bg-blue-400" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Amoníaco</span>
                        <span className="text-xs font-medium text-white">0.12 mg/L</span>
                      </div>
                      <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                        <div className="h-1.5 rounded-full bg-purple-400" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Turbidez</span>
                        <span className="text-xs font-medium text-white">8.4 NTU</span>
                      </div>
                      <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                        <div className="h-1.5 rounded-full bg-green-400" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Clorofila-a</span>
                        <span className="text-xs font-medium text-white">7.8 μg/L</span>
                      </div>
                      <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                        <div className="h-1.5 rounded-full bg-yellow-400" style={{ width: '39%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Fila media - Mapa de centros */}
            <div className="h-1/3">
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      Mapa de Centros
                    </h2>
                    <StatusIndicator status="monitoring" text="Monitoreando" />
                  </div>
                  <div className="flex-1 bg-gray-dark rounded flex items-center justify-center relative">
                    {/* Simulación de mapa marino */}
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZT0iIzQwNDA0MCIgc3Ryb2tlLXdpZHRoPSIxIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6Ii8+PC9nPjwvc3ZnPg==')]"></div>
                    
                    {/* Centros en el mapa */}
                    <div className="relative z-10 grid grid-cols-4 gap-6 w-full h-full p-4">
                      {/* Centro principal */}
                      <div className="col-span-1 col-start-2 row-start-2 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-1">
                          <Anchor className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-xs text-white">{selectedCenter}</span>
                        <span className="text-[10px] text-gray-400">Activo</span>
                      </div>
                      
                      {/* Otros centros */}
                      <div className="col-span-1 flex flex-col items-center justify-end">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-1">
                          <Fish className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-xs text-white">Centro Norte</span>
                      </div>
                      
                      <div className="col-span-1 flex flex-col items-center justify-start">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mb-1">
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="text-xs text-white">Centro Sur</span>
                      </div>
                      
                      <div className="col-span-1 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mb-1">
                          <XCircle className="w-4 h-4 text-red-400" />
                        </div>
                        <span className="text-xs text-white">Centro Oeste</span>
                      </div>
                      
                      {/* Líneas de conexión */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <svg width="100%" height="100%" className="text-gray-600">
                          <line x1="25%" y1="50%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
                          <line x1="50%" y1="50%" x2="75%" y2="50%" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
                          <line x1="50%" y1="50%" x2="50%" y2="25%" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
                          <line x1="50%" y1="50%" x2="50%" y2="75%" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Fila inferior - Producción y biomasa */}
            <div className="h-1/3">
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <h2 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                    Producción y Biomasa
                  </h2>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div className="bg-gray-dark rounded p-3 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Biomasa total</span>
                        <span className="text-xs font-medium text-white">245 Tn</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full">
                        <div className="h-2 rounded-full bg-blue-400" style={{ width: '72%' }}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">+12% vs mes anterior</div>
                    </div>
                    
                    <div className="bg-gray-dark rounded p-3 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Tasa crecimiento</span>
                        <span className="text-xs font-medium text-white">3.2 g/día</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full">
                        <div className="h-2 rounded-full bg-green-400" style={{ width: '64%' }}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">Óptimo</div>
                    </div>
                    
                    <div className="bg-gray-dark rounded p-3 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Conversión alimenticia</span>
                        <span className="text-xs font-medium text-white">1.28</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full">
                        <div className="h-2 rounded-full bg-purple-400" style={{ width: '85%' }}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">Eficiente</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Columna derecha - Alertas y pestañas */}
          <div className="w-1/3 flex flex-col gap-2">
            <Card className="h-1/2">
              <div className="p-3 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-medium text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    Alertas Ambientales
                  </h2>
                  <button className="text-xs text-gray-400 hover:text-white">Ver todas</button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {alertasAmbientales.map(alerta => (
                    <div key={alerta.id} className="mb-3 pb-3 border-b border-gray-700 last:border-0 last:mb-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1 rounded-full ${alerta.nivel === 'critical' ? 'bg-red-400/20' : alerta.nivel === 'warning' ? 'bg-yellow-400/20' : 'bg-green-400/20'}`}>
                          {alerta.nivel === 'critical' ? <XCircle className="w-3 h-3 text-red-400" /> : 
                           alerta.nivel === 'warning' ? <AlertTriangle className="w-3 h-3 text-yellow-400" /> :
                           <CheckCircle className="w-3 h-3 text-green-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="text-xs text-white">{alerta.tipo}</p>
                            <span className="text-xs text-gray-400">{alerta.tiempo}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{alerta.centro}</p>
                          <p className="text-xs text-white mt-1 font-medium">
                            {showSensitive ? alerta.parametro : "••••••••••••"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            
            <Card className="flex-1">
              <div className="flex flex-col h-full">
                {/* Barra de pestañas */}
                <div className="flex border-b border-gray-700">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-2 text-xs font-medium flex-1 text-center transition-colors duration-150 ${activeTab === tab.id
                          ? "text-white border-b-2 border-blue-500"
                          : "text-gray-400 hover:text-white hover:bg-gray-dark"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Contenido de pestañas */}
                <div className="flex-1 p-3 overflow-auto">
                  {activeTab === 0 && (
                    <div className="space-y-4">
                      <div className="bg-gray-dark rounded p-3">
                        <h3 className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                          <Thermometer className="w-3 h-3 text-blue-400" />
                          Parámetros actuales
                        </h3>
                        <ul className="text-xs text-gray-300 space-y-2">
                          <li className="flex justify-between">
                            <span>Temperatura:</span>
                            <span className="text-white">{centroSeleccionado?.temperatura}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Oxígeno:</span>
                            <span className="text-white">{centroSeleccionado?.oxigeno}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Salinidad:</span>
                            <span className="text-white">{centroSeleccionado?.salinidad}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>pH:</span>
                            <span className="text-white">{centroSeleccionado?.ph}</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-dark rounded p-3">
                        <h3 className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-green-400" />
                          Histórico
                        </h3>
                        <div className="text-xs text-gray-300">
                          <p>Datos de última semana estables</p>
                          <p className="mt-1 text-gray-400">Última actualización: Hoy 06:00</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 1 && (
                    <div className="space-y-3">
                      {centros.map(centro => (
                        <div key={centro.id} className="bg-gray-dark rounded p-2 flex items-center gap-3">
                          <div className={`p-2 rounded-full ${centro.estado === 'optimal' ? 'bg-green-500/20' : centro.estado === 'warning' ? 'bg-yellow-500/20' : 'bg-red-500/20'}`}>
                            <Fish className="w-4 h-4 text-green-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-white">{centro.nombre}</p>
                            <p className="text-xs text-gray-400">
                              {showSensitive ? centro.ubicacion : "••••••••••••"}
                            </p>
                          </div>
                          <StatusIndicator status={centro.estado} text={centro.estado === 'optimal' ? 'Óptimo' : centro.estado === 'warning' ? 'Alerta' : 'Crítico'} />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {activeTab === 2 && (
                    <div className="text-xs text-gray-300 space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>Reportes disponibles</span>
                      </div>
                      <ul className="space-y-1 mt-2">
                        <li className="text-blue-400 cursor-pointer">• Reporte semanal producción</li>
                        <li className="text-blue-400 cursor-pointer">• Análisis calidad de agua</li>
                        <li className="text-blue-400 cursor-pointer">• Biometría mensual</li>
                        <li className="text-blue-400 cursor-pointer">• Estado de salud peces</li>
                      </ul>
                    </div>
                  )}

                  {activeTab === 3 && (
                    <div className="text-xs text-gray-300 space-y-3">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-gray-400" />
                        <span>Configuración de monitoreo</span>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>Alertas por email</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span>Monitoreo continuo</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span>Reporte automático</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};