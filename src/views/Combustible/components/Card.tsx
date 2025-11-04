// src/views/combustible/components/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`flex-1 h-full overflow-hidden bg-gray-dark border border-gray-700/40 shadow-sm ${className}`}>
      {children}
    </div>
  );
}