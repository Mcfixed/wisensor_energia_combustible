// import Chart from "react-apexcharts";
// import { CardProps } from "../../assets/types/Alertas";
// /* rojos */
// // Card reutilizable
// function Card({ children }: CardProps) {
//   return (
//     <div className="flex-1 bg-gray-darkL rounded-lg border border-gray-700 shadow-sm overflow-hidden">
//       {children}
//     </div>
//   );
// }


// export const Graficos1 = () => {
//   //const [activeModule, setActiveModule] = useState(null);

//   const chartOptions = {
//     chart: { toolbar: { show: false }, background: "transparent" },
//     theme: { mode: "dark" },
//     dataLabels: { enabled: false },
//     stroke: { curve: "smooth" },
//     grid: { borderColor: "#374151" },
//     xaxis: {
//       categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
//       labels: { style: { colors: "#9CA3AF" } }
//     },
//     yaxis: {
//       labels: { style: { colors: "#9CA3AF" } }
//     },
//     tooltip: { theme: "dark" }
//   };

//   const chartSeries = [{ name: "Series 1", data: [30, 40, 35, 50, 49, 60] }];

//   const chartTypes = ["line", "bar", "area", "donut", "radar", "pie", "heatmap", "scatter", "line"];

//   return (
//     <main className="flex-1 h-screen overflow-hidden p-2 bg-gray-dark">
//       <div className="flex flex-col h-full gap-2">

//         {/* Información de empresa */}
//         <div className="h-1/5">
//           <Card>
//             <div className="flex flex-col h-full p-2">

//               {/* Header */}
//               <div className="h-full flex items-center justify-between px-3 border-b border-gray-700">
//                 <div className="flex items-center gap-4">
//                   <div className="w-10 h-10 rounded-full bg-red-dark/20 flex items-center justify-center">
//                     <svg className="w-6 h-6 text-red-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                     </svg>
//                   </div>

//                   <div>
//                     <h2 className="text-lg font-semibold text-white">PUDUGUAPI</h2>
//                     <div className="flex gap-4 mt-1">
//                       <div className="flex items-center">
//                         <span className="text-xs text-gray-400 mr-1">Localización:</span>
//                         <span className="text-xs text-gray-300">Puerto Montt</span>
//                       </div>
//                       <div className="flex items-center">
//                         <span className="text-xs text-gray-400 mr-1">PERIODO</span>
//                         <span className="text-xs text-gray-300">2025</span>
//                       </div>
//                       <div className="flex items-center">
//                         <span className="text-xs text-gray-400 mr-1">Estado:</span>
//                         <span className="text-xs text-green-400">Operativo</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Fecha y usuario */}
//                 <div className="text-right">
//                   <div className="flex items-center justify-end gap-3">
//                     <div className="text-right">
//                       <p className="text-sm text-gray-300 flex items-center justify-end">
//                         <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                         </svg>
//                         {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
//                       </p>
//                       <p className="text-sm text-gray-300 flex items-center justify-end mt-1">
//                         <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         {new Date().toLocaleTimeString()}
//                       </p>
//                     </div>

//                     <div className="h-8 w-px bg-gray-600"></div>

//                     <div className="flex items-center">
//                       <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
//                         <span className="text-xs text-white">AD</span>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-300">Administrador</p>
//                         <p className="text-xs text-gray-400">Nivel: Supervisor</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//               </div>

//             </div>
//           </Card>
//         </div>

//         {/* Gráficos */}
//         <div className="flex-1 overflow-auto">
//           <div className="grid grid-cols-3 gap-2 p-1 min-h-full">
//             {chartTypes.map((type, i) => (
//               <Card key={i}>
//                 <div className="h-full p-2 flex flex-col">
//                   <h3 className="text-sm text-gray-300 mb-2">Gráfico {i + 1} - {type.toUpperCase()}</h3>
//                   <div className="flex-1">
//                     <Chart
//                       options={chartOptions}
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
