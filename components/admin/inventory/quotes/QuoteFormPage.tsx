'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Quote, QuoteFormData } from '@/types/inventory';
import { createQuote, updateQuote } from '@/lib/services/admin/quotes.service';
import { buildCreatePayload, buildUpdatePayload } from '@/lib/services/quote-domain.service';
import QuoteForm from './QuoteForm';

interface QuoteFormPageProps {
  quote?: Quote;
}

function toFormData(quote: Quote): QuoteFormData {
  return {
    clientName: quote.clientName,
    clientEmail: quote.clientEmail,
    clientPhone: quote.clientPhone,
    clientCompany: quote.clientCompany,
    status: quote.status,
    validUntil: quote.validUntil,
    discount: quote.discount,
    notes: quote.notes,
    iva: quote.iva,
    includingIva: quote.includingIva,
    paymentMethod: quote.paymentMethod,
    items: quote.items,
    extras: quote.extras,
  };
}

export default function QuoteFormPage({ quote }: QuoteFormPageProps): React.ReactElement {
  const router = useRouter();
  const isEdit = !!quote;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: QuoteFormData): Promise<void> {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = isEdit
        ? await updateQuote(quote.id, buildUpdatePayload(data))
        : await createQuote(buildCreatePayload(data));

      if (result.success) {
        router.push('/admin/inventory/quotes');
      } else {
        setError(result.error);
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel(): void {
    router.push('/admin/inventory/quotes');
  }

  return (
    <div className="w-full max-w-[80rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
      {/* Back navigation */}
      <button
        type="button"
        onClick={handleCancel}
        className="flex items-center gap-[0.8rem] text-[1.3rem] text-subtle hover:text-heading transition-colors duration-150 mb-[2.4rem]"
      >
        <ArrowLeft className="w-[1.6rem] h-[1.6rem]" />
        Volver a Cotizaciones
      </button>

      {/* Page header */}
      <div className="mb-[3rem]">
        <h1 className="text-heading text-[2.4rem]">
          {isEdit ? `Editar ${quote.quoteNumber}` : 'Nueva Cotización'}
        </h1>
        {isEdit && (
          <p className="text-subtle text-[1.4rem] mt-[0.4rem]">
            Cliente: {quote.clientName}
          </p>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-[2.4rem] flex items-center gap-[0.8rem] px-[1.6rem] py-[1.2rem] bg-red-50 border border-red-200 rounded text-[1.3rem] text-red-700">
          <AlertCircle className="w-[1.6rem] h-[1.6rem] shrink-0" />
          {error}
        </div>
      )}

      {/* Form */}
      <QuoteForm
        initialData={isEdit ? toFormData(quote) : undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
