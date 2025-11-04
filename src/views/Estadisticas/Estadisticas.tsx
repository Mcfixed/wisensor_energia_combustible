import { useState, useMemo } from 'react';
// Corregido: Asumimos que el hook está en la carpeta central de hooks
import { useEstadisticas } from './hooks/useDevice';
// Corregido: Asumimos que los tipos están en tu archivo central de tipos
import { DeviceDetails, MongoHistoryRecord, DeviceType } from './types/DeviceType';
import { HardDrive, Building, MapPin, ChevronRight, Loader2, ArrowLeft, BarChart2 } from 'lucide-react';

// --- ¡¡IMPORTANTE!! ---
// 1. Instala: npm install chart.js react-chartjs-2
// 2. Importa los componentes de chart.js
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
  Filler, // <-- ¡¡NUEVO!! Importa Filler para el relleno
} from 'chart.js';

// 3. Registra los componentes que usarás
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler // <-- ¡¡NUEVO!! Registra Filler
);

// --- Formateador de Fecha ---
const formatChartDate = (isoDate: string) => {
  try {
    return new Date(isoDate).toLocaleString('es-CL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return 'invalid date';
  }
};

// --- Componente de Gráfico Genérico (con Chart.js) ---
interface ChartData {
  time: string; // Fecha formateada
  [key: string]: any; // Valor
}
// --- MODIFICADO: Este componente ahora grafica un RANGO (Min/Max) ---
interface GenericChartProps {
  data: ChartData[];
  dataKeyBase: string; // <-- MODIFICADO (ej: "agg_activePower")
  name: string;
  color: string;
}
const SensorChart: React.FC<GenericChartProps> = ({ data, dataKeyBase, name, color }) => {

  // Buscamos las claves _min y _max que vienen del backend
  const keyMin = `${dataKeyBase}_min`;
  const keyMax = `${dataKeyBase}_max`;

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#D1D5DB', // text-gray-300
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1F2937', // bg-gray-800
        titleColor: '#F9FAFB', // text-gray-50
        bodyColor: '#F9FAFB',
        borderColor: '#4B5563', // border-gray-600
        borderWidth: 1,
        mode: 'index', // <-- Mejor para ver min/max al mismo tiempo
        intersect: false,
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#9CA3AF', // text-gray-400
          maxTicksLimit: 7, // Limitar para que no se sature
          font: { size: 10 }
        },
        grid: {
          color: '#374151', // border-gray-700
        }
      },
      y: {
        ticks: {
          color: '#9CA3AF', // text-gray-400
          font: { size: 10 }
        },
        grid: {
          color: '#374151', // border-gray-700
        }
      }
    }
  };

  // --- MODIFICADO: Ahora creamos DOS datasets (Min y Max) ---
  const chartData = {
    labels: data.map(d => d.time), // Labels (e.g., "29 Oct 10:00")
    datasets: [
      {
        label: `${name} (Máx)`,
        data: data.map(d => d[keyMax]), // <-- Usa la clave Max
        borderColor: color,
        backgroundColor: `${color}80`, // Color con 50% opacidad
        pointRadius: 1,
        tension: 0.1,
        fill: '+1', // <-- Rellena hasta el siguiente dataset (Min)
      },
      {
        label: `${name} (Mín)`,
        data: data.map(d => d[keyMin]), // <-- Usa la clave Min
        borderColor: color,
        backgroundColor: `${color}30`, // Un color más suave
        pointRadius: 1,
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="h-64 w-full bg-gray-darkL p-4 rounded-lg border border-gray-700">
      <h4 className="text-sm font-semibold text-white mb-4">{name}</h4>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">Sin datos</div>
      ) : (
        <div className="relative h-full w-full" style={{ height: 'calc(100% - 2rem)' }}>
          <Line options={chartOptions} data={chartData} />
        </div>
      )}
    </div>
  );
};


// --- (VISTA 2) El Panel de Control del Sensor ---
interface SensorDashboardProps {
  sensor: DeviceDetails;
  history: MongoHistoryRecord[];
  loading: boolean;
  onBack: () => void;
  onRangeChange: (range: any) => void;
  timeRange: string;
}
const SensorDashboard: React.FC<SensorDashboardProps> = ({
  sensor, history, loading, onBack, onRangeChange, timeRange
}) => {

  const processedData = useMemo(() => {
    const tableData: { key: string, value: any }[] = [];
    const chartData: ChartData[] = [];
    
    const latestRecord = history[history.length - 1];
    if (latestRecord && latestRecord.object) {
      Object.entries(latestRecord.object).forEach(([key, value]) => {
        const displayValue = typeof value === 'number' ? value.toFixed(2) : String(value);
        tableData.push({ key, value: displayValue });
      });
    }

    history.forEach(record => {
      const time = formatChartDate(record.time);
      const values = record.object || {};
      chartData.push({ time, ...values });
    });

    return { tableData, chartData };
  }, [history]);

  const getChartsByType = (type: DeviceType) => {
    if (type === DeviceType.COMBUSTIBLE) {
      return (
        <>
          <SensorChart data={processedData.chartData} dataKeyBase="volume_L_S0" name="Volumen (L) S0" color="#34D399" />
          <SensorChart data={processedData.chartData} dataKeyBase="volume_L_S1" name="Volumen (L) S1" color="#F87171" />
          <SensorChart data={processedData.chartData} dataKeyBase="pressure_Bar_S0" name="Presión (Bar) S0" color="#60A5FA" />
        </>
      );
    }
    if (type === DeviceType.ENERGIA) {
      return (
        <>
          <SensorChart data={processedData.chartData} dataKeyBase="agg_activePower" name="Potencia Activa (W)" color="#34D399" />
          <SensorChart data={processedData.chartData} dataKeyBase="agg_voltage" name="Voltaje (V)" color="#F87171" />
          <SensorChart data={processedData.chartData} dataKeyBase="agg_current" name="Corriente (A)" color="#60A5FA" />
        </>
      );
    }
    return <div className="text-gray-400">Tipo de sensor no reconocido.</div>;
  };

  return (
    <div className="p-4 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-1 pb-2 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{sensor.name}</h1>
            <p className="text-gray-400 text-sm">
              {sensor.company_name} / {sensor.center_name}
            </p>
          </div>
        </div>
        <div className="flex space-x-1 bg-gray-darkL p-1 rounded-lg">
          {['1d', '7d', '30d'].map(range => (
            <button
              key={range}
              onClick={() => onRangeChange(range)}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === range
                  ? 'bg-red-dark text-white'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-white">
          <Loader2 className="animate-spin mr-2" /> Cargando historial...
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 overflow-hidden min-h-0">
          
          <div className="lg:col-span-1 flex flex-col overflow-hidden bg-gray-dark rounded-lg border border-gray-700 min-h-0">
            <h3 className="text-lg font-semibold text-white p-4 border-b border-gray-700">
              Últimos Valores (Agregados)
            </h3>
            <div className="overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <tbody className="bg-gray-dark divide-y divide-gray-700">
                  {processedData.tableData.map(row => (
                    <tr key={row.key}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-300">{row.key}</td>
                      <td className="px-4 py-3 text-sm text-white font-mono text-right">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Columna 2: Gráficos (Se quitó 'overflow-y-auto' y se añadió 'min-h-0') */}
          <div className="lg:col-span-2 flex flex-col gap-2 pr-2 min-h-0">
            {getChartsByType(sensor.type)}
          </div>
        </div>
      )}
    </div>
  );
};


// --- (VISTA 1) La Tabla Principal de Sensores ---
export const Estadisticas = () => {
  const {
    selectedSensor,
    deviceList,
    sensorHistory,
    loadingList,
    loadingHistory,
    error,
    selectSensor,
    deselectSensor,
    handleTimeRangeChange,
    timeRange
  } = useEstadisticas();

  // --- Si hay un sensor seleccionado, muestra el Panel ---
  if (selectedSensor) {
    return (
      <SensorDashboard
        sensor={selectedSensor}
        history={sensorHistory}
        loading={loadingHistory}
        onBack={deselectSensor}
        onRangeChange={handleTimeRangeChange}
        timeRange={timeRange}
      />
    );
  }
  
  // --- Si no, muestra la Tabla (Vista 1) ---
  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-white">Estadísticas de Sensores</h1>
          <p className="text-gray-400 text-sm">Selecciona un sensor para ver su historial.</p>
        </div>
      </div>

      {loadingList ? (
        <div className="flex-1 flex items-center justify-center text-white">
          <Loader2 className="animate-spin mr-2" /> Cargando lista de sensores...
        </div>
      ) : error ? (
        <div className="p-4 text-red-300 bg-red-900/50 border border-red-700 rounded-lg">Error: {error}</div>
      ) : (
        <div className="flex-1 overflow-auto rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-darkL">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Sensor (Nombre)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">DevEUI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Centro</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-gray-dark divide-y divide-gray-700">
              {deviceList.map((device) => (
                <tr key={device.id} className="hover:bg-gray-darkL transition-colors">
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <HardDrive size={18} className={`mr-3 ${device.status === 'active' ? 'text-green-500' : 'text-gray-500'}`} />
                      <span className="text-white font-medium">{device.name}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                    {device.dev_eui}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center">
                      <Building size={14} className="mr-2 text-gray-500" />
                      {device.company_name}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-2 text-gray-500" />
                      {device.center_name}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => selectSensor(device)}
                      className="text-red-dark hover:text-red-400 p-1 rounded hover:bg-gray-700/50 flex items-center"
                      title="Ver Historial"
                    >
                      <BarChart2 size={16} className="mr-1" />
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};