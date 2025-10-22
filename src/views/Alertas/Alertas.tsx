
import Chart from "react-apexcharts";
import { CardProps } from "../../assets/types/Alertas";
function Card({ children }: CardProps) {
  return (
    <div className="flex-1 h-full overflow-hidden bg-gray-darkL rounded-lg border border-gray-700 shadow-sm">
      {children}
    </div>
  );
}

export const Alertas = () => {
  // Configuración común mejorada para los gráficos
  const chartOptions = {
    chart: {
      type: 'line',
      height: '100%',
      background: 'transparent',
      foreColor: '#E5E7EB', // Texto más claro
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      dropShadow: {
        enabled: true,
        top: 2,
        left: 2,
        blur: 4,
        opacity: 0.15
      }
    },
    theme: {
      mode: 'dark',
      palette: 'palette1'
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 4,
      padding: {
        top: 20,
        right: 15,
        bottom: 5,
        left: 15
      },
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      lineCap: 'round'
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'inherit'
      },
      x: {
        format: 'dd MMM yyyy'
      },
      marker: {
        show: true,
      },
      fixed: {
        enabled: true,
        position: 'topRight',
        offsetX: 0,
        offsetY: 0,
      }
    },
    legend: {
      position: 'top' as 'top' | 'right' | 'bottom' | 'left',
      horizontalAlign: 'right',
      fontSize: '12px',
      itemMargin: {
        horizontal: 10,
        vertical: 5
      },
      markers: {
        radius: 4,
        width: 12,
        height: 12
      },
      labels: {
        colors: '#F3F4F6',
        useSeriesColors: false
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 5,
      strokeWidth: 2,
      strokeColors: ['#1F2937'],
      hover: {
        size: 7
      }
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '11px',
          fontFamily: 'inherit'
        }
      },
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '11px',
          fontFamily: 'inherit'
        },
        offsetX: -10
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '70%',
        dataLabels: {
          position: 'top'
        }
      },
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '14px',
              fontFamily: 'inherit',
              fontWeight: 600,
              color: '#F3F4F6'
            }
          }
        }
      }
    },
    fill: {
      opacity: 0.9,
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: undefined,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '50%'
          }
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  // Paleta de colores mejorada con tonos más profesionales
  const colors = [
    '#FF6B6B', // Rojo coral
    '#4ECDC4', // Turquesa suave
    '#45B7D1', // Azul cielo
    '#A37EBA', // Lila
    '#FFA07A', // Salmón
    '#98D8C8', // Verde menta
    '#F9C74F', // Amarillo mostaza
    '#90BE6D', // Verde pistacho
    '#577590'  // Azul acero
  ];

  // Función para crear datos de gráficos con estilo mejorado
  interface CustomOptions {
    stroke?: object;
    markers?: object;
    [key: string]: any; // Allow additional properties
  }

  const createChartData = (title:string, colorIndex:number, categories: string[], data:number[], type = 'line', customOptions: CustomOptions = {}) => {
    const color = colors[colorIndex % colors.length];
    
    const gradientFill = type === 'area' ? {
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: [color],
          inverseColors: false,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100]
        }
      }
    } : {};
    
    return {
      series: [{
        name: title,
        data,
        color
      }],
      options: {
        ...chartOptions,
        ...customOptions,
        chart: { 
          ...chartOptions.chart, 
          type: type as "line" | "area" | "bar" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "boxPlot" | "radar" | "polarArea" | "rangeBar" | "rangeArea" | "treemap",
          sparkline: {
            enabled: false
          }
        },
        colors: [color],
        xaxis: { 
          ...chartOptions.xaxis,
          categories 
        },
        title: {
          text: title,
          align: 'left',
          margin: 10,
          offsetX: 15,
          offsetY: 10,
          floating: false,
          style: {
            color: '#F3F4F6',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'inherit'
          }
        },
        ...gradientFill,
        stroke: {
          ...chartOptions.stroke,
          ...(type === 'bar' ? { width: 0 } : {}), // Eliminar bordes en barras
          ...(customOptions.stroke || {})
        },
        markers: {
          ...chartOptions.markers,
          ...(customOptions.markers || {})
        }
      }
    };
  };

  // Datos para los gráficos con nuevo estilo
  const charts = [
    createChartData('Producción Mensual', 0, ['Ene', 'Feb', 'Mar', 'Abr', 'May'], [450, 520, 480, 610, 580], 'line', {
      stroke: { width: 3 },
      markers: { 
        size: 6,
        strokeColors: '#1F2937',
        hover: { size: 8 }
      }
    }),
    createChartData('Temperatura Agua', 1, ['Sem1', 'Sem2', 'Sem3', 'Sem4'], [12.5, 13.2, 14.1, 13.8], 'line', {
      stroke: { width: 3 },
      markers: { 
        size: 6,
        strokeColors: '#1F2937',
        hover: { size: 8 }
      },
      yaxis: {
        labels: {
          formatter: function(val:number) {
            return val.toFixed(1) + "°C";
          }
        }
      }
    }),
    createChartData('Niveles Oxígeno', 2, ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'], [6.8, 7.1, 6.9, 7.2, 6.7], 'area', {
      stroke: { width: 2 },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: [colors[2]],
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0.2,
          stops: [0, 90, 100]
        }
      },
      yaxis: {
        labels: {
          formatter: function(val:number) {
            return val.toFixed(1) + " mg/L";
          }
        }
      }
    }),
    createChartData('Salinidad por Zona', 3, ['Zona 1', 'Zona 2', 'Zona 3', 'Zona 4'], [30.5, 31.2, 30.8, 31.5], 'bar', {
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '50%',
          distributed: true
        }
      },
      yaxis: {
        labels: {
          formatter: function(val:number) {
            return val.toFixed(1) + " ppt";
          }
        }
      }
    }),
    createChartData('Tasa Mortalidad', 4, ['Mod1', 'Mod2', 'Mod3', 'Mod4'], [2.1, 1.8, 1.5, 1.9], 'line', {
      stroke: { width: 3 },
      markers: { 
        size: 6,
        strokeColors: '#1F2937',
        hover: { size: 8 }
      },
      yaxis: {
        labels: {
          formatter: function(val:number) {
            return val.toFixed(1) + "%";
          }
        }
      }
    }),
    createChartData('Consumo Alimento', 5, ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'], [120, 135, 125, 140, 130], 'area', {
      stroke: { width: 2 },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: [colors[5]],
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0.2,
          stops: [0, 90, 100]
        }
      },
      yaxis: {
        labels: {
          formatter: function(val:number) {
            return val + " kg";
          }
        }
      }
    }),
    createChartData('Crecimiento', 6, ['Sem1', 'Sem2', 'Sem3', 'Sem4'], [45, 68, 92, 115], 'line', {
      stroke: { width: 3 },
      markers: { 
        size: 6,
        strokeColors: '#1F2937',
        hover: { size: 8 }
      },
      yaxis: {
        labels: {
          formatter: function(val:number) {
            return val + " g";
          }
        }
      }
    }),
    createChartData('Niveles pH', 7, ['6:00', '12:00', '18:00', '0:00'], [7.8, 7.9, 7.7, 7.8], 'line', {
      stroke: { width: 3 },
      markers: { 
        size: 6,
        strokeColors: '#1F2937',
        hover: { size: 8 }
      }
    }),
    createChartData('Distrib. Costos', 8, ['Alimento', 'Energía', 'M. Obra', 'Otros'], [1200, 1350, 1100, 800], 'bar', {
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '50%',
          distributed: true
        }
      },
      yaxis: {
        labels: {
          formatter: function(val:number) {
            return "$" + val;
          }
        }
      }
    })
  ];

  return (
    <main className="flex-1 h-screen overflow-hidden p-2 bg-gray-dark">
      <div className="flex flex-col h-full gap-2">
        {/* Sección superior - Información compacta */}
        <div className="h-auto">
          <Card>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-dark/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-white">PUDUGUAPI</h2>
                    <div className="flex gap-4 mt-1">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-400 mr-1">Localización:</span>
                        <span className="text-xs text-gray-300">Puerto Montt</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-400 mr-1">PERIODO</span>
                        <span className="text-xs text-gray-300">2025</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-400 mr-1">Estado:</span>
                        <span className="text-xs text-green-400">Operativo</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-300 flex items-center justify-end">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-300 flex items-center justify-end mt-1">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="h-8 w-px bg-gray-600"></div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
                        <span className="text-xs text-white">AD</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-300">Administrador</p>
                        <p className="text-xs text-gray-400">Nivel: Supervisor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sección de gráficos con nuevo estilo */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          {[0, 3, 6].map((startIdx) => (
            <div key={startIdx} className="flex-1 flex gap-2">
              {charts.slice(startIdx, startIdx + 3).map((chart, idx) => (
                <div key={startIdx + idx} className="flex-1 h-full">
                  <Card>
                    <div className="h-full p-1">
                      <Chart
                        options={chart.options}
                        series={chart.series}
                        type={chart.options.chart.type}
                        height="100%"
                        width="100%"
                      />
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};