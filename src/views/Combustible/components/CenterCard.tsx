// src/views/combustible/components/CenterCard.tsx
import React from 'react';
import { Building } from 'lucide-react';
import { Center, Tank } from '../types';
import { StatusIndicator } from './StatusIndicator';
import { FuelWidget } from './FuelWidget';

interface CenterCardProps {
  center: Center;
  onTankSelect: (tank: Tank) => void;
}

export function CenterCard({ center, onTankSelect }: CenterCardProps) {
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

      {/* Grid de Widgets de Combustible */}
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