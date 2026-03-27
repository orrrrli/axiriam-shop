import { Sale, SaleFormData } from '@/types/inventory';
import { ServiceResult } from './types';

/**
 * Create a new sale
 * @param data - The sale form data
 * @returns ServiceResult with the created sale or an error
 */
export async function createSale(
  data: SaleFormData
): Promise<ServiceResult<Sale>> {
  try {
    const res = await fetch('/api/admin/inventory/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Failed to create sale' };
    }

    const sale = await res.json();
    return { success: true, data: sale };
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Update an existing sale
 * @param id - The sale ID
 * @param data - The updated sale form data
 * @returns ServiceResult with the updated sale or an error
 */
export async function updateSale(
  id: string,
  data: SaleFormData
): Promise<ServiceResult<Sale>> {
  try {
    const res = await fetch(`/api/admin/inventory/sales/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Failed to update sale' };
    }

    const sale = await res.json();
    return { success: true, data: sale };
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Delete a sale
 * @param id - The sale ID to delete
 * @returns ServiceResult with void on success or an error
 */
export async function deleteSale(id: string): Promise<ServiceResult<void>> {
  try {
    const res = await fetch(`/api/admin/inventory/sales/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Failed to delete sale' };
    }

    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}
