// src/views/combustible/components/FuelHeader.tsx
import React from 'react';
import { Fuel, Droplets, Gauge, Grid3X3, BarChart3 } from 'lucide-react';
import { Card } from './Card';
import { FuelSummary } from '../types';

type ViewType = 'todos' | 'detalle';

interface FuelHeaderProps {
  summary: FuelSummary;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function FuelHeader({ summary, activeView, onViewChange }: FuelHeaderProps) {
  return (
    <div className="h-16 flex gap-2 flex-shrink-0">
      <Card className="flex items-center px-4">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Fuel className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Monitoreo Combustible</h1>
              <p className="text-xs text-gray-400">
                {summary.totalCenters} centros, {summary.totalTanks} sensores
              </p>
            </div>
          </div>
          
          {/* Botones de Vista en el Header */}
          <div className="flex items-center gap-2 ml-6">
            <button
              onClick={() => onViewChange('todos')}
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
              onClick={() => onViewChange('detalle')}
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
                  {summary.totalInventory.toLocaleString()} L
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
                  {summary.activeTanks}/{summary.totalTanks}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}