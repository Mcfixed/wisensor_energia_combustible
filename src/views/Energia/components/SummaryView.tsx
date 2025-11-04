// components/SummaryView.tsx
import { Line } from 'react-chartjs-2'; 
import { Card } from "./Card";
import { ConsumptionGauge } from "./ConsumptionGauge";
import { DeviceSummary } from "../types";

// 1. Props actualizadas (sin onTimeRangeChange)
interface SummaryViewProps {
  device: DeviceSummary;
  index: number;
  onViewDetails: () => void;
  currentTimeRange: string;
}

// 2. Firma de la función actualizada
export function SummaryView({
  device,
  index,
  onViewDetails,
  currentTimeRange
}: SummaryViewProps) {
  
  const colors = ['blue', 'green', 'purple', 'yellow', 'red'];
  const currentColor = colors[index % colors.length];
  
  const lastDataTime = new Date(device.time);
  const now = new Date();
  const minutesAgo = (now.getTime() - lastDataTime.getTime()) / (1000 * 60);
  const isActive = minutesAgo < 5;
  
  const formattedTime = lastDataTime.toLocaleString('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/Santiago'
  }).replace(',', '');


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const, 
      intersect: false, 
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { 
          color: '#ccc', 
          font: { size: 11 }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: { 
          display: false 
        },
        ticks: { 
          color: '#9CA3AF', 
          font: { size: 10 },
          maxTicksLimit: 8
        }
      },
      y: {
        grid: { color: '#374151' },
        ticks: { 
          color: '#9CA3AF', 
          font: { size: 10 } 
        }
      }
    }
  };

  const availableVariables = [
    { id: 'consumption', label: 'Consumo', unit: 'kW', color: 'rgb(34, 197, 94)' },
    { id: 'voltage', label: 'Voltaje', unit: 'V', color: 'rgb(59, 130, 246)' },
    { id: 'current', label: 'Corriente', unit: 'A', color: 'rgb(239, 68, 68)' },
    { id: 'power', label: 'Potencia', unit: 'kW', color: 'rgb(234, 179, 8)' }
  ];

  type VariableId = 'consumption' | 'voltage' | 'current' | 'power';

  // 3. Función getHistoricalChartData COMPLETA (aquí estaba tu error)
  const getHistoricalChartData = (variableIds: VariableId[]) => {
    const data = (currentTimeRange === "monthly_mock")
      ? device.historicalData.monthly
      : device.historicalData.daily;
    
    // Usamos 'consumption' como referencia para las etiquetas (labels)
    const labels = data.consumption.map(d => d.time); 
    
    // Esta era la línea que faltaba o estaba incompleta
    const datasets = variableIds.map(id => {
        const selectedData = data[id as keyof typeof data]; 
        const variableConfig = availableVariables.find(v => v.id === id);

        if (!selectedData) {
            console.warn(`No historical data found for variable: ${id}`);
            return null;
        }

        return {
            label: `${variableConfig?.label} (${variableConfig?.unit})`,
            data: selectedData.map(d => d.value),
            borderColor: variableConfig?.color,
            backgroundColor: variableConfig?.color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
            borderWidth: 1.5,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: variableConfig?.color
        };
    }).filter(Boolean); // <-- Importante

    return {
      labels,
      datasets: datasets as any[] // Ahora 'datasets' sí está definido
    };
  };

  // 4. JSX actualizado SIN los <select>
  return (
     <div className="h-full flex flex-col gap-1">
       {/* Header */}
       <Card className="h-16">
         <div className="p-2 h-full">
           <div className="flex items-center justify-between h-full">
             <div className="flex items-center gap-3">
               <div className={`flex-shrink-0 w-8 h-8 rounded-full ${
                 isActive 
                 ? 'bg-green-500 animate-pulse' // Activo
                 : 'bg-gray-600' // Inactivo
               }`}>
               </div>
               <h3 className="text-sm font-semibold text-white">{device.deviceInfo.deviceName}</h3>
             </div>
             <div>
               <p className="text-sm text-gray-300">
                 Últ. dato: {formattedTime}
               </p>
             </div>
             <button 
               onClick={onViewDetails}
               className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
             >
               Ver Detalles
             </button>
           </div>
         </div>
       </Card>

       {/* Gauges */}
       <Card className="h-32">
         <div className="p-2 h-full">
           <div className="flex justify-between items-center h-full">
             <ConsumptionGauge 
               value={device.object.agg_activeEnergy / 1000}
               max={100} 
               label="Total Diario (kWh)"
               size="medium"
               color="yellow"
             />
             <ConsumptionGauge 
               value={device.object.phaseA_activeEnergy / 1000}
               max={50} 
               label="Fase A (kWh)"
               size="small"
               color="purple"
             />
             <ConsumptionGauge 
               value={device.object.phaseB_activeEnergy / 1000}
               max={50} 
               label="Fase B (kWh)" 
               size="small"
               color="purple"
             />
             <ConsumptionGauge 
               value={device.object.phaseC_activeEnergy / 1000}
               max={50} 
               label="Fase C (kWh)"
               size="small"
               color="purple"
             />
           </div>
         </div>
       </Card>

       {/* Métricas Rápidas */}
       <Card className="h-20">
         <div className="p-2 h-full">
           <div className="grid grid-cols-4 gap-1 h-full text-xs">
             <div className="bg-gray-700 rounded p-1 flex flex-col items-center justify-center">
               <div className="text-gray-400">Último Voltaje Total</div>
               <div className="text-white font-medium">{device.object.agg_voltage.toFixed(1)}V</div>
             </div>
             <div className="bg-gray-700 rounded p-1 flex flex-col items-center justify-center">
               <div className="text-gray-400">Última Corriente</div>
               <div className="text-white font-medium">{device.object.agg_current.toFixed(1)}A</div>
             </div>
             <div className="bg-gray-700 rounded p-1 flex flex-col items-center justify-center">
               <div className="text-gray-400">Última Frec.</div>
               <div className="text-white font-medium">{device.object.agg_frequency}Hz</div>
             </div>
             <div className="bg-gray-700 rounded p-1 flex flex-col items-center justify-center">
               <div className="text-gray-400">Última F. P.</div>
               <div className="text-white font-medium">{(device.object.agg_powerFactor * 100).toFixed(1)}%</div>
             </div>
           </div>
         </div>
       </Card>

       {/* Historial (Voltaje y Potencia) */}
       <Card className="h-60">
         <div className="p-2 h-full flex flex-col">
           <div className="flex justify-between items-center mb-2">
             <h4 className="text-xs font-medium text-white">Historial (Voltaje y Potencia)</h4>
             {/* SELECT ELIMINADO DE AQUÍ */}
           </div>
           <div className="flex-1">
             <Line 
               data={getHistoricalChartData(['voltage', 'power'])} 
               options={chartOptions}
             />
           </div>
         </div>
       </Card>

       {/* Historial de Consumo */}
       <Card className="h-64">
         <div className="p-2 h-full flex flex-col">
           <div className="flex justify-between items-center mb-2">
             <h4 className="text-xs font-medium text-white">Historial de Consumo (kW)</h4>
             {/* SELECT ELIMINADO DE AQUÍ */}
           </div>
           <div className="flex-1">
             <Line 
               data={getHistoricalChartData(['consumption'])} 
               options={chartOptions}
             />
           </div>
         </div>
       </Card>
     </div>
   );
}