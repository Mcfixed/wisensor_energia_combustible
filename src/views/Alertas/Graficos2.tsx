// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";
// import { CardProps } from "../../assets/types/Alertas";

// // Definir tipos específicos para ApexCharts
// type ChartType = 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 
//                 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 
//                 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'treemap';

// type CurveType = 'smooth' | 'straight' | 'stepline' | 'linestep' | 'monotoneCubic';

// // Card reutilizable
// function Card({ children }: CardProps) {
//   return (
//     <div className="flex-1 bg-gray-darkL rounded-lg border border-gray-700 shadow-sm overflow-hidden">
//       {children}
//     </div>
//   );
// }

// export const Graficos1 = () => {
//   // Definir opciones del gráfico con el tipo correcto
//   const chartOptions: ApexOptions = {
//     chart: { 
//       toolbar: { show: false }, 
//       background: "transparent",
//       type: 'line' // tipo por defecto, será sobrescrito
//     },
//     theme: { mode: "dark" as const },
//     dataLabels: { enabled: false },
//     stroke: { curve: "smooth" as CurveType },
//     grid: { borderColor: "#374151" },
//     xaxis: {
//       categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
//       labels: { style: { colors: "#9CA3AF" } }
//     },
//     yaxis: {
//       labels: { style: { colors: "#9CA3AF" } }
//     },
//     tooltip: { theme: "dark" as const }
//   };

//   const chartSeries = [{ name: "Series 1", data: [30, 40, 35, 50, 49, 60] }];

//   // Definir tipos de gráficos permitidos
//   const chartTypes: ChartType[] = ["line", "bar", "area", "donut", "radar", "pie"];

//   return (
//     <main className="flex-1 h-screen overflow-hidden p-2 bg-gray-dark">
//       <div className="flex flex-col h-full gap-2">
//         {/* ... (resto del código JSX permanece igual) ... */}
        
//         {/* Gráficos */}
//         <div className="flex-1 overflow-auto">
//           <div className="grid grid-cols-3 gap-2 p-1 min-h-full">
//             {chartTypes.map((type, i) => (
//               <Card key={i}>
//                 <div className="h-full p-2 flex flex-col">
//                   <h3 className="text-sm text-gray-300 mb-2">Gráfico {i + 1} - {type.toUpperCase()}</h3>
//                   <div className="flex-1">
//                     <Chart
//                       options={{ ...chartOptions, chart: { ...chartOptions.chart, type } }}
//                       series={chartSeries}
//                       type={type}
//                       height="100%"
//                       width="100%"
//                     />
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };