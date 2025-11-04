// components/DetailedView.tsx
import { ArrowLeft, BarChart, TrendingUp, Zap } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { DeviceSummary } from '../types';
import { useEnergyDetails } from '../hooks/useEnergyDetails';
import { Card } from './Card'; 

interface DetailedViewProps {
  device: DeviceSummary; 
  onBack: () => void;    
}

export function DetailedView({ device, onBack }: DetailedViewProps) {
  
  const { data, loading, error } = useEnergyDetails(device.deviceInfo.devEui);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y.toFixed(2)} kWh`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9CA3AF' }
      },
      y: {
        grid: { color: '#374151' },
        ticks: { color: '#9CA3AF' },
        title: {
          display: true,
          text: 'Consumo (kWh)',
          color: '#9CA3AF'
        }
      }
    }
  };

  const chartData = {
    labels: data?.dailyConsumption.map(d => d.date) || [],
    datasets: [
      {
        label: 'Consumo Diario',
        data: data?.dailyConsumption.map(d => d.consumption) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64 text-white">
          Cargando detalles...
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center h-64 text-red-400">
          {error}
        </div>
      );
    }
    if (!data) {
      return (
         <div className="flex items-center justify-center h-64 text-gray-400">
          No hay datos disponibles.
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Card className="h-24">
            <div className="p-4 flex items-center gap-4">
              <Zap className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Consumo Total (Últ. 30 días)</p>
                <p className="text-2xl font-bold text-white">
                  {data.totalConsumption.toFixed(2)} <span className="text-lg">kWh</span>
                </p>
              </div>
            </div>
          </Card>
          <Card className="h-24">
            <div className="p-4 flex items-center gap-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Consumo Promedio Diario</p>
                <p className="text-2xl font-bold text-white">
                  {data.avgDailyConsumption.toFixed(2)} <span className="text-lg">kWh/día</span>
                </p>
              </div>
            </div>
          </Card>
          <Card className="h-24">
            <div className="p-4 flex items-center gap-4">
              <BarChart className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Días con Datos</p>
                <p className="text-2xl font-bold text-white">
                  {data.dailyConsumption.length} <span className="text-lg">días</span>
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Gráfico Principal */}
        <Card className="flex-1">
          <div className="p-4 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">
              Consumo Diario (Últimos 30 días)
            </h3>
            <div className="flex-1 min-h-[400px]">
              <Bar options={chartOptions} data={chartData} />
            </div>
          </div>
        </Card>
      </>
    );
  };

  return (
    <div className="p-2 flex flex-col gap-2 h-screen">
      {/* Header de la Vista Detallada */}
      <div className="flex-shrink-0">
        <Card className="h-16">
          <div className="p-4 flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                title="Volver"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  {device.deviceInfo.deviceName}
                </h1>
                <p className="text-sm text-gray-400">
                  {device.deviceInfo.devEui} | {device.deviceInfo.location}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Contenido (Resumen y Gráfico) */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {renderContent()}
      </div>
    </div>
  );
}