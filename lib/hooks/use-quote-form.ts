'use client';

import { useState, useCallback } from 'react';
import { QuoteFormData } from '@/types/inventory';
import { createQuote, updateQuote } from '@/services/admin/quotes.service';
import { buildCreatePayload, buildUpdatePayload } from '@/lib/utils/quote';
import { ServiceResult } from '@/services/admin/types';

interface UseQuoteFormReturn {
  isSubmitting: boolean;
  submitCreate: (data: QuoteFormData) => Promise<ServiceResult<void>>;
  submitUpdate: (id: string, data: QuoteFormData) => Promise<ServiceResult<void>>;
}

export function useQuoteForm(): UseQuoteFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitCreate = useCallback(async (data: QuoteFormData): Promise<ServiceResult<void>> => {
    setIsSubmitting(true);
    try {
      const result = await createQuote(buildCreatePayload(data));
      if (result.success) {
        return { success: true, data: undefined };
      }
      return { success: false, error: result.error };
    } catch {
      return { success: false, error: 'Error de conexión. Intenta de nuevo.' };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const submitUpdate = useCallback(async (id: string, data: QuoteFormData): Promise<ServiceResult<void>> => {
    setIsSubmitting(true);
    try {
      const result = await updateQuote(id, buildUpdatePayload(data));
      if (result.success) {
        return { success: true, data: undefined };
      }
      return { success: false, error: result.error };
    } catch {
      return { success: false, error: 'Error de conexión. Intenta de nuevo.' };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { isSubmitting, submitCreate, submitUpdate };
}
