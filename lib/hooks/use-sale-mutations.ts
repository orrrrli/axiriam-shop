'use client';

import { useState, useCallback } from 'react';
import { Sale, SaleFormData, SaleStatus } from '@/types/inventory';
import { updateSale } from '@/services/admin/sales.service';

interface UseSaleMutationsReturn {
  updating: boolean;
  updateTracking: (trackingNumber: string) => Promise<boolean>;
  updateStatus: (status: SaleStatus) => Promise<boolean>;
}

export function useSaleMutations(sale: Sale): UseSaleMutationsReturn {
  const [updating, setUpdating] = useState(false);

  function buildPayload(overrides: Partial<SaleFormData>): SaleFormData {
    return {
      name: sale.name,
      status: sale.status,
      socialMediaPlatform: sale.socialMediaPlatform,
      socialMediaUsername: sale.socialMediaUsername,
      trackingNumber: sale.trackingNumber,
      invoiceRequired: sale.invoiceRequired,
      shippingType: sale.shippingType,
      localShippingOption: sale.localShippingOption,
      localAddress: sale.localAddress,
      nationalShippingCarrier: sale.nationalShippingCarrier,
      shippingDescription: sale.shippingDescription,
      discount: sale.discount,
      totalAmount: sale.totalAmount,
      deliveryDate: sale.deliveryDate,
      saleItems: sale.saleItems,
      extras: sale.extras,
      ...overrides,
    };
  }

  const updateTracking = useCallback(
    async (trackingNumber: string): Promise<boolean> => {
      setUpdating(true);
      try {
        const result = await updateSale(sale.id, buildPayload({ trackingNumber }));
        return result.success;
      } finally {
        setUpdating(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sale],
  );

  const updateStatus = useCallback(
    async (status: SaleStatus): Promise<boolean> => {
      setUpdating(true);
      try {
        const result = await updateSale(sale.id, buildPayload({ status }));
        return result.success;
      } finally {
        setUpdating(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sale],
  );

  return { updating, updateTracking, updateStatus };
}
