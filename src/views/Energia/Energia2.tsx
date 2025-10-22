import { useState } from "react";
import Chart from 'react-apexcharts';
import { 
  AlertTriangle, Battery, BatteryCharging, Clock, Eye, EyeOff, 
  FileText, Flame, Gauge, Lightbulb, Power, PowerOff, Settings, 
  Thermometer, Wind, Zap, TrendingUp, DollarSign, Cpu, Activity,
  Sun, Droplets, GitBranch
} from 'lucide-react';
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
    secure: { color: "text-green-400", bg: "bg-green-400/10", icon: <BatteryCharging className="w-3 h-3" /> },
    warning: { color: "text-yellow-400", bg: "bg-yellow-400/10", icon: <AlertTriangle className="w-3 h-3" /> },
    danger: { color: "text-red-400", bg: "bg-red-400/10", icon: <PowerOff className="w-3 h-3" /> },
    neutral: { color: "text-blue-400", bg: "bg-blue-400/10", icon: <Gauge className="w-3 h-3" /> }
  };
  
  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[status].bg} ${statusConfig[status].color}`}>
      {statusConfig[status].icon}
      {text}
    </div>
  );
}

export const Energia2 = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSensitive, setShowSensitive] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');

  // Configuración moderna para gráficos
  const modernChartOptions = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        easing: 'easeinout' as const,
        speed: 800
      },
      fontFamily: 'Inter, sans-serif'
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.1)',
      strokeDashArray: 3,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      },
      x: {
        show: true,
        format: 'HH:mm'
      }
    },
    stroke: {
      curve: 'smooth' as const,
      lineCap: 'round' as const
    }
  };

  // Gráfico de consumo moderno con área gradient
  const realTimeConsumptionChart = {
    series: [{
      name: 'Consumo (kW)',
      data: [142, 148, 155, 162, 158, 172, 185, 178, 165, 158, 152, 148, 155, 162, 172]
    }],
    options: {
      ...modernChartOptions,
      chart: {
        ...modernChartOptions.chart,
        type: 'area',
        height: 280
      },
      colors: ['#00E396'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.6,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100]
        }
      },
      stroke: {
        width: 3,
        curve: 'smooth'
      },
      xaxis: {
        categories: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
        labels: {
          style: {
            colors: 'rgba(156, 163, 175, 0.8)',
            fontSize: '11px'
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
            colors: 'rgba(156, 163, 175, 0.8)',
            fontSize: '11px'
          }
        },
        title: {
          text: 'kW',
          style: {
            color: 'rgba(156, 163, 175, 0.8)',
            fontSize: '12px'
          }
        }
      },
      markers: {
        size: 0,
        hover: {
          size: 5
        }
      },
      dataLabels: {
        enabled: false
      }
    }
  };

  // Gráfico de distribución moderno radial
  const energyDistributionChart = {
    series: [45, 32, 15, 8],
    options: {
      ...modernChartOptions,
      chart: {
        type: 'radialBar' as const,
        height: 320,
        offsetY: 0
      },
      colors: ['#00E396', '#FEB019', '#FF4560', '#775DD0'],
      plotOptions: {
        radialBar: {
          track: {
            background: 'rgba(255,255,255,0.1)',
            margin: 8
          },
          dataLabels: {
            name: {
              fontSize: '14px',
              color: '#9CA3AF',
              offsetY: -10
            },
            value: {
              fontSize: '24px',
              color: '#FFFFFF',
              offsetY: 5
            },
            total: {
              show: true,
              label: 'Total',
              color: '#9CA3AF',
              formatter: function (w: any) {
                return '100%'
              }
            }
          },
          hollow: {
            size: '45%'
          }
        }
      },
      labels: ['Producción', 'Climatización', 'Bombeo', 'Auxiliares'],
      stroke: {
        lineCap: 'round'
      }
    }
  };

  // Gráfico de fuentes moderno con barras
  const energySourcesChart = {
    series: [
      {
        name: 'Red Principal',
        data: [180, 165, 172, 158, 162, 156, 145, 168, 175, 162, 158, 172]
      },
      {
        name: 'Solar',
        data: [25, 28, 30, 32, 28, 25, 22, 35, 38, 32, 28, 30]
      },
      {
        name: 'Eólica',
        data: [12, 15, 18, 14, 16, 12, 10, 20, 22, 18, 15, 16]
      }
    ],
    options: {
      ...modernChartOptions,
      chart: {
        ...modernChartOptions.chart,
        type: 'bar',
        height: 280,
        stacked: true
      },
      colors: ['#3B82F6', '#F59E0B', '#10B981'],
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '55%',
          borderRadiusApplication: 'end'
        }
      },
      xaxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        labels: {
          style: {
            colors: 'rgba(156, 163, 175, 0.8)',
            fontSize: '11px'
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
            colors: 'rgba(156, 163, 175, 0.8)',
            fontSize: '11px'
          }
        },
        title: {
          text: 'kW',
          style: {
            color: 'rgba(156, 163, 175, 0.8)',
            fontSize: '12px'
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
        labels: {
          colors: 'rgba(156, 163, 175, 0.8)'
        }
      }
    }
  };

  // Nuevo gráfico de métricas de eficiencia
  const efficiencyMetricsChart = {
    series: [
      {
        name: 'Eficiencia',
        data: [85, 86, 88, 87, 89, 90, 92, 91, 89, 88, 87, 90]
      }
    ],
    options: {
      ...modernChartOptions,
      chart: {
        ...modernChartOptions.chart,
        type: 'line',
        height: 120,
        sparkline: {
          enabled: true
        }
      },
      colors: ['#00E396'],
      stroke: {
        width: 3,
        curve: 'smooth'
      },
      markers: {
        size: 0
      },
      xaxis: {
        crosshairs: {
          width: 1
        },
      },
      tooltip: {
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function () {
              return 'Eficiencia'
            }
          }
        },
        marker: {
          show: false
        }
      }
    }
  };

  const energyEvents = [
    { id: 1, type: "Pico de consumo", source: "Planta Oxigenación", level: "warning", time: "5 min ago", value: "245 kW" },
    { id: 2, type: "Generador activado", source: "Backup System", level: "secure", time: "12 min ago", value: "180 kW" },
    { id: 3, type: "Temperatura crítica", source: "Sala Eléctrica A", level: "danger", time: "25 min ago", value: "42°C" },
    { id: 4, type: "Carga estable", source: "Red Principal", level: "neutral", time: "1 hr ago", value: "156 kW" }
  ];

  const equipment = [
    { id: 1, name: "Planta Oxigenación", type: "oxygen", consumption: 45, status: "active", efficiency: 92 },
    { id: 2, name: "Sistema Refrigeración", type: "cooling", consumption: 38, status: "active", efficiency: 88 },
    { id: 3, name: "Bombeo Agua", type: "pump", consumption: 22, status: "idle", efficiency: 85 },
    { id: 4, name: "Generador Backup", type: "generator", consumption: 0, status: "standby", efficiency: 95 }
  ];

  const tabs = [
    { id: 0, label: "Resumen", icon: <Gauge className="w-4 h-4" /> },
    { id: 1, label: "Análisis", icon: <TrendingUp className="w-4 h-4" /> },
    { id: 2, label: "Costos", icon: <DollarSign className="w-4 h-4" /> },
  ];

  // Métricas rápidas modernas
  const quickMetrics = [
    { icon: <Activity className="w-5 h-5" />, label: "Consumo Actual", value: "156 kW", change: "+2.3%", trend: "up", color: "text-green-400" },
    { icon: <Sun className="w-5 h-5" />, label: "Solar", value: "28 kW", change: "+15%", trend: "up", color: "text-yellow-400" },
    { icon: <Wind className="w-5 h-5" />, label: "Eólica", value: "15 kW", change: "-5%", trend: "down", color: "text-blue-400" },
    { icon: <Droplets className="w-5 h-5" />, label: "Eficiencia", value: "87%", change: "+1.2%", trend: "up", color: "text-purple-400" },
  ];

  return (
    <main className="flex-1 h-screen overflow-hidden p-4 bg-gray-dark">
      <div className="flex flex-col h-full gap-4">
        {/* Header modernizado */}
        <div className="flex gap-4">
          <Card className="w-80 flex items-center px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Energy Center</h1>
                <p className="text-sm text-gray-400">Centro de Salmonicultura</p>
              </div>
            </div>
          </Card>
          
          <Card className="flex-1 flex items-center px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-8">
                {quickMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-gray-800 ${metric.color} bg-opacity-10`}>
                      {metric.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{metric.label}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold text-white">{metric.value}</p>
                        <span className={`text-xs font-medium ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-4">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="24h">Últimas 24h</option>
                  <option value="7d">Última semana</option>
                  <option value="30d">Último mes</option>
                </select>
                <button 
                  onClick={() => setShowSensitive(!showSensitive)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                >
                  {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showSensitive ? "Ocultar" : "Mostrar"}
                </button>
                <div className="h-6 w-px bg-gray-700"></div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Clock className="w-4 h-4" />
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contenido principal modernizado */}
        <div className="flex-1 flex gap-4">
          {/* Columna izquierda - Gráficos principales */}
          <div className="w-2/3 flex flex-col gap-4">
            {/* Fila superior - Gráficos principales */}
            <div className="h-96 flex gap-4">
              {/* Gráfico de consumo moderno */}
              <Card className="flex-1">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-white flex items-center gap-3">
                        <Activity className="w-5 h-5 text-green-400" />
                        Consumo en Tiempo Real
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">Monitorización continua del consumo energético</p>
                    </div>
                    <StatusIndicator status="secure" text="Estable" />
                  </div>
                  <div className="flex-1">
                    <Chart
                      options={realTimeConsumptionChart.options}
                      series={realTimeConsumptionChart.series}
                      type="area"
                      height="100%"
                    />
                  </div>
                </div>
              </Card>

              {/* Gráfico de distribución radial moderno */}
              <Card className="w-96">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-white flex items-center gap-3">
                        <GitBranch className="w-5 h-5 text-purple-400" />
                        Distribución
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">Por áreas de consumo</p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <Chart
                      options={energyDistributionChart.options}
                      series={energyDistributionChart.series}
                      type="radialBar"
                      height="320"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Fila inferior - Gráficos secundarios */}
            <div className="flex-1 flex gap-4">
              {/* Gráfico de fuentes apilado */}
              <Card className="flex-1">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-white flex items-center gap-3">
                        <Wind className="w-5 h-5 text-blue-400" />
                        Fuentes de Energía
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">Distribución mensual por fuente</p>
                    </div>
                    <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
                      <option>2024</option>
                      <option>2023</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <Chart
                      options={energySourcesChart.options}
                      series={energySourcesChart.series}
                      type="bar"
                      height="100%"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Columna derecha - Paneles de control */}
          <div className="w-1/3 flex flex-col gap-4">
            {/* Pestañas de análisis */}
            <Card className="h-48">
              <div className="flex flex-col h-full">
                <div className="flex border-b border-gray-700 bg-gray-800 rounded-t-xl">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-6 py-4 text-sm font-semibold flex-1 transition-all duration-200 ${
                        activeTab === tab.id
                          ? "text-white bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b-2 border-yellow-500"
                          : "text-gray-400 hover:text-white hover:bg-gray-750"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 p-6">
                  {activeTab === 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">3,450</div>
                        <div className="text-xs text-gray-400">kWh Hoy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-400">-5.2%</div>
                        <div className="text-xs text-gray-400">Vs. Ayer</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-white">$1,240</div>
                        <div className="text-xs text-gray-400">Costo Hoy</div>
                      </div>
                      <div className="text-center">
                        <Chart
                          options={efficiencyMetricsChart.options}
                          series={efficiencyMetricsChart.series}
                          type="line"
                          height="60"
                        />
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 1 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Tendencia 7d</span>
                        <span className="text-sm font-semibold text-green-400">↗ -8.1%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Máximo Pico</span>
                        <span className="text-sm font-semibold text-yellow-400">245 kW</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Promedio</span>
                        <span className="text-sm font-semibold text-white">158 kW</span>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 2 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Costo Mes</span>
                        <span className="text-lg font-bold text-white">$37.2k</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Ahorro Renovable</span>
                        <span className="text-sm font-semibold text-green-400">$2,840</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Proyección</span>
                        <span className="text-sm font-semibold text-blue-400">-12%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Eventos de energía */}
            <Card className="flex-1">
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    Eventos Recientes
                  </h2>
                  <button className="text-sm text-gray-400 hover:text-white transition-colors">
                    Ver todos →
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4">
                  {energyEvents.map(event => (
                    <div key={event.id} className="flex items-start gap-4 p-4 rounded-xl bg-gray-800 hover:bg-gray-750 transition-all duration-200 group">
                      <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${
                        event.level === 'danger' ? 'bg-red-500/20' : 
                        event.level === 'warning' ? 'bg-yellow-500/20' : 
                        event.level === 'secure' ? 'bg-green-500/20' : 'bg-blue-500/20'
                      }`}>
                        {event.level === 'danger' ? <PowerOff className="w-4 h-4 text-red-400" /> : 
                         event.level === 'warning' ? <AlertTriangle className="w-4 h-4 text-yellow-400" /> :
                         <BatteryCharging className="w-4 h-4 text-green-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-semibold text-white truncate">{event.type}</p>
                          <span className="text-xs text-gray-400 whitespace-nowrap pl-2">{event.time}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate mb-2">{event.source}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-white">{event.value}</span>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            event.level === 'danger' ? 'bg-red-500/20 text-red-400' : 
                            event.level === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {event.level === 'danger' ? 'Crítico' : event.level === 'warning' ? 'Alerta' : 'Normal'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Equipos críticos */}
            <Card className="h-64">
              <div className="p-6 h-full flex flex-col">
                <h2 className="text-lg font-semibold text-white flex items-center gap-3 mb-6">
                  <Cpu className="w-5 h-5 text-blue-400" />
                  Equipos Críticos
                </h2>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {equipment.map(device => (
                    <div key={device.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-800 hover:bg-gray-750 transition-all duration-200 group">
                      <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${
                        device.status === 'active' ? 'bg-green-500/20' : 
                        device.status === 'idle' ? 'bg-blue-500/20' : 'bg-yellow-500/20'
                      }`}>
                        {device.type === 'oxygen' ? <Wind className="w-4 h-4 text-blue-400" /> : 
                         device.type === 'cooling' ? <Thermometer className="w-4 h-4 text-green-400" /> :
                         device.type === 'pump' ? <Power className="w-4 h-4 text-red-400" /> :
                         <Zap className="w-4 h-4 text-yellow-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{device.name}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-400">{device.consumption} kW</span>
                          <span className="text-xs text-green-400 font-medium">{device.efficiency}% eff.</span>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        device.status === 'active' ? 'bg-green-400 animate-pulse' : 
                        device.status === 'idle' ? 'bg-blue-400' : 'bg-yellow-400'
                      }`} />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};