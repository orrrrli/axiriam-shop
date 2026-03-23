'use client';

import { useState, useCallback } from 'react';
import { Sale, SaleFormData } from '@/types/inventory';
import { updateSale, deleteSale } from '@/lib/services/admin/sales.service';
import { ServiceResult } from '@/lib/services/admin/types';

interface UseSalesListMutationsReturn {
  deleting: boolean;
  update: (id: string, data: SaleFormData) => Promise<ServiceResult<Sale>>;
  remove: (id: string) => Promise<ServiceResult<void>>;
}

export function useSalesListMutations(): UseSalesListMutationsReturn {
  const [deleting, setDeleting] = useState(false);

  const update = useCallback(async (id: string, data: SaleFormData): Promise<ServiceResult<Sale>> => {
    return await updateSale(id, data);
  }, []);

  const remove = useCallback(async (id: string): Promise<ServiceResult<void>> => {
    setDeleting(true);
    try {
      return await deleteSale(id);
    } finally {
      setDeleting(false);
    }
  }, []);

  return { deleting, update, remove };
}
