import { QuoteFormData, QuoteItem, SaleExtra } from '@/types/inventory';

export interface QuoteTotals {
  subtotal: number;
  discountAmount: number;
  ivaAmount: number;
  totalAmount: number;
}

export interface CreateQuotePayload extends QuoteFormData {
  subtotal: number;
  totalAmount: number;
}

export function calcItemSubtotal(item: QuoteItem): number {
  const discType = item.discountType ?? 'percentage';
  if (discType === 'percentage') {
    const total = item.unitPrice * item.quantity;
    const disc = item.discount ? total * (item.discount / 100) : 0;
    return total - disc;
  }
  return (item.unitPrice - (item.discount ?? 0)) * item.quantity;
}

export function calcExtraSubtotal(extra: SaleExtra): number {
  const qty = extra.quantity ?? 1;
  const discType = extra.discountType ?? 'percentage';
  if (discType === 'percentage') {
    const total = extra.price * qty;
    const disc = extra.discount ? total * (extra.discount / 100) : 0;
    return total - disc;
  }
  return (extra.price - (extra.discount ?? 0)) * qty;
}

export function calculateTotals(formData: QuoteFormData): QuoteTotals {
  const itemsSubtotal = formData.items.reduce(
    (sum: number, item: QuoteItem) => sum + calcItemSubtotal(item),
    0,
  );

  const extrasSubtotal = formData.extras.reduce(
    (sum: number, extra: SaleExtra) => sum + calcExtraSubtotal(extra),
    0,
  );

  const subtotal = itemsSubtotal + extrasSubtotal;
  const globalDiscType = formData.discountType ?? 'percentage';
  const discountAmount =
    globalDiscType === 'percentage'
      ? subtotal * (formData.discount / 100)
      : formData.discount;
  const afterDiscount = subtotal - discountAmount;

  const ivaRate = formData.iva / 100;
  const ivaAmount = formData.includingIva ? 0 : afterDiscount * ivaRate;
  const totalAmount = afterDiscount + ivaAmount;

  return { subtotal, discountAmount, ivaAmount, totalAmount };
}

export function buildCreatePayload(formData: QuoteFormData): CreateQuotePayload {
  const { subtotal, totalAmount } = calculateTotals(formData);
  return { ...formData, subtotal, totalAmount };
}

export function buildUpdatePayload(formData: QuoteFormData): CreateQuotePayload {
  const { subtotal, totalAmount } = calculateTotals(formData);
  return { ...formData, subtotal, totalAmount };
}
