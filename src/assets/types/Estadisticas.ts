export type StatusType = 'optimal' | 'warning' | 'critical' | 'monitoring';

export interface StatusDefaultProps {
  status: StatusType;
  text: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}