import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

// Importar nuestros componentes y hook
import { useEnergyData } from "./hooks/useEnergyData";
import { EnergyHeader } from "./components/EnergyHeader";
import { SummaryView } from "./components/SummaryView";
import { DetailedView } from "./components/DetailedView";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

export const Energia = () => {
  // 1. Usar el hook para obtener los datos
  
  const { devices, loading, error, timeRange, setTimeRange } = useEnergyData();
  console.log("Dispositivos de energía cargados:", devices);
  // 2. Estados locales para la UI
  const [showSensitive, setShowSensitive] = useState(false);
  const [detailedViewIndex, setDetailedViewIndex] = useState<number | null>(null);

  // 3. Calcular ancho de columnas
  const columnWidth = devices.length > 0 ? `${100 / devices.length}%` : '100%';

  // 4. Manejar estados de carga y error
  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Cargando dispositivos...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-400">{error}</div>;
  }

  // 5. Renderizar vista detallada si está seleccionada
  if (detailedViewIndex !== null) {
    return (
      <DetailedView 
        device={devices[detailedViewIndex]} 
        index={detailedViewIndex}
        onBack={() => setDetailedViewIndex(null)}
      />
    );
  }

  // 6. Renderizar vista resumen (principal)
  return (
    <main className="flex-1 h-screen overflow-hidden p-2 bg-gray-dark">
      <div className="flex flex-col h-full gap-2">
      
        {/* Header (ahora es un componente) */}
        <EnergyHeader 
          devices={devices}
          showSensitive={showSensitive}
          onToggleSensitive={() => setShowSensitive(!showSensitive)}
        />

        {/* Contenedor principal de columnas */}
        <div className="flex-1 flex gap-2 overflow-x-auto">
          {devices.map((device, index) => (
            <div 
              key={device.deviceInfo.devEui}
              style={{ width: columnWidth, minWidth: '400px' }}
              className="h-full"
            >
              <SummaryView 
                device={device} 
                index={index}
                onViewDetails={() => setDetailedViewIndex(index)}
                currentTimeRange={timeRange}
                onTimeRangeChange={setTimeRange}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Energia;