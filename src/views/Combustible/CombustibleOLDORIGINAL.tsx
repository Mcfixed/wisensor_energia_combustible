import { useState, useRef, useEffect } from "react";
import { 
  AlertTriangle, Droplets, Fuel, Clock, Eye, EyeOff, 
  FileText, MapPin, Building, TrendingDown, 
  Battery, Zap, Waves, Settings,
  Database, RefreshCw, BarChart3, Filter,
  Gauge, Activity, BarChart, Navigation,
  Maximize2, Minimize2, Grid3X3, List, Search,
  ChevronDown, ChevronRight
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Interfaces
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface StatusDefaultProps {
  status: 'secure' | 'warning' | 'danger' | 'neutral' | 'maintenance';
  text: string;
}

interface SensorData {
  volume_L: number;
  percentage: number;
  pressure_Bar: number;
  sensor_ok: boolean;
  lastUpdate: string;
  latitude: number;
  longitude: number;
}

interface Tank {
  id: string;
  name: string;
  capacity: number;
  fuelType: string;
  sensor: SensorData;
  centerId: string;
}

interface Center {
  id: string;
  name: string;
  location: string;
  status: 'secure' | 'warning' | 'danger' | 'maintenance' | 'neutral';
  tanks: Tank[];
  totalCapacity: number;
  currentInventory: number;
}

// Componentes base
function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`flex-1 h-full overflow-hidden bg-gray-dark border border-gray-700/40 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function StatusIndicator({ status, text }: StatusDefaultProps) {
  const statusConfig = {
    secure: { 
      color: "text-green-400", 
      bg: "bg-green-400/10", 
      icon: <Battery className="w-3 h-3" /> 
    },
    warning: { 
      color: "text-yellow-400", 
      bg: "bg-yellow-400/10", 
      icon: <AlertTriangle className="w-3 h-3" /> 
    },
    danger: { 
      color: "text-red-400", 
      bg: "bg-red-400/10", 
      icon: <TrendingDown className="w-3 h-3" /> 
    },
    neutral: { 
      color: "text-blue-400", 
      bg: "bg-blue-400/10", 
      icon: <Droplets className="w-3 h-3" /> 
    },
    maintenance: { 
      color: "text-gray-400", 
      bg: "bg-gray-400/10", 
      icon: <Settings className="w-3 h-3" /> 
    }
  };
  
  const config = statusConfig[status] || statusConfig.neutral;
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.bg} ${config.color}`}>
      {config.icon}
      {text}
    </div>
  );
}

// Widget de Combustible para Centro
function FuelWidget({ 
  tank
}: { 
  tank: Tank;
}) {
  const getFuelColor = () => {
    const percentage = tank.sensor.percentage;
    if (percentage > 70) return 'from-green-500 to-green-600';
    if (percentage > 40) return 'from-yellow-500 to-yellow-600';
    if (percentage > 20) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getStatusColor = () => {
    if (!tank.sensor.sensor_ok) return 'border-red-400';
    const percentage = tank.sensor.percentage;
    if (percentage < 20) return 'border-red-400';
    if (percentage < 40) return 'border-yellow-400';
    return 'border-green-400';
  };

  return (
    <div className="bg-dark-osc border border-gray-700 p-2">
      {/* Header del Widget */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate">
            {tank.name}
          </div>
          <div className="text-xs text-gray-400">{tank.fuelType}</div>
        </div>
        <StatusIndicator 
          status={tank.sensor.sensor_ok ? 'secure' : 'danger'} 
          text={tank.sensor.percentage + '%'} 
        />
      </div>

      {/* Tanque Visual y Métricas */}
      <div className="flex items-center gap-2">
        <div className={`relative w-10 h-14 bg-gray-700 rounded-lg border-2 ${getStatusColor()} overflow-hidden`}>
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getFuelColor()} transition-all duration-500 ease-out`}
            style={{ height: `${tank.sensor.percentage}%` }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>
        
        {/* Métricas del Tanque */}
        <div className="flex-1 grid grid-cols-2 gap-1.5 text-xs">
          <div>
            <div className="text-gray-400 text-[11px]">Volumen</div>
            <div className="text-white font-bold">{tank.sensor.volume_L.toLocaleString()}L</div>
          </div>
          <div>
            <div className="text-gray-400 text-[11px]">Presión</div>
            <div className="text-white font-bold">{tank.sensor.pressure_Bar} Bar</div>
          </div>
          <div>
            <div className="text-gray-400 text-[11px]">Capacidad</div>
            <div className="text-gray-400">{tank.capacity.toLocaleString()}L</div>
          </div>
          <div>
            <div className="text-gray-400 text-[11px]">Estado</div>
            <div className={`text-[11px] font-medium ${tank.sensor.sensor_ok ? 'text-green-400' : 'text-red-400'}`}>
              {tank.sensor.sensor_ok ? 'ACTIVO' : 'ERROR'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Centro con 3 Sensores
function CenterCard({ 
  center,
  onTankSelect
}: { 
  center: Center;
  onTankSelect: (tank: Tank) => void;
}) {
  return (
    <div className="bg-dark-osc border border-gray-700/40 p-4">
      {/* Header del Centro */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">{center.name}</h3>
          </div>
          <p className="text-sm text-gray-400 mt-0.5">{center.location}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusIndicator 
            status={center.status} 
            text={`${center.tanks.length} sensores`} 
          />
          <div className="text-sm text-white">
            {center.currentInventory.toLocaleString()}L / {center.totalCapacity.toLocaleString()}L
          </div>
        </div>
      </div>

      {/* Grid de 3 Widgets de Combustible */}
      <div className="grid grid-cols-3 gap-2">
        {center.tanks.map(tank => (
          <div 
            key={tank.id}
            className="cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => onTankSelect(tank)}
          >
            <FuelWidget tank={tank} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente de Tanque con Gráfico (para vista detalle)
function TankWithChart({ 
  tank,
  isSelected = false,
  onClick,
  timeRange
}: { 
  tank: Tank;
  isSelected?: boolean;
  onClick: () => void;
  timeRange: '24h' | '7d' | '30d';
}) {
  const getFuelColor = () => {
    const percentage = tank.sensor.percentage;
    if (percentage > 70) return 'from-green-500 to-green-600';
    if (percentage > 40) return 'from-yellow-500 to-yellow-600';
    if (percentage > 20) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getStatusColor = () => {
    if (!tank.sensor.sensor_ok) return 'border-red-400';
    const percentage = tank.sensor.percentage;
    if (percentage < 20) return 'border-red-400';
    if (percentage < 40) return 'border-yellow-400';
    return 'border-green-400';
  };

  return (
    <div 
      className={`flex gap-4 p-4 cursor-pointer transition-all ${
        isSelected ? 'bg-gray-700 border-2 border-orange-500' : 'bg-gray-800 hover:bg-gray-700'
      }`}
      onClick={onClick}
    >
      {/* Tanque Visual */}
      <div className="flex flex-col items-center">
        <div className={`relative w-16 h-20 bg-gray-700 rounded-lg border-2 ${getStatusColor()} overflow-hidden`}>
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getFuelColor()} transition-all duration-1000 ease-out`}
            style={{ height: `${tank.sensor.percentage}%` }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>
        
        <div className="text-center mt-2">
          <div className="text-sm font-semibold text-white">{tank.name}</div>
          <div className="text-xs text-gray-400">{tank.fuelType}</div>
          <div className={`text-lg font-bold mt-1 ${!tank.sensor.sensor_ok ? 'text-red-400' : 'text-white'}`}>
            {tank.sensor.percentage}%
          </div>
        </div>
      </div>
      
      {/* Información detallada */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="text-sm font-medium text-white">{tank.name}</div>
            <div className="text-xs text-gray-400">Centro {tank.centerId}</div>
          </div>
          <StatusIndicator 
            status={tank.sensor.sensor_ok ? 'secure' : 'danger'} 
            text={tank.sensor.sensor_ok ? 'ACTIVO' : 'ERROR'} 
          />
        </div>
        
        <div className="grid grid-cols-3 gap-3 text-xs mb-3">
          <div>
            <div className="text-gray-400">Volumen</div>
            <div className="text-white font-bold">{tank.sensor.volume_L.toLocaleString()}L</div>
          </div>
          <div>
            <div className="text-gray-400">Presión</div>
            <div className="text-white font-bold">{tank.sensor.pressure_Bar} Bar</div>
          </div>
          <div>
            <div className="text-gray-400">Actualización</div>
            <div className="text-gray-400">
              {new Date(tank.sensor.lastUpdate).toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        {/* Información adicional */}
        <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
          <span>Capacidad: {tank.capacity.toLocaleString()}L</span>
          <span>Historial {timeRange}</span>
        </div>
      </div>
    </div>
  );
}

// Generar datos de ejemplo para centros con 3 sensores cada uno
const generateCenters = (): Center[] => {
  const centerNames = [
    "Planta Principal Norte", 
    "Centro Logístico Sur", 
    "Base Operativa Este", 
    "Estación Costa Oeste",
    "Terminal Central",
    "Depósito Regional"
  ];

  const locations = [
    "Av. Industrial 123, Zona Norte",
    "Ruta 5 Sur KM 245",
    "Cordillera, Sector Minero", 
    "Puerto Montt, Caleta",
    "Centro Ciudad, Plaza Principal",
    "Zona Franca, Bodega 42"
  ];

  return centerNames.map((name, index) => {
    const tanks: Tank[] = Array.from({ length: 3 }, (_, tankIndex) => ({
      id: `centro-${index + 1}-tanque-${tankIndex + 1}`,
      name: `Tanque ${String.fromCharCode(65 + tankIndex)}`,
      capacity: [10000, 15000, 8000][tankIndex],
      fuelType: ["Diesel", "Gasolina", "Biodiesel"][tankIndex],
      centerId: `centro-${index + 1}`,
      sensor: {
        volume_L: Math.floor(Math.random() * 15000) + 1000,
        percentage: Math.floor(Math.random() * 100) + 1,
        pressure_Bar: Math.random() * 4 + 0.5,
        sensor_ok: Math.random() > 0.2,
        lastUpdate: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        latitude: -41.46 + (Math.random() - 0.5) * 0.1,
        longitude: -72.94 + (Math.random() - 0.5) * 0.1
      }
    }));

    const totalCapacity = tanks.reduce((sum, tank) => sum + tank.capacity, 0);
    const currentInventory = tanks.reduce((sum, tank) => sum + tank.sensor.volume_L, 0);
    
    // Determinar estado del centro basado en sus tanques
    const hasError = tanks.some(tank => !tank.sensor.sensor_ok);
    const lowInventory = tanks.some(tank => tank.sensor.percentage < 20);
    
    let status: 'secure' | 'warning' | 'danger' | 'maintenance' | 'neutral' = 'secure';
    if (hasError) status = 'danger';
    else if (lowInventory) status = 'warning';

    return {
      id: `centro-${index + 1}`,
      name,
      location: locations[index],
      status,
      tanks,
      totalCapacity,
      currentInventory
    };
  });
};

export const Combustible = () => {
  const [activeView, setActiveView] = useState<'detalle' | 'todos'>('todos');
  const [selectedTank, setSelectedTank] = useState<Tank | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [searchTerm, setSearchTerm] = useState('');

  // Generar datos
  const centers = generateCenters();
  const allTanks = centers.flatMap(center => center.tanks);
  const filteredCenters = centers.filter(center =>
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentTank = selectedTank || allTanks[0];

  const customScrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(31, 41, 55, 0.5);
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(75, 85, 99, 0.8);
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(107, 114, 128, 0.8);
    }
  `;

  return (
    <main className="flex-1 max-h-screen overflow-hidden p-2 bg-dark-osc">
      <div className="flex flex-col h-full gap-2">
          {/* Header */}
        <div className="h-16 flex gap-2 flex-shrink-0">
          <Card className="flex items-center px-4">
            <div className="flex items-center gap-4 w-full">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Fuel className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">Monitoreo Combustible</h1>
                  <p className="text-xs text-gray-400">{centers.length} centros, {allTanks.length} sensores</p>
                </div>
              </div>
              
              {/* Botones de Vista en el Header */}
              <div className="flex items-center gap-2 ml-6">
                <button
                  onClick={() => setActiveView('todos')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeView === 'todos'
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  Vista Todos
                </button>
                <button
                  onClick={() => setActiveView('detalle')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeView === 'detalle'
                      ? "bg-orange-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Vista Detalle
                </button>
              </div>
            </div>
          </Card>
          
          <Card className="w-96 flex items-center px-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-green-500/20">
                    <Droplets className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Inventario Total</p>
                    <p className="text-sm font-medium text-white">
                      {allTanks.reduce((sum, tank) => sum + tank.sensor.volume_L, 0).toLocaleString()} L
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-blue-500/20">
                    <Gauge className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Sensores Activos</p>
                    <p className="text-sm font-medium text-white">
                      {allTanks.filter(tank => tank.sensor.sensor_ok).length}/{allTanks.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <Card className="h-12 flex-shrink-0">
          <div className="p-3 h-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-1">
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Buscar centro o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none text-white text-sm placeholder-gray-400 focus:outline-none w-64"
                />
              </div>
              
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white"
              >
                <option value="24h">Últimas 24 Horas</option>
                <option value="7d">Últimos 7 Días</option>
                <option value="30d">Últimos 30 Días</option>
              </select>
            </div>
            
            <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
              <RefreshCw className="w-4 h-4" />
              Actualizar Datos
            </button>
          </div>
        </Card>

        {/* Contenido principal */}
        <div className="flex-1 flex gap-2">
          {/* Columna izquierda - 2/3 */}
          <div className="w-2/3 flex flex-col gap-2">
            {activeView === 'detalle' ? (
              /* VISTA DETALLE - 3 tanques con información completa */
              <Card>
                <div className="p-4 h-full flex flex-col max-h-[calc(100vh-8rem)]">
                  <h2 className="text-lg font-semibold text-white mb-4 flex-shrink-0">Sensores en Detalle</h2>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {allTanks.slice(0, 3).map(tank => (
                      <TankWithChart
                        key={tank.id}
                        tank={tank}
                        isSelected={currentTank.id === tank.id}
                        onClick={() => setSelectedTank(tank)}
                        timeRange={timeRange}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            ) : (
              /* VISTA TODOS - Centros con sus 3 sensores */
              <Card>
                <div className="p-4 h-full flex flex-col max-h-[calc(100vh-8rem)]">
                  <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-white">Todos los Centros</h2>
                    <div className="text-sm text-gray-400">
                      {filteredCenters.length} de {centers.length} centros
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {filteredCenters.map(center => (
                      <CenterCard
                        key={center.id}
                        center={center}
                        onTankSelect={setSelectedTank}
                      />
                    ))}
                    
                    {filteredCenters.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No se encontraron centros
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
          
          {/* Columna derecha - 1/3 para Detalles */}
          <div className="w-1/3 flex flex-col gap-2">
            <Card className="flex-1">
              <div className="p-4 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2 flex-shrink-0">
                  <Building className="w-5 h-5 text-blue-400" />
                  Información del Centro
                </h3>
                
                {currentTank && (
                  <div className="space-y-3">
                    <div className="bg-dark-osc p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-white">{currentTank.name}</h4>
                          <p className="text-xs text-gray-400">Centro {currentTank.centerId} - {currentTank.fuelType}</p>
                        </div>
                        <StatusIndicator 
                          status={currentTank.sensor.sensor_ok ? 'secure' : 'danger'} 
                          text={currentTank.sensor.sensor_ok ? 'ACTIVO' : 'ERROR'} 
                        />
                      </div>
                    </div>

                    {/* Gráficos */}
                    <div className="grid grid-cols-1 gap-3">
                      {/* Gráfico de Porcentaje */}
                      <div className="bg-dark-osc p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-white">Nivel de Combustible</h4>
                          <span className="text-lg font-bold text-white">{currentTank.sensor.percentage}%</span>
                        </div>
                        <div className="h-[120px]">
                          <Line
                            data={{
                              labels: ['6h', '5h', '4h', '3h', '2h', '1h', 'Ahora'],
                              datasets: [{
                                label: 'Nivel (%)',
                                data: [
                                  currentTank.sensor.percentage * 0.92,
                                  currentTank.sensor.percentage * 0.94,
                                  currentTank.sensor.percentage * 0.96,
                                  currentTank.sensor.percentage * 0.97,
                                  currentTank.sensor.percentage * 0.98,
                                  currentTank.sensor.percentage * 0.99,
                                  currentTank.sensor.percentage
                                ],
                                borderColor: '#22c55e',
                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                fill: true,
                                tension: 0.4
                              }]
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { display: false }
                              },
                              scales: {
                                y: {
                                  beginAtZero: true,
                                  grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                  ticks: { color: '#9ca3af' }
                                },
                                x: {
                                  grid: { display: false },
                                  ticks: { color: '#9ca3af' }
                                }
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* Gráfico de Volumen */}
                      <div className="bg-dark-osc p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-white">Volumen</h4>
                          <span className="text-lg font-bold text-white">{currentTank.sensor.volume_L.toLocaleString()}L</span>
                        </div>
                        <div className="h-[120px]">
                          <Line
                            data={{
                              labels: ['6h', '5h', '4h', '3h', '2h', '1h', 'Ahora'],
                              datasets: [{
                                label: 'Volumen (L)',
                                data: [
                                  currentTank.sensor.volume_L * 0.95,
                                  currentTank.sensor.volume_L * 0.97,
                                  currentTank.sensor.volume_L * 0.98,
                                  currentTank.sensor.volume_L * 0.99,
                                  currentTank.sensor.volume_L * 0.995,
                                  currentTank.sensor.volume_L * 0.998,
                                  currentTank.sensor.volume_L
                                ],
                                borderColor: '#3b82f6',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                fill: true,
                                tension: 0.4
                              }]
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { display: false }
                              },
                              scales: {
                                y: {
                                  grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                  ticks: { color: '#9ca3af' }
                                },
                                x: {
                                  grid: { display: false },
                                  ticks: { color: '#9ca3af' }
                                }
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* Gráfico de Presión */}
                      <div className="bg-dark-osc p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-white">Presión</h4>
                          <span className="text-lg font-bold text-white">{currentTank.sensor.pressure_Bar} Bar</span>
                        </div>
                        <div className="h-[120px]">
                          <Line
                            data={{
                              labels: ['6h', '5h', '4h', '3h', '2h', '1h', 'Ahora'],
                              datasets: [{
                                label: 'Presión (Bar)',
                                data: [
                                  currentTank.sensor.pressure_Bar * 0.92,
                                  currentTank.sensor.pressure_Bar * 0.94,
                                  currentTank.sensor.pressure_Bar * 0.96,
                                  currentTank.sensor.pressure_Bar * 0.97,
                                  currentTank.sensor.pressure_Bar * 0.98,
                                  currentTank.sensor.pressure_Bar * 0.99,
                                  currentTank.sensor.pressure_Bar
                                ],
                                borderColor: '#ec4899',
                                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                                fill: true,
                                tension: 0.4
                              }]
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { display: false }
                              },
                              scales: {
                                y: {
                                  grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                  ticks: { color: '#9ca3af' }
                                },
                                x: {
                                  grid: { display: false },
                                  ticks: { color: '#9ca3af' }
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};