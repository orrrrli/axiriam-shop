'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Quote, QuoteFormData } from '@/types/inventory';
import {
  createQuote,
  updateQuote,
  deleteQuote,
} from '@/lib/services/admin/quotes.service';
import { buildCreatePayload, buildUpdatePayload } from '@/lib/services/quote-domain.service';
import { generateQuotePDFFromFormData, generateQuotePDFFromQuote } from '@/lib/pdf/quote-pdf';

type SortOrder = 'asc' | 'desc';

interface UseQuotesParams {
  initialQuotes: Quote[];
  searchQuery: string;
  sortOrder: SortOrder;
}

interface UseQuotesReturn {
  quotes: Quote[];
  filteredQuotes: Quote[];
  isSubmitting: boolean;
  handleAddQuote: (data: QuoteFormData) => Promise<boolean>;
  handleEditQuote: (id: string, data: QuoteFormData) => Promise<boolean>;
  handleDeleteConfirm: (id: string) => Promise<boolean>;
  handleGeneratePDF: (data: QuoteFormData) => void;
  handleDownloadPDF: (quote: Quote) => void;
}

export function useQuotes({
  initialQuotes,
  searchQuery,
  sortOrder,
}: UseQuotesParams): UseQuotesReturn {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setQuotes(initialQuotes);
  }, [initialQuotes]);

  const filteredQuotes = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const filtered = query
      ? quotes.filter(
          (q) =>
            q.clientName.toLowerCase().includes(query) ||
            q.quoteNumber.toLowerCase().includes(query) ||
            (q.clientCompany?.toLowerCase().includes(query) ?? false)
        )
      : quotes;

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [quotes, searchQuery, sortOrder]);

  const handleAddQuote = useCallback(async (data: QuoteFormData): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const payload = buildCreatePayload(data);
      const result = await createQuote(payload);
      if (result.success) {
        setQuotes((prev) => [result.data, ...prev]);
        return true;
      }
      alert(result.error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleEditQuote = useCallback(async (id: string, data: QuoteFormData): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const payload = buildUpdatePayload(data);
      const result = await updateQuote(id, payload);
      if (result.success) {
        setQuotes((prev) =>
          prev.map((q) => (q.id === id ? result.data : q))
        );
        return true;
      }
      alert(result.error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleDeleteConfirm = useCallback(async (id: string): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const result = await deleteQuote(id);
      if (result.success) {
        setQuotes((prev) => prev.filter((q) => q.id !== id));
        return true;
      }
      alert(result.error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleGeneratePDF = useCallback((data: QuoteFormData): void => {
    try {
      generateQuotePDFFromFormData(data);
    } catch {
      alert('La generación de PDF aún no está implementada');
    }
  }, []);

  const handleDownloadPDF = useCallback((quote: Quote): void => {
    try {
      generateQuotePDFFromQuote(quote);
    } catch {
      alert('La descarga de PDF aún no está implementada');
    }
  }, []);

  return {
    quotes,
    filteredQuotes,
    isSubmitting,
    handleAddQuote,
    handleEditQuote,
    handleDeleteConfirm,
    handleGeneratePDF,
    handleDownloadPDF,
  };
}
