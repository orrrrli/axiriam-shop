import { StoreOrderStatus } from '@/types/inventory';

export const VENTA_STATUS_LABELS: Record<StoreOrderStatus, string> = {
  pending: 'Pendiente',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const VENTA_STATUS_STYLES: Record<StoreOrderStatus, string> = {
  pending: 'bg-[#f5f5f5] text-[#555]',
  processing: 'bg-[#fff8e1] text-[#f57f17]',
  shipped: 'bg-[#e3f2fd] text-[#1565c0]',
  delivered: 'bg-[#e8f5e9] text-[#2e7d32]',
  cancelled: 'bg-[#fce4ec] text-[#c62828]',
};
