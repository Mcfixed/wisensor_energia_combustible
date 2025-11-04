import { ReactNode } from 'react';


export interface CardProps {
  children: ReactNode;
  className?: string;
}

export interface StatusDefaultProps {
  status: 'secure' | 'warning' | 'danger' | 'neutral';
  text: string;
}


export interface CentroCultivo {
  id: number;
  nombre: string;
  ubicacion: string;
  estado: 'activo' | 'alerta' | 'mantenimiento';
  consumoPromedio: number;
  capacidadTanques: number;
  combustibleDisponible: number;
}

export interface TanqueCombustible {
  id: number;
  centroId: number;
  nombre: string;
  capacidadTotal: number;
  nivelActual: number;
  tipoCombustible: 'diesel' | 'gasolina' | 'bunker';
  temperatura: number;
  ultimaInspeccion: string;
}

export interface Embarcacion {
  id: number;
  nombre: string;
  centroId: number;
  tipo: 'lancha' | 'bote' | 'ponton';
  consumoPromedio: number;
  estado: 'operativa' | 'mantenimiento' | 'inactiva';
  ultimoConsumo: number;
}

export interface Alerta {
  id: number;
  tipo: 'nivel_bajo' | 'consumo_elevado' | 'temperatura' | 'reabastecimiento';
  severidad: 'baja' | 'media' | 'alta' | 'critica';
  centroId: number;
  tanqueId?: number;
  embarcacionId?: number;
  mensaje: string;
  valor: number;
  timestamp: string;
  resuelta: boolean;
}

export interface Reabastecimiento {
  id: number;
  centroId: number;
  tanqueId: number;
  cantidad: number;
  proveedor: string;
  fecha: string;
  costo: number;
  numeroFactura: string;
}


export interface IndicadorNivelProps {
  nivel: number;
  capacidad: number;
  tipo?: 'tanque' | 'embarcacion';
  showLabel?: boolean;
}

export interface MetricCardProps {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  tendencia?: 'positiva' | 'negativa' | 'neutral';
  variacion?: number;
  icono?: ReactNode;
}

export interface GraficoLinealProps {
  datos: Array<{
    fecha: string;
    valor: number;
    centro?: string;
  }>;
  titulo: string;
  color?: string;
}

export interface MapaCentrosProps {
  centros: CentroCultivo[];
  onCentroClick?: (centro: CentroCultivo) => void;
}


export interface DashboardState {
  centros: CentroCultivo[];
  tanques: TanqueCombustible[];
  embarcaciones: Embarcacion[];
  alertas: Alerta[];
  reabastecimientos: Reabastecimiento[];
  periodoSeleccionado: 'hoy' | 'semana' | 'mes';
  mostrarDatosSensibles: boolean;
  centroFiltro?: number;
}

export interface ConfiguracionDashboard {
  umbralNivelBajo: number;
  umbralNivelCritico: number;
  temperaturaMaxima: number;
  consumoMaximoPorEmbarcacion: number;
  alertasEmail: boolean;
  alertasSMS: boolean;
  reporteAutomatico: boolean;
}