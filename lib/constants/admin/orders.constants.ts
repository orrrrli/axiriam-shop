import { OrderMaterialFormData, OrderMaterialStatus } from '@/types/inventory';

/**
 * Display labels for order material status values
 * Maps internal status values to user-friendly Spanish labels
 */
export const ORDER_STATUS_LABELS: Record<OrderMaterialStatus, string> = {
  pending: 'Pendiente',
  ordered: 'Ordenado',
  received: 'Recibido',
};

/**
 * CSS classes for order status badge styling
 * Maps status values to Tailwind CSS classes for visual differentiation
 */
export const ORDER_STATUS_STYLES: Record<OrderMaterialStatus, string> = {
  pending: 'bg-[#fff8e1] text-[#f57f17]',
  ordered: 'bg-[#e3f2fd] text-[#1565c0]',
  received: 'bg-[#e8f5e9] text-[#2e7d32]',
};

/**
 * Column headers for the orders table view
 */
export const ORDER_COLUMNS = [
  'Distribuidor',
  'Descripción',
  'Estado',
  'Paquetería',
  'Tracking',
  'Fecha',
  'Acciones',
];

/**
 * Default form values for creating a new order
 */
export const EMPTY_ORDER_FORM: OrderMaterialFormData = {
  materials: [],
  distributor: '',
  description: '',
  status: 'pending',
  trackingNumber: undefined,
  parcel_service: undefined,
};
