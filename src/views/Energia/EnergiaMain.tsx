import { useState, useEffect } from "react";
import { 
  Clock, Eye, EyeOff, Settings, Zap, Gauge, 
  Thermometer, Cpu, Battery, Power, FileText,
  BarChart3, Activity, AlertTriangle, Info,
  ArrowLeft, Download, Filter
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
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';

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
    <div className={`overflow-hidden bg-dark-osc border border-gray-700/40 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// Componente Gauge
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
    purple: "border-purple-400 text-purple-400",
    red: "border-red-400 text-red-400"
  };

  const config = sizeConfig[size];

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className={`relative ${config.container}`}>
        <div className="absolute inset-0 rounded-full bg-gray-700"></div>
        <div 
          className={`absolute inset-1 rounded-full border-4 ${colorConfig[color]}`}
          style={{
            clipPath: `polygon(0 0, 100% 0, 100% ${100 - percentage}%, 0 ${100 - percentage}%)`
          }}
        ></div>
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

// Generar datos históricos detallados
const generateHistoricalData = (deviceNumber, type = "daily") => {
  const baseData = {
    consumption: [],
    voltage: [],
    current: [],
    power: [],
    powerFactor: [],
    frequency: [],
    thd: [],
    reactivePower: [],
    apparentPower: []
  };

  if (type === "daily") {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}h`);
    baseData.consumption = hours.map(hour => ({
      time: hour,
      value: Math.floor(Math.random() * 40) + 30 + (deviceNumber * 15)
    }));
    baseData.voltage = hours.map(hour => ({
      time: hour,
      value: 230 + (Math.random() * 10 - 5) + (deviceNumber * 0.5)
    }));
    baseData.current = hours.map(hour => ({
      time: hour,
      value: 10 + (Math.random() * 8 - 4) + (deviceNumber * 1)
    }));
    baseData.power = hours.map(hour => ({
      time: hour,
      value: Math.floor(Math.random() * 40) + 30 + (deviceNumber * 15)
    }));
    baseData.powerFactor = hours.map(hour => ({
      time: hour,
      value: 85 + (Math.random() * 10 - 5) + (deviceNumber * 2)
    }));
    baseData.frequency = hours.map(hour => ({
      time: hour,
      value: 50 + (Math.random() * 0.4 - 0.2)
    }));
    baseData.thd = hours.map(hour => ({
      time: hour,
      value: 5 + (Math.random() * 15) + (deviceNumber * 2)
    }));
    baseData.reactivePower = hours.map(hour => ({
      time: hour,
      value: Math.floor(Math.random() * 20) + 10 + (deviceNumber * 5)
    }));
    baseData.apparentPower = hours.map(hour => ({
      time: hour,
      value: Math.floor(Math.random() * 50) + 40 + (deviceNumber * 10)
    }));
  } else {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    baseData.consumption = months.map(month => ({
      month,
      value: Math.floor(Math.random() * 1000) + 500 + (deviceNumber * 300)
    }));
    baseData.voltage = months.map(month => ({
      month,
      value: 230 + (Math.random() * 8 - 4) + (deviceNumber * 0.3)
    }));
    // ... similar para otras variables
  }

  return baseData;
};

// Simulación de datos completos para dispositivos
const generateDeviceData = (deviceNumber: number) => {
  const baseConsumption = Math.floor(Math.random() * 50) + 30;
  
  return {
    "_id": { "$oid": `68f7ed8b903aff68bc911a3${deviceNumber}` },
    "time": new Date().toISOString(),
    "deviceInfo": {
      "deviceName": `Medidor ${deviceNumber}`,
      "devEui": `8e564ec4ac0fcec${deviceNumber}`,
      "location": `Área ${deviceNumber}`,
      "applicationName": "Monitor-energia-jsy",
      "deviceProfileName": "Monitor_energia_jsy"
    },
    "object": {
      // Potencias
      "agg_activePower": baseConsumption,
      "phaseA_activePower": Math.floor(baseConsumption * 0.35),
      "phaseB_activePower": Math.floor(baseConsumption * 0.40),
      "phaseC_activePower": Math.floor(baseConsumption * 0.25),
      "agg_reactivePower": 1602 + deviceNumber * 100,
      "phaseA_reactivePower": 659 + deviceNumber * 20,
      "phaseB_reactivePower": 575 + deviceNumber * 25,
      "phaseC_reactivePower": 367 + deviceNumber * 15,
      "agg_apparentPower": 7881 + deviceNumber * 200,
      "phaseA_apparentPower": 2235 + deviceNumber * 40,
      "phaseB_apparentPower": 2974 + deviceNumber * 50,
      "phaseC_apparentPower": 2672 + deviceNumber * 60,
      
      // Voltajes
      "agg_voltage": 231.32 + deviceNumber * 0.3,
      "phaseA_voltage": 231.71 + deviceNumber * 0.6,
      "phaseB_voltage": 232.11 + deviceNumber * 0.4,
      "phaseC_voltage": 229.86 + deviceNumber * 0.5,
      
      // Corrientes
      "agg_current": 34.07 + deviceNumber * 2,
      "phaseA_current": 9.64 + deviceNumber * 0.3,
      "phaseB_current": 12.81 + deviceNumber * 0.5,
      "phaseC_current": 11.62 + deviceNumber * 0.4,
      
      // Energías
      "agg_activeEnergy": 13527810 + deviceNumber * 100000,
      "phaseA_activeEnergy": 3775250 + deviceNumber * 90000,
      "phaseB_activeEnergy": 4295650 + deviceNumber * 80000,
      "phaseC_activeEnergy": 5456910 + deviceNumber * 120000,
      "agg_reactiveEnergy": 5870 + deviceNumber * 200,
      "phaseA_reactiveEnergy": 2240 + deviceNumber * 100,
      "phaseB_reactiveEnergy": 2180 + deviceNumber * 100,
      "phaseC_reactiveEnergy": 1450 + deviceNumber * 80,
      "agg_apparentEnergy": 15113960 + deviceNumber * 150000,
      "phaseA_apparentEnergy": 4433060 + deviceNumber * 50000,
      "phaseB_apparentEnergy": 4904480 + deviceNumber * 60000,
      "phaseC_apparentEnergy": 5776420 + deviceNumber * 70000,
      
      // Calidad de Energía
      "agg_powerFactor": 0.9 - deviceNumber * 0.02,
      "phaseA_powerFactor": 0.76 + deviceNumber * 0.05,
      "phaseB_powerFactor": 0.95,
      "phaseC_powerFactor": 0.96,
      "agg_frequency": 50,
      "agg_thdI": 0,
      "phaseA_thdI": 67.06 - deviceNumber * 10,
      "phaseB_thdI": 26.37 - deviceNumber * 8,
      "phaseC_thdI": 24.28 - deviceNumber * 5,
      "phaseA_thdU": 1.41,
      "phaseB_thdU": 1.54,
      "phaseC_thdU": 1.45,
      
      // Información del dispositivo
      "model": 819,
      "address": deviceNumber
    },
    "historicalData": {
      daily: generateHistoricalData(deviceNumber, "daily"),
      monthly: generateHistoricalData(deviceNumber, "monthly")
    },
    "dailyConsumption": baseConsumption + Math.floor(Math.random() * 20),
    "alerts": [
      {
        id: 1,
        type: "warning",
        message: `THD Fase A elevado: ${67.06 - deviceNumber * 10}%`,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: 2,
        type: "info", 
        message: "Consumo estable",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      }
    ]
  };
};

// VISTA RESUMEN (Compacta)
function SummaryView({ device, index, onViewDetails }) {
  const [timeRange, setTimeRange] = useState('daily');
  const [activeVariable, setActiveVariable] = useState('consumption');

  const colors = ['blue', 'green', 'purple', 'yellow', 'red'];
  const currentColor = colors[index % colors.length];

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

  const availableVariables = [
    { id: 'consumption', label: 'Consumo', unit: 'kW', color: 'rgb(34, 197, 94)' },
    { id: 'voltage', label: 'Voltaje', unit: 'V', color: 'rgb(59, 130, 246)' },
    { id: 'current', label: 'Corriente', unit: 'A', color: 'rgb(239, 68, 68)' }
  ];

  const tripleColumnData = {
    labels: ['Fase A', 'Fase B', 'Fase C'],
    datasets: [
      {
        label: 'Voltaje (V)',
        data: [
          device.object.phaseA_voltage,
          device.object.phaseB_voltage,
          device.object.phaseC_voltage
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Corriente (A)',
        data: [
          device.object.phaseA_current,
          device.object.phaseB_current,
          device.object.phaseC_current
        ],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
      {
        label: 'Potencia (kW)',
        data: [
          device.object.phaseA_activePower,
          device.object.phaseB_activePower,
          device.object.phaseC_activePower
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      }
    ]
  };

  const getHistoricalChartData = () => {
    const data = device.historicalData[timeRange];
    const labels = timeRange === 'daily' 
      ? data.consumption.map(d => d.time) 
      : data.consumption.map(d => d.month);
    
    const selectedData = data[activeVariable];
    
    return {
      labels,
      datasets: [{
        label: `${availableVariables.find(v => v.id === activeVariable)?.label} (${availableVariables.find(v => v.id === activeVariable)?.unit})`,
        data: selectedData.map(d => d.value),
        borderColor: availableVariables.find(v => v.id === activeVariable)?.color,
        backgroundColor: availableVariables.find(v => v.id === activeVariable)?.color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    };
  };

  return (
    <div className="h-full flex flex-col gap-1">
      {/* Header compacto con botón de detalles */}
      <Card className="h-12">
        <div className="p-2 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full bg-${currentColor}-500`}></div>
              <h3 className="text-sm font-semibold text-white">{device.deviceInfo.deviceName}</h3>
            </div>
            <button 
              onClick={onViewDetails}
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      </Card>

      {/* Gauges de Consumo */}
      <Card className="h-32">
        <div className="p-2 h-full">
          <div className="flex justify-between items-center h-full">
            <ConsumptionGauge 
              value={device.object.agg_activePower}
              max={100}
              label="Total"
              size="medium"
              color={currentColor}
            />
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

      {/* Métricas Rápidas */}
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

      {/* Distribución por Fases */}
      <Card className="h-48">
        <div className="p-2 h-full flex flex-col">
          <h4 className="text-xs font-medium text-white mb-2">Distribución por Fases</h4>
          <div className="flex-1">
            <Bar 
              data={tripleColumnData} 
              options={chartOptions} 
            />
          </div>
        </div>
      </Card>

      {/* Calidad de Energía */}
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

      {/* Historial */}
      <Card className="h-52">
        <div className="p-2 h-full flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-medium text-white">Historial</h4>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
            >
              <option value="daily">Hoy</option>
              <option value="monthly">Este Mes</option>
            </select>
          </div>
          <div className="flex gap-1 mb-2 overflow-x-auto pb-1">
            {availableVariables.map(variable => (
              <button
                key={variable.id}
                onClick={() => setActiveVariable(variable.id)}
                className={`flex-shrink-0 text-xs px-3 py-1 rounded whitespace-nowrap ${
                  activeVariable === variable.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {variable.label}
              </button>
            ))}
          </div>
          <div className="flex-1">
            <Line 
              data={getHistoricalChartData()} 
              options={chartOptions} 
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

// VISTA DETALLADA
function DetailedView({ device, index, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('daily');

  const colors = ['blue', 'green', 'purple', 'yellow', 'red'];
  const currentColor = colors[index % colors.length];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ccc',
          font: { size: 11 }
        }
      },
    },
    scales: {
      x: {
        grid: { color: '#374151' },
        ticks: { 
          color: '#9CA3AF', 
          font: { size: 10 }
        }
      },
      y: {
        grid: { color: '#374151' },
        ticks: { 
          color: '#9CA3AF', 
          font: { size: 10 }
        }
      }
    }
  };

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'power', label: 'Potencia', icon: <Zap className="w-4 h-4" /> },
    { id: 'energy', label: 'Energía', icon: <Battery className="w-4 h-4" /> },
    { id: 'quality', label: 'Calidad', icon: <Activity className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alertas', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'info', label: 'Información', icon: <Info className="w-4 h-4" /> }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-white mb-3">Distribución de Potencia</h4>
                  <div className="h-48">
                    <Doughnut
                      data={{
                        labels: ['Activa', 'Reactiva', 'Aparente'],
                        datasets: [{
                          data: [
                            device.object.agg_activePower,
                            device.object.agg_reactivePower,
                            device.object.agg_apparentPower
                          ],
                          backgroundColor: [
                            'rgba(34, 197, 94, 0.8)',
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(168, 85, 247, 0.8)'
                          ]
                        }]
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-white mb-3">Balance por Fases</h4>
                  <div className="h-48">
                    <Bar
                      data={{
                        labels: ['Fase A', 'Fase B', 'Fase C'],
                        datasets: [
                          {
                            label: 'Potencia (kW)',
                            data: [
                              device.object.phaseA_activePower,
                              device.object.phaseB_activePower,
                              device.object.phaseC_activePower
                            ],
                            backgroundColor: 'rgba(34, 197, 94, 0.8)'
                          }
                        ]
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'power':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-white mb-2">Potencia Activa</h4>
                  <div className="text-2xl font-bold text-green-400">{device.object.agg_activePower} kW</div>
                  <div className="text-xs text-gray-400 mt-1">Total</div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-white mb-2">Potencia Reactiva</h4>
                  <div className="text-2xl font-bold text-blue-400">{device.object.agg_reactivePower} kVAR</div>
                  <div className="text-xs text-gray-400 mt-1">Total</div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-white mb-2">Potencia Aparente</h4>
                  <div className="text-2xl font-bold text-purple-400">{device.object.agg_apparentPower} kVA</div>
                  <div className="text-xs text-gray-400 mt-1">Total</div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'energy':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-white mb-3">Energía Activa Acumulada</h4>
                  <div className="text-3xl font-bold text-green-400">
                    {(device.object.agg_activeEnergy / 1000).toLocaleString()} kWh
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                    <div className="text-center">
                      <div className="text-gray-400">Fase A</div>
                      <div className="text-white">{(device.object.phaseA_activeEnergy / 1000).toLocaleString()} kWh</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Fase B</div>
                      <div className="text-white">{(device.object.phaseB_activeEnergy / 1000).toLocaleString()} kWh</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Fase C</div>
                      <div className="text-white">{(device.object.phaseC_activeEnergy / 1000).toLocaleString()} kWh</div>
                    </div>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-white mb-3">Energía Reactiva Acumulada</h4>
                  <div className="text-3xl font-bold text-blue-400">
                    {device.object.agg_reactiveEnergy.toLocaleString()} kVARh
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'quality':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-white mb-3">Factor de Potencia</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">
                      {(device.object.agg_powerFactor * 100).toFixed(1)}%
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                      <div className="text-center">
                        <div className="text-gray-400">Fase A</div>
                        <div className="text-white">{(device.object.phaseA_powerFactor * 100).toFixed(1)}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400">Fase B</div>
                        <div className="text-white">{(device.object.phaseB_powerFactor * 100).toFixed(1)}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400">Fase C</div>
                        <div className="text-white">{(device.object.phaseC_powerFactor * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-white mb-3">THD por Fases</h4>
                  <div className="h-48">
                    <Bar
                      data={{
                        labels: ['Fase A', 'Fase B', 'Fase C'],
                        datasets: [{
                          label: 'THD (%)',
                          data: [
                            device.object.phaseA_thdI,
                            device.object.phaseB_thdI,
                            device.object.phaseC_thdI
                          ],
                          backgroundColor: 'rgba(234, 179, 8, 0.8)'
                        }]
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'alerts':
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Alertas y Eventos</h3>
            {device.alerts.map(alert => (
              <Card key={alert.id}>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="text-white">{alert.message}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 'info':
        return (
          <div className="space-y-4">
            <Card>
              <div className="p-4">
                <h4 className="text-sm font-medium text-white mb-3">Información del Dispositivo</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Nombre</div>
                    <div className="text-white">{device.deviceInfo.deviceName}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">DevEUI</div>
                    <div className="text-white">{device.deviceInfo.devEui}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Ubicación</div>
                    <div className="text-white">{device.deviceInfo.location}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Aplicación</div>
                    <div className="text-white">{device.deviceInfo.applicationName}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Modelo</div>
                    <div className="text-white">{device.object.model}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Dirección</div>
                    <div className="text-white">{device.object.address}</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header de vista detallada */}
      <Card className="mb-2">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={onBack}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-white">{device.deviceInfo.deviceName}</h2>
                <p className="text-sm text-gray-400">{device.deviceInfo.location} • {device.deviceInfo.devEui}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm">Exportar</span>
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Pestañas de vista detallada */}
      <Card className="flex-1">
        <div className="flex flex-col h-full">
          <div className="flex border-b border-gray-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-white border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-auto">
            {renderTabContent()}
          </div>
        </div>
      </Card>
    </div>
  );
}

// COMPONENTE PRINCIPAL
export const Energia = () => {
  const [showSensitive, setShowSensitive] = useState(false);
  const [devices, setDevices] = useState([]);
  const [detailedView, setDetailedView] = useState(null);

  useEffect(() => {
    const numberOfDevices = 1;
    const deviceData = Array.from({ length: numberOfDevices }, (_, i) => generateDeviceData(i + 1));
    setDevices(deviceData);
  }, []);

  const columnWidth = devices.length > 0 ? `${100 / devices.length}%` : '100%';

  if (devices.length === 0) {
    return <div className="flex items-center justify-center h-screen text-white">Cargando dispositivos...</div>;
  }

  // Si estamos en vista detallada, mostrar solo ese dispositivo
  if (detailedView !== null) {
    return (
      <DetailedView 
        device={devices[detailedView]} 
        index={detailedView}
        onBack={() => setDetailedView(null)}
      />
    );
  }

  // Vista resumen (múltiples dispositivos)
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
              style={{ width: columnWidth, minWidth: '400px' }}
              className="h-full"
            >
              <SummaryView 
                device={device} 
                index={index}
                onViewDetails={() => setDetailedView(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};