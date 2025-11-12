// components/SummaryView.tsx
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Card } from "./Card";
import { ConsumptionGauge } from "./ConsumptionGauge";
import { DeviceSummary } from "../types"; 

import { LayoutGrid, LayoutList } from 'lucide-react';


interface SummaryViewProps {
    device: DeviceSummary;
    index: number;
    onViewDetails: () => void;
    currentTimeRange: string;
}

export function SummaryView({
    device,
    onViewDetails,
    currentTimeRange
}: SummaryViewProps) {

    // Estado para los Tabs del segundo gráfico
    const [activeTab, setActiveTab] = useState('current_a'); // Tab inicial

    // Estado para el modo de visualización de gráficos
    const [viewMode, setViewMode] = useState<'tabs' | 'all'>('tabs');


    const lastDataTime = new Date(device.time);
    const now = new Date();
    const minutesAgo = (now.getTime() - lastDataTime.getTime()) / (1000 * 60);
    const isActive = minutesAgo < 5;

    const formattedTime = lastDataTime.toLocaleString('es-CL', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        timeZone: 'America/Santiago'
    }).replace(',', '');

    // --- Opciones de Gráfico Base ---
    const baseChartOptions = {
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
                grid: { display: false },
                ticks: {
                    color: '#9CA3AF',
                    font: { size: 10 },
                    maxTicksLimit: 8
                }
            },
            y: { // Eje Y principal (izquierda)
                type: 'linear' as const,
                position: 'left' as const,
                grid: { color: '#374151' },
                ticks: {
                    color: '#9CA3AF',
                    font: { size: 10 }
                }
            }
        }
    };

    // --- Opciones para Gráfico 1 (con 2 ejes Y) ---
    const multiAxisChartOptions = {
        ...baseChartOptions,
        scales: {
            ...baseChartOptions.scales,
            // Eje Y (Izquierda) para Voltaje (V) y Potencia (kW)
            y: {
                ...baseChartOptions.scales.y,
                title: { display: true, text: 'Voltaje (V) / Potencia (kW)', color: '#9CA3AF' }
            },
            // Eje Y (Derecha) para Consumo Acumulado (Wh)
            y1: {
                type: 'linear' as const,
                position: 'right' as const,
                grid: { display: false }, // Ocultar grilla para este eje
                ticks: { color: 'rgb(34, 197, 94)', font: { size: 10 } }, // Color verde
                title: { display: true, text: 'Consumo (Wh)', color: 'rgb(34, 197, 94)' }
            }
        }
    };
    
    // --- Opciones para los mini-gráficos (oculta la leyenda) ---
    const miniChartOptions = {
        ...baseChartOptions,
        plugins: {
            ...baseChartOptions.plugins,
            legend: {
                display: false // Ocultamos la leyenda para ahorrar espacio
            }
        },
        scales: {
             ...baseChartOptions.scales,
             x: {
                 ...baseChartOptions.scales.x,
                 ticks: { ...baseChartOptions.scales.x.ticks, maxTicksLimit: 5 } // Menos ticks
             }
        }
    };


    // --- Definición de TODAS las variables (debe coincidir con ALL_HISTORICAL_FIELDS) ---
    const availableVariables = [
        // Agregados
        { id: 'consumption', label: 'Consumo Acum.', unit: 'Wh', color: 'rgb(34, 197, 94)', yAxisID: 'y1' }, // <-- Eje Y 1
        { id: 'power', label: 'Potencia (Agg)', unit: 'W', color: 'rgb(234, 179, 8)', yAxisID: 'y' },
        { id: 'voltage', label: 'Voltaje (Agg)', unit: 'V', color: 'rgb(59, 130, 246)', yAxisID: 'y' },
        { id: 'current', label: 'Corriente (Agg)', unit: 'A', color: 'rgb(239, 68, 68)', yAxisID: 'y' },
        { id: 'powerFactor', label: 'FP (Agg)', unit: '-', color: 'rgb(168, 85, 247)', yAxisID: 'y' },
        { id: 'frequency', label: 'Frecuencia', unit: 'Hz', color: 'rgb(22, 163, 74)', yAxisID: 'y' },
        { id: 'reactivePower', label: 'Pot. Reactiva (Agg)', unit: 'VAr', color: 'rgb(217, 119, 6)', yAxisID: 'y' },
        { id: 'apparentPower', label: 'Pot. Aparente (Agg)', unit: 'VA', color: 'rgb(202, 138, 4)', yAxisID: 'y' },
        { id: 'thd', label: 'THD-I (Agg)', unit: '%', color: 'rgb(244, 63, 94)', yAxisID: 'y' },
        { id: 'apparentEnergy', label: 'Energía Apar. (Agg)', unit: 'VAh', color: 'rgb(13, 148, 136)', yAxisID: 'y' },
        { id: 'reactiveEnergy', label: 'Energía React. (Agg)', unit: 'VArh', color: 'rgb(8, 126, 164)', yAxisID: 'y' },

        // Fase A
        { id: 'power_a', label: 'Potencia (A)', unit: 'W', color: 'rgb(234, 179, 8)', yAxisID: 'y' },
        { id: 'voltage_a', label: 'Voltaje (A)', unit: 'V', color: 'rgb(59, 130, 246)', yAxisID: 'y' },
        { id: 'current_a', label: 'Corriente (A)', unit: 'A', color: 'rgb(239, 68, 68)', yAxisID: 'y' },
        { id: 'powerFactor_a', label: 'FP (A)', unit: '-', color: 'rgb(168, 85, 247)', yAxisID: 'y' },
        { id: 'reactivePower_a', label: 'Pot. Reactiva (A)', unit: 'VAr', color: 'rgb(217, 119, 6)', yAxisID: 'y' },
        { id: 'apparentPower_a', label: 'Pot. Aparente (A)', unit: 'VA', color: 'rgb(202, 138, 4)', yAxisID: 'y' },
        { id: 'thd_i_a', label: 'THD-I (A)', unit: '%', color: 'rgb(244, 63, 94)', yAxisID: 'y' },
        { id: 'thd_u_a', label: 'THD-U (A)', unit: '%', color: 'rgb(219, 39, 119)', yAxisID: 'y' },
        { id: 'apparentEnergy_a', label: 'Energía Apar. (A)', unit: 'VAh', color: 'rgb(13, 148, 136)', yAxisID: 'y' },
        { id: 'reactiveEnergy_a', label: 'Energía React. (A)', unit: 'VArh', color: 'rgb(8, 126, 164)', yAxisID: 'y' },
        { id: 'activeEnergy_a', label: 'Energía Act.(A)', unit: 'Wh', color: 'rgb(34, 197, 94)', yAxisID: 'y' },
        { id: 'activePower_a', label: 'Potencia Act.(A)', unit: 'W', color: 'rgb(34, 197, 94)', yAxisID: 'y' },
        { id: 'reactiveEnergy_a', label: 'Energía React.(A)', unit: 'Wh', color: 'rgb(34, 197, 94)', yAxisID: 'y' },
    ];

    // Define el tipo 'VariableId'
    type VariableId = typeof availableVariables[number]['id'];

    // --- Definición de las variables que van en los tabs ---
    const tabbedChartVariables = [
        { id: 'current_a', title: 'Corriente(A)' },
        { id: 'power_a', title: 'Pot. Activa(A)' },
        { id: 'powerFactor_a', title: 'F.Potencia(A)' },
        { id: 'thd_i_a', title: 'THD-I(A)' },
        { id: 'thd_u_a', title: 'THD-U(A)' },
        { id: 'reactivePower_a', title: 'Pot.Reactiva(A)' },
        { id: 'apparentPower_a', title: 'Pot.Aparente(A)' },
        { id: 'apparentEnergy_a', title: 'Ener.Aparente(A)' },
        { id: 'reactiveEnergy_a', title: 'Ener.Reactiva(A)' },
        { id: 'frequency', title: 'Frec.' },
    ];

    // Función para construir los datasets del gráfico
    const getHistoricalChartData = (variableIds: VariableId[]) => {
        const data = (currentTimeRange === "monthly_mock")
            ? device.historicalData.monthly
            : device.historicalData.daily;

        // Usamos 'power' como referencia para las etiquetas
        const labels = data.power?.map(d => d.time) || [];

        const datasets = variableIds.map(id => {
            const selectedData = data[id as keyof typeof data];
            const variableConfig = availableVariables.find(v => v.id === id);

            if (!selectedData || !variableConfig) {
                console.warn(`No historical data or config found for variable: ${id}`);
                return null;
            }

            return {
                label: `${variableConfig.label} (${variableConfig.unit})`,
                data: selectedData.map(d => d.value),
                borderColor: variableConfig.color,
                backgroundColor: variableConfig.color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
                borderWidth: 1.5,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: variableConfig.color,
                yAxisID: variableConfig.yAxisID, // <-- Asigna el eje Y
            };
        }).filter(Boolean); // Filtra los nulos

        return {
            labels,
            datasets: datasets as any[]
        };
    };

    // --- JSX de la Vista ---
    return (
        <div className="h-full flex flex-col gap-1">

            {/* Header */}
            <Card className="h-16">
                <div className="p-2 h-full">
                    <div className="flex items-center justify-between h-full">
                        <div className="flex items-center gap-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${isActive
                                ? 'bg-green-500 animate-pulse'
                                : 'bg-gray-600'
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
                            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors cursor-pointer"
                        >
                            Detalles de Facturación
                        </button>
                    </div>
                </div>
            </Card>

            {/* Gauges */}
            <Card className="h-32 relative">
    <p className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded z-10">
        {currentTimeRange}
    </p>
    <div className="p-2 h-full pt-4">
                    <div className="flex justify-between items-center h-full">
                        <ConsumptionGauge
                            value={device.object.agg_activeEnergy / 1000} // Convertido a kWh
                            max={100} // Asumo que el max es en kWh
                            label="Total"
                            size="medium"
                            color="yellow"
                        />
                        <ConsumptionGauge
                            value={device.object.phaseA_activeEnergy / 1000} // Convertido a kWh
                            max={50}
                            label="Fase A (kWh)"
                            size="small"
                            color="purple"
                        />
                        <ConsumptionGauge
                            value={device.object.phaseB_activeEnergy / 1000} // Convertido a kWh
                            max={50}
                            label="Fase B (kWh)"
                            size="small"
                            color="purple"
                        />
                        <ConsumptionGauge
                            value={device.object.phaseC_activeEnergy / 1000} // Convertido a kWh
                            max={50}
                            label="Fase C (kWh)"
                            size="small"
                            color="purple"
                        />
                    </div>
                </div>
            </Card>

            {/* Métricas Rápidas */}
            <Card className="h-14 bg-dark-osc border border-gray-600/50">
  <div className="p-2 h-full">
    <div className="flex items-center space-x-3 h-full">
      <div className="flex items-center space-x-2">
      <div className="relative">
        {isActive && (
          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping absolute"></div>
        )}
        <div className={`w-2 h-2 rounded-full relative ${
          isActive ? 'bg-green-500' : 'bg-gray-400'
        }`}></div>
      </div>
      <span className={`font-medium text-sm ${
        isActive ? 'text-green-400' : 'text-gray-400'
      }`}>
        {isActive ? 'Live' : 'Offline'}
      </span>
    </div>
      
      <div className="h-6 w-px bg-gray-600"></div>
      
      <div className="grid grid-cols-6 gap-2 flex-1">
        <div className="flex items-center justify-center space-x-1">
          <span className="text-gray-400 text-xs">V</span>
          <span className="text-white font-bold text-sm">{device.object.phaseA_voltage.toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-center space-x-1">
          <span className="text-gray-400 text-xs">A</span>
          <span className="text-white font-bold text-sm">{device.object.phaseA_current.toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-center space-x-1">
          <span className="text-gray-400 text-xs">W</span>
          <span className="text-white font-bold text-sm">{device.object.agg_activePower?.toFixed(0)}</span>
        </div>
        <div className="flex items-center justify-center space-x-1">
          <span className="text-gray-400 text-xs">Hz</span>
          <span className="text-white font-bold text-sm">{device.object.agg_frequency}</span>
        </div>
        <div className="flex items-center justify-center space-x-1">
          <span className="text-gray-400 text-xs">FP</span>
          <span className="text-white font-bold text-sm">{(device.object.agg_powerFactor * 100).toFixed(1)}%</span>
        </div>
        
        <div className="flex items-center justify-center space-x-1">
          <span className="text-gray-400 text-xs">Wh</span>
          <span className="text-white font-bold text-sm">{device.object.agg_activeEnergy?.toFixed(1)}</span>
        </div>
      </div>
    </div>
  </div>
</Card>

            {/* --- Gráfico 1 (Voltaje, Potencia, Consumo) --- */}
            <Card className="h-60">
                <div className="p-2 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-medium text-white">Consumo, Voltaje y Potencia</h4>
                    </div>
                    <div className="flex-1">
                        <Line
                            data={getHistoricalChartData(['voltage', 'power', 'consumption'])}
                            options={multiAxisChartOptions} // <-- Usa las opciones con 2 ejes
                        />
                    </div>
                </div>
            </Card>

            {/* --- Gráfico 2 (Métricas Adicionales con Tabs) --- */}
            <Card className="h-80"> {/* Altura aumentada para el botón de toggle */}
                <div className="p-2 h-full flex flex-col">

                    {/* --- MODIFICADO: Header con Título y Botón de Toggle (usando Lucide) --- */}
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-700">
                        <h4 className="text-xs font-medium text-white">Métricas Adicionales</h4>
                        <button
                            onClick={() => setViewMode(viewMode === 'tabs' ? 'all' : 'tabs')}
                            className="flex items-center gap-1.5 text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded transition-colors"
                            title={viewMode === 'tabs' ? 'Ver todos los gráficos' : 'Ver por pestañas'}
                        >
                            {viewMode === 'tabs' ? (
                                <>
                                    <LayoutList className="w-4 h-4" strokeWidth={2} />
                                    Ver Todos
                                </>
                            ) : (
                                <>
                                    <LayoutGrid className="w-4 h-4" strokeWidth={2} />
                                    Ver Tabs
                                </>
                            )}
                        </button>
                    </div>


                    {/* --- Renderizado Condicional del Contenido --- */}
                    {viewMode === 'tabs' ? (
                        <>
                            {/* === MODO TABS === */}
                            {/* Contenedor de Tabs en múltiples filas */}
                            <div className="flex flex-wrap gap-1 mb-2">
                                {tabbedChartVariables.map(tab => (
                                    <TabButton
                                        key={tab.id}
                                        title={tab.title}
                                        isActive={activeTab === tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                    />
                                ))}
                            </div>

                            {/* Gráfico que cambia según el Tab */}
                            <div className="flex-1 min-h-0">
                                <Line
                                    data={getHistoricalChartData([activeTab as VariableId])}
                                    options={baseChartOptions}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* === MODO TODOS (Grilla con Scroll) === */}
                            <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    
                                    {tabbedChartVariables.map(tab => {
                                        // Buscamos la configuración de la variable para obtener el 'label'
                                        const variableConfig = availableVariables.find(v => v.id === tab.id);
                                        
                                        return (
                                            <div 
                                                key={tab.id} 
                                                className="h-48 flex flex-col bg-dark-osc p-2 rounded-md"
                                            >
                                                <h5 className="text-xs text-white text-center font-medium mb-1">
                                                    {variableConfig?.label || tab.title}
                                                </h5>
                                                <div className="flex-1 min-h-0">
                                                    <Line
                                                        data={getHistoricalChartData([tab.id as VariableId])}
                                                        options={miniChartOptions} // <-- Usamos las opciones de mini-gráfico
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}

                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}

// --- Componente Auxiliar para los Botones de Tab ---
interface TabButtonProps {
    title: string;
    isActive: boolean;
    onClick: () => void;
}

function TabButton({ title, isActive, onClick }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap
        ${isActive
                    ? 'border-b-2 border-blue-500 text-white bg-blue-500/40'
                    : 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent cursor-pointer'
                }
        `}
        >
            {title}
        </button>
    );
}