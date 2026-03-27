import { OrderMaterial, OrderMaterialFormData, OrderMaterialGroup, OrderMaterialStatus } from '@/types/inventory';
import { ServiceResult } from './types';

/**
 * Create a new order
 * @param data - The order form data
 * @returns ServiceResult with the created order or an error
 */
export async function createOrder(
  data: OrderMaterialFormData
): Promise<ServiceResult<OrderMaterial>> {
  try {
    const res = await fetch('/api/admin/inventory/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Failed to create order' };
    }

    const order = await res.json();
    return { success: true, data: order };
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Update an existing order
 * @param id - The order ID
 * @param data - The updated order form data
 * @returns ServiceResult with the updated order or an error
 */
export async function updateOrder(
  id: string,
  data: OrderMaterialFormData
): Promise<ServiceResult<OrderMaterial>> {
  try {
    const res = await fetch(`/api/admin/inventory/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Failed to update order' };
    }

    const order = await res.json();
    return { success: true, data: order };
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}

export interface WarehouseOrderPayload {
  distributor: string;
  description: string;
  status: OrderMaterialStatus;
  materials: OrderMaterialGroup[];
}

/**
 * Create an order from warehouse material selection.
 * Accepts a partial payload without orderNumber (generated server-side).
 */
export async function createWarehouseOrder(
  payload: WarehouseOrderPayload,
): Promise<ServiceResult<OrderMaterial>> {
  try {
    const res = await fetch('/api/admin/inventory/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json() as { error?: string };
      return { success: false, error: error.error ?? 'Failed to create order' };
    }

    const order = await res.json() as OrderMaterial;
    return { success: true, data: order };
  } catch {
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Delete an order
 * @param id - The order ID to delete
 * @returns ServiceResult with void on success or an error
 */
export async function deleteOrder(id: string): Promise<ServiceResult<void>> {
  try {
    const res = await fetch(`/api/admin/inventory/orders/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Failed to delete order' };
    }

    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}
