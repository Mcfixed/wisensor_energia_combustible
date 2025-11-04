// src/views/combustible/components/FuelWidget.tsx
import React from 'react';
import { Tank } from '../types';
import { StatusIndicator } from './StatusIndicator';

interface FuelWidgetProps {
  tank: Tank;
}

export function FuelWidget({ tank }: FuelWidgetProps) {
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
          status={tank.sensor.sensor_ok ? (tank.sensor.percentage < 20 ? 'warning' : 'secure') : 'danger'} 
          text={tank.sensor.percentage.toFixed(0) + '%'} 
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
            <div className="text-white font-bold">{tank.sensor.pressure_Bar.toFixed(2)} Bar</div>
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