// src/views/combustible/components/StatusIndicator.tsx
import React from 'react';
import { AlertTriangle, Battery, Droplets, Settings, TrendingDown } from 'lucide-react';
import { Center } from '../types'; // Usamos el tipo Center

// Tomamos el tipo de Center['status']
type StatusType = Center['status'];

interface StatusDefaultProps {
  status: StatusType;
  text: string;
}

export function StatusIndicator({ status, text }: StatusDefaultProps) {
  const statusConfig = {
    secure: { 
      color: "text-green-400", 
      bg: "bg-green-400/10", 
      icon: <Battery className="w-3 h-3" /> 
    },
    warning: { 
      color: "text-yellow-400", 
      bg: "bg-yellow-400/10", 
      icon: <AlertTriangle className="w-3 h-3" /> 
    },
    danger: { 
      color: "text-red-400", 
      bg: "bg-red-400/10", 
      icon: <TrendingDown className="w-3 h-3" /> 
    },
    neutral: { 
      color: "text-blue-400", 
      bg: "bg-blue-400/10", 
      icon: <Droplets className="w-3 h-3" /> 
    },
    maintenance: { 
      color: "text-gray-400", 
      bg: "bg-gray-400/10", 
      icon: <Settings className="w-3 h-3" /> 
    }
  };
  
  const config = statusConfig[status] || statusConfig.neutral;
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.bg} ${config.color}`}>
      {config.icon}
      {text}
    </div>
  );
}