import { useState } from "react";
import { Bar, Line } from 'react-chartjs-2';
import { Card } from "./Card";
import { ConsumptionGauge } from "./ConsumptionGauge";
import { DeviceSummary } from "../types";

// Tipamos las props que recibe
interface SummaryViewProps {
  device: DeviceSummary;
  index: number;
  onViewDetails: () => void;
  currentTimeRange: string;
  onTimeRangeChange: (newRange: string) => void;
}
export function SummaryView({ device, index, onViewDetails, currentTimeRange, onTimeRangeChange }: SummaryViewProps) {
  
  const [activeVariable, setActiveVariable] = useState('consumption');
  console.log(device.object.phaseC_activePower);
  const colors = ['blue', 'green', 'purple', 'yellow', 'red'];
  const currentColor = colors[index % colors.length];
  /* Logica para el color activo */
  // Convertir el string ISO de la DB a un objeto Date
  const lastDataTime = new Date(device.time);
  const now = new Date();
  const minutesAgo = (now.getTime() - lastDataTime.getTime()) / (1000 * 60);
  const isActive = minutesAgo < 5; // Activo si es < 5 minutos
  
  // --- MODIFICACIÓN: Cambiar el formato de la fecha ---
  const formattedTime = lastDataTime.toLocaleString('es-CL', {
    year: 'numeric',   // YYYY
    month: '2-digit',  // MM
    day: '2-digit',    // DD
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(',', '');


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#ccc', font: { size: 9 } }
      },
    },
    scales: {
      x: {
        grid: { color: '#374151' },
        ticks: { color: '#9CA3AF', font: { size: 8 }, maxRotation: 45 }
      },
      y: {
        grid: { color: '#374151' },
        ticks: { color: '#9CA3AF', font: { size: 8 } }
      }
    }
  };

  const availableVariables = [
    { id: 'consumption', label: 'Consumo', unit: 'kW', color: 'rgb(34, 197, 94)' },
    { id: 'voltage', label: 'Voltaje', unit: 'V', color: 'rgb(59, 130, 246)' },
    { id: 'current', label: 'Corriente', unit: 'A', color: 'rgb(239, 68, 68)' }
  ];

  const tripleColumnData = {
    labels: ['Fase A', 'Fase B', 'Fase C'],
    datasets: [
      {
        label: 'Voltaje (V)',
        data: [
          device.object.phaseA_voltage,
          device.object.phaseB_voltage,
          device.object.phaseC_voltage
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Corriente (A)',
        data: [
          device.object.phaseA_current,
          device.object.phaseB_current,
          device.object.phaseC_current
        ],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
      {
        label: 'Potencia (kW)',
        data: [
          device.object.phaseA_activePower,
          device.object.phaseB_activePower,
          device.object.phaseC_activePower
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      }
    ]
  };

  const getHistoricalChartData = () => {
    // --- MODIFICADO: Usar el prop para decidir qué data mostrar ---
    const data = (currentTimeRange === "monthly_mock") // Usamos una clave "ficticia" para el mock
      ? device.historicalData.monthly
      : device.historicalData.daily; // 'daily' ahora contiene 1d, 7d, 14d, o 30d
    
    // El resto de esta función es igual...
    const labels = data.consumption.map(d => d.time);
    const selectedData = data[activeVariable];
    const variableConfig = availableVariables.find(v => v.id === activeVariable);
    
    return {
      labels,
      datasets: [{
        label: `${variableConfig?.label} (${variableConfig?.unit})`,
        data: selectedData.map(d => d.value),
        borderColor: variableConfig?.color,
        backgroundColor: variableConfig?.color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    };
  };

  // ... (El resto de tu JSX de SummaryView va aquí, sin cambios)
  return (
     <div className="h-full flex flex-col gap-1">
       {/* Header compacto con botón de detalles */}
       <Card className="h-16">
        <div className="p-2 h-full">
          
          {/* Este 'div' es el contenedor principal del header */}
          <div className="flex items-center justify-between h-full">
            
            {/* GRUPO IZQUIERDA: Indicador y Nombre */}
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${
                isActive 
                ? 'bg-green-500 animate-pulse' // Activo
                : 'bg-gray-600' // Inactivo
              }`}>
              </div>
              <h3 className="text-sm font-semibold text-white">{device.deviceInfo.deviceName}</h3>
            </div>
            
            {/* GRUPO MEDIO: La fecha */}
            <div>
              <p className="text-sm text-gray-300">
                Últ. dato: {formattedTime}
              </p>
            </div>
            
            {/* GRUPO DERECHA: El botón */}
            <button 
              onClick={onViewDetails}
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      </Card>

       {/* Gauges de Consumo */}
       <Card className="h-32">
         <div className="p-2 h-full">
           <div className="flex justify-between items-center h-full">
             <ConsumptionGauge 
               value={device.object.agg_activePower}
               max={100}
               label="Total"
               size="medium"
               color={currentColor}
             />
             <ConsumptionGauge 
               value={device.object.phaseA_activePower}
               max={50}
               label="Fase A"
               size="small"
               color="green"
             />
             <ConsumptionGauge 
               value={device.object.phaseB_activePower}
               max={50}
               label="Fase B" 
               size="small"
               color="yellow"
             />
             <ConsumptionGauge 
               value={device.object.phaseC_activePower}
               max={50}
               label="Fase C"
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

       {/* Distribución por Fases */}
       <Card className="h-48">
         <div className="p-2 h-full flex flex-col">
           <h4 className="text-xs font-medium text-white mb-2">Distribución por Fases</h4>
           <div className="flex-1">
             <Bar 
               data={tripleColumnData} 
               options={chartOptions} 
             />
           </div>
         </div>
       </Card>

       {/* Calidad de Energía */}
       <Card className="h-24">
         <div className="p-2 h-full">
           <h4 className="text-xs font-medium text-white mb-1">Calidad de Energía</h4>
           <div className="grid grid-cols-3 gap-1 text-xs">
             <div className="text-center">
               <div className="text-gray-400">THD A</div>
               <div className="text-yellow-400 font-medium">{device.object.phaseA_thdI.toFixed(1)}%</div>
             </div>
             <div className="text-center">
               <div className="text-gray-400">THD B</div>
               <div className="text-yellow-400 font-medium">{device.object.phaseB_thdI.toFixed(1)}%</div>
             </div>
             <div className="text-center">
               <div className="text-gray-400">THD C</div>
               <div className="text-yellow-400 font-medium">{device.object.phaseC_thdI.toFixed(1)}%</div>
             </div>
           </div>
         </div>
       </Card>

       {/* Historial */}
       <Card className="h-52">
         <div className="p-2 h-full flex flex-col">
           <div className="flex justify-between items-center mb-2">
             <h4 className="text-xs font-medium text-white">Historial</h4>
             <select 
              value={currentTimeRange}
              onChange={(e) => onTimeRangeChange(e.target.value)}
              className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
            >
              <option value="1d">1 Día</option>
              <option value="7d">1 Semana</option>
              <option value="14d">2 Semanas</option>
              <option value="30d">1 Mes</option>
              {/* Esta opción usará el dato simulado mensual que dejamos */}
              <option value="monthly_mock">Mes (Simulado)</option> 
            </select>
           </div>
           <div className="flex gap-1 mb-2 overflow-x-auto pb-1">
             {availableVariables.map(variable => (
               <button
                 key={variable.id}
                 onClick={() => setActiveVariable(variable.id)}
                 className={`flex-shrink-0 text-xs px-3 py-1 rounded whitespace-nowrap ${
                   activeVariable === variable.id 
                     ? 'bg-blue-500 text-white' 
                     : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                 }`}
               >
                 {variable.label}
               </button>
             ))}
           </div>
           <div className="flex-1">
             <Line 
               data={getHistoricalChartData()} 
               options={chartOptions} 
             />
           </div>
         </div>
       </Card>
     </div>
   );
}