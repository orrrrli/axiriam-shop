'use client';

import { useState, useCallback } from 'react';
import { StoreOrder, StoreOrderUpdateData } from '@/types/inventory';
import { updateVenta } from '@/lib/services/admin/ventas.service';
import { ServiceResult } from '@/lib/services/admin/types';

interface UseVentasMutationsReturn {
  updating: boolean;
  update: (id: string, data: StoreOrderUpdateData) => Promise<ServiceResult<StoreOrder>>;
}

export function useVentasMutations(): UseVentasMutationsReturn {
  const [updating, setUpdating] = useState(false);

  const update = useCallback(async (id: string, data: StoreOrderUpdateData): Promise<ServiceResult<StoreOrder>> => {
    setUpdating(true);
    try {
      return await updateVenta(id, data);
    } finally {
      setUpdating(false);
    }
  }, []);

  return { updating, update };
}
