import { InventoryItem, InventoryItemFormData } from '@/types/inventory';
import { ServiceResult } from './types';

/**
 * Create a new inventory item
 * 
 * @param data - The item form data
 * @returns ServiceResult containing the created item or an error
 */
export async function createItem(
  data: InventoryItemFormData
): Promise<ServiceResult<InventoryItem>> {
  try {
    const res = await fetch('/api/admin/inventory/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Failed to create item' };
    }

    const item = await res.json();
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Update an existing inventory item
 * 
 * @param id - The item ID
 * @param data - The updated item form data
 * @returns ServiceResult containing the updated item or an error
 */
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
      return { success: false, error: error.message || 'Failed to update item' };
    }

    const item = await res.json();
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Delete an inventory item
 * 
 * @param id - The item ID to delete
 * @returns ServiceResult indicating success or an error
 */
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
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}
