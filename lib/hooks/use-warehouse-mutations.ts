'use client';

import { useState, useCallback } from 'react';
import { RawMaterial, RawMaterialFormData } from '@/types/inventory';
import {
  createWarehouseMaterial,
  updateWarehouseMaterial,
  deleteWarehouseMaterial,
} from '@/lib/services/admin/warehouse.service';
import { ServiceResult } from '@/lib/services/admin/types';

interface UseWarehouseMutationsReturn {
  saving: boolean;
  deleting: boolean;
  create: (data: RawMaterialFormData) => Promise<ServiceResult<RawMaterial>>;
  update: (id: string, data: RawMaterialFormData) => Promise<ServiceResult<RawMaterial>>;
  remove: (id: string) => Promise<ServiceResult<void>>;
}

export function useWarehouseMutations(): UseWarehouseMutationsReturn {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const create = useCallback(async (data: RawMaterialFormData): Promise<ServiceResult<RawMaterial>> => {
    setSaving(true);
    try {
      return await createWarehouseMaterial(data);
    } finally {
      setSaving(false);
    }
  }, []);

  const update = useCallback(async (id: string, data: RawMaterialFormData): Promise<ServiceResult<RawMaterial>> => {
    setSaving(true);
    try {
      return await updateWarehouseMaterial(id, data);
    } finally {
      setSaving(false);
    }
  }, []);

  const remove = useCallback(async (id: string): Promise<ServiceResult<void>> => {
    setDeleting(true);
    try {
      return await deleteWarehouseMaterial(id);
    } finally {
      setDeleting(false);
    }
  }, []);

  return { saving, deleting, create, update, remove };
}
