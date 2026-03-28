'use client';

import { useState, useCallback } from 'react';
import { InventoryItem, InventoryItemFormData, ItemCreatePayload } from '@/types/inventory';
import {
  createItem,
  updateItem,
  deleteItem,
} from '@/services/admin/items.service';
import { ServiceResult } from '@/services/admin/types';

interface UseItemMutationsReturn {
  saving: boolean;
  deleting: boolean;
  create: (data: ItemCreatePayload) => Promise<ServiceResult<InventoryItem>>;
  update: (id: string, data: InventoryItemFormData) => Promise<ServiceResult<InventoryItem>>;
  remove: (id: string) => Promise<ServiceResult<void>>;
}

export function useItemMutations(): UseItemMutationsReturn {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const create = useCallback(async (data: ItemCreatePayload): Promise<ServiceResult<InventoryItem>> => {
    setSaving(true);
    try {
      return await createItem(data);
    } finally {
      setSaving(false);
    }
  }, []);

  const update = useCallback(async (id: string, data: InventoryItemFormData): Promise<ServiceResult<InventoryItem>> => {
    setSaving(true);
    try {
      return await updateItem(id, data);
    } finally {
      setSaving(false);
    }
  }, []);

  const remove = useCallback(async (id: string): Promise<ServiceResult<void>> => {
    setDeleting(true);
    try {
      return await deleteItem(id);
    } finally {
      setDeleting(false);
    }
  }, []);

  return { saving, deleting, create, update, remove };
}
