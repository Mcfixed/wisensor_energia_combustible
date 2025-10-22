import { useState, useEffect } from "react";
import { 
  AlertTriangle, Droplets, Fuel, Clock, Eye, EyeOff, 
  FileText, MapPin, Thermometer, TrendingDown, 
  Battery, Zap, Waves, Ship, Settings,
  Database, RefreshCw, BarChart3, Filter, Download,
  TrendingUp, Gauge, Calendar
} from 'lucide-react';
import Chart from 'react-apexcharts';
import { CardProps, StatusDefaultProps } from "../../assets/types/Estadisticas";

function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`flex-1 h-full overflow-hidden bg-gray-darkL rounded-xl border border-gray-700 shadow-lg ${className}`}>
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

export const Combustible2 = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSensitive, setShowSensitive] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  // Datos de ejemplo para los gráficos
  const nivelesTanques = [
    { nombre: "Tanque Principal", nivel: 85, capacidad: 15000, combustible: "Diesel", tendencia: "up" },
    { nombre: "Tanque Reserva", nivel: 45, capacidad: 10000, combustible: "Diesel", tendencia: "down" },
    { nombre: "Tanque Emergencia", nivel: 92, capacidad: 8000, combustible: "Diesel", tendencia: "stable" },
    { nombre: "Tanque Lanchas", nivel: 32, capacidad: 5000, combustible: "Gasolina", tendencia: "down" }
  ];

  // Configuración moderna para gráfico de niveles de tanques
  const nivelesChartOptions = {
    chart: {
      type: 'bar' as const,
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 8,
        borderRadiusApplication: 'end',
        barHeight: '70%',
        distributed: false,
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val + "%";
      },
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#fff']
      },
      offsetX: 10,
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.45
      }
    },
    xaxis: {
      categories: nivelesTanques.map(tanque => tanque.nombre),
      labels: {
        style: { 
          colors: '#9CA3AF',
          fontSize: '12px',
          fontWeight: 600
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: { 
          colors: '#9CA3AF',
          fontSize: '12px',
          fontWeight: 600
        }
      }
    },
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#1D4ED8', '#047857', '#D97706', '#DC2626'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 100]
      }
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 4,
      padding: {
        top: 0,
        right: 20,
        bottom: 0,
        left: 20
      }
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px'
      },
      y: {
        formatter: function(val: number, { seriesIndex }: any) {
          const tanque = nivelesTanques[seriesIndex];
          return `${val}% (${Math.round(tanque.capacidad * val / 100).toLocaleString()}L)`;
        }
      }
    }
  };

  const nivelesChartSeries = [{
    name: 'Nivel Actual',
    data: nivelesTanques.map(tanque => tanque.nivel)
  }];

  // Configuración moderna para gráfico de consumo
  const consumoChartOptions = {
    chart: {
      type: 'line' as const,
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000
      },
      dropShadow: {
        enabled: true,
        top: 3,
        left: 2,
        blur: 8,
        opacity: 0.1
      }
    },
    stroke: {
      width: 4,
      curve: 'smooth',
      lineCap: 'round'
    },
    markers: {
      size: 6,
      strokeWidth: 3,
      strokeColors: ['#1E40AF'],
      fillOpacity: 1,
      hover: {
        size: 8
      }
    },
    xaxis: {
      categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      labels: {
        style: { 
          colors: '#9CA3AF',
          fontSize: '11px',
          fontWeight: 600
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      title: {
        text: 'Litros',
        style: { 
          color: '#9CA3AF',
          fontSize: '12px',
          fontWeight: 500
        }
      },
      labels: {
        style: { 
          colors: '#9CA3AF',
          fontSize: '11px'
        },
        formatter: function(val: number) {
          return val.toLocaleString() + 'L';
        }
      }
    },
    colors: ['#3B82F6'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#1E40AF'],
        inverseColors: false,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 4,
      padding: {
        top: 20,
        right: 10,
        bottom: 0,
        left: 10
      }
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px'
      },
      x: {
        show: true
      },
      marker: {
        show: true
      }
    }
  };

  const consumoChartSeries = [{
    name: 'Consumo Diario',
    data: [4200, 3800, 4500, 4100, 4800, 3200, 2800]
  }];

  // Configuración moderna para gráfico radial de eficiencia
  const eficienciaChartOptions = {
    chart: {
      type: 'radialBar' as const,
      toolbar: { show: false },
      background: 'transparent'
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: '70%',
          background: 'transparent',
          image: undefined,
        },
        track: {
          background: '#374151',
          strokeWidth: '100%',
          margin: 0,
        },
        dataLabels: {
          name: {
            fontSize: '16px',
            color: '#9CA3AF',
            offsetY: -10
          },
          value: {
            fontSize: '24px',
            color: '#fff',
            fontWeight: 'bold',
            offsetY: 5
          },
          total: {
            show: true,
            label: 'Eficiencia',
            color: '#9CA3AF',
            fontSize: '14px',
            formatter: function (w: any) {
              return '87%'
            }
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#10B981'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    colors: ['#3B82F6'],
    stroke: {
      lineCap: 'round'
    },
    labels: ['Eficiencia General'],
  };

  const eficienciaChartSeries = [87];

  // Configuración moderna para gráfico de temperatura
  const temperaturaChartOptions = {
    chart: {
      type: 'area' as const,
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    stroke: {
      width: 3,
      curve: 'smooth',
      lineCap: 'round'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#F59E0B'],
        inverseColors: false,
        opacityFrom: 0.6,
        opacityTo: 0.2,
        stops: [0, 100]
      }
    },
    xaxis: {
      categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      labels: {
        style: { 
          colors: '#9CA3AF',
          fontSize: '11px',
          fontWeight: 600
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      title: {
        text: '°C',
        style: { 
          color: '#9CA3AF',
          fontSize: '12px',
          fontWeight: 500
        }
      },
      labels: {
        style: { 
          colors: '#9CA3AF',
          fontSize: '11px'
        }
      },
      min: 10,
      max: 30
    },
    colors: ['#F59E0B'],
    grid: {
      borderColor: '#374151',
      strokeDashArray: 4,
      padding: {
        top: 10,
        right: 10,
        bottom: 0,
        left: 10
      }
    },
    annotations: {
      yaxis: [
        {
          y: 25,
          borderColor: '#EF4444',
          strokeDashArray: 4,
          label: {
            borderColor: '#EF4444',
            style: {
              color: '#fff',
              background: '#EF4444',
              fontSize: '10px',
              fontWeight: 'bold'
            },
            text: 'Límite Máx'
          }
        },
        {
          y: 15,
          borderColor: '#3B82F6',
          strokeDashArray: 4,
          label: {
            borderColor: '#3B82F6',
            style: {
              color: '#fff',
              background: '#3B82F6',
              fontSize: '10px',
              fontWeight: 'bold'
            },
            text: 'Límite Mín'
          }
        }
      ]
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px'
      }
    }
  };

  const temperaturaChartSeries = [{
    name: 'Temperatura',
    data: [18, 17, 19, 22, 24, 20]
  }];

  // Configuración para gráfico de donut moderno
  const distribucionChartOptions = {
    chart: {
      type: 'donut' as const,
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    labels: ['Centro Norte', 'Centro Sur', 'Centro Este', 'Centro Oeste', 'Otros'],
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return Math.round(val) + "%";
      },
      style: {
        fontSize: '11px',
        fontWeight: 'bold',
        colors: ['#fff']
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.45
      }
    },
    legend: {
      position: 'bottom' as const,
      horizontalAlign: 'center' as const,
      labels: {
        colors: '#9CA3AF',
        useSeriesColors: false
      },
      fontSize: '12px',
      fontWeight: 600
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              color: '#9CA3AF',
              offsetY: 5
            },
            value: {
              show: true,
              fontSize: '20px',
              color: '#fff',
              fontWeight: 'bold',
              offsetY: -5,
              formatter: function (val: string) {
                return val + '%'
              }
            },
            total: {
              show: true,
              label: 'Total',
              color: '#9CA3AF',
              fontSize: '14px',
              formatter: function (w: any) {
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0) + 'L'
              }
            }
          }
        }
      }
    },
    stroke: {
      width: 2,
      colors: ['#111827']
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function(val: number, { seriesIndex }: any) {
          const consumos = [1250, 890, 1670, 0, 400];
          return `${val}% (${consumos[seriesIndex].toLocaleString()} L/d)`;
        }
      }
    }
  };

  const distribucionChartSeries = [35, 25, 28, 5, 7];

  const alertasCombustible = [
    { id: 1, type: "Nivel bajo crítico", source: "Tanque Lanchas", level: "danger", time: "2 min ago", value: "15%" },
    { id: 2, type: "Consumo elevado", source: "Lancha 042", level: "warning", time: "12 min ago", value: "45L/h" },
    { id: 3, type: "Temperatura óptima", source: "Tanque Principal", level: "secure", time: "25 min ago", value: "18°C" },
    { id: 4, type: "Reabastecimiento", source: "Proveedor", level: "neutral", time: "1 hr ago", value: "5000L" }
  ];

  return (
    <main className="flex-1 h-screen overflow-hidden p-4 bg-gray-dark">
      <div className="flex flex-col h-full gap-4">
        {/* Header */}
        <div className="h-20 flex gap-4">
          <Card className="w-80 flex items-center px-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                <Fuel className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Monitoreo Combustible</h1>
                <p className="text-sm text-gray-400">Centros de Salmonicultura</p>
              </div>
            </div>
          </Card>
          
          <Card className="flex-1 flex items-center px-6">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <Droplets className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Inventario Total</p>
                    <p className="text-lg font-bold text-white">25,840 L</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Consumo Diario</p>
                    <p className="text-lg font-bold text-white">4,210 L</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg">
                    <Ship className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Embarcaciones</p>
                    <p className="text-lg font-bold text-white">18/22</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <Gauge className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Eficiencia</p>
                    <p className="text-lg font-bold text-white">87%</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <select 
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-transparent text-xs text-white border-none outline-none"
                  >
                    <option value="24h">24H</option>
                    <option value="7d">7D</option>
                    <option value="30d">30D</option>
                  </select>
                </div>
                
                <button 
                  onClick={() => setShowSensitive(!showSensitive)}
                  className="flex items-center gap-2 text-xs text-gray-300 hover:text-white bg-gray-800 rounded-lg px-3 py-2 transition-colors"
                >
                  {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showSensitive ? "Ocultar" : "Mostrar"}
                </button>
                
                <button className="flex items-center gap-2 text-xs text-gray-300 hover:text-white bg-gray-800 rounded-lg px-3 py-2 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  Actualizar
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex gap-4">
          {/* Columna izquierda - Gráficos principales */}
          <div className="w-2/3 flex flex-col gap-4">
            {/* Fila superior - Niveles y Eficiencia */}
            <div className="h-1/2 flex gap-4">
              <Card>
                <div className="p-4 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-500/20">
                        <Droplets className="w-5 h-5 text-blue-400" />
                      </div>
                      Niveles de Tanques
                    </h2>
                    <StatusIndicator status="warning" text="Nivel bajo" />
                  </div>
                  <div className="flex-1">
                    <Chart
                      options={nivelesChartOptions}
                      series={nivelesChartSeries}
                      type="bar"
                      height="100%"
                    />
                  </div>
                </div>
              </Card>
              
              <Card className="w-96">
                <div className="p-4 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-green-500/20">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      </div>
                      Eficiencia General
                    </h2>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <Chart
                      options={eficienciaChartOptions}
                      series={eficienciaChartSeries}
                      type="radialBar"
                      height="280"
                    />
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Fila inferior - Consumo y Distribución */}
            <div className="h-1/2 flex gap-4">
              <Card>
                <div className="p-4 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-cyan-500/20">
                        <TrendingDown className="w-5 h-5 text-cyan-400" />
                      </div>
                      Tendencia de Consumo
                    </h2>
                    <StatusIndicator status="secure" text="Estable" />
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
              
              <Card>
                <div className="p-4 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-purple-500/20">
                        <MapPin className="w-5 h-5 text-purple-400" />
                      </div>
                      Distribución por Centro
                    </h2>
                    <button className="text-xs text-gray-400 hover:text-white flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-1">
                      <Download className="w-3 h-3" />
                      Exportar
                    </button>
                  </div>
                  <div className="flex-1">
                    <Chart
                      options={distribucionChartOptions}
                      series={distribucionChartSeries}
                      type="donut"
                      height="100%"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Columna derecha - Alertas y Métricas */}
          <div className="w-1/3 flex flex-col gap-4">
            <Card className="h-2/5">
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-red-500/20">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    Alertas Activas
                  </h2>
                  <span className="text-xs text-gray-400 bg-gray-800 rounded-full px-2 py-1">4</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {alertasCombustible.map(alerta => (
                    <div key={alerta.id} className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          alerta.level === 'danger' ? 'bg-red-500/20 border border-red-500/30' : 
                          alerta.level === 'warning' ? 'bg-yellow-500/20 border border-yellow-500/30' : 
                          alerta.level === 'secure' ? 'bg-green-500/20 border border-green-500/30' : 'bg-blue-500/20 border border-blue-500/30'
                        }`}>
                          {alerta.level === 'danger' ? <TrendingDown className="w-4 h-4 text-red-400" /> : 
                           alerta.level === 'warning' ? <AlertTriangle className="w-4 h-4 text-yellow-400" /> :
                           <Battery className="w-4 h-4 text-green-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-semibold text-white truncate">{alerta.type}</p>
                            <span className="text-xs text-gray-400 whitespace-nowrap">{alerta.time}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {showSensitive ? alerta.source : "••••••••••••••••"}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className={`text-sm font-bold ${
                              alerta.level === 'danger' ? 'text-red-400' : 
                              alerta.level === 'warning' ? 'text-yellow-400' : 
                              'text-white'
                            }`}>
                              {alerta.value}
                            </span>
                            <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                              Acción
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            
            <Card className="h-2/5">
              <div className="p-4 h-full flex flex-col">
                <h2 className="text-lg font-bold text-white flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-yellow-500/20">
                    <Thermometer className="w-5 h-5 text-yellow-400" />
                  </div>
                  Monitoreo de Temperatura
                </h2>
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

            <Card className="h-1/5">
              <div className="p-4 h-full flex items-center justify-between bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Fuel className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Próximo Reabastecimiento</p>
                    <p className="text-lg font-bold text-white">Mañana 08:00 AM</p>
                    <p className="text-xs text-orange-400">5,000 L programados</p>
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