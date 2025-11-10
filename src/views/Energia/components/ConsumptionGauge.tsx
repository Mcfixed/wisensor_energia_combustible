// Componente Gauge
import { ConsumptionGaugeProps } from "../types";
export function ConsumptionGauge({ value, max = 100, label, size = "medium", color = "green" }: ConsumptionGaugeProps) {
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