import { Quote, QuoteFormData } from '@/types/inventory';
import {
  getQuotes as repoGetQuotes,
  getQuoteById as repoGetQuoteById,
  getQuoteByNumber as repoGetQuoteByNumber,
  createQuote as repoCreateQuote,
  updateQuote as repoUpdateQuote,
  deleteQuote as repoDeleteQuote,
} from '@/repositories/quote-repository';
import {
  buildCreatePayload,
  buildUpdatePayload,
} from '@/lib/services/quote-domain.service';

export async function getQuotes(): Promise<Quote[]> {
  return repoGetQuotes();
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  return repoGetQuoteById(id);
}

export async function getQuoteByNumber(quoteNumber: string): Promise<Quote | null> {
  return repoGetQuoteByNumber(quoteNumber);
}

export async function createQuote(data: QuoteFormData): Promise<Quote> {
  const payload = buildCreatePayload(data);
  return repoCreateQuote(payload);
}

export async function updateQuote(id: string, data: QuoteFormData): Promise<Quote> {
  const payload = buildUpdatePayload(data);
  return repoUpdateQuote(id, payload);
}

export async function deleteQuote(id: string): Promise<void> {
  return repoDeleteQuote(id);
}
