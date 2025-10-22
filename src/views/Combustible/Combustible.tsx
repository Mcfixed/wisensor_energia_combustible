import { useState } from "react";
import { 
  AlertTriangle, Droplets, Fuel, Clock, Eye, EyeOff, 
  FileText, MapPin, Thermometer, TrendingDown, 
  Battery, Zap, Waves, Ship, Settings,
  Database, RefreshCw, BarChart3, Filter
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
    secure: { color: "text-green-400", bg: "bg-green-400/10", icon: <Battery className="w-3 h-3" /> },
    warning: { color: "text-yellow-400", bg: "bg-yellow-400/10", icon: <AlertTriangle className="w-3 h-3" /> },
    danger: { color: "text-red-400", bg: "bg-red-400/10", icon: <TrendingDown className="w-3 h-3" /> },
    neutral: { color: "text-blue-400", bg: "bg-blue-400/10", icon: <Droplets className="w-3 h-3" /> }
  };
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusConfig[status].bg} ${statusConfig[status].color}`}>
      {statusConfig[status].icon}
      {text}
    </div>
  );
}

export const Combustible = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSensitive, setShowSensitive] = useState(false);
  
  const alertasCombustible = [
    { id: 1, type: "Nivel bajo", source: "Tanque Norte", level: "warning", time: "5 min ago", value: "15%" },
    { id: 2, type: "Consumo elevado", source: "Lancha 042", level: "danger", time: "12 min ago", value: "45L/h" },
    { id: 3, type: "Temperatura estable", source: "Tanque Sur", level: "secure", time: "25 min ago", value: "18°C" },
    { id: 4, type: "Reabastecimiento", source: "Proveedor", level: "neutral", time: "1 hr ago", value: "5000L" }
  ];

  const centros = [
    { id: 1, name: "Centro Norte", location: "Lat: -42.123, Long: -73.456", status: "active", consumo: 1250 },
    { id: 2, name: "Centro Sur", location: "Lat: -43.234, Long: -73.567", status: "warning", consumo: 890 },
    { id: 3, name: "Centro Este", location: "Lat: -42.345, Long: -73.678", status: "active", consumo: 1670 },
    { id: 4, name: "Centro Oeste", location: "Lat: -43.456, Long: -73.789", status: "maintenance", consumo: 0 }
  ];

  const tabs = [
    { id: 0, label: "Resumen", content: "Resumen general" },
    { id: 1, label: "Centros", content: "Lista de centros" },
    { id: 2, label: "Reportes", content: "Reportes de consumo" },
    { id: 3, label: "Configuración", content: "Ajustes de monitoreo" },
  ];

  // Datos para gráficos
  const consumoHistorico = [1200, 1100, 1300, 1250, 1400, 1350, 1500];
  const nivelesTanques = [
    { nombre: "Tanque A", nivel: 85, capacidad: 10000 },
    { nombre: "Tanque B", nivel: 45, capacidad: 8000 },
    { nombre: "Tanque C", nivel: 92, capacidad: 12000 },
  ];

  return (
    <main className="flex-1 h-screen overflow-hidden p-2 bg-gray-dark">
      <div className="flex flex-col h-full gap-2">
        {/* Header */}
        <div className="h-16 flex gap-2">
          <Card className="w-64 flex items-center px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Fuel className="w-4 h-4 text-orange-500" />
              </div>
              <h1 className="text-lg font-semibold text-white">Monitoreo Combustible</h1>
            </div>
          </Card>
          
          <Card className="flex-1 flex items-center px-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-green-500/20">
                    <Droplets className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Inventario Total</p>
                    <p className="text-sm font-medium text-white">25,840 L</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-blue-500/20">
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Consumo Diario</p>
                    <p className="text-sm font-medium text-white">4,210 L</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-yellow-500/20">
                    <Ship className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Embarcaciones</p>
                    <p className="text-sm font-medium text-white">18 activas</p>
                  </div>
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
                <button className="flex items-center gap-1 text-xs text-gray-300 hover:text-white">
                  <RefreshCw className="w-4 h-4" />
                  Actualizar
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
            {/* Fila superior - Niveles de Tanques */}
            <div className="h-1/3 flex gap-2">
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      Niveles de Tanques
                    </h2>
                    <StatusIndicator status="warning" text="Alerta nivel bajo" />
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    {nivelesTanques.map((tanque, index) => (
                      <div key={index} className="bg-gray-dark rounded p-2 flex flex-col items-center justify-center">
                        <div className={`text-2xl font-bold ${
                          tanque.nivel > 80 ? 'text-green-400' : 
                          tanque.nivel > 30 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {tanque.nivel}%
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{tanque.nombre}</div>
                        <div className="w-full h-1 mt-2 bg-gray-700 rounded-full">
                          <div 
                            className={`h-1 rounded-full ${
                              tanque.nivel > 80 ? 'bg-green-400' : 
                              tanque.nivel > 30 ? 'bg-yellow-400' : 'bg-red-400'
                            }`} 
                            style={{ width: `${tanque.nivel}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.round(tanque.capacidad * tanque.nivel / 100)}L / {tanque.capacidad}L
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-green-400" />
                      Consumo por Centro
                    </h2>
                    <StatusIndicator status="secure" text="Estable" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="bg-gray-dark rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Centro Norte</span>
                        <span className="text-xs font-medium text-white">1,250 L/d</span>
                      </div>
                      <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                        <div className="h-1.5 rounded-full bg-blue-400" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Centro Sur</span>
                        <span className="text-xs font-medium text-white">890 L/d</span>
                      </div>
                      <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                        <div className="h-1.5 rounded-full bg-purple-400" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Centro Este</span>
                        <span className="text-xs font-medium text-white">1,670 L/d</span>
                      </div>
                      <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                        <div className="h-1.5 rounded-full bg-green-400" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Centro Oeste</span>
                        <span className="text-xs font-medium text-white">0 L/d</span>
                      </div>
                      <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                        <div className="h-1.5 rounded-full bg-gray-500" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Fila media - Mapa de Centros */}
            <div className="h-1/3">
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      Ubicación de Centros
                    </h2>
                    <StatusIndicator status="neutral" text="Monitoreando" />
                  </div>
                  <div className="flex-1 bg-gray-dark rounded flex items-center justify-center relative">
                    {/* Simulación de mapa de centros */}
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZT0iIzQwNDA0MCIgc3Ryb2tlLXdpZHRoPSIxIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6Ii8+PC9nPjwvc3ZnPg==')]"></div>
                    
                    {/* Centros en el mapa */}
                    <div className="relative z-10 grid grid-cols-3 gap-4 w-full h-full p-4">
                      {/* Centro Norte */}
                      <div className="col-span-1 flex flex-col items-center justify-start">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-1 border-2 border-blue-400">
                          <Waves className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-xs text-white">Norte</span>
                        <span className="text-[10px] text-gray-400">85%</span>
                      </div>
                      
                      {/* Centro Sur */}
                      <div className="col-span-1 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mb-1 border-2 border-yellow-400">
                          <Waves className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="text-xs text-white">Sur</span>
                        <span className="text-[10px] text-gray-400">45%</span>
                      </div>
                      
                      {/* Centro Este */}
                      <div className="col-span-1 flex flex-col items-center justify-end">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-1 border-2 border-green-400">
                          <Waves className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-xs text-white">Este</span>
                        <span className="text-[10px] text-gray-400">92%</span>
                      </div>
                      
                      {/* Líneas de conexión */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <svg width="100%" height="100%" className="text-gray-600">
                          <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
                          <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
                          <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Fila inferior - Métricas de Calidad */}
            <div className="h-1/3">
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <h2 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                    <Thermometer className="w-4 h-4 text-yellow-400" />
                    Calidad y Condiciones
                  </h2>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div className="bg-gray-dark rounded p-3 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Temperatura</span>
                        <span className="text-xs font-medium text-white">18°C</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full">
                        <div className="h-2 rounded-full bg-blue-400" style={{ width: '60%' }}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">Rango: 15-25°C</div>
                    </div>
                    
                    <div className="bg-gray-dark rounded p-3 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Densidad</span>
                        <span className="text-xs font-medium text-white">0.85 kg/L</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full">
                        <div className="h-2 rounded-full bg-green-400" style={{ width: '75%' }}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">Óptimo</div>
                    </div>
                    
                    <div className="bg-gray-dark rounded p-3 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Humedad</span>
                        <span className="text-xs font-medium text-white">45%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full">
                        <div className="h-2 rounded-full bg-purple-400" style={{ width: '45%' }}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">Controlado</div>
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
                    Alertas de Combustible
                  </h2>
                  <button className="text-xs text-gray-400 hover:text-white">Ver todas</button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {alertasCombustible.map(alerta => (
                    <div key={alerta.id} className="mb-3 pb-3 border-b border-gray-700 last:border-0 last:mb-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1 rounded-full ${
                          alerta.level === 'danger' ? 'bg-red-400/20' : 
                          alerta.level === 'warning' ? 'bg-yellow-400/20' : 
                          alerta.level === 'secure' ? 'bg-green-400/20' : 'bg-blue-400/20'
                        }`}>
                          {alerta.level === 'danger' ? <TrendingDown className="w-3 h-3 text-red-400" /> : 
                           alerta.level === 'warning' ? <AlertTriangle className="w-3 h-3 text-yellow-400" /> :
                           <Battery className="w-3 h-3 text-green-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="text-xs text-white">{alerta.type}</p>
                            <span className="text-xs text-gray-400">{alerta.time}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {showSensitive ? alerta.source : "••••••••••••••••"}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs font-medium text-white">{alerta.value}</span>
                            <button className="text-xs text-blue-400 hover:text-blue-300">
                              Ver detalles
                            </button>
                          </div>
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
                      className={`px-3 py-2 text-xs font-medium flex-1 text-center transition-colors duration-150 ${
                        activeTab === tab.id
                          ? "text-white border-b-2 border-orange-500"
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
                          <Fuel className="w-3 h-3 text-orange-400" />
                          Resumen del Día
                        </h3>
                        <ul className="text-xs text-gray-300 space-y-2">
                          <li className="flex justify-between">
                            <span>Consumo total:</span>
                            <span className="text-white">4,210 L</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Reabastecimientos:</span>
                            <span className="text-white">3</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Embarcaciones activas:</span>
                            <span className="text-white">18/22</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Alertas activas:</span>
                            <span className="text-yellow-400">2</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-dark rounded p-3">
                        <h3 className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                          <BarChart3 className="w-3 h-3 text-green-400" />
                          Tendencia Semanal
                        </h3>
                        <div className="text-xs text-gray-300">
                          <p>Consumo: +5% vs semana anterior</p>
                          <div className="flex gap-1 mt-2">
                            {consumoHistorico.map((valor, index) => (
                              <div 
                                key={index}
                                className="flex-1 bg-blue-500/30 rounded-t flex items-end justify-center"
                                style={{ height: `${(valor / 1500) * 40}px` }}
                              >
                                <span className="text-[8px] text-white">{valor}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 1 && (
                    <div className="space-y-3">
                      {centros.map(centro => (
                        <div key={centro.id} className="bg-gray-dark rounded p-2 flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            centro.status === 'active' ? 'bg-green-500/20' : 
                            centro.status === 'warning' ? 'bg-yellow-500/20' : 'bg-gray-500/20'
                          }`}>
                            <Waves className="w-4 h-4 text-green-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-white">{centro.name}</p>
                            <p className="text-xs text-gray-400">
                              {showSensitive ? centro.location : "••••••••••••"}
                            </p>
                          </div>
                          <div className="text-xs font-medium text-white">
                            {centro.consumo} L/d
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {activeTab === 2 && (
                    <div className="text-xs text-gray-300 space-y-3">
                      <div className="flex items-center gap-2 p-2 bg-gray-dark rounded">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>Reporte de consumo mensual</span>
                        <button className="ml-auto text-blue-400 hover:text-blue-300 text-xs">
                          Descargar
                        </button>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-dark rounded">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>Inventario actual</span>
                        <button className="ml-auto text-blue-400 hover:text-blue-300 text-xs">
                          Descargar
                        </button>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-dark rounded">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>Alertas del mes</span>
                        <button className="ml-auto text-blue-400 hover:text-blue-300 text-xs">
                          Descargar
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 3 && (
                    <div className="space-y-3">
                      <button className="w-full text-xs text-gray-300 hover:text-white p-2 bg-gray-dark rounded flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Configurar alertas
                      </button>
                      <button className="w-full text-xs text-gray-300 hover:text-white p-2 bg-gray-dark rounded flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Límites de inventario
                      </button>
                      <button className="w-full text-xs text-gray-300 hover:text-white p-2 bg-gray-dark rounded flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Preferencias de reportes
                      </button>
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