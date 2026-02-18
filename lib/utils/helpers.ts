export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function generateOrderNumber(): string {
  return `WC${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

export function calculateTax(subtotal: number, taxRate: number = 0.08): number {
  return subtotal * taxRate;
}

export function calculateShipping(subtotal: number): number {
  if (subtotal >= 50) return 0; // Free shipping over $50
  return 5.99;
}

export function generateTrackingNumber(): string {
  const prefix = 'WC';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
