import { useEffect, useState } from "react";
import { CardProps } from "../../assets/types/Inspecciones";
function Card({ title, children }: CardProps) {
  return (
    <div className="bg-gray-darkL rounded-lg border border-gray-700 shadow-sm flex flex-col">
      {title && (
        <div className="px-4 py-2 border-b border-gray-700 text-xs font-semibold text-gray-300">
          {title}
        </div>
      )}
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}

export const Inspecciones = () => {
  const [time, setTime] = useState(new Date());
  const sensores = [
    { id: "T1", label: "Temp° Agua", unit: "°C" },
    { id: "H1", label: "Humedad", unit: "%" },
    { id: "P1", label: "Presión", unit: "bar" },
    { id: "F1", label: "Flujo", unit: "L/min" },
  ];

  // Simular actualización en vivo
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const valorAleatorio = () => (Math.random() * 100).toFixed(1);

  return (
    <main className="flex-1 h-screen overflow-hidden p-2 bg-gray-dark">
      <div className="flex flex-col h-full gap-2">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 bg-gray-darkL rounded-lg border border-gray-700">
          <h1 className="text-lg font-semibold text-white">Dashboard Sensores Live</h1>
          <div className="text-sm text-gray-300">
            {time.toLocaleDateString("es-ES")} • {time.toLocaleTimeString("es-ES")}
          </div>
        </div>

        {/* Métricas en vivo */}
        <div className="grid grid-cols-4 gap-2 h-1/4">
          {sensores.map((s) => (
            <Card key={s.id} title={s.label}>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-white">{valorAleatorio()}</span>
                <span className="text-lg text-gray-400">{s.unit}</span>
              </div>
              {/* Aquí podrías insertar un sparkline */}
              <div className="mt-2 h-6 bg-gray-800 rounded animate-pulse"></div>
            </Card>
          ))}
        </div>

        {/* Gráficos detallados */}
        <div className="grid grid-rows-2 grid-cols-2 gap-2 h-3/4">
          {/* Gráfico 1 */}
          <Card title="Temp° Agua (últimas 24h)">
            <div className="h-full bg-gray-800 rounded flex items-center justify-center text-gray-500">
              {/* Placeholder Chart */}
              Gráfico de temperatura
            </div>
          </Card>

          {/* Gráfico 2 */}
          <Card title="Humedad (últimas 24h)">
            <div className="h-full bg-gray-800 rounded flex items-center justify-center text-gray-500">
              {/* Placeholder Chart */}
              Gráfico de humedad
            </div>
          </Card>

          {/* Gráfico 3 */}
          <Card title="Presión (últimas 24h)">
            <div className="h-full bg-gray-800 rounded flex items-center justify-center text-gray-500">
              {/* Placeholder Chart */}
              Gráfico de presión
            </div>
          </Card>

          {/* Gráfico 4 */}
          <Card title="Flujo (últimas 24h)">
            <div className="h-full bg-gray-800 rounded flex items-center justify-center text-gray-500">
              {/* Placeholder Chart */}
              Gráfico de flujo
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
};
