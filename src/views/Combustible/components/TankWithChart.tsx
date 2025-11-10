// src/views/combustible/components/TankWithChart.tsx
import { Tank, TimeRange } from '../types';
import { StatusIndicator } from './StatusIndicator';

interface TankWithChartProps {
  tank: Tank;
  isSelected?: boolean;
  onClick: () => void;
  timeRange: TimeRange;
}

export function TankWithChart({ tank, isSelected = false, onClick, timeRange }: TankWithChartProps) {
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
            {tank.sensor.percentage.toFixed(0)}%
          </div>
        </div>
      </div>
      
      {/* Información detallada */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="text-sm font-medium text-white">{tank.name}</div>
            <div className="text-xs text-gray-400">Centro ID: {tank.centerId}</div>
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
            <div className="text-white font-bold">{tank.sensor.pressure_Bar.toFixed(2)} Bar</div>
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