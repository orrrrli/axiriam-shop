'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Trash2, Loader2, FileText } from 'lucide-react';
import { Quote, QuoteStatus } from '@/types/inventory';
import { formatPrice } from '@/lib/utils/helpers';
import {
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_STYLES,
  QUOTE_COLUMNS,
} from '@/lib/constants/admin/quotes.constants';
import { updateQuote, deleteQuote } from '@/lib/services/admin/quotes.service';
import { DataTable } from '@/components/admin/common/organisms/DataTable';

export default function QuotesView({ initialQuotes }: { initialQuotes: Quote[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialQuotes);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: QuoteStatus) {
    setItems((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
    
    const quote = items.find((q) => q.id === id);
    if (!quote) return;

    const result = await updateQuote(id, {
      clientName: quote.clientName,
      clientEmail: quote.clientEmail,
      clientPhone: quote.clientPhone,
      clientCompany: quote.clientCompany,
      status,
      validUntil: quote.validUntil,
      discount: quote.discount,
      notes: quote.notes,
      iva: quote.iva,
      includingIva: quote.includingIva,
      paymentMethod: quote.paymentMethod,
      items: quote.items,
      extras: quote.extras,
    });

    if (!result.success) {
      alert(result.error);
      // Revert optimistic update
      setItems((prev) =>
        prev.map((q) => (q.id === id ? quote : q))
      );
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta cotización?')) return;
    setDeletingId(id);
    try {
      const result = await deleteQuote(id);
      if (result.success) {
        setItems((prev) => prev.filter((q) => q.id !== id));
      } else {
        alert(result.error);
      }
    } finally {
      setDeletingId(null);
    }
  }

  const columns = [
    {
      header: 'Folio',
      key: 'quoteNumber',
      render: (value: string) => (
        <span className="font-mono">{value}</span>
      ),
    },
    {
      header: 'Cliente',
      key: 'clientName',
      render: (value: string) => (
        <span className="font-bold text-heading">{value}</span>
      ),
    },
    {
      header: 'Empresa',
      key: 'clientCompany',
      render: (value: string | undefined) => value ?? '—',
    },
    {
      header: 'Total',
      key: 'totalAmount',
      render: (value: number) => (
        <span className="font-bold text-heading">{formatPrice(value)}</span>
      ),
    },
    {
      header: 'IVA',
      key: 'iva',
      render: (value: number) => `${value}%`,
    },
    {
      header: 'Estado',
      key: 'status',
      render: (value: QuoteStatus, row: Quote) => (
        <select
          className={`text-[1.2rem] font-bold px-[0.8rem] py-[0.3rem] border-0 cursor-pointer focus:outline-none ${QUOTE_STATUS_STYLES[value]}`}
          value={value}
          onChange={(e) => handleStatusChange(row.id, e.target.value as QuoteStatus)}
        >
          {Object.entries(QUOTE_STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      ),
    },
    {
      header: 'Vence',
      key: 'validUntil',
      render: (value: Date) => new Date(value).toLocaleDateString('es-MX'),
    },
    {
      header: 'Acciones',
      key: 'id',
      render: (_: string, row: Quote) => (
        <div className="flex items-center gap-[0.8rem]">
          <button
            onClick={() => router.push(`/admin/inventory/quotes/${row.id}`)}
            className="button button-muted button-small flex items-center gap-[0.4rem]"
          >
            <Eye className="w-[1.2rem] h-[1.2rem]" /> Ver
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            disabled={deletingId === row.id}
            className="button button-danger button-small flex items-center gap-[0.4rem]"
          >
            {deletingId === row.id ? (
              <Loader2 className="w-[1.2rem] h-[1.2rem] animate-spin" />
            ) : (
              <Trash2 className="w-[1.2rem] h-[1.2rem]" />
            )}
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-[120rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
      <div className="flex items-center justify-between mb-[3rem]">
        <div>
          <h1 className="text-heading text-[2.4rem]">Cotizaciones</h1>
          <p className="text-subtle text-[1.4rem] mt-[0.4rem]">
            {items.length} cotizaciones registradas
          </p>
        </div>
        <button
          className="button flex items-center gap-[0.8rem] text-[1.3rem]"
          onClick={() => router.push('/admin/inventory/quotes/new')}
        >
          <Plus className="w-[1.6rem] h-[1.6rem]" /> Nueva Cotización
        </button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        emptyMessage="No hay cotizaciones registradas"
        emptyIcon={<FileText className="w-[3rem] h-[3rem] opacity-30" />}
        deletingId={deletingId}
      />
    </div>
  );
}
