import { QuoteFormData, QuoteItem, SaleExtra, IvaRate } from '@/types/inventory';

interface QuoteTotals {
  subtotal: number;
  discountAmount: number;
  ivaAmount: number;
  totalAmount: number;
}

/**
 * Calculate subtotal, discount, IVA, and total from quote form data.
 * Pure function — no I/O.
 */
export function calculateTotals(formData: QuoteFormData): QuoteTotals {
  const itemsSubtotal = formData.items.reduce((sum: number, item: QuoteItem) => {
    const itemTotal = item.unitPrice * item.quantity;
    const itemDiscount = item.discount ? itemTotal * (item.discount / 100) : 0;
    return sum + (itemTotal - itemDiscount);
  }, 0);

  const extrasSubtotal = formData.extras.reduce((sum: number, extra: SaleExtra) => {
    const qty = extra.quantity ?? 1;
    const extraTotal = extra.price * qty;
    const extraDiscount = extra.discount ? extraTotal * (extra.discount / 100) : 0;
    return sum + (extraTotal - extraDiscount);
  }, 0);

  const subtotal = itemsSubtotal + extrasSubtotal;
  const discountAmount = subtotal * (formData.discount / 100);
  const afterDiscount = subtotal - discountAmount;

  const ivaRate = formData.iva / 100;
  const ivaAmount = formData.includingIva ? 0 : afterDiscount * ivaRate;
  const totalAmount = afterDiscount + ivaAmount;

  return {
    subtotal,
    discountAmount,
    ivaAmount,
    totalAmount,
  };
}

interface CreateQuotePayload extends QuoteFormData {
  subtotal: number;
  totalAmount: number;
}

/**
 * Build the payload for creating a new quote.
 * Attaches calculated totals to the form data.
 */
export function buildCreatePayload(formData: QuoteFormData): CreateQuotePayload {
  const { subtotal, totalAmount } = calculateTotals(formData);
  return {
    ...formData,
    subtotal,
    totalAmount,
  };
}

/**
 * Build the payload for updating an existing quote.
 * Recalculates totals from the updated form data.
 */
export function buildUpdatePayload(formData: QuoteFormData): CreateQuotePayload {
  const { subtotal, totalAmount } = calculateTotals(formData);
  return {
    ...formData,
    subtotal,
    totalAmount,
  };
}
