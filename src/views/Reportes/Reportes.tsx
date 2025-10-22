import { useState } from "react";
import { 
  Activity, AlertCircle, BarChart2, Battery, Bell, Clock, 
  Cloud, Database, HardDrive, Server,
  Shield, Signal, Thermometer, Wifi 
} from 'lucide-react';
import {CardProps, StatusBadgeProps, Status} from '../../assets/types/Reportes'

function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`flex-1 h-full overflow-hidden bg-gray-darkL rounded-lg border border-gray-700 shadow-sm ${className}`}>
      {children}
    </div>
  );
}


function StatusBadge({ status }:StatusBadgeProps) {
  const statusColors = {
    online: "text-green-400 bg-green-400/10",
    warning: "text-yellow-400 bg-yellow-400/10",
    critical: "text-red-400 bg-red-400/10",
    offline: "text-gray-400 bg-gray-400/10"
  };
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export const Reportes = () => {
  const [activeTab, setActiveTab] = useState(0);
  /* setNotifications */
  const [notifications] = useState([
    { id: 1, message: "Alta temperatura en servidor DB01", time: "2 min ago", level: "critical" },
    { id: 2, message: "Actualización de seguridad disponible", time: "15 min ago", level: "warning" },
    { id: 3, message: "Nuevo dispositivo conectado", time: "1 hora ago", level: "info" }
  ]);

  const servers = [
    { id: 1, name: "Servidor Web", status: "online", cpu: 32, memory: 45 },
    { id: 2, name: "Base de Datos", status: "warning", cpu: 78, memory: 65 },
    { id: 3, name: "Servidor Backup", status: "online", cpu: 12, memory: 34 },
    { id: 4, name: "Servidor Dev", status: "offline", cpu: 0, memory: 0 }
  ];

  const tabs = [
    { id: 0, label: "Resumen", content: "Contenido resumen" },
    { id: 1, label: "Rendimiento", content: "Contenido rendimiento" },
    { id: 2, label: "Red", content: "Contenido red" },
    { id: 3, label: "Almacenamiento", content: "Contenido almacenamiento" },
  ];

  return (
    <main className="flex-1 h-screen overflow-hidden p-2 bg-gray-dark">
      <div className="flex flex-col h-full gap-2">
        {/* Primera fila - Header y métricas rápidas */}
        <div className="h-16 flex gap-2">
          {/* Logo y título */}
          <Card className="w-64 flex items-center px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Server className="w-4 h-4 text-blue-500" />
              </div>
              <h1 className="text-lg font-semibold text-white">Centro de Monitoreo</h1>
            </div>
          </Card>
          
          {/* Widgets pequeños */}
          <Card className="flex-1 flex items-center px-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Sistemas activos:</span>
                  <span className="text-sm font-medium text-white">12/15</span>
                </div>
                
                <div className="h-4 w-px bg-gray-600"></div>
                
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Alertas:</span>
                  <span className="text-sm font-medium text-white">3</span>
                </div>
                
                <div className="h-4 w-px bg-gray-600"></div>
                
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Temperatura:</span>
                  <span className="text-sm font-medium text-white">42°C</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Segunda fila - Contenido principal */}
        <div className="flex-1 flex gap-2">
          {/* Columna izquierda - Gráficos y métricas */}
          <div className="w-3/4 flex flex-col gap-2">
            {/* Fila de gráficos */}
            <div className="h-1/2 flex gap-2">
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-purple-400" />
                      Uso de CPU
                    </h2>
                    <StatusBadge status="online" />
                  </div>
                  <div className="flex-1 bg-gray-dark rounded p-2 flex items-center justify-center">
                    <div className="w-full h-40 bg-gradient-to-b from-purple-500/10 to-transparent rounded border border-purple-500/30 relative">
                      {/* Simulación de gráfico */}
                      <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-purple-500/20 to-transparent"></div>
                      <div className="absolute top-3 left-3 text-xs text-purple-400">75% promedio</div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-400" />
                      Uso de Memoria
                    </h2>
                    <StatusBadge status="warning" />
                  </div>
                  <div className="flex-1 bg-gray-dark rounded p-2 flex items-center justify-center">
                    <div className="w-full h-40 bg-gradient-to-b from-blue-500/10 to-transparent rounded border border-blue-500/30 relative">
                      {/* Simulación de gráfico */}
                      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-blue-500/20 to-transparent"></div>
                      <div className="absolute top-3 left-3 text-xs text-blue-400">65% promedio</div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-green-400" />
                      Almacenamiento
                    </h2>
                    <StatusBadge status="online" />
                  </div>
                  <div className="flex-1 bg-gray-dark rounded p-2 flex items-center justify-center">
                    <div className="w-full h-40 bg-gradient-to-b from-green-500/10 to-transparent rounded border border-green-500/30 relative">
                      {/* Simulación de gráfico */}
                      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-500/20 to-transparent"></div>
                      <div className="absolute top-3 left-3 text-xs text-green-400">32% utilizado</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Fila de servidores */}
            <div className="h-1/2 flex gap-2">
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <h2 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                    <Server className="w-4 h-4 text-yellow-400" />
                    Estado de Servidores
                  </h2>
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-700">
                          <th className="pb-2">Nombre</th>
                          <th className="pb-2">Estado</th>
                          <th className="pb-2">CPU</th>
                          <th className="pb-2">Memoria</th>
                        </tr>
                      </thead>
                      <tbody>
                        {servers.map(server => (
                          <tr key={server.id} className="border-b border-gray-700/50 hover:bg-gray-700/10">
                            <td className="py-2 text-white">{server.name}</td>
                            <td className="py-2">
                              <StatusBadge status={server.status as Status} />
                            </td>
                            <td className="py-2">
                              <div className="w-full bg-gray-700 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${server.cpu > 70 ? 'bg-red-400' : server.cpu > 40 ? 'bg-yellow-400' : 'bg-green-400'}`} 
                                  style={{ width: `${server.cpu}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-300">{server.cpu}%</span>
                            </td>
                            <td className="py-2">
                              <div className="w-full bg-gray-700 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${server.memory > 70 ? 'bg-red-400' : server.memory > 40 ? 'bg-yellow-400' : 'bg-green-400'}`} 
                                  style={{ width: `${server.memory}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-300">{server.memory}%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <h2 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                    <Wifi className="w-4 h-4 text-purple-400" />
                    Estado de Red
                  </h2>
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Ancho de banda</span>
                      <span className="text-sm font-medium text-white">45% usado</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="h-2 rounded-full bg-purple-400" style={{ width: '45%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-300">Latencia</span>
                      <span className="text-sm font-medium text-white">28ms</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="h-2 rounded-full bg-green-400" style={{ width: '28%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-300">Paquetes perdidos</span>
                      <span className="text-sm font-medium text-white">0.2%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="h-2 rounded-full bg-yellow-400" style={{ width: '2%' }}></div>
                    </div>
                    
                    <div className="mt-auto pt-4">
                      <div className="flex items-center gap-2">
                        <Signal className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-300">Dispositivos conectados: </span>
                        <span className="text-sm font-medium text-white">14</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Columna derecha - Notificaciones y pestañas */}
          <div className="w-1/4 flex flex-col gap-2">
            <Card>
              <div className="p-3 h-full flex flex-col">
                <h2 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                  <Bell className="w-4 h-4 text-red-400" />
                  Alertas Recientes
                </h2>
                <div className="flex-1 overflow-y-auto">
                  {notifications.map(notification => (
                    <div key={notification.id} className="mb-3 pb-3 border-b border-gray-700 last:border-0 last:mb-0 last:pb-0">
                      <div className="flex items-start gap-2">
                        <div className={`mt-0.5 p-1 rounded-full ${notification.level === 'critical' ? 'bg-red-400/20' : notification.level === 'warning' ? 'bg-yellow-400/20' : 'bg-blue-400/20'}`}>
                          <AlertCircle className={`w-3 h-3 ${notification.level === 'critical' ? 'text-red-400' : notification.level === 'warning' ? 'text-yellow-400' : 'text-blue-400'}`} />
                        </div>
                        <div>
                          <p className="text-xs text-white">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
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
                  <div className="text-gray-300 text-sm">
                    {tabs.find(tab => tab.id === activeTab)?.content}
                    
                    {activeTab === 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/10 rounded-lg">
                            <Cloud className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Servicios en la nube</p>
                            <p className="text-sm text-white">3 activos</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Shield className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Seguridad</p>
                            <p className="text-sm text-white">Protegido</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Battery className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Energía</p>
                            <p className="text-sm text-white">UPS activo</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};