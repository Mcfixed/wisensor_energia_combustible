// import { useState } from "react";
// import Chart from "react-apexcharts";
// import { CardProps } from "../../assets/types/Alertas";
// /* plomos */
// function Card({ children }: CardProps) {
//   return (
//     <div className="flex-1 h-full overflow-hidden bg-gray-darkL rounded-lg border border-gray-700 shadow-sm">
//       {children}
//     </div>
//   );
// }

// export const Graficos3 = () => {
//   const [date] = useState(new Date());

//   const chartOptions = {
//     chart: {
//       background: "transparent",
//       toolbar: { show: false },
//       foreColor: "#ccc",
//     },
//     grid: {
//       borderColor: "#333",
//     },
//     colors: ["#ff5b57"],
//     dataLabels: { enabled: false },
//     tooltip: {
//       theme: "dark",
//     },
//   };

//   const chartSeries = [
//     {
//       name: "Series 1",
//       data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
//     },
//   ];

//   return (
//     <main className="flex-1 min-h-screen overflow-hidden p-2 bg-gray-dark">
//       <div className="flex flex-col h-full gap-2">

//         {/* Información Empresa */}
//         <div className="h-1/4">
//           <Card>
//             <div className="flex flex-col h-full p-3">
//               <div className="flex items-center justify-between border-b border-gray-700 pb-2">
//                 <div className="flex items-center gap-4">
//                   <div className="w-10 h-10 rounded-full bg-red-dark/20 flex items-center justify-center">
//                     <svg className="w-6 h-6 text-red-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                     </svg>
//                   </div>

//                   <div>
//                     <h2 className="text-lg font-semibold text-white">PUDUGUAPI</h2>
//                     <div className="flex gap-4 mt-1">
//                       <p className="text-xs text-gray-400">Localización: <span className="text-gray-300">Puerto Montt</span></p>
//                       <p className="text-xs text-gray-400">Periodo: <span className="text-gray-300">2025</span></p>
//                       <p className="text-xs text-gray-400">Estado: <span className="text-green-400">Operativo</span></p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex flex-col items-end text-gray-300 text-xs">
//                   <p className="flex items-center">
//                     <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     {date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
//                   </p>
//                   <p className="flex items-center mt-1">
//                     <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     {date.toLocaleTimeString()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* Gráficos */}
//         <div className="flex-1 grid grid-cols-3 grid-rows-3 gap-2">
//           {[...Array(9)].map((_, i) => (
//             <Card key={i}>
//               <div className="h-full p-2 flex flex-col">
//                 <h3 className="text-sm text-gray-300 mb-2">Gráfico {i + 1}</h3>
//                 <div className="flex-1">
//                   <Chart
//                     options={chartOptions}
//                     series={chartSeries}
//                     type="line"
//                     height="100%"
//                     width="100%"
//                   />
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>

//       </div>
//     </main>
//   );
// };
