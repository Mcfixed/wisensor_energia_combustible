// src/views/combustible/index.tsx
import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';

// Importar nuestro hook y tipos
import { useFuelData } from './hooks/useFuelData';
import { Tank } from './types';

// Importar nuestros componentes
import { Card } from './components/Card';
import { CenterCard } from './components/CenterCard';
import { TankWithChart } from './components/TankWithChart';
import { FuelHeader } from './components/FuelHeader';
import { FuelFilterBar } from './components/FuelFilterBar';
import { RightDetailPanel } from './components/RightDetailPanel';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, ArcElement, Filler
);

// Estilos para el scrollbar (utility)
const CustomScrollbarStyles = () => (
  <style>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(31, 41, 55, 0.5);
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(75, 85, 99, 0.8);
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(107, 114, 128, 0.8);
    }
  `}</style>
);

export const Combustible = () => {
  // 1. Usar el hook para obtener los datos
  const { 
    centers, 
    allTanks, 
    summary, 
    loading, 
    error, 
    timeRange, 
    setTimeRange,
    refreshData
  } = useFuelData();
  
  console.log("Centers cargados:", centers);
  console.log("All Tanks cargados:", allTanks);
  console.log("Summary cargado:", summary);
  
  // 2. Estados locales para la UI
  const [activeView, setActiveView] = useState<'todos' | 'detalle'>('todos');
  const [selectedTank, setSelectedTank] = useState<Tank | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 3. Lógica de filtrado y selección
  const filteredCenters = useMemo(() => {
    return centers.filter(center =>
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [centers, searchTerm]);

  // Asegurarse de que 'currentTank' se actualice cuando los datos se carguen
  const currentTank = useMemo(() => {
    // Si hay un tanque seleccionado, usarlo
    if (selectedTank) {
      // Opcional: buscar el tanque actualizado en allTanks por si sus datos cambiaron
      return allTanks.find(t => t.id === selectedTank.id) || selectedTank;
    }
    // Si no hay selección, mostrar el primero de la lista
    return allTanks[0] || null;
  }, [selectedTank, allTanks]);

  // 4. Manejar estados de carga y error
  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Cargando centros de combustible...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-400">{error}</div>;
  }

  // 5. Renderizar la vista principal
  return (
    <main className="flex-1 h-screen overflow-hidden p-1 bg-dark-osc">
      <CustomScrollbarStyles />
      <div className="flex flex-col h-full gap-1">
        
        {/* Header - Altura fija y compacta */}
        <div className="h-[60px] flex-shrink-0">
          <FuelHeader 
            summary={summary}
            activeView={activeView}
            onViewChange={setActiveView}
          />
        </div>

        {/* Barra de Búsqueda - Altura fija y compacta */}
        <div className="h-[40px] flex-shrink-0">
          <FuelFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            onRefresh={refreshData}
          />
        </div>

        {/* Contenido principal - Se expande con el espacio restante */}
        <div className="flex-1 flex gap-2 overflow-hidden">
          
          {/* Columna izquierda - 2/3 */}
          <div className="w-2/3 flex flex-col overflow-hidden">
            {activeView === 'detalle' ? (
              /* VISTA DETALLE - Lista de Tanques */
              <Card className="h-full flex flex-col">
                <div className="p-4 flex flex-col h-full">
                  <h2 className="text-lg font-semibold text-white mb-4 flex-shrink-0">
                    Sensores en Detalle
                  </h2>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {allTanks.map(tank => (
                      <TankWithChart
                        key={tank.id}
                        tank={tank}
                        isSelected={currentTank?.id === tank.id}
                        onClick={() => setSelectedTank(tank)}
                        timeRange={timeRange}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            ) : (
              /* VISTA TODOS - Lista de Centros */
              <Card className="h-full flex flex-col">
                <div className="p-4 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-white">Todos los Centros</h2>
                    <div className="text-sm text-gray-400">
                      {filteredCenters.length} de {centers.length} centros
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-rows-3 gap-2 h-full">
                      {filteredCenters.slice(0, 3).map(center => (
                        <CenterCard
                          key={center.id}
                          center={center}
                          onTankSelect={(tank) => {
                            setSelectedTank(tank);
                          }}
                        />
                      ))}
                    </div>
                    
                    {filteredCenters.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No se encontraron centros
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
          
          {/* Columna derecha - 1/3 para Detalles */}
          <div className="w-1/3 flex flex-col overflow-hidden">
            <RightDetailPanel currentTank={currentTank} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Combustible;