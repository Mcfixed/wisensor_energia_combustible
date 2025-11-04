
import { Search, RefreshCw } from 'lucide-react';
import { Card } from './Card';
import { TimeRange } from '../types';

interface FuelFilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  onRefresh: () => void;
}

export function FuelFilterBar({ 
  searchTerm, 
  onSearchChange, 
  timeRange, 
  onTimeRangeChange,
  onRefresh
}: FuelFilterBarProps) {
  return (
    <Card className="h-12 flex-shrink-0">
      <div className="p-3 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-1">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Buscar centro o ubicación..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent border-none text-white text-sm placeholder-gray-400 focus:outline-none w-64"
            />
          </div>
          
          <select 
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white"
          >
            <option value="24h">Últimas 24 Horas</option>
            <option value="7d">Últimos 7 Días</option>
            <option value="30d">Últimos 30 Días</option>
          </select>
        </div>
        
        <button 
          onClick={onRefresh}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar Datos
        </button>
      </div>
    </Card>
  );
}