import { useState } from "react";
import { 
  AlertTriangle, Cable, Clock, Cpu, Eye, EyeOff, 
  FileText, Fingerprint, Globe, HardDrive, Lock, 
  MemoryStick, Network, Shield, ShieldAlert, 
  Smartphone, Tablet, User, Server
} from 'lucide-react';
import { CardProps,StatusDefaultProps } from "../../assets/types/Estadisticas";
function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`flex-1 h-full overflow-hidden bg-gray-darkL rounded-lg border border-gray-700 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function StatusIndicator({ status, text }: StatusDefaultProps) {
  const statusConfig = {
    secure: { color: "text-green-400", bg: "bg-green-400/10", icon: <Shield className="w-3 h-3" /> },
    warning: { color: "text-yellow-400", bg: "bg-yellow-400/10", icon: <AlertTriangle className="w-3 h-3" /> },
    danger: { color: "text-red-400", bg: "bg-red-400/10", icon: <ShieldAlert className="w-3 h-3" /> },
    neutral: { color: "text-blue-400", bg: "bg-blue-400/10", icon: <Eye className="w-3 h-3" /> }
  };
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusConfig[status].bg} ${statusConfig[status].color}`}>
      {statusConfig[status].icon}
      {text}
    </div>
  );
}

export const Estadisticas = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSensitive, setShowSensitive] = useState(false);
  
  const securityEvents = [
    { id: 1, type: "Intento de acceso", source: "192.168.1.45", level: "warning", time: "2 min ago" },
    { id: 2, type: "Actualización de firewall", source: "Sistema", level: "secure", time: "15 min ago" },
    { id: 3, type: "Nuevo dispositivo", source: "MAC: 3A:2B:...", level: "neutral", time: "32 min ago" },
    { id: 4, type: "Escaneo de puertos", source: "45.33.21.10", level: "danger", time: "1 hr ago" }
  ];

  const devices = [
    { id: 1, name: "Servidor Web", type: "server", ip: "192.168.1.10", status: "active", connections: 42 },
    { id: 2, name: "Admin Laptop", type: "laptop", ip: "192.168.1.15", status: "idle", connections: 3 },
    { id: 3, name: "IoT Device", type: "iot", ip: "192.168.1.22", status: "active", connections: 8 },
    { id: 4, name: "Backup Server", type: "server", ip: "192.168.1.11", status: "maintenance", connections: 2 }
  ];

  const tabs = [
    { id: 0, label: "Seguridad", content: "Resumen de seguridad" },
    { id: 1, label: "Dispositivos", content: "Lista de dispositivos" },
    { id: 2, label: "Registros", content: "Registros del sistema" },
    { id: 3, label: "Configuración", content: "Ajustes de monitoreo" },
  ];

  return (
    <main className="flex-1 h-screen overflow-hidden p-2 bg-gray-dark">
      <div className="flex flex-col h-full gap-2">
        {/* Header */}
        <div className="h-16 flex gap-2">
          <Card className="w-64 flex items-center px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Fingerprint className="w-4 h-4 text-purple-500" />
              </div>
              <h1 className="text-lg font-semibold text-white">Security Center</h1>
            </div>
          </Card>
          
          <Card className="flex-1 flex items-center px-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-green-500/20">
                    <Network className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Estado de red</p>
                    <p className="text-sm font-medium text-white">Protegida</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-blue-500/20">
                    <Lock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Firewall</p>
                    <p className="text-sm font-medium text-white">Activo</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-yellow-500/20">
                    <User className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Sesiones</p>
                    <p className="text-sm font-medium text-white">12 activas</p>
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
                      <Cpu className="w-4 h-4 text-blue-400" />
                      Rendimiento del Sistema
                    </h2>
                    <StatusIndicator status="secure" text="Estable" />
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div className="bg-gray-dark rounded p-2 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-green-400">78%</div>
                      <div className="text-xs text-gray-400 mt-1">CPU</div>
                      <div className="w-full h-1 mt-2 bg-gray-700 rounded-full">
                        <div className="h-1 rounded-full bg-green-400" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-yellow-400">64%</div>
                      <div className="text-xs text-gray-400 mt-1">RAM</div>
                      <div className="w-full h-1 mt-2 bg-gray-700 rounded-full">
                        <div className="h-1 rounded-full bg-yellow-400" style={{ width: '64%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-purple-400">42%</div>
                      <div className="text-xs text-gray-400 mt-1">Disco</div>
                      <div className="w-full h-1 mt-2 bg-gray-700 rounded-full">
                        <div className="h-1 rounded-full bg-purple-400" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-400" />
                      Actividad de Red
                    </h2>
                    <StatusIndicator status="warning" text="Alerta menor" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="bg-gray-dark rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Entrante</span>
                        <span className="text-xs font-medium text-white">3.2 MB/s</span>
                      </div>
                      <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                        <div className="h-1.5 rounded-full bg-blue-400" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Saliente</span>
                        <span className="text-xs font-medium text-white">1.8 MB/s</span>
                      </div>
                      <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                        <div className="h-1.5 rounded-full bg-purple-400" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Conexiones</span>
                        <span className="text-xs font-medium text-white">142</span>
                      </div>
                      <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                        <div className="h-1.5 rounded-full bg-green-400" style={{ width: '48%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-dark rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Latencia</span>
                        <span className="text-xs font-medium text-white">28ms</span>
                      </div>
                      <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                        <div className="h-1.5 rounded-full bg-yellow-400" style={{ width: '22%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Fila media - Mapa de red */}
            <div className="h-1/3">
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <Cable className="w-4 h-4 text-purple-400" />
                      Mapa de Red
                    </h2>
                    <StatusIndicator status="neutral" text="Monitoreando" />
                  </div>
                  <div className="flex-1 bg-gray-dark rounded flex items-center justify-center relative">
                    {/* Simulación de mapa de red */}
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZT0iIzQwNDA0MCIgc3Ryb2tlLXdpZHRoPSIxIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6Ii8+PC9nPjwvc3ZnPg==')]"></div>
                    
                    {/* Dispositivos en la red */}
                    <div className="relative z-10 grid grid-cols-4 gap-6 w-full h-full p-4">
                      {/* Servidor central */}
                      <div className="col-span-1 col-start-2 row-start-2 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-1">
                          <Server className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-xs text-white">Core Server</span>
                        <span className="text-[10px] text-gray-400">192.168.1.1</span>
                      </div>
                      
                      {/* Dispositivos conectados */}
                      <div className="col-span-1 flex flex-col items-center justify-end">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-1">
                          <Smartphone className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-xs text-white">Mobile</span>
                      </div>
                      
                      <div className="col-span-1 flex flex-col items-center justify-start">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-1">
                          <Tablet className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-xs text-white">Tablet</span>
                      </div>
                      
                      <div className="col-span-1 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mb-1">
                          <MemoryStick className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="text-xs text-white">NAS</span>
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
            
            {/* Fila inferior - Dispositivos */}
            <div className="h-1/3">
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <h2 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                    <HardDrive className="w-4 h-4 text-yellow-400" />
                    Almacenamiento y Backup
                  </h2>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div className="bg-gray-dark rounded p-3 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Principal</span>
                        <span className="text-xs font-medium text-white">1.2TB/2TB</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full">
                        <div className="h-2 rounded-full bg-blue-400" style={{ width: '60%' }}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">SSD NVMe</div>
                    </div>
                    
                    <div className="bg-gray-dark rounded p-3 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Backup</span>
                        <span className="text-xs font-medium text-white">4.5TB/8TB</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full">
                        <div className="h-2 rounded-full bg-green-400" style={{ width: '56%' }}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">RAID 5</div>
                    </div>
                    
                    <div className="bg-gray-dark rounded p-3 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Cloud</span>
                        <span className="text-xs font-medium text-white">150GB/500GB</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full">
                        <div className="h-2 rounded-full bg-purple-400" style={{ width: '30%' }}></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">Último: Hoy 03:42</div>
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
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    Eventos de Seguridad
                  </h2>
                  <button className="text-xs text-gray-400 hover:text-white">Ver todos</button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {securityEvents.map(event => (
                    <div key={event.id} className="mb-3 pb-3 border-b border-gray-700 last:border-0 last:mb-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1 rounded-full ${event.level === 'danger' ? 'bg-red-400/20' : event.level === 'warning' ? 'bg-yellow-400/20' : event.level === 'secure' ? 'bg-green-400/20' : 'bg-blue-400/20'}`}>
                          {event.level === 'danger' ? <ShieldAlert className="w-3 h-3 text-red-400" /> : 
                           event.level === 'warning' ? <AlertTriangle className="w-3 h-3 text-yellow-400" /> :
                           <Shield className="w-3 h-3 text-green-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="text-xs text-white">{event.type}</p>
                            <span className="text-xs text-gray-400">{event.time}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {showSensitive ? event.source : "••••••••••••••••"}
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
                          ? "text-white border-b-2 border-purple-500"
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
                          <Shield className="w-3 h-3 text-green-400" />
                          Protecciones activas
                        </h3>
                        <ul className="text-xs text-gray-300 space-y-2">
                          <li className="flex items-center gap-2">• Firewall de aplicaciones</li>
                          <li className="flex items-center gap-2">• Detección de intrusos</li>
                          <li className="flex items-center gap-2">• Cifrado SSL</li>
                          <li className="flex items-center gap-2">• Autenticación 2FA</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-dark rounded p-3">
                        <h3 className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-yellow-400" />
                          Vulnerabilidades
                        </h3>
                        <div className="text-xs text-gray-300">
                          <p>2 vulnerabilidades de media prioridad</p>
                          <p className="mt-1 text-gray-400">Último escaneo: Hoy 04:00</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 1 && (
                    <div className="space-y-3">
                      {devices.map(device => (
                        <div key={device.id} className="bg-gray-dark rounded p-2 flex items-center gap-3">
                          <div className={`p-2 rounded-full ${device.status === 'active' ? 'bg-green-500/20' : device.status === 'idle' ? 'bg-blue-500/20' : 'bg-yellow-500/20'}`}>
                            {device.type === 'server' ? <Server className="w-4 h-4 text-green-400" /> : 
                             device.type === 'laptop' ? <Smartphone className="w-4 h-4 text-blue-400" /> :
                             <MemoryStick className="w-4 h-4 text-yellow-400" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-white">{device.name}</p>
                            <p className="text-xs text-gray-400">
                              {showSensitive ? device.ip : "••••••••••••"}
                            </p>
                          </div>
                          <div className="text-xs font-medium text-white">
                            {device.connections} conex.
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {activeTab === 2 && (
                    <div className="text-xs text-gray-300 space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>Registros del sistema disponibles</span>
                      </div>
                      <p className="text-gray-400 mt-2">Seleccione un dispositivo para ver sus registros detallados.</p>
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