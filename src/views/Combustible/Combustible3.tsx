import { useState, useEffect } from "react";
import {
  AlertTriangle, Droplets, Fuel, Clock, Eye, EyeOff,
  FileText, MapPin, Thermometer, TrendingDown,
  Battery, Zap, Waves, Ship, Settings,
  Database, RefreshCw, BarChart3, Filter, Download,
  DollarSign // <- Icono agregado
} from 'lucide-react';
import Chart from 'react-apexcharts';
import { CardProps, StatusDefaultProps } from "../../assets/types/Estadisticas";

function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`flex-1 h-full overflow-hidden bg-gray-darkL rounded-lg border border-gray-700 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function StatusIndicator({ status, text }: StatusDefaultProps) {
  const statusConfig = {
    secure: { color: "text-green-400", bg: "bg-green-400/10", icon: <Battery className="w-3 h-3" /> },
    warning: { color: "text-yellow-400", bg: "bg-yellow-400/10", icon: <AlertTriangle className="w-3 h-3" /> },
    danger: { color: "text-red-400", bg: "bg-red-400/10", icon: <TrendingDown className="w-3 h-3" /> },
    neutral: { color: "text-blue-400", bg: "bg-blue-400/10", icon: <Droplets className="w-3 h-3" /> }
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusConfig[status].bg} ${statusConfig[status].color}`}>
      {statusConfig[status].icon}
      {text}
    </div>
  );
}

// --- NUEVO COMPONENTE: MetricCard ---
// Esta tarjeta reemplaza los items de "Métricas Rápidas" y "Distribución"
function MetricCard({ icon: Icon, title, value, unit, className = "" }: {
  icon: React.ElementType,
  title: string,
  value: string | number,
  unit?: string,
  className?: string
}) {
  return (
    <div className={`p-3 rounded-lg bg-gray-dark ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-xs text-gray-400">{title}</span>
      </div>
      <p className="text-lg font-semibold text-white">
        {value} <span className="text-sm font-normal text-gray-300">{unit}</span>
      </p>
    </div>
  );
}


export const Combustible3 = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSensitive, setShowSensitive] = useState(false);
  const [consumoData, setConsumoData] = useState([]);

  // Datos de ejemplo
  const nivelesTanques = [
    { nombre: "Tanque Principal", nivel: 85, capacidad: 15000, combustible: "Diesel" },
    { nombre: "Tanque Reserva", nivel: 45, capacidad: 10000, combustible: "Diesel" },
    { nombre: "Tanque Emergencia", nivel: 92, capacidad: 8000, combustible: "Diesel" },
    { nombre: "Tanque Lanchas", nivel: 32, capacidad: 5000, combustible: "Gasolina" }
  ];

  const alertasCombustible = [
    { id: 1, type: "Nivel bajo", source: "Tanque Lanchas", level: "warning", time: "5 min ago", value: "32%" },
    { id: 2, type: "Consumo elevado", source: "Lancha 042", level: "danger", time: "12 min ago", value: "45L/h" },
    { id: 3, type: "Temperatura estable", source: "Tanque Principal", level: "secure", time: "25 min ago", value: "18°C" },
    { id: 4, type: "Reabastecimiento", source: "Proveedor", level: "neutral", time: "1 hr ago", value: "5000L" }
  ];

  // --- NUEVOS DATOS: Para las MetricCards de Distribución ---
  const distribucionData = [
    { icon: MapPin, title: "Centro Norte", value: 1250, unit: "L/d" },
    { icon: MapPin, title: "Centro Sur", value: 890, unit: "L/d" },
    { icon: MapPin, title: "Centro Este", value: 1670, unit: "L/d" },
    { icon: MapPin, title: "Centro Oeste", value: 0, unit: "L/d" }
  ];

  // --- NUEVA FUNCIÓN: Generador de opciones para Gauges ---
  const createGaugeOptions = (label: string) => ({
    chart: {
      type: 'radialBar' as const,
      height: 150,
      background: 'transparent',
      sparkline: { enabled: false }
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '65%',
        },
        track: {
          background: '#374151', // gray-700
        },
        dataLabels: {
          name: {
            show: true,
            offsetY: 20, // Mueve el label (nombre) hacia abajo
            color: '#9CA3AF', // gray-400
            fontSize: '12px',
          },
          value: {
            show: true,
            offsetY: -15, // Mueve el valor (%) hacia arriba
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: 'bold',
            formatter: (val: number) => `${val}%`
          }
        }
      }
    },
    stroke: { lineCap: 'round' as const },
    labels: [label],
  });

  // --- GRÁFICOS ANTIGUOS ELIMINADOS ---
  // Se eliminaron 'nivelesChartOptions', 'nivelesChartSeries'
  // Se eliminaron 'distribucionChartOptions', 'distribucionChartSeries'


  // Configuración para gráfico de consumo semanal (Se mantiene igual)
  const consumoChartOptions = {
    chart: {
      type: 'line' as const,
      toolbar: { show: false },
      background: 'transparent'
    },
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    xaxis: {
      categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      labels: {
        style: { colors: '#9CA3AF' }
      }
    },
    yaxis: {
      title: {
        text: 'Litros',
        style: { color: '#9CA3AF' }
      },
      labels: {
        style: { colors: '#9CA3AF' }
      }
    },
    colors: ['#3B82F6'],
    grid: {
      borderColor: '#374151'
    },
    markers: {
      size: 5,
    },
    tooltip: {
      theme: 'dark'
    }
  };

  const consumoChartSeries = [{
    name: 'Consumo Diario',
    data: [4200, 3800, 4500, 4100, 4800, 3200, 2800]
  }];


  // Configuración para gráfico de temperatura (Se mantiene igual)
  const temperaturaChartOptions = {
    chart: {
      type: 'area' as const,
      toolbar: { show: false },
      background: 'transparent'
    },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      }
    },
    xaxis: {
      categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      labels: {
        style: { colors: '#9CA3AF' }
      }
    },
    yaxis: {
      title: {
        text: '°C',
        style: { color: '#9CA3AF' }
      },
      labels: {
        style: { colors: '#9CA3AF' }
      },
      min: 10,
      max: 30
    },
    colors: ['#F59E0B'],
    grid: {
      borderColor: '#374151'
    },
    annotations: {
      yaxis: [
        {
          y: 25,
          borderColor: '#EF4444',
          label: {
            borderColor: '#EF4444',
            style: {
              color: '#fff',
              background: '#EF4444'
            },
            text: 'Límite máximo'
          }
        },
        {
          y: 15,
          borderColor: '#3B82F6',
          label: {
            borderColor: '#3B82F6',
            style: {
              color: '#fff',
              background: '#3B82F6'
            },
            text: 'Límite mínimo'
          }
        }
      ]
    },
    tooltip: {
      theme: 'dark'
    }
  };

  const temperaturaChartSeries = [{
    name: 'Temperatura',
    data: [18, 17, 19, 22, 24, 20]
  }];

  return (
    <main className="flex-1 h-screen overflow-hidden p-2 bg-gray-dark">
      <div className="flex flex-col h-full gap-2">
        {/* Header (Se mantiene igual) */}
        <div className="h-16 flex gap-2">
          <Card className="w-64 flex items-center px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Fuel className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Combustible</h1>
                <p className="text-xs text-gray-400">Salmonicultura</p>
              </div>
            </div>
          </Card>

          <Card className="flex-1 flex items-center px-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-green-500/20">
                    <Droplets className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Inventario Total</p>
                    <p className="text-sm font-medium text-white">25,840 L</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-blue-500/20">
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Consumo Diario</p>
                    <p className="text-sm font-medium text-white">4,210 L</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-yellow-500/20">
                    <Ship className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Embarcaciones</p>
                    <p className="text-sm font-medium text-white">18 activas</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-purple-500/20">
                    <Thermometer className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Temperatura Avg</p>
                    <p className="text-sm font-medium text-white">19.5°C</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSensitive(!showSensitive)}
                  className="flex items-center gap-1 text-xs text-gray-300 hover:text-white"
                >
                  {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showSensitive ? "Ocultar datos" : "Mostrar datos"}
                </button>
                <div className="h-4 w-px bg-gray-600"></div>
                <button className="flex items-center gap-1 text-xs text-gray-300 hover:text-white">
                  <RefreshCw className="w-4 h-4" />
                  Actualizar
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex gap-2">
          {/* Columna izquierda - Gráficos principales */}
          <div className="w-2/3 flex flex-col gap-2">
            {/* Fila superior - Niveles y Consumo */}
            <div className="h-1/2 flex gap-2">
              
              {/* --- MODIFICADO: Niveles de Tanques ahora usa Gauges --- */}
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      Niveles de Tanques
                    </h2>
                    <StatusIndicator status="warning" text="Nivel bajo detectado" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 items-center justify-around gap-2">
                    {nivelesTanques.map((tanque) => {
                      // Define el color basado en el nivel
                      const color = tanque.nivel > 80 ? '#10B981' : // green-500
                                    tanque.nivel > 30 ? '#F59E0B' : // yellow-500
                                    '#EF4444'; // red-500
                      
                      // Crea opciones específicas para este gauge
                      const gaugeOptions: any = {
                        ...createGaugeOptions(tanque.nombre),
                        fill: { colors: [color] },
                        tooltip: { // Tooltip personalizado con litros
                          theme: 'dark',
                          y: {
                            formatter: (val: number) => `${val}% (${Math.round(tanque.capacidad * val / 100)}L)`
                          }
                        }
                      };

                      return (
                        <div key={tanque.nombre} className="flex flex-col items-center">
                          <Chart
                            options={gaugeOptions}
                            series={[tanque.nivel]}
                            type="radialBar"
                            height="100%"
                            width="100%"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>

              {/* Consumo Semanal (Se mantiene igual) */}
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-green-400" />
                      Consumo Semanal
                    </h2>
                    <StatusIndicator status="secure" text="Dentro del rango" />
                  </div>
                  <div className="flex-1">
                    <Chart
                      options={consumoChartOptions}
                      series={consumoChartSeries}
                      type="line"
                      height="100%"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Fila inferior - Distribución y Temperatura */}
            <div className="h-1/2 flex gap-2">

              {/* --- MODIFICADO: Distribución por Centro ahora usa MetricCards --- */}
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      Consumo por Centro
                    </h2>
                    <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      Exportar
                    </button>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3 content-start">
                    {distribucionData.map((centro) => (
                      <MetricCard
                        key={centro.title}
                        icon={centro.icon}
                        title={centro.title}
                        value={centro.value.toLocaleString('es-CL')}
                        unit={centro.unit}
                      />
                    ))}
                  </div>
                </div>
              </Card>

              {/* Monitoreo de Temperatura (Se mantiene igual) */}
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-yellow-400" />
                      Monitoreo de Temperatura
                    </h2>
                    <StatusIndicator status="secure" text="Estable" />
                  </div>
                  <div className="flex-1">
                    <Chart
                      options={temperaturaChartOptions}
                      series={temperaturaChartSeries}
                      type="area"
                      height="100%"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Columna derecha - Alertas y Métricas rápidas */}
          <div className="w-1/3 flex flex-col gap-2">
            
            {/* Alertas Activas (Se mantiene igual) */}
            <Card className="h-2/5">
              <div className="p-3 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-medium text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    Alertas Activas
                  </h2>
                  <span className="text-xs text-gray-400">4 alertas</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {alertasCombustible.map(alerta => (
                    <div key={alerta.id} className="mb-3 pb-3 border-b border-gray-700 last:border-0 last:mb-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1 rounded-full ${
                          alerta.level === 'danger' ? 'bg-red-400/20' :
                          alerta.level === 'warning' ? 'bg-yellow-400/20' :
                          alerta.level === 'secure' ? 'bg-green-400/20' : 'bg-blue-400/20'
                        }`}>
                          {alerta.level === 'danger' ? <TrendingDown className="w-3 h-3 text-red-400" /> :
                           alerta.level === 'warning' ? <AlertTriangle className="w-3 h-3 text-yellow-400" /> :
                           <Battery className="w-3 h-3 text-green-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="text-xs text-white">{alerta.type}</p>
                            <span className="text-xs text-gray-400">{alerta.time}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {showSensitive ? alerta.source : "••••••••••••••••"}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className={`text-xs font-medium ${
                              alerta.level === 'danger' ? 'text-red-400' :
                              alerta.level === 'warning' ? 'text-yellow-400' : 'text-white'
                            }`}>
                              {alerta.value}
                            </span>
                            <button className="text-xs text-blue-400 hover:text-blue-300">
                              Ver detalles
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* --- MODIFICADO: Métricas Rápidas ahora usa Gauges y MetricCards --- */}
            <Card className="h-2/5">
              <div className="p-3 h-full flex flex-col">
                <h2 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-green-400" />
                  Métricas Clave
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {/* Gauge para Eficiencia */}
                  <div className="flex flex-col items-center p-2 bg-gray-dark rounded-lg">
                    <Chart
                      options={{
                        ...createGaugeOptions("Eficiencia"),
                        fill: { colors: ['#10B981'] }, // green-500
                      }}
                      series={[87]}
                      type="radialBar"
                      height={140}
                    />
                  </div>
                  {/* Gauge para Humedad */}
                  <div className="flex flex-col items-center p-2 bg-gray-dark rounded-lg">
                    <Chart
                      options={{
                        ...createGaugeOptions("Humedad"),
                        fill: { colors: ['#A78BFA'] }, // purple-400
                      }}
                      series={[45]}
                      type="radialBar"
                      height={140}
                    />
                  </div>
                  {/* MetricCard para Coste/L */}
                  <MetricCard
                    icon={DollarSign}
                    title="Coste/L"
                    value="$1.24"
                    className="bg-gray-dark"
                  />
                  {/* MetricCard para Densidad */}
                  <MetricCard
                    icon={Database}
                    title="Densidad"
                    value="0.85"
                    unit="kg/L"
                    className="bg-gray-dark"
                  />
                </div>
              </div>
            </Card>

            {/* Próximo Reabastecimiento (Se mantiene igual) */}
            <Card className="h-1/5">
              <div className="p-3 h-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Fuel className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Próximo Reabastecimiento</p>
                    <p className="text-sm font-medium text-white">Mañana 08:00 AM</p>
                  </div>
                </div>
                <StatusIndicator status="neutral" text="Programado" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};