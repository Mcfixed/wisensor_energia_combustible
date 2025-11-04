// src/views/combustible/components/FuelChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
// Asegúrate de importar ChartJS y sus componentes en tu index.tsx principal

interface FuelChartProps {
  title: string;
  value: string;
  data: number[];
  labels: string[];
  borderColor: string;
  backgroundColor: string;
}

export function FuelChart({ title, value, data, labels, borderColor, backgroundColor }: FuelChartProps) {
  return (
    <div className="bg-dark-osc p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <span className="text-lg font-bold text-white">{value}</span>
      </div>
      <div className="h-[120px]">
        <Line
          data={{
            labels: labels,
            datasets: [{
              label: title,
              data: data,
              borderColor: borderColor,
              backgroundColor: backgroundColor,
              fill: true,
              tension: 0.4
            }]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: {
                beginAtZero: false, // El nivel puede no empezar en 0
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: '#9ca3af' }
              },
              x: {
                grid: { display: false },
                ticks: { color: '#9ca3af' }
              }
            }
          }}
        />
      </div>
    </div>
  );
}