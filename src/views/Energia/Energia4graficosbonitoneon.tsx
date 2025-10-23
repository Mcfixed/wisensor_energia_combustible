import { useState, useEffect } from "react";
import { 
  Clock, Eye, EyeOff, Settings, Zap, Gauge, 
  Thermometer, Cpu, Battery, Power,
  FileText, ArrowUp, ArrowDown
} from 'lucide-react';
import { CardProps } from "../../assets/types/Estadisticas";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`overflow-hidden bg-dark-osc  border border-gray-700/60 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// Componente Gauge mejorado
function ConsumptionGauge({ value, max = 100, label, size = "medium", color = "green" }) {
  const percentage = (value / max) * 100;
  
  const sizeConfig = {
    small: { container: "w-16 h-16", text: "text-lg", label: "text-xs" },
    medium: { container: "w-20 h-20", text: "text-xl", label: "text-xs" },
    large: { container: "w-24 h-24", text: "text-2xl", label: "text-sm" }
  };

  const colorConfig = {
    green: "border-green-400 text-green-400",
    blue: "border-blue-400 text-blue-400", 
    yellow: "border-yellow-400 text-yellow-400",
    purple: "border-purple-400 text-purple-400"
  };

  const config = sizeConfig[size];

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className={`relative ${config.container}`}>
        {/* Fondo del gauge */}
        <div className="absolute inset-0 rounded-full bg-gray-700"></div>
        
        {/* Indicador de progreso */}
        <div 
          className={`absolute inset-1 rounded-full border-4 ${colorConfig[color]}`}
          style={{
            clipPath: `polygon(0 0, 100% 0, 100% ${100 - percentage}%, 0 ${100 - percentage}%)`
          }}
        ></div>
        
        {/* Contenido central */}
        <div className="absolute inset-2 rounded-full bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className={`font-bold ${config.text} ${colorConfig[color]}`}>
              {value}
            </div>
          </div>
        </div>
      </div>
      <div className={`text-white mt-1 ${config.label}`}>{label}</div>
      <div className="text-xs text-gray-500">{percentage.toFixed(0)}%</div>
    </div>
  );
}

// Generar datos históricos
const generateHistoricalData = (deviceNumber, type = "daily") => {
  if (type === "daily") {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}h`);
    return hours.map(hour => ({
      time: hour,
      consumption: Math.floor(Math.random() * 40) + 30 + (deviceNumber * 15),
      cost: Math.random() * 30 + 15
    }));
  } else {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months.map(month => ({
      month,
      consumption: Math.floor(Math.random() * 1000) + 500 + (deviceNumber * 300),
      cost: Math.random() * 200 + 100
    }));
  }
};

// Simulación de datos para dispositivos
const generateDeviceData = (deviceNumber: number) => {
  const baseConsumption = Math.floor(Math.random() * 50) + 30;
  
  return {
    "_id": { "$oid": `68f7ed8b903aff68bc911a3${deviceNumber}` },
    "time": new Date().toISOString(),
    "deviceInfo": {
      "deviceName": `Medidor ${deviceNumber}`,
      "devEui": `8e564ec4ac0fcec${deviceNumber}`,
      "location": `Área ${deviceNumber}`
    },
    "object": {
      "agg_activePower": baseConsumption,
      "phaseA_activePower": Math.floor(baseConsumption * 0.35),
      "phaseB_activePower": Math.floor(baseConsumption * 0.40),
      "phaseC_activePower": Math.floor(baseConsumption * 0.25),
      "phaseA_reactiveEnergy": 2240 + deviceNumber * 100,
      "phaseB_reactiveEnergy": 2180 + deviceNumber * 100,
      "phaseC_voltage": 229.86 + deviceNumber * 0.5,
      "agg_voltage": 231.32 + deviceNumber * 0.3,
      "agg_activeEnergy": 13527810 + deviceNumber * 100000,
      "phaseA_powerFactor": 0.76 + deviceNumber * 0.05,
      "phaseA_apparentEnergy": 4433060 + deviceNumber * 50000,
      "phaseB_apparentPower": 2974 + deviceNumber * 50,
      "phaseB_current": 12.81 + deviceNumber * 0.5,
      "phaseB_activeEnergy": 4295650 + deviceNumber * 80000,
      "agg_current": 34.07 + deviceNumber * 2,
      "phaseA_reactivePower": 659 + deviceNumber * 20,
      "agg_reactivePower": 1602 + deviceNumber * 100,
      "phaseC_activeEnergy": 5456910 + deviceNumber * 120000,
      "agg_apparentPower": 7881 + deviceNumber * 200,
      "phaseB_apparentEnergy": 4904480 + deviceNumber * 60000,
      "phaseA_thdI": 67.06 - deviceNumber * 10,
      "phaseC_reactiveEnergy": 1450 + deviceNumber * 80,
      "phaseA_current": 9.64 + deviceNumber * 0.3,
      "phaseC_apparentEnergy": 5776420 + deviceNumber * 70000,
      "phaseC_thdI": 24.28 - deviceNumber * 5,
      "agg_frequency": 50,
      "phaseC_apparentPower": 2672 + deviceNumber * 60,
      "phaseB_powerFactor": 0.95,
      "agg_apparentEnergy": 15113960 + deviceNumber * 150000,
      "phaseA_apparentPower": 2235 + deviceNumber * 40,
      "phaseC_reactivePower": 367 + deviceNumber * 15,
      "phaseB_thdU": 1.54,
      "phaseC_powerFactor": 0.96,
      "phaseC_current": 11.62 + deviceNumber * 0.4,
      "phaseC_thdU": 1.45,
      "phaseA_thdU": 1.41,
      "agg_thdI": 0,
      "agg_powerFactor": 0.9 - deviceNumber * 0.02,
      "phaseA_activeEnergy": 3775250 + deviceNumber * 90000,
      "phaseB_voltage": 232.11 + deviceNumber * 0.4,
      "agg_reactiveEnergy": 5870 + deviceNumber * 200,
      "phaseA_voltage": 231.71 + deviceNumber * 0.6,
      "phaseB_thdI": 26.37 - deviceNumber * 8,
      "phaseB_reactivePower": 575 + deviceNumber * 25
    },
    "historicalData": {
      daily: generateHistoricalData(deviceNumber, "daily"),
      monthly: generateHistoricalData(deviceNumber, "monthly")
    },
    "dailyConsumption": baseConsumption + Math.floor(Math.random() * 20)
  };
};

// Componente para cada sensor/columna
function SensorColumn({ device, index }) {
  const [activeChart, setActiveChart] = useState('voltage');
  const [timeRange, setTimeRange] = useState('daily');
  const [activeVariable, setActiveVariable] = useState('consumption');

  const colors = ['blue', 'green', 'purple', 'yellow', 'red'];
  const currentColor = colors[index % colors.length];

  // Configuración común de Chart.js optimizada
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ccc',
          font: { size: 9 }
        }
      },
    },
    scales: {
      x: {
        grid: { color: '#374151' },
        ticks: { 
          color: '#9CA3AF', 
          font: { size: 8 },
          maxRotation: 45
        }
      },
      y: {
        grid: { color: '#374151' },
        ticks: { 
          color: '#9CA3AF', 
          font: { size: 8 }
        }
      }
    }
  };

  // Variables disponibles para gráficos
  const availableVariables = [
    { id: 'consumption', label: 'Consumo', unit: 'kW' },
    { id: 'voltage', label: 'Voltaje', unit: 'V' },
    { id: 'current', label: 'Corriente', unit: 'A' },
    { id: 'power', label: 'Potencia', unit: 'kW' },
    { id: 'energy', label: 'Energía', unit: 'kWh' },
    { id: 'frequency', label: 'Frecuencia', unit: 'Hz' },
    { id: 'powerFactor', label: 'Factor P.', unit: '%' },
    { id: 'thd', label: 'THD', unit: '%' }
  ];

  // Datos para gráfico principal con variables dinámicas
  const getChartData = () => {
    const data = timeRange === 'daily' ? device.historicalData.daily : device.historicalData.monthly;
    const labels = timeRange === 'daily' ? data.map(d => d.time) : data.map(d => d.month);
    
    return {
      labels,
      datasets: [{
        label: `${availableVariables.find(v => v.id === activeVariable)?.label} (${availableVariables.find(v => v.id === activeVariable)?.unit})`,
        data: data.map(d => {
          // Simular datos diferentes para cada variable
          const baseValue = d.consumption;
          switch(activeVariable) {
            case 'voltage': return baseValue * 0.5 + 200;
            case 'current': return baseValue * 0.3 + 10;
            case 'power': return baseValue;
            case 'energy': return baseValue * 24;
            case 'frequency': return 50 + (Math.random() * 0.5 - 0.25);
            case 'powerFactor': return 85 + (Math.random() * 10);
            case 'thd': return 5 + (Math.random() * 15);
            default: return baseValue;
          }
        }),
        borderColor: `rgb(${index * 60 + 59}, ${index * 80 + 130}, ${index * 40 + 246})`,
        backgroundColor: `rgba(${index * 60 + 59}, ${index * 80 + 130}, ${index * 40 + 246}, 0.1)`,
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    };
  };

  // Datos para gráficos de fases
  const phaseData = {
    labels: ['Fase A', 'Fase B', 'Fase C'],
    datasets: [{
      label: activeChart === 'voltage' ? 'Voltaje (V)' : 
             activeChart === 'current' ? 'Corriente (A)' : 'Potencia (kW)',
      data: activeChart === 'voltage' ? [
        device.object.phaseA_voltage,
        device.object.phaseB_voltage,
        device.object.phaseC_voltage
      ] : activeChart === 'current' ? [
        device.object.phaseA_current,
        device.object.phaseB_current,
        device.object.phaseC_current
      ] : [
        device.object.phaseA_activePower,
        device.object.phaseB_activePower,
        device.object.phaseC_activePower
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(168, 85, 247, 0.8)'
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(234, 179, 8)',
        'rgb(168, 85, 247)'
      ],
      borderWidth: 1,
    }]
  };

  return (
    <div className="h-full flex flex-col gap-1">
      {/* Header compacto del Sensor */}
      <Card className="h-12">
        <div className="p-2 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full bg-${currentColor}-500`}></div>
              <h3 className="text-sm font-semibold text-white">{device.deviceInfo.deviceName}</h3>
            </div>
            <div className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
              {device.deviceInfo.location}
            </div>
          </div>
        </div>
      </Card>

      {/* Gauges de Consumo - Compactos */}
      <Card className="h-32">
        <div className="p-2 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Gauge Principal */}
            <ConsumptionGauge 
              value={device.object.agg_activePower}
              max={100}
              label="Total"
              size="medium"
              color={currentColor}
            />
            
            {/* Gauges de Fases */}
            <ConsumptionGauge 
              value={device.object.phaseA_activePower}
              max={50}
              label="Fase A"
              size="small"
              color="green"
            />
            
            <ConsumptionGauge 
              value={device.object.phaseB_activePower}
              max={50}
              label="Fase B" 
              size="small"
              color="yellow"
            />
            
            <ConsumptionGauge 
              value={device.object.phaseC_activePower}
              max={50}
              label="Fase C"
              size="small"
              color="purple"
            />
          </div>
        </div>
      </Card>

      {/* Métricas Rápidas - Compactas */}
      <Card className="h-20">
        <div className="p-2 h-full">
          <div className="grid grid-cols-4 gap-1 h-full text-xs">
            <div className="bg-gray-700 rounded p-1 flex flex-col items-center justify-center">
              <div className="text-gray-400">Voltaje</div>
              <div className="text-white font-medium">{device.object.agg_voltage}V</div>
            </div>
            <div className="bg-gray-700 rounded p-1 flex flex-col items-center justify-center">
              <div className="text-gray-400">Corriente</div>
              <div className="text-white font-medium">{device.object.agg_current}A</div>
            </div>
            <div className="bg-gray-700 rounded p-1 flex flex-col items-center justify-center">
              <div className="text-gray-400">Frec.</div>
              <div className="text-white font-medium">{device.object.agg_frequency}Hz</div>
            </div>
            <div className="bg-gray-700 rounded p-1 flex flex-col items-center justify-center">
              <div className="text-gray-400">F. P.</div>
              <div className="text-white font-medium">{(device.object.agg_powerFactor * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Gráfico de Fases - Compacto */}
      <Card className="h-40">
        <div className="p-2 h-full flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-xs font-medium text-white">Distribución por Fases</h4>
            <div className="flex gap-1">
              {['voltage', 'current', 'power'].map(type => (
                <button
                  key={type}
                  onClick={() => setActiveChart(type)}
                  className={`text-xs px-2 py-1 rounded ${
                    activeChart === type 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {type === 'voltage' ? 'V' : type === 'current' ? 'A' : 'kW'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <Bar 
              data={phaseData} 
              options={{
                ...chartOptions,
                plugins: { legend: { display: false } }
              }} 
            />
          </div>
        </div>
      </Card>

      {/* Gráfico Principal con Variables - Más espacio */}
      <Card className="h-48">
        <div className="p-2 h-full flex flex-col">
          {/* Controles de tiempo y variables */}
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-medium text-white">Historial</h4>
            <div className="flex gap-1">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
              >
                <option value="daily">Hoy</option>
                <option value="monthly">Este Mes</option>
              </select>
            </div>
          </div>
          
          {/* Selector de variables */}
          <div className="flex gap-1 mb-2 overflow-x-auto">
            {availableVariables.map(variable => (
              <button
                key={variable.id}
                onClick={() => setActiveVariable(variable.id)}
                className={`flex-shrink-0 text-xs px-2 py-1 rounded whitespace-nowrap ${
                  activeVariable === variable.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {variable.label}
              </button>
            ))}
          </div>
          
          {/* Gráfico principal */}
          <div className="flex-1">
            <Line 
              data={getChartData()} 
              options={chartOptions} 
            />
          </div>
        </div>
      </Card>

      {/* Calidad de Energía - Compacta */}
      <Card className="h-24">
        <div className="p-2 h-full">
          <h4 className="text-xs font-medium text-white mb-1">Calidad de Energía</h4>
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="text-center">
              <div className="text-gray-400">THD A</div>
              <div className="text-yellow-400 font-medium">{device.object.phaseA_thdI}%</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">THD B</div>
              <div className="text-yellow-400 font-medium">{device.object.phaseB_thdI}%</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">THD C</div>
              <div className="text-yellow-400 font-medium">{device.object.phaseC_thdI}%</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export const Energia = () => {
  const [showSensitive, setShowSensitive] = useState(false);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    // Simular carga de dispositivos - cambia el número aquí
    const numberOfDevices = 2;
    const deviceData = Array.from({ length: numberOfDevices }, (_, i) => generateDeviceData(i + 1));
    setDevices(deviceData);
  }, []);

  const columnWidth = devices.length > 0 ? `${100 / devices.length}%` : '100%';

  if (devices.length === 0) {
    return <div className="flex items-center justify-center h-screen text-white">Cargando dispositivos...</div>;
  }

  return (
    <main className="flex-1 h-screen overflow-hidden p-2 bg-gray-dark">
      <div className="flex flex-col h-full gap-2">
        {/* Header */}
        <div className="h-16 flex gap-2">
          <Card className="w-64 flex items-center px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-yellow-500" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Monitor Energía</h1>
                <p className="text-xs text-gray-400">{devices.length} Dispositivos</p>
              </div>
            </div>
          </Card>
          
          <Card className="flex-1 flex items-center px-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-green-500/20">
                    <Power className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Potencia Total</p>
                    <p className="text-sm font-medium text-white">
                      {devices.reduce((sum, device) => sum + device.object.agg_activePower, 0)} kW
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-blue-500/20">
                    <Battery className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Energía Total</p>
                    <p className="text-sm font-medium text-white">
                      {(devices.reduce((sum, device) => sum + device.object.agg_activeEnergy, 0) / 1000).toFixed(0)} kWh
                    </p>
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
                <div className="flex items-center gap-1 text-xs text-gray-300">
                  <Clock className="w-4 h-4" />
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contenedor principal de columnas */}
        <div className="flex-1 flex gap-2 overflow-x-auto">
          {devices.map((device, index) => (
            <div 
              key={device.deviceInfo.devEui}
              style={{ width: columnWidth, minWidth: '380px' }}
              className="h-full"
            >
              <SensorColumn device={device} index={index} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};