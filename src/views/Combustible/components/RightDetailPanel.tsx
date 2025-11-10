// src/views/combustible/components/RightDetailPanel.tsx

import { Building } from 'lucide-react';
import { Card } from './Card';
import { StatusIndicator } from './StatusIndicator';
import { FuelChart } from './FuelChart';
import { Tank } from '../types';

interface RightDetailPanelProps {
  currentTank: Tank | null;
}

export function RightDetailPanel({ currentTank }: RightDetailPanelProps) {
  
  // Datos mock para los gráficos (en un futuro vendrán de 'historicalData')
  const mockLabels = ['6h', '5h', '4h', '3h', '2h', '1h', 'Ahora'];
  const generateMockData = (value: number) => [
    value * 0.92,
    value * 0.94,
    value * 0.96,
    value * 0.97,
    value * 0.98,
    value * 0.99,
    value
  ];

  if (!currentTank) {
    return (
      <Card className="flex-1">
        <div className="p-4 h-full flex items-center justify-center">
          <p className="text-gray-500">Seleccione un tanque para ver detalles</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex-1">
      <div className="p-4 h-full flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2 flex-shrink-0">
          <Building className="w-5 h-5 text-blue-400" />
          Información del Tanque
        </h3>
        
        <div className="space-y-3">
          <div className="bg-dark-osc p-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">{currentTank.name}</h4>
                <p className="text-xs text-gray-400">Centro ID: {currentTank.centerId} - {currentTank.fuelType}</p>
              </div>
              <StatusIndicator 
                status={currentTank.sensor.sensor_ok ? 'secure' : 'danger'} 
                text={currentTank.sensor.sensor_ok ? 'ACTIVO' : 'ERROR'} 
              />
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 gap-3">
            <FuelChart
              title="Nivel de Combustible"
              value={`${currentTank.sensor.percentage.toFixed(0)}%`}
              labels={mockLabels}
              data={generateMockData(currentTank.sensor.percentage)}
              borderColor="#22c55e"
              backgroundColor="rgba(34, 197, 94, 0.1)"
            />
            <FuelChart
              title="Volumen"
              value={`${currentTank.sensor.volume_L.toLocaleString()}L`}
              labels={mockLabels}
              data={generateMockData(currentTank.sensor.volume_L)}
              borderColor="#3b82f6"
              backgroundColor="rgba(59, 130, 246, 0.1)"
            />
            <FuelChart
              title="Presión"
              value={`${currentTank.sensor.pressure_Bar.toFixed(2)} Bar`}
              labels={mockLabels}
              data={generateMockData(currentTank.sensor.pressure_Bar)}
              borderColor="#ec4899"
              backgroundColor="rgba(236, 72, 153, 0.1)"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}