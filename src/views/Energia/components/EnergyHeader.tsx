import { Clock, Eye, EyeOff, Zap, Power, Battery } from 'lucide-react';
import { Card } from './Card';
import { DeviceSummary } from '../types';

interface EnergyHeaderProps {
  devices: DeviceSummary[];
  showSensitive: boolean;
  onToggleSensitive: () => void;
}

export function EnergyHeader({ devices, showSensitive, onToggleSensitive }: EnergyHeaderProps) {
  
  const totalPower = devices.reduce((sum, device) => sum + device.object.agg_activePower, 0);
  const totalEnergy = devices.reduce((sum, device) => sum + device.object.agg_activeEnergy, 0) / 1000; // a kWh

  return (
    <div className="h-16 flex gap-2">
      <Card className="w-64 flex items-center px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Monitor Energía</h1>
            <p className="text-xs text-gray-400">{devices.length} Dispositivos</p>
          </div>
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
                <p className="text-xs text-gray-400">Potencia Total</p>
                <p className="text-sm font-medium text-white">
                  {totalPower.toFixed(2)} kW
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-blue-500/20">
                <Battery className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Energía Total</p>
                <p className="text-sm font-medium text-white">
                  {totalEnergy.toFixed(0)} kWh
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onToggleSensitive}
              className="flex items-center gap-1 text-xs text-gray-300 hover:text-white"
            >
              {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showSensitive ? "Ocultar datos" : "Mostrar datos"}
            </button>
            <div className="h-4 w-px bg-gray-600"></div>
            <div className="flex items-center gap-1 text-xs text-gray-300">
              <Clock className="w-4 h-4" />
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}