import { useState } from "react";
import { 
  AlertTriangle, Battery, BatteryCharging, Clock, Cpu, Eye, EyeOff, 
  FileText, Flame, Gauge, HardDrive, Lightbulb, Network, 
  Power, PowerOff, Settings, Shield, ShieldAlert, 
  Thermometer, Wind, Zap
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
    secure: { color: "text-green-400", bg: "bg-green-400/10", icon: <BatteryCharging className="w-3 h-3" /> },
    warning: { color: "text-yellow-400", bg: "bg-yellow-400/10", icon: <AlertTriangle className="w-3 h-3" /> },
    danger: { color: "text-red-400", bg: "bg-red-400/10", icon: <PowerOff className="w-3 h-3" /> },
    neutral: { color: "text-blue-400", bg: "bg-blue-400/10", icon: <Gauge className="w-3 h-3" /> }
  };
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusConfig[status].bg} ${statusConfig[status].color}`}>
      {statusConfig[status].icon}
      {text}
    </div>
  );
}

export const Energia = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSensitive, setShowSensitive] = useState(false);
  
  const energyEvents = [
    { id: 1, type: "Pico de consumo", source: "Planta Oxigenación", level: "warning", time: "5 min ago", value: "245 kW" },
    { id: 2, type: "Generador activado", source: "Backup System", level: "secure", time: "12 min ago", value: "180 kW" },
    { id: 3, type: "Temperatura crítica", source: "Sala Eléctrica A", level: "danger", time: "25 min ago", value: "42°C" },
    { id: 4, type: "Carga estable", source: "Red Principal", level: "neutral", time: "1 hr ago", value: "156 kW" }
  ];

  const equipment = [
    { id: 1, name: "Planta Oxigenación", type: "oxygen", ip: "192.168.1.10", status: "active", consumption: 45 },
    { id: 2, name: "Sistema Refrigeración", type: "cooling", ip: "192.168.1.15", status: "active", consumption: 38 },
    { id: 3, name: "Bombeo Agua", type: "pump", ip: "192.168.1.22", status: "idle", consumption: 22 },
    { id: 4, name: "Generador Backup", type: "generator", ip: "192.168.1.11", status: "standby", consumption: 0 }
  ];

  const tabs = [
    { id: 0, label: "Resumen", content: "Resumen energético" },
    { id: 1, label: "Equipos", content: "Lista de equipos" },
    { id: 2, label: "Histórico", content: "Registros de consumo" },
    { id: 3, label: "Configuración", content: "Ajustes de monitoreo" },
  ];

  return (
    <main className="flex-1 h-screen overflow-hidden p-2 bg-gray-dark">
      <div className="flex flex-col h-full gap-2">
        {/* Header */}
        <div className="h-16 flex gap-2">
          <Card className="w-64 flex items-center px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-yellow-500" />
              </div>
              <h1 className="text-lg font-semibold text-white">Energy Center</h1>
            </div>
          </Card>
          
          <Card className="flex-1 flex items-center px-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-green-500/20">
                    <Power className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Consumo Actual</p>
                    <p className="text-sm font-medium text-white">156 kW</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-blue-500/20">
                    <Battery className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Backup</p>
                    <p className="text-sm font-medium text-white">92%</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-purple-500/20">
                    <Gauge className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Eficiencia</p>
                    <p className="text-sm font-medium text-white">87%</p>
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
            {/* Fila superior */}
            <div className="h-1/3 flex gap-2">
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-blue-400" />
                      Distribución de Carga
                    </h2>
                    <StatusIndicator status="secure" text="Balanceado" />
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div className="bg-gray-dark rounded p-2 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-green-400">45%</div>
                      <div className="text-xs text-gray-400 mt-1">Producción</div>
                      <div className="w-full h-1 mt-2 bg-gray-700 rounded-full">
                        <div className="h-1 rounded-full bg-green-400" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-yellow-400">32%</div>
                      <div className="text-xs text-gray-400 mt-1">Climatización</div>
                      <div className="w-full h-1 mt-2 bg-gray-700 rounded-full">
                        <div className="h-1 rounded-full bg-yellow-400" style={{ width: '32%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-purple-400">23%</div>
                      <div className="text-xs text-gray-400 mt-1">Auxiliares</div>
                      <div className="w-full h-1 mt-2 bg-gray-700 rounded-full">
                        <div className="h-1 rounded-full bg-purple-400" style={{ width: '23%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-400" />
                      Flujo de Energía
                    </h2>
                    <StatusIndicator status="warning" text="Alerta menor" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="bg-gray-dark rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Red Principal</span>
                        <span className="text-xs font-medium text-white">156 kW</span>
                      </div>
                      <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                        <div className="h-1.5 rounded-full bg-blue-400" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Generadores</span>
                        <span className="text-xs font-medium text-white">0 kW</span>
                      </div>
                      <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                        <div className="h-1.5 rounded-full bg-green-400" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Solar</span>
                        <span className="text-xs font-medium text-white">28 kW</span>
                      </div>
                      <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                        <div className="h-1.5 rounded-full bg-yellow-400" style={{ width: '48%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Eólica</span>
                        <span className="text-xs font-medium text-white">15 kW</span>
                      </div>
                      <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                        <div className="h-1.5 rounded-full bg-purple-400" style={{ width: '22%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Fila media - Mapa de red eléctrica */}
            <div className="h-1/3">
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <Network className="w-4 h-4 text-purple-400" />
                      Red Eléctrica - Centro Salmonicultura
                    </h2>
                    <StatusIndicator status="neutral" text="Monitoreando" />
                  </div>
                  <div className="flex-1 bg-gray-dark rounded flex items-center justify-center relative">
                    {/* Simulación de mapa de red eléctrica */}
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZT0iIzQwNDA0MCIgc3Ryb2tlLXdpZHRoPSIxIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6Ii8+PC9nPjwvc3ZnPg==')]"></div>
                    
                    {/* Equipos en la red */}
                    <div className="relative z-10 grid grid-cols-4 gap-6 w-full h-full p-4">
                      {/* Subestación principal */}
                      <div className="col-span-1 col-start-2 row-start-2 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-1">
                          <Zap className="w-5 h-5 text-yellow-400" />
                        </div>
                        <span className="text-xs text-white">Subestación</span>
                        <span className="text-[10px] text-gray-400">400 kW</span>
                      </div>
                      
                      {/* Áreas de producción */}
                      <div className="col-span-1 flex flex-col items-center justify-end">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-1">
                          <Wind className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-xs text-white">Oxigenación</span>
                        <span className="text-[10px] text-gray-400">45 kW</span>
                      </div>
                      
                      <div className="col-span-1 flex flex-col items-center justify-start">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-1">
                          <Thermometer className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-xs text-white">Climatización</span>
                        <span className="text-[10px] text-gray-400">38 kW</span>
                      </div>
                      
                      <div className="col-span-1 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mb-1">
                          <Power className="w-4 h-4 text-red-400" />
                        </div>
                        <span className="text-xs text-white">Bombeo</span>
                        <span className="text-[10px] text-gray-400">22 kW</span>
                      </div>
                      
                      {/* Líneas de conexión (simuladas con pseudo-elementos) */}
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
            
            {/* Fila inferior - Almacenamiento y generación */}
            <div className="h-1/3">
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <h2 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                    <BatteryCharging className="w-4 h-4 text-yellow-400" />
                    Almacenamiento y Generación
                  </h2>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div className="bg-gray-dark rounded p-3 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Baterías</span>
                        <span className="text-xs font-medium text-white">92%/100%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full">
                        <div className="h-2 rounded-full bg-green-400" style={{ width: '92%' }}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">8h autonomía</div>
                    </div>
                    
                    <div className="bg-gray-dark rounded p-3 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Generadores</span>
                        <span className="text-xs font-medium text-white">0/4 activos</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full">
                        <div className="h-2 rounded-full bg-blue-400" style={{ width: '0%' }}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">Standby</div>
                    </div>
                    
                    <div className="bg-gray-dark rounded p-3 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Renovables</span>
                        <span className="text-xs font-medium text-white">43 kW</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full">
                        <div className="h-2 rounded-full bg-purple-400" style={{ width: '65%' }}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">28kW solar + 15kW eólica</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Columna derecha - Eventos y pestañas */}
          <div className="w-1/3 flex flex-col gap-2">
            <Card className="h-1/2">
              <div className="p-3 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-medium text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    Eventos de Energía
                  </h2>
                  <button className="text-xs text-gray-400 hover:text-white">Ver todos</button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {energyEvents.map(event => (
                    <div key={event.id} className="mb-3 pb-3 border-b border-gray-700 last:border-0 last:mb-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1 rounded-full ${event.level === 'danger' ? 'bg-red-400/20' : event.level === 'warning' ? 'bg-yellow-400/20' : event.level === 'secure' ? 'bg-green-400/20' : 'bg-blue-400/20'}`}>
                          {event.level === 'danger' ? <PowerOff className="w-3 h-3 text-red-400" /> : 
                           event.level === 'warning' ? <AlertTriangle className="w-3 h-3 text-yellow-400" /> :
                           <BatteryCharging className="w-3 h-3 text-green-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="text-xs text-white">{event.type}</p>
                            <span className="text-xs text-gray-400">{event.time}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {showSensitive ? event.source : "••••••••••••••••"}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-white font-medium">{event.value}</span>
                            <div className={`text-xs ${event.level === 'danger' ? 'text-red-400' : event.level === 'warning' ? 'text-yellow-400' : 'text-green-400'}`}>
                              {event.level === 'danger' ? 'Crítico' : event.level === 'warning' ? 'Alerta' : 'Normal'}
                            </div>
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
                      className={`px-3 py-2 text-xs font-medium flex-1 text-center transition-colors duration-150 ${activeTab === tab.id
                          ? "text-white border-b-2 border-yellow-500"
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
                          <Lightbulb className="w-3 h-3 text-green-400" />
                          Resumen del Día
                        </h3>
                        <ul className="text-xs text-gray-300 space-y-2">
                          <li className="flex justify-between">
                            <span>Consumo total:</span>
                            <span className="text-white">3,450 kWh</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Máximo pico:</span>
                            <span className="text-yellow-400">245 kW</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Costo estimado:</span>
                            <span className="text-white">$1,240</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Eficiencia:</span>
                            <span className="text-green-400">87%</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-dark rounded p-3">
                        <h3 className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          Objetivos
                        </h3>
                        <div className="text-xs text-gray-300">
                          <div className="flex justify-between mb-1">
                            <span>Reducción consumo:</span>
                            <span className="text-green-400">-12% vs mes anterior</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-700 rounded-full">
                            <div className="h-1.5 rounded-full bg-green-400" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 1 && (
                    <div className="space-y-3">
                      {equipment.map(device => (
                        <div key={device.id} className="bg-gray-dark rounded p-2 flex items-center gap-3">
                          <div className={`p-2 rounded-full ${device.status === 'active' ? 'bg-green-500/20' : device.status === 'idle' ? 'bg-blue-500/20' : 'bg-yellow-500/20'}`}>
                            {device.type === 'oxygen' ? <Wind className="w-4 h-4 text-blue-400" /> : 
                             device.type === 'cooling' ? <Thermometer className="w-4 h-4 text-green-400" /> :
                             device.type === 'pump' ? <Power className="w-4 h-4 text-red-400" /> :
                             <Zap className="w-4 h-4 text-yellow-400" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-white">{device.name}</p>
                            <p className="text-xs text-gray-400">
                              {showSensitive ? device.ip : "••••••••••••"}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium text-white">
                              {device.consumption} kW
                            </div>
                            <div className={`text-xs ${device.status === 'active' ? 'text-green-400' : device.status === 'idle' ? 'text-blue-400' : 'text-yellow-400'}`}>
                              {device.status === 'active' ? 'Activo' : device.status === 'idle' ? 'Inactivo' : 'Standby'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {activeTab === 2 && (
                    <div className="text-xs text-gray-300 space-y-3">
                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span>Registros de consumo</span>
                        </div>
                        <select className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs">
                          <option>Últimas 24h</option>
                          <option>Última semana</option>
                          <option>Último mes</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>00:00 - 06:00</span>
                          <span className="text-white">890 kWh</span>
                        </div>
                        <div className="flex justify-between">
                          <span>06:00 - 12:00</span>
                          <span className="text-white">1,240 kWh</span>
                        </div>
                        <div className="flex justify-between">
                          <span>12:00 - 18:00</span>
                          <span className="text-white">980 kWh</span>
                        </div>
                        <div className="flex justify-between">
                          <span>18:00 - 24:00</span>
                          <span className="text-white">340 kWh</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 3 && (
                    <div className="text-xs text-gray-300 space-y-3">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-gray-400" />
                        <span className="text-white">Configuración de Umbrales</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-gray-400 mb-1">Umbral de alerta (kW)</label>
                          <input 
                            type="number" 
                            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
                            defaultValue="200"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 mb-1">Umbral crítico (kW)</label>
                          <input 
                            type="number" 
                            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
                            defaultValue="280"
                          />
                        </div>
                        <button className="w-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded px-3 py-2 text-xs hover:bg-yellow-500/30 transition-colors">
                          Guardar Configuración
                        </button>
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