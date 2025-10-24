import { CardProps } from '../types';

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`overflow-hidden bg-dark-osc border border-gray-700/40 shadow-sm ${className}`}>
      {children}
    </div>
  );
}