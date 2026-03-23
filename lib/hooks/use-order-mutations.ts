'use client';

import { useState, useCallback } from 'react';
import { OrderMaterial, OrderMaterialFormData } from '@/types/inventory';
import {
  createOrder,
  updateOrder,
  deleteOrder,
} from '@/lib/services/admin/orders.service';
import { ServiceResult } from '@/lib/services/admin/types';

interface UseOrderMutationsReturn {
  saving: boolean;
  deleting: boolean;
  create: (data: OrderMaterialFormData) => Promise<ServiceResult<OrderMaterial>>;
  update: (id: string, data: OrderMaterialFormData) => Promise<ServiceResult<OrderMaterial>>;
  remove: (id: string) => Promise<ServiceResult<void>>;
}

export function useOrderMutations(): UseOrderMutationsReturn {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const create = useCallback(async (data: OrderMaterialFormData): Promise<ServiceResult<OrderMaterial>> => {
    setSaving(true);
    try {
      return await createOrder(data);
    } finally {
      setSaving(false);
    }
  }, []);

  const update = useCallback(async (id: string, data: OrderMaterialFormData): Promise<ServiceResult<OrderMaterial>> => {
    setSaving(true);
    try {
      return await updateOrder(id, data);
    } finally {
      setSaving(false);
    }
  }, []);

  const remove = useCallback(async (id: string): Promise<ServiceResult<void>> => {
    setDeleting(true);
    try {
      return await deleteOrder(id);
    } finally {
      setDeleting(false);
    }
  }, []);

  return { saving, deleting, create, update, remove };
}
