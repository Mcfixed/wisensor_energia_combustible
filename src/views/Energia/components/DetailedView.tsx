// components/DetailedView.tsx
import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, TrendingUp, Zap, FileText,
  DollarSign, AlertTriangle, Check, Loader2, Download
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DeviceSummary } from '../types';
import { useEnergyDetails } from '../hooks/useEnergyDetails';
import { Card } from './Card';
import { updateKwhPriceByDevice } from '../services/energiaService';
// Importar jsPDF
import jsPDF from 'jspdf';
// Importar tipos de Chart.js (¡Importante para los refs!)
import { Chart as ChartJS } from 'chart.js';

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

  // --- NUEVO: Refs para los gráficos ---
  // Estos refs nos darán acceso a la instancia de Chart.js para convertirlos a imagen
  const dailyChartRef = useRef<ChartJS<'bar'>>(null);
  const monthlyChartRef = useRef<ChartJS<'bar'>>(null);
  // Estado de carga para el PDF
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);


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

  // --- NUEVA FUNCIÓN: Generar y Descargar PDF ---
  const handleDownloadPDF = async () => {
  // Validar que tenemos todos los datos necesarios
  if (!data || !editablePrice || !dailyChartRef.current || !monthlyChartRef.current) {
    alert("No se pueden generar el PDF. Faltan datos o los gráficos no han cargado.");
    return;
  }

  setIsGeneratingPDF(true);

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageHeight = 297;
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = margin;

    // --- Colores ---
    const primaryColor = [200, 60, 75]; // Rojo para acentos
    const darkGray = [60, 60, 60]; // Texto principal
    const mediumGray = [100, 100, 100]; // Texto secundario
    const lightGray = [240, 240, 240]; // Fondos sutiles
    const borderColor = [220, 220, 220]; // Bordes grises
    const lightBg = [250, 245, 245];
    // --- Encabezado con Logo ---
    const logoUrl = '/AST-Logo.png';
    // Logo en esquina superior izquierda
    // pdf.addImage(logoBase64, 'PNG', margin, yPos, 30, 15);
    try {
      // jsPDF puede cargar imágenes directamente desde URL
      pdf.addImage(logoUrl, 'PNG', 15, 5, 30, 15);
    } catch (logoError) {
      console.warn('No se pudo cargar el logo:', logoError);
      // Si falla, simplemente continuamos sin logo
    }
    // Título principal centrado
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.text('INFORME DE CONSUMO ENERGÉTICO', pageWidth / 2, yPos + 10, { align: 'center' });
    
    // Línea decorativa gris
    pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPos + 15, pageWidth - margin, yPos + 15);
    
    // Fecha del reporte
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    pdf.text(`Período: Últimos 30 días - Generado: ${new Date().toLocaleDateString('es-CL')}`, pageWidth / 2, yPos + 22, { align: 'center' });
    
    yPos += 30;

    // --- Información del Dispositivo ---
    pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.rect(margin, yPos, contentWidth, 25, 'F');
    pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    pdf.setLineWidth(0.5);
    pdf.rect(margin, yPos, contentWidth, 25, 'S');
    
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.text('DISPOSITIVO DE MONITOREO', margin + 12, yPos + 8);
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    
    // Layout en dos columnas
    pdf.text(`• ${device.deviceInfo.deviceName}`, margin + 12, yPos + 15);
    pdf.text(`• ${device.deviceInfo.location}`, margin + 12, yPos + 21);
    pdf.text(`• EUI: ${device.deviceInfo.devEui}`, margin + contentWidth/2 + 12, yPos + 15);
    
    yPos += 32;

    // --- Resumen de Costos ---
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.text('RESUMEN FINANCIERO', margin, yPos);
    yPos += 10;

    // Cálculos
    const priceToCalculate = editablePrice;
    const totalCost = data.totalConsumptionLast30Days * priceToCalculate;
    const avgDailyCost = data.avgDailyConsumption * priceToCalculate;

    // Cuadro de resumen principal
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    pdf.setLineWidth(0.5);
    pdf.rect(margin, yPos, contentWidth, 45, 'FD');
    
    const cardPadding = 10;
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    
    pdf.text('PRECIO kWh', margin + cardPadding, yPos + 8);
    pdf.text('CONSUMO TOTAL', margin + cardPadding, yPos + 20);
    pdf.text('PROMEDIO DIARIO', margin + cardPadding, yPos + 32);
    
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    
    pdf.text(`$ ${priceToCalculate.toLocaleString('es-CL')}`, pageWidth - margin - cardPadding, yPos + 8, { align: 'right' });
    pdf.text(`${data.totalConsumptionLast30Days.toFixed(2)} kWh`, pageWidth - margin - cardPadding, yPos + 20, { align: 'right' });
    pdf.text(`${data.avgDailyConsumption.toFixed(2)} kWh/día`, pageWidth - margin - cardPadding, yPos + 32, { align: 'right' });

    // Total destacado
    yPos += 50;
    pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.rect(margin, yPos, contentWidth, 20, 'F');
    pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    pdf.rect(margin, yPos, contentWidth, 20, 'S');
    
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.text('INVERSIÓN TOTAL ESTIMADA (30 DÍAS)', margin + cardPadding, yPos + 8);
    pdf.text(`$ ${totalCost.toLocaleString('es-CL', { maximumFractionDigits: 0 })}`, pageWidth - margin - cardPadding, yPos + 8, { align: 'right' });
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    pdf.text('Costo estimado basado en consumo medido', margin + cardPadding, yPos + 15);

    yPos += 30;

    // --- Detalle de Consumo Diario ---
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.text('DETALLE DIARIO DE CONSUMO', margin, yPos);
    yPos += 8;

    // Encabezados de tabla
    pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.rect(margin, yPos, contentWidth, 10, 'F');
    pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    pdf.rect(margin, yPos, contentWidth, 10, 'S');
    
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.text('FECHA', margin + 8, yPos + 6);
    pdf.text('ENERGÍA (kWh)', margin + 80, yPos + 6, { align: 'right' });
    pdf.text('COSTO ESTIMADO', margin + 120, yPos + 6, { align: 'right' });
    
    yPos += 12;

    // Filas de la tabla
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    
    data.dailyConsumption.forEach((day, index) => {
      // Control de salto de página
      if (yPos > pageHeight - margin - 15) {
        pdf.addPage();
        yPos = margin;
        // Repetir encabezados
        pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
        pdf.rect(margin, yPos, contentWidth, 10, 'F');
        pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
        pdf.rect(margin, yPos, contentWidth, 10, 'S');
        
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        pdf.text('FECHA', margin + 8, yPos + 6);
        pdf.text('ENERGÍA (kWh)', margin + 80, yPos + 6, { align: 'right' });
        pdf.text('COSTO ESTIMADO', margin + 120, yPos + 6, { align: 'right' });
        yPos += 12;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
      }

      // Filas alternadas con fondo sutil
      if (index % 2 === 0) {
        pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
        pdf.rect(margin, yPos - 3, contentWidth, 6, 'F');
      }

      const dailyCost = (day.consumption * priceToCalculate);
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.text(day.date, margin + 8, yPos + 2);
      
      pdf.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
      pdf.text(day.consumption.toFixed(2), margin + 80, yPos + 2, { align: 'right' });
      
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.text(`$ ${dailyCost.toLocaleString('es-CL', { maximumFractionDigits: 0 })}`, margin + 120, yPos + 2, { align: 'right' });
      
      yPos += 6;
    });
    
    yPos += 15;

    // --- Análisis Gráfico ---
    if (yPos > pageHeight - 130) {
      pdf.addPage();
      yPos = margin;
    }

    const dailyChartImg = dailyChartRef.current.toBase64Image();
    const monthlyChartImg = monthlyChartRef.current.toBase64Image();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.text('ANÁLISIS VISUAL', margin, yPos);
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    pdf.text('Tendencias y patrones de consumo energético', margin, yPos + 5);
    
    yPos += 12;

    // Gráfico mensual
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    pdf.rect(margin, yPos, contentWidth, contentWidth / 2 + 15, 'FD');
    
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.text('EVOLUCIÓN MENSUAL', margin + 15, yPos + 10);
    
    pdf.addImage(monthlyChartImg, 'PNG', margin + 5, yPos + 15, contentWidth - 10, (contentWidth - 10) / 2);
    yPos += (contentWidth / 2) + 25;

    // Gráfico diario
    if (yPos > pageHeight - 100) {
      pdf.addPage();
      yPos = margin;
    }

    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    pdf.rect(margin, yPos, contentWidth, contentWidth / 2 + 15, 'FD');
    
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.text('DETALLE DIARIO', margin + 15, yPos + 10);
    
    pdf.addImage(dailyChartImg, 'PNG', margin + 5, yPos + 15, contentWidth - 10, (contentWidth - 10) / 2);

    // --- Pie de página con rojos ---
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      // Fondo sutil para el pie (gris claro)
      pdf.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F');
      
      // Línea superior del pie (roja)
      pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.setLineWidth(0.5);
      pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
      
      // Texto del pie
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(8);
      pdf.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
      
      const footerText = `Sistema de Monitoreo de Energía AST - Documento técnico de carácter referencial - Página ${i} de ${totalPages}`;
      const dateText = `Generado el ${new Date().toLocaleDateString('es-CL', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`;
      
      pdf.text(footerText, pageWidth / 2, pageHeight - 14, { align: 'center' });
      pdf.text(dateText, pageWidth / 2, pageHeight - 8, { align: 'center' });
    }

    // --- Guardar PDF ---
    pdf.save(`analisis_energetico_${device.deviceInfo.deviceName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);

  } catch (e) {
    console.error("Error al generar el PDF:", e);
    alert("Ocurrió un error al generar el PDF.");
  } finally {
    setIsGeneratingPDF(false);
  }
};
  // --- Fin Nueva Función PDF ---


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
                  ref={monthlyChartRef} // <-- AÑADIR REF
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
                  ref={dailyChartRef} // <-- AÑADIR REF
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
                  disabled={isSaving || saveSuccess || (data && editablePrice === data.price_kwh)}
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
                  <Zap className="w-4 h-4 text-yellow-400" /> Consumo Total
                </span>
                <span className="text-white font-medium">{data.totalConsumptionLast30Days.toFixed(2)} kWh</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" /> Consumo Promedio
                </span>
                <span className="text-white font-medium">{data.avgDailyConsumption.toFixed(2)} kWh/día</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <span className="text-gray-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" /> Costo Promedio Diario
                </span>
                <span className="text-white font-medium">$ {avgDailyCost.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Total Estimado (30 días)
                </span>
                <span className="text-2xl font-bold text-green-400">
                  $ {totalCost.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
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

            {/* --- NUEVO BOTÓN DE DESCARGA PDF --- */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF || loading || !data}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer text-white font-medium transition-colors
                         bg-green-600 hover:bg-green-700
                         disabled:bg-gray-500 disabled:opacity-70 disabled:cursor-not-allowed"
              title="Descargar Recibo en PDF"
            >
              {isGeneratingPDF ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">
                {isGeneratingPDF ? "Generando..." : "Descargar PDF"}
              </span>
            </button>

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