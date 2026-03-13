import { RawMaterial, RawMaterialFormData } from '@/types/inventory';
import { ServiceResult } from './types';

/**
 * Create a new tela (raw material)
 * @param data - The tela form data
 * @returns ServiceResult with the created tela or an error
 */
export async function createTela(
  data: RawMaterialFormData
): Promise<ServiceResult<RawMaterial>> {
  try {
    const res = await fetch('/api/admin/inventory/telas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Failed to create tela' };
    }

    const tela = await res.json();
    return { success: true, data: tela };
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Update an existing tela
 * @param id - The tela ID
 * @param data - The updated tela form data
 * @returns ServiceResult with the updated tela or an error
 */
export async function updateTela(
  id: string,
  data: RawMaterialFormData
): Promise<ServiceResult<RawMaterial>> {
  try {
    const res = await fetch(`/api/admin/inventory/telas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Failed to update tela' };
    }

    const tela = await res.json();
    return { success: true, data: tela };
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Delete a tela
 * @param id - The tela ID to delete
 * @returns ServiceResult with void on success or an error
 */
export async function deleteTela(id: string): Promise<ServiceResult<void>> {
  try {
    const res = await fetch(`/api/admin/inventory/telas/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Failed to delete tela' };
    }

    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}
