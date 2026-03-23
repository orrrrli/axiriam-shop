import {
  LocalShippingOption,
  NationalShippingCarrier,
  SaleFormData,
  SaleStatus,
} from '@/types/inventory';

/**
 * Display labels for sale status values
 * Maps internal status values to user-friendly Spanish labels
 */
export const STATUS_LABELS: Record<SaleStatus, string> = {
  pending: 'Pendiente',
  shipped: 'Enviado',
  delivered: 'Entregado',
};

/**
 * CSS classes for sale status badge styling
 * Maps status values to Tailwind CSS classes for visual differentiation
 */
export const STATUS_STYLES: Record<SaleStatus, string> = {
  pending: 'bg-[#fff8e1] text-[#f57f17]',
  shipped: 'bg-[#e3f2fd] text-[#1565c0]',
  delivered: 'bg-[#e8f5e9] text-[#2e7d32]',
};

/**
 * Display icons for social media platforms
 * Maps platform values to abbreviated display text
 */
export const PLATFORM_ICONS: Record<string, string> = {
  facebook: 'FB',
  instagram: 'IG',
  whatsapp: 'WA',
};

/**
 * Display labels for shipping types
 * Maps internal shipping type values to user-friendly Spanish labels
 */
export const SHIPPING_LABELS: Record<string, string> = {
  local: 'Local',
  nacional: 'Nacional',
};

export const LOCAL_SHIPPING_LABELS: Record<LocalShippingOption, string> = {
  'meeting-point': 'Punto de encuentro',
  pzexpress: 'PZ Express',
};

export const CARRIER_LABELS: Record<NationalShippingCarrier, string> = {
  estafeta: 'Estafeta',
  dhl: 'DHL',
  fedex: 'FedEx',
  correos: 'Correos de México',
};

/**
 * Column headers for the sales table view
 */
export const SALE_COLUMNS = [
  'Cliente',
  'Red Social',
  'Tipo Envío',
  'Total',
  'Estado',
  'Entrega',
  'Acciones',
];

/**
 * Default form values for creating a new sale
 */
export const EMPTY_SALE_FORM: SaleFormData = {
  name: '',
  status: 'pending',
  socialMediaPlatform: 'instagram',
  socialMediaUsername: '',
  trackingNumber: undefined,
  invoiceRequired: false,
  shippingType: 'local',
  localShippingOption: undefined,
  localAddress: undefined,
  nationalShippingCarrier: undefined,
  shippingDescription: undefined,
  discount: 0,
  totalAmount: 0,
  deliveryDate: undefined,
  saleItems: [],
  extras: [],
};
