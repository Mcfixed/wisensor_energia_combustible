import { useState } from "react";
import { 
  AlertTriangle, BatteryCharging, Clock, Gauge, 
  Lightbulb, Map, MapPin, Power, TrendingUp, Zap, BarChart
} from 'lucide-react';
import Chart from 'react-apexcharts'; // Para ApexCharts
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // Para Leaflet
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Tus Componentes Base ---
// He mantenido tus componentes Card y StatusIndicator tal cual los tenías.

// Arreglo para el ícono de Leaflet en Webpack/Vite
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


// Tipos (los mismos que tenías)
interface CardProps {
  children: React.ReactNode;
  className?: string;
}
type Status = "secure" | "warning" | "danger" | "neutral";
interface StatusDefaultProps {
  status: Status;
  text: string;
}

function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`flex-1 h-full overflow-hidden bg-gray-darkL rounded-lg border border-gray-700 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function StatusIndicator({ status, text }: StatusDefaultProps) {
  const statusConfig = {
    secure: { color: "text-green-400", bg: "bg-green-400/10", icon: <BatteryCharging className="w-3 h-3" /> },
    warning: { color: "text-yellow-400", bg: "bg-yellow-400/10", icon: <AlertTriangle className="w-3 h-3" /> },
    danger: { color: "text-red-400", bg: "bg-red-400/10", icon: <Power className="w-3 h-3" /> },
    neutral: { color: "text-blue-400", bg: "bg-blue-400/10", icon: <Gauge className="w-3 h-3" /> }
  };
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${statusConfig[status].bg} ${statusConfig[status].color}`}>
      {statusConfig[status].icon}
      <span className="font-medium">{text}</span>
    </div>
  );
}

// --- Datos Mock (Simulados) ---
// Datos para los centros que mencionaste.
// Como vives en Puerto Montt, usé coordenadas de la zona.
const centrosData = [
  {
    id: 1,
    name: "Centro A (Oxigenación)",
    coords: [-41.471, -72.941] as [number, number], // Lat, Lng de Pto. Montt
    status: "secure" as Status,
    currentConsumption: 152, // kW
    dailyHistory: [110, 115, 120, 130, 145, 150, 155, 160, 158, 152, 140, 130, 120, 115, 118, 125, 135, 148, 155, 162, 160, 155, 150, 152]
  },
  {
    id: 2,
    name: "Centro B (Alimentación)",
    coords: [-41.505, -72.992] as [number, number], // Cerca de Chinquihue
    status: "warning" as Status,
    currentConsumption: 245, // kW (Pico)
    dailyHistory: [200, 210, 215, 220, 230, 235, 240, 242, 245, 240, 230, 220, 210, 205, 210, 220, 230, 240, 245, 248, 250, 248, 246, 245]
  },
  {
    id: 3,
    name: "Centro C (Refrigeración)",
    coords: [-41.482, -72.903] as [number, number], // Hacia Pelluco
    status: "neutral" as Status,
    currentConsumption: 88, // kW
    dailyHistory: [80, 82, 85, 87, 90, 92, 90, 88, 86, 85, 84, 83, 82, 81, 80, 82, 84, 86, 88, 90, 91, 90, 89, 88]
  }
];

// Generar categorías de tiempo (últimas 24h)
const timeCategories = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

// Datos para el gráfico de "Consumo General"
const generalConsumptionSeries = [{
  name: 'Consumo Total',
  data: timeCategories.map((_, i) => 
    centrosData.reduce((sum, centro) => sum + centro.dailyHistory[i], 0)
  )
}];

// Datos para el gráfico de "Consumo por Centro"
const donutSeries = centrosData.map(c => c.currentConsumption);
const donutLabels = centrosData.map(c => c.name);

// --- Componente Principal de Energía ---

export const Energia1 = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Calcular KPIs
  const totalConsumption = centrosData.reduce((sum, centro) => sum + centro.currentConsumption, 0);
  const activeAlerts = centrosData.filter(c => c.status === 'warning' || c.status === 'danger').length;
  const maxCentro = centrosData.reduce((max, c) => c.currentConsumption > max.currentConsumption ? c : max, centrosData[0]);

  // --- Opciones de ApexCharts (Tema Oscuro) ---

  const baseChartOptions: ApexCharts.ApexOptions = {
    chart: {
      foreColor: '#A0AEC0', // Color de texto (gris claro)
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    grid: {
      borderColor: '#4A5568', // Borde de la grilla (gris oscuro)
      strokeDashArray: 4,
    },
    tooltip: {
      theme: 'dark',
      style: {
        background: '#1A202C', // Fondo del tooltip (gris muy oscuro)
      }
    },
    xaxis: {
      labels: {
        style: {
          colors: '#A0AEC0',
        },
      },
      axisBorder: {
        color: '#4A5568',
      },
      axisTicks: {
        color: '#4A5568',
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#A0AEC0',
        },
      },
    },
  };

  const lineChartOptions: ApexCharts.ApexOptions = {
    ...baseChartOptions,
    chart: {
      ...baseChartOptions.chart,
      type: 'area', // Cambiado a 'area' para un look más moderno
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#F6E05E'], // Amarillo (puedes cambiarlo a #38B2AC de la imagen)
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: ['#F6E05E'],
        shadeIntensity: 1,
        type: 'vertical',
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      },
    },
    xaxis: {
      ...baseChartOptions.xaxis,
      categories: timeCategories,
      tooltip: { enabled: false }
    },
    yaxis: {
      ...baseChartOptions.yaxis,
      title: {
        text: 'kW',
        style: { color: '#A0AEC0', fontWeight: 'normal' }
      }
    },
    tooltip: {
      ...baseChartOptions.tooltip,
      x: { format: 'HH:mm' },
      y: {
        formatter: (val) => `${val} kW`,
      }
    },
  };
  
  const donutChartOptions: ApexCharts.ApexOptions = {
    ...baseChartOptions,
    chart: {
      type: 'donut',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              color: '#A0AEC0',
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return `${total} kW`;
              }
            }
          }
        }
      }
    },
    labels: donutLabels,
    colors: ['#4299E1', '#F6E05E', '#68D391'], // Azul, Amarillo, Verde
    legend: {
      position: 'bottom',
      labels: {
        colors: '#A0AEC0'
      }
    },
    dataLabels: {
      enabled: false
    }
  };

  const tabs = [
    { id: 0, label: "Consumo General", icon: <Map className="w-4 h-4" /> },
    { id: 1, label: "Detalle por Centro", icon: <BarChart className="w-4 h-4" /> },
  ];

  return (
    <main className="flex-1 h-screen overflow-auto p-4 bg-gray-dark text-gray-300">
      <div className="flex flex-col h-full gap-4">
        
        {/* 1. Header (Como en la imagen de ejemplo) */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-2xl font-semibold text-white">Hola Diego, bienvenido a tu portafolio de energía</h1>
            <p className="text-sm text-gray-400">Resumen del consumo de tus centros en tiempo real.</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>

        {/* 2. KPIs (Indicadores Clave) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Consumo Total Actual</span>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-4xl font-bold text-white">{totalConsumption} <span className="text-2xl text-gray-400">kW</span></div>
            <div className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+5.2% vs ayer</span>
            </div>
          </Card>
          
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Pico de Consumo (Centro)</span>
              <Gauge className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-4xl font-bold text-white">{maxCentro.currentConsumption} <span className="text-2xl text-gray-400">kW</span></div>
            <div className="text-xs text-gray-400 mt-1">{maxCentro.name}</div>
          </Card>
          
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Alertas Activas</span>
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-4xl font-bold text-white">{activeAlerts}</div>
            <div className="text-xs text-gray-400 mt-1">Centros con consumo anómalo</div>
          </Card>

        </div>

        {/* 3. Pestañas de Navegación */}
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                activeTab === tab.id
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4. Contenido de las Pestañas */}
        <div className="flex-1">

          {/* Pestaña 0: Consumo General (Gráficos y Mapa) */}
          {activeTab === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
              
              {/* Columna Izquierda (Gráficos) */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                
                <Card className="p-4 h-[350px]">
                  <h2 className="text-base font-semibold text-white mb-3">Consumo General (Últimas 24h)</h2>
                  <div className="h-[280px]">
                    <Chart 
                      options={lineChartOptions} 
                      series={generalConsumptionSeries} 
                      type="area" 
                      height="100%" 
                    />
                  </div>
                </Card>

                <Card className="p-4 h-[350px]">
                  <h2 className="text-base font-semibold text-white mb-3">Distribución de Carga Actual</h2>
                   <div className="h-[280px]">
                    <Chart 
                      options={donutChartOptions} 
                      series={donutSeries} 
                      type="donut" 
                      height="100%" 
                    />
                  </div>
                </Card>

              </div>

              {/* Columna Derecha (Mapa) */}
              <div className="lg:col-span-1 h-[716px]">
                <Card className="p-4 h-full flex flex-col">
                  <h2 className="text-base font-semibold text-white mb-3">Mapa de Centros</h2>
                  <div className="flex-1 rounded-lg overflow-hidden">
                    <MapContainer 
                      center={[-41.48, -72.95]} // Centrado en la bahía de Pto. Montt
                      zoom={12} 
                      scrollWheelZoom={false}
                      className="h-full w-full"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Tile oscuro
                      />
                      {centrosData.map(centro => (
                        <Marker key={centro.id} position={centro.coords}>
                          <Popup>
                            <div className="text-gray-900">
                              <h4 className="font-bold">{centro.name}</h4>
                              <p>Consumo: {centro.currentConsumption} kW</p>
                              <p>Estado: {centro.status}</p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </Card>
              </div>

            </div>
          )}

          {/* Pestaña 1: Detalle por Centro (Gráficos individuales) */}
          {activeTab === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {centrosData.map(centro => {
                // Opciones de gráfico específicas para cada centro
                const centroChartOptions: ApexCharts.ApexOptions = {
                  ...baseChartOptions,
                  chart: {
                    ...baseChartOptions.chart,
                    type: 'area',
                    height: 150,
                    sparkline: { enabled: true } // Modo "sparkline" para gráficos pequeños
                  },
                  stroke: {
                    curve: 'smooth',
                    width: 2
                  },
                  colors: [centro.status === 'warning' ? '#F6E05E' : centro.status === 'danger' ? '#FC8181' : '#68D391'],
                  fill: {
                    type: 'gradient',
                    gradient: {
                      shade: 'dark',
                      gradientToColors: [centro.status === 'warning' ? '#F6E05E' : centro.status === 'danger' ? '#FC8181' : '#68D391'],
                      shadeIntensity: 1,
                      type: 'vertical',
                      opacityFrom: 0.5,
                      opacityTo: 0.1,
                      stops: [0, 100]
                    },
                  },
                  tooltip: {
                    ...baseChartOptions.tooltip,
                    x: { show: false },
                    y: {
                      title: {
                        formatter: () => `${centro.name}`
                      },
                      formatter: (val) => `${val} kW`
                    },
                    marker: { show: false }
                  }
                };

                return (
                  <Card key={centro.id} className="p-4 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-white">{centro.name}</h3>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {centro.coords[0]}, {centro.coords[1]}
                        </div>
                      </div>
                      <StatusIndicator status={centro.status} text={centro.status} />
                    </div>
                    
                    <div className="my-4">
                      <span className="text-xs text-gray-400">Consumo Actual</span>
                      <p className="text-3xl font-bold text-white">{centro.currentConsumption} <span className="text-xl text-gray-400">kW</span></p>
                    </div>

                    <div className="flex-1 mt-2">
                      <h4 className="text-xs font-medium text-gray-400 mb-1">Consumo (Últimas 24h)</h4>
                      <Chart 
                        options={centroChartOptions} 
                        series={[{ name: 'Consumo', data: centro.dailyHistory }]} 
                        type="area"
                        height={150}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </main>
  );
};