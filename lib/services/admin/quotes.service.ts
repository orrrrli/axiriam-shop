import { Quote, QuoteFormData } from '@/types/inventory';
import { ServiceResult } from './types';

/**
 * Create a new quote
 * @param data - The quote form data
 * @returns ServiceResult with the created quote or an error
 */
export async function createQuote(
  data: QuoteFormData
): Promise<ServiceResult<Quote>> {
  try {
    const res = await fetch('/api/admin/inventory/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Failed to create quote' };
    }

    const quote = await res.json();
    return { success: true, data: quote };
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Update an existing quote
 * @param id - The quote ID
 * @param data - The updated quote form data
 * @returns ServiceResult with the updated quote or an error
 */
export async function updateQuote(
  id: string,
  data: QuoteFormData
): Promise<ServiceResult<Quote>> {
  try {
    const res = await fetch(`/api/admin/inventory/quotes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Failed to update quote' };
    }

    const quote = await res.json();
    return { success: true, data: quote };
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}

/**
 * Delete a quote
 * @param id - The quote ID to delete
 * @returns ServiceResult with void on success or an error
 */
export async function deleteQuote(id: string): Promise<ServiceResult<void>> {
  try {
    const res = await fetch(`/api/admin/inventory/quotes/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || 'Failed to delete quote' };
    }

    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}
