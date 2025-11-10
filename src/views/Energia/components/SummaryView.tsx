// components/SummaryView.tsx
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Card } from "./Card";
import { ConsumptionGauge } from "./ConsumptionGauge";
import { DeviceSummary } from "../types"; // Asegúrate que 'types.ts' refleje el schema de backend

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
                            value={device.object.agg_activeEnergy / 1000} // Convertido a kWh
                            max={100} // Asumo que el max es en kWh
                            label="Total Diario (kWh)"
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
            <Card className="h-72"> {/* Aumenté un poco la altura para acomodar las filas */}
                <div className="p-2 h-full flex flex-col">
                    {/* Contenedor de Tabs en múltiples filas */}
                    <div className="flex flex-wrap gap-1 border-b border-gray-700 mb-2 pb-1">
                        <TabButton
                            title="Corriente(A)"
                            isActive={activeTab === 'current_a'}
                            onClick={() => setActiveTab('current_a')}
                        />
                        <TabButton
                            title="Pot. Activa(A)"
                            isActive={activeTab === 'power_a'}
                            onClick={() => setActiveTab('power_a')}
                        />
                        <TabButton
                            title="F.Potencia(A)"
                            isActive={activeTab === 'powerFactor_a'}
                            onClick={() => setActiveTab('powerFactor_a')}
                        />
                        <TabButton
                            title="THD-I(A)"
                            isActive={activeTab === 'thd_i_a'}
                            onClick={() => setActiveTab('thd_i_a')}
                        />
                        <TabButton
                            title="THD-U(A)"
                            isActive={activeTab === 'thd_u_a'}
                            onClick={() => setActiveTab('thd_u_a')}
                        />
                        <TabButton
                            title="Pot.Reactiva(A)"
                            isActive={activeTab === 'reactivePower_a'}
                            onClick={() => setActiveTab('reactivePower_a')}
                        />
                        <TabButton
                            title="Pot.Aparente(A)"
                            isActive={activeTab === 'apparentPower_a'}
                            onClick={() => setActiveTab('apparentPower_a')}
                        />
                        <TabButton
                            title="Ener.Aparente(A)"
                            isActive={activeTab === 'apparentEnergy_a'}
                            onClick={() => setActiveTab('apparentEnergy_a')}
                        />
                        <TabButton
                            title="Ener.Reactiva(A)"
                            isActive={activeTab === 'reactiveEnergy_a'}
                            onClick={() => setActiveTab('reactiveEnergy_a')}
                        />
                        <TabButton
                            title="Frec."
                            isActive={activeTab === 'frequency'}
                            onClick={() => setActiveTab('frequency')}
                        />
                    </div>

                    {/* Gráfico que cambia según el Tab */}
                    <div className="flex-1 min-h-0">
                        <Line
                            data={getHistoricalChartData([activeTab as VariableId])}
                            options={baseChartOptions}
                        />
                    </div>
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
                    ? 'border-b-2 border-blue-500 text-white'
                    : 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent'
                }
      `}
        >
            {title}
        </button>
    );
}