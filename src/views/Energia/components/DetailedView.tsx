// components/DetailedView.tsx
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, TrendingUp, Zap, FileText, 
  DollarSign, AlertTriangle, Check, Loader2 
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DeviceSummary } from '../types';
import { useEnergyDetails } from '../hooks/useEnergyDetails';
import { Card } from './Card';
import { updateKwhPriceByDevice } from '../services/energiaService'; // Asegúrate de importar esto

interface DetailedViewProps {
  device: DeviceSummary; 
  onBack: () => void;
}

export function DetailedView({ device, onBack }: DetailedViewProps) {
  
  const { data, loading, error } = useEnergyDetails(device.deviceInfo.devEui);
  
  // Estado para el precio editable
  const [editablePrice, setEditablePrice] = useState<number | null>(null);
  // Estado para el botón de guardar
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Cuando 'data' (de la API) cargue, seteamos el estado 'editablePrice'
  useEffect(() => {
    // Solo seteamos el precio la primera vez que 'data' carga
    if (data && editablePrice === null) {
      setEditablePrice(data.price_kwh);
    }
  }, [data, editablePrice]);

  // --- Opciones y Datos de Gráficos ---
  const dailyChartOptions = {
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
      },
      datalabels: {
        color: '#9CA3AF',
        anchor: 'end' as const,
        align: 'top' as const,
        offset: -4,
        font: {
          size: 10,
        },
        formatter: (value: number) => {
          if (value === 0) return '';
          return Math.round(value);
        },
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#9CA3AF' } },
      y: {
        grid: { color: '#374151' },
        ticks: { color: '#9CA3AF' },
        title: { display: true, text: 'Consumo (kWh)', color: '#9CA3AF' }
      }
    }
  };
  
  const monthlyChartOptions = {
    ...dailyChartOptions,
    scales: {
      ...dailyChartOptions.scales,
      x: {
         ...dailyChartOptions.scales.x,
         ticks: { ...dailyChartOptions.scales.x.ticks, maxRotation: 0, minRotation: 0 }
      }
    }
  };

  const dailyChartData = {
    labels: data?.dailyConsumption.map(d => d.date) || [],
    datasets: [{
      label: 'Consumo Diario (kWh)',
      data: data?.dailyConsumption.map(d => d.consumption) || [],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1,
    }],
  };

  const monthlyChartData = {
    labels: data?.monthlyConsumption.map(d => d.month_name) || [],
    datasets: [{
      label: 'Consumo Mensual (kWh)',
      data: data?.monthlyConsumption.map(d => d.consumption) || [],
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 1,
    }],
  };
  // --- Fin Opciones y Datos de Gráficos ---

  // --- Función para Guardar Precio ---
  const handleSavePrice = async () => {
    if (editablePrice === null || editablePrice === data?.price_kwh) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // Llamamos a la API para guardar
      const response = await updateKwhPriceByDevice(device.deviceInfo.devEui, editablePrice);
      
      // Seteamos el precio con el valor confirmado por la API
      setEditablePrice(response.new_price);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error("Error al guardar el precio:", err);
      // Opcional: revertir el precio al original si falla
      if (data) setEditablePrice(data.price_kwh); 
    } finally {
      setIsSaving(false);
    }
  };


  const renderContent = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-64 text-white">Cargando detalles...</div>;
    }
    if (error) {
      return <div className="flex items-center justify-center h-64 text-red-400">{error}</div>;
    }
    if (!data || editablePrice === null) {
      // Espera a que tanto 'data' como 'editablePrice' estén listos
      return <div className="flex items-center justify-center h-64 text-gray-400">Cargando datos de precio...</div>;
    }
    
    // Usamos el precio del estado local para los cálculos
    const priceToCalculate = editablePrice; 
    const totalCost = data.totalConsumptionLast30Days * priceToCalculate;
    const avgDailyCost = data.avgDailyConsumption * priceToCalculate;

    return (
      <>
        {/* Primera fila: Gráficos lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
          {/* Gráfico Mensual */}
          <Card className="h-[380px]">
            <div className="p-4 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-3">
                Consumo Mensual (Últimos 12 meses)
              </h3>
              <div className="flex-1 min-h-0">
                <Bar 
                  options={monthlyChartOptions} 
                  data={monthlyChartData} 
                  plugins={[ChartDataLabels]}
                />
              </div>
            </div>
          </Card>

          {/* Gráfico Diario */}
          <Card className="h-[380px]">
            <div className="p-4 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-3">
                Consumo Diario (Últimos 30 días)
              </h3>
              <div className="flex-1 min-h-0">
                <Bar 
                  options={dailyChartOptions} 
                  data={dailyChartData} 
                  plugins={[ChartDataLabels]}
                />
              </div>
            </div>
          </Card>
        </div>
        
        {/* Segunda fila: Análisis de Costos */}
        <Card>
          <div className="p-4">
            
            {/* Título y Disclaimer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-lg font-semibold text-white">
                Análisis de Costos (Últimos 30 días)
              </h3>
              <div className="p-2 bg-yellow-900/30 border border-yellow-700 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <p className="text-xs text-yellow-300">
                  Valores estimativos y referenciales.
                </p>
              </div>
            </div>
            
            {/* Input para el Precio (Editable) */}
            <div className="mb-4">
              <label htmlFor="priceKwh" className="text-sm text-gray-400 block mb-1">
                Precio por kWh (CLP) - (Configurado en el Centro)
              </label>
              <div className="flex items-center gap-2">
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    id="priceKwh"
                    value={editablePrice}
                    onChange={(e) => setEditablePrice(Number(e.target.value) || 0)}
                    className="w-full pl-7 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
                
                {/* Botón de Guardar */}
                <button
                  onClick={handleSavePrice}
                  disabled={isSaving || saveSuccess || editablePrice === data.price_kwh}
                  className="px-4 py-2 rounded-lg text-white font-medium transition-colors
                             bg-blue-600 hover:bg-blue-700
                             disabled:bg-gray-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : saveSuccess ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    "Guardar"
                  )}
                </button>
              </div>
            </div>

            {/* "Cuenta de luz" */}
            <div className="bg-gray-dark p-4 space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-400 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400"/> Consumo Total
                </span>
                <span className="text-white font-medium">{data.totalConsumptionLast30Days.toFixed(2)} kWh</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400"/> Consumo Promedio
                </span>
                <span className="text-white font-medium">{data.avgDailyConsumption.toFixed(2)} kWh/día</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400"/> Costo Promedio Diario
                </span>
                <span className="text-white font-medium">$ {avgDailyCost.toLocaleString('es-CL', {maximumFractionDigits: 0})}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5"/> Total Estimado (30 días)
                </span>
                <span className="text-2xl font-bold text-green-400">
                  $ {totalCost.toLocaleString('es-CL', {maximumFractionDigits: 0})}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </>
    );
  };

  // Layout principal (corregido para h-screen)
  return (
    <div className="h-screen flex flex-col bg-gray-dark">
      
      {/* Header fijo */}
      <div className="flex-shrink-0 p-2 pb-1">
        <Card>
          <div className="p-4 flex items-center justify-between">
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

      {/* Contenido con scroll */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="space-y-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}