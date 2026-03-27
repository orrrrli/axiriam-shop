import { InventoryItem, InventoryItemFormData, ItemCreatePayload } from '@/types/inventory';
import { ServiceResult } from './types';

export async function createItem(
  data: ItemCreatePayload
): Promise<ServiceResult<InventoryItem>> {
  try {
    const res = await fetch('/api/admin/inventory/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.error || 'Failed to create item' };
    }

    const item = await res.json();
    return { success: true, data: item };
  } catch {
    return { success: false, error: 'Network error occurred' };
  }
}

export async function updateItem(
  id: string,
  data: InventoryItemFormData
): Promise<ServiceResult<InventoryItem>> {
  try {
    const res = await fetch(`/api/admin/inventory/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.error || 'Failed to update item' };
    }

    const item = await res.json();
    return { success: true, data: item };
  } catch {
    return { success: false, error: 'Network error occurred' };
  }
}

export async function deleteItem(id: string): Promise<ServiceResult<void>> {
  try {
    const res = await fetch(`/api/admin/inventory/items/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Failed to delete item' };
    }

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'Network error occurred' };
  }
}
