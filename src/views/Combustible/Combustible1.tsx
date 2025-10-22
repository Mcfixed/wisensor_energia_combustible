import { useState, useEffect } from "react";
import { 
  AlertTriangle, Droplets, Fuel, Clock, Eye, EyeOff, 
  FileText, MapPin, Thermometer, TrendingDown, 
  Battery, Zap, Waves, Ship, Settings,
  Database, RefreshCw, BarChart3, Filter, Download
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

export const Combustible1 = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSensitive, setShowSensitive] = useState(false);
  const [consumoData, setConsumoData] = useState([]);

  // Datos de ejemplo para los gráficos
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

  // Configuración para gráfico de niveles de tanques
  const nivelesChartOptions = {
    chart: {
      type: 'bar' as const,
      toolbar: { show: false },
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        distributed: true,
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val + "%";
      },
    },
    xaxis: {
      categories: nivelesTanques.map(tanque => tanque.nombre),
      labels: {
        style: { colors: '#9CA3AF' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#9CA3AF' }
      }
    },
    colors: nivelesTanques.map(tanque => 
      tanque.nivel > 80 ? '#10B981' : 
      tanque.nivel > 30 ? '#F59E0B' : '#EF4444'
    ),
    grid: {
      borderColor: '#374151'
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function(val: number, { seriesIndex }: any) {
          const tanque = nivelesTanques[seriesIndex];
          return `${val}% (${Math.round(tanque.capacidad * val / 100)}L)`;
        }
      }
    }
  };

  const nivelesChartSeries = [{
    name: 'Nivel',
    data: nivelesTanques.map(tanque => tanque.nivel)
  }];

  // Configuración para gráfico de consumo semanal
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

  // Configuración para gráfico de distribución por centro
  const distribucionChartOptions = {
    chart: {
      type: 'pie' as const,
      toolbar: { show: false },
      background: 'transparent'
    },
    labels: ['Centro Norte', 'Centro Sur', 'Centro Este', 'Centro Oeste'],
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    legend: {
      labels: {
        colors: '#9CA3AF'
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return Math.round(val) + "%";
      },
      style: {
        colors: ['#fff']
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function(val: number, { seriesIndex }: any) {
          const consumos = [1250, 890, 1670, 0];
          return `${val}% (${consumos[seriesIndex]} L/d)`;
        }
      }
    }
  };

  const distribucionChartSeries = [42, 30, 25, 3];

  // Configuración para gráfico de temperatura
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
        {/* Header */}
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
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      Niveles de Tanques
                    </h2>
                    <StatusIndicator status="warning" text="Nivel bajo detectado" />
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
              <Card>
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      Distribución por Centro
                    </h2>
                    <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      Exportar
                    </button>
                  </div>
                  <div className="flex-1">
                    <Chart
                      options={distribucionChartOptions}
                      series={distribucionChartSeries}
                      type="pie"
                      height="100%"
                    />
                  </div>
                </div>
              </Card>
              
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
            
            <Card className="h-2/5">
              <div className="p-3 h-full flex flex-col">
                <h2 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-green-400" />
                  Métricas Rápidas
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-dark rounded p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Eficiencia</span>
                      <span className="text-xs font-medium text-green-400">87%</span>
                    </div>
                    <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                      <div className="h-1.5 rounded-full bg-green-400" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-dark rounded p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Coste/L</span>
                      <span className="text-xs font-medium text-blue-400">$1.24</span>
                    </div>
                    <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                      <div className="h-1.5 rounded-full bg-blue-400" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-dark rounded p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Densidad</span>
                      <span className="text-xs font-medium text-yellow-400">0.85</span>
                    </div>
                    <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                      <div className="h-1.5 rounded-full bg-yellow-400" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-dark rounded p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Humedad</span>
                      <span className="text-xs font-medium text-purple-400">45%</span>
                    </div>
                    <div className="w-full h-1.5 mt-1 bg-gray-700 rounded-full">
                      <div className="h-1.5 rounded-full bg-purple-400" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

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