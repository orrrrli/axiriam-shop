import { QuoteFormData, QuoteStatus } from '@/types/inventory';

/**
 * Display labels for quote status values
 * Maps internal status values to user-friendly Spanish labels
 */
export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: 'Borrador',
  sent: 'Enviado',
  accepted: 'Aceptado',
  rejected: 'Rechazado',
  expired: 'Vencido',
};

/**
 * CSS classes for quote status badge styling
 * Maps status values to Tailwind CSS classes for visual differentiation
 */
export const QUOTE_STATUS_STYLES: Record<QuoteStatus, string> = {
  draft: 'bg-body-alt text-paragraph',
  sent: 'bg-[#e3f2fd] text-[#1565c0]',
  accepted: 'bg-[#e8f5e9] text-[#2e7d32]',
  rejected: 'bg-[#ffebee] text-[#c62828]',
  expired: 'bg-[#fafafa] text-subtle',
};

/**
 * Column headers for the quotes table view
 */
export const QUOTE_COLUMNS = [
  'Folio',
  'Cliente',
  'Empresa',
  'Total',
  'IVA',
  'Estado',
  'Vence',
  'Acciones',
];

/**
 * Default form values for creating a new quote
 */
export const EMPTY_QUOTE_FORM: QuoteFormData = {
  clientName: '',
  clientEmail: undefined,
  clientPhone: undefined,
  clientCompany: undefined,
  status: 'draft',
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  discount: 0,
  notes: undefined,
  iva: 16,
  includingIva: true,
  paymentMethod: 'Transferencia',
  items: [],
  extras: [],
};
