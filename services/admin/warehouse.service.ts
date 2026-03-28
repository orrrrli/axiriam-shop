import { RawMaterial, RawMaterialFormData } from '@/types/inventory';
import { ServiceResult } from './types';

export async function createWarehouseMaterial(
  data: RawMaterialFormData
): Promise<ServiceResult<RawMaterial>> {
  try {
    const res = await fetch('/api/admin/inventory/warehouse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Failed to create material' };
    }

    const { material } = await res.json() as { material: RawMaterial };
    return { success: true, data: material };
  } catch {
    return { success: false, error: 'Network error occurred' };
  }
}

export async function updateWarehouseMaterial(
  id: string,
  data: RawMaterialFormData
): Promise<ServiceResult<RawMaterial>> {
  try {
    const res = await fetch(`/api/admin/inventory/warehouse/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Failed to update material' };
    }

    const { material } = await res.json() as { material: RawMaterial };
    return { success: true, data: material };
  } catch {
    return { success: false, error: 'Network error occurred' };
  }
}

export async function deleteWarehouseMaterial(id: string): Promise<ServiceResult<void>> {
  try {
    const res = await fetch(`/api/admin/inventory/warehouse/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const error = await res.json() as { error?: string; code?: string };
      return { success: false, error: error.error ?? 'Failed to delete material', code: error.code };
    }

    return { success: true, data: undefined };
  } catch {
    return { success: false, error: 'Network error occurred' };
  }
}
