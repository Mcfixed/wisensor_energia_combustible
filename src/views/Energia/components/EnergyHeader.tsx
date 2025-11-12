import { Clock, Eye, EyeOff, Zap, Power, Battery } from 'lucide-react';
import { Card } from './Card';
import { DeviceSummary } from '../types';

interface EnergyHeaderProps {
  devices: DeviceSummary[];
  showSensitive: boolean;
  onToggleSensitive: () => void;
  timeRange: string;
  onTimeRangeChange: (newRange: string) => void;
}

export function EnergyHeader({
  devices,
  onToggleSensitive,
  timeRange,
  onTimeRangeChange
}: EnergyHeaderProps) {
  console.log(devices);
  const totalEnergy = devices.reduce((sum, device) => sum + device.final_energy_counter, 0) / 1000; // a kWh

  return (
    <div className="h-16 flex gap-2">
        <Card className="w-64 flex items-center px-4">
    <div className="flex items-center gap-2">
      <img 
        src="/EFE-logo3.png" 
        alt="Logo" 
        className="w-16 h-14 object-contain"
      />
      <div>
        <h1 className="text-lg font-semibold text-gray-300">Monitor Energía</h1>
        <p className="text-xs text-gray-400">{devices.length} Dispositivos</p>
      </div>
    </div>
  </Card>
      
      <Card className="flex-1 flex items-center px-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-green-500/20">
                <Zap className="w-4 h-4 text-green-400" />
                
              </div>
              <div>
                <p className="text-xs text-gray-400">Consumo energía total desde inicio</p>
                <p className="text-sm font-medium text-white">
                  {totalEnergy.toFixed(2)} kWh
                </p>
              </div>
            </div>
            
          </div>
          
          <div className="flex items-center gap-4">
            
            
            <select 
                value={timeRange}
                onChange={(e) => onTimeRangeChange(e.target.value)}
                className="
                  w-full max-w-xs
                  bg-gradient-to-br from-gray-950/40 to-gray-900/40
                  border-2 border-red-700/40
                  rounded
                  px-4 py-3
                  text-white
                  font-semibold
                  text-base
                  shadow-lg
                  transition-all
                  duration-300
                  ease-in-out
                  hover:border-blue-400
                  hover:shadow-blue-500/25
                  hover:shadow-xl
                  focus:outline-none
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/30
                  focus:shadow-2xl
                  cursor-pointer
                  backdrop-blur-sm
                  appearance-none
                  pr-12
                "
                >
                <option value="5m" className="bg-gray-800 py-2">Últimos 5 minutos</option>
                <option value="30m" className="bg-gray-800 py-2">Últimos 30 minutos</option>
                <option value="1h" className="bg-gray-800 py-2">Última hora</option>
                <option value="6h" className="bg-gray-800 py-2">Últimas 6 horas</option>
                <option value="12h" className="bg-gray-800 py-2">Últimas 12 horas</option>
                <option value="1d" className="bg-gray-800 py-2">Últimas 24 horas</option>
                <option value="7d" className="bg-gray-800 py-2">Últimos 7 días</option>
                <option value="14d" className="bg-gray-800 py-2">Últimos 14 días</option>
                <option value="30d" className="bg-gray-800 py-2">Últimos 30 días</option>
                </select> 
            
            <button 
              onClick={onToggleSensitive}
              className="flex items-center gap-1 text-xs text-gray-300 hover:text-white"
            >
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