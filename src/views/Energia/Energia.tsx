// Energia.tsx
import { useState } from "react";
import { useEnergyData } from "./hooks/useEnergyData";
import { EnergyHeader } from "./components/EnergyHeader";
import { SummaryView } from "./components/SummaryView";
import { DetailedView } from "./components/DetailedView";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

export const Energia = () => {
  const [timeRange, setTimeRange] = useState("1d");
  const [showSensitive, setShowSensitive] = useState(false);
  const [detailedViewIndex, setDetailedViewIndex] = useState<number | null>(null);

  // El hook se alimenta del estado 'timeRange'
  const { devices, loading, error } = useEnergyData(timeRange);

  const handleTimeRangeChange = (newRange: string) => {
    setTimeRange(newRange);
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-white">Cargando dispositivos...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-400">{error}</div>;

  if (detailedViewIndex !== null) {
    return (
      <DetailedView 
        device={devices[detailedViewIndex]} 
        index={detailedViewIndex}
        onBack={() => setDetailedViewIndex(null)}
      />
    );
  }

  const columnWidth = devices.length > 0 ? `${100 / devices.length}%` : '100%';

  return (
    <main className="flex-1 h-screen overflow-hidden p-2 bg-gray-dark">
      <div className="flex flex-col h-full gap-2">
        
        {/* 1. Pasamos las props al Header */}
        <EnergyHeader 
          devices={devices}
          showSensitive={showSensitive}
          onToggleSensitive={() => setShowSensitive(!showSensitive)}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />

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
                // 2. Quitamos 'onTimeRangeChange' de aquí
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};