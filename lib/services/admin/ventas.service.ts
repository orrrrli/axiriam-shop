import { StoreOrder, StoreOrderUpdateData } from '@/types/inventory';
import { ServiceResult } from './types';

export async function updateVenta(
  id: string,
  data: StoreOrderUpdateData,
): Promise<ServiceResult<StoreOrder>> {
  try {
    const res = await fetch(`/api/admin/ventas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.error || 'Failed to update order' };
    }

    const { order } = await res.json();
    return { success: true, data: order };
  } catch {
    return { success: false, error: 'Network error occurred' };
  }
}
