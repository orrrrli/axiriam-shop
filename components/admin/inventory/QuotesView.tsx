'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Trash2, Loader2, FileText } from 'lucide-react';
import { Quote, QuoteStatus } from '@/types/inventory';
import { formatPrice } from '@/lib/utils/helpers';

const STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: 'Borrador',
  sent: 'Enviado',
  accepted: 'Aceptado',
  rejected: 'Rechazado',
  expired: 'Vencido',
};

const STATUS_STYLES: Record<QuoteStatus, string> = {
  draft: 'bg-body-alt text-paragraph',
  sent: 'bg-[#e3f2fd] text-[#1565c0]',
  accepted: 'bg-[#e8f5e9] text-[#2e7d32]',
  rejected: 'bg-[#ffebee] text-[#c62828]',
  expired: 'bg-[#fafafa] text-subtle',
};

const COLUMNS = ['Folio', 'Cliente', 'Empresa', 'Total', 'IVA', 'Estado', 'Vence', 'Acciones'];

export default function QuotesView({ initialQuotes }: { initialQuotes: Quote[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialQuotes);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: QuoteStatus) {
    setItems((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
    await fetch(`/api/admin/inventory/quotes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta cotización?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/inventory/quotes/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((q) => q.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="w-full max-w-[120rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
      <div className="flex items-center justify-between mb-[3rem]">
        <div>
          <h1 className="text-heading text-[2.4rem]">Cotizaciones</h1>
          <p className="text-subtle text-[1.4rem] mt-[0.4rem]">{items.length} cotizaciones registradas</p>
        </div>
        <button
          className="button flex items-center gap-[0.8rem] text-[1.3rem]"
          onClick={() => router.push('/admin/inventory/quotes/new')}
        >
          <Plus className="w-[1.6rem] h-[1.6rem]" /> Nueva Cotización
        </button>
      </div>

      <div className="bg-white border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-body-alt">
                {COLUMNS.map((h) => (
                  <th key={h} className="text-left py-[1.2rem] px-[2rem] text-[1.2rem] text-subtle font-bold uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length} className="py-[6rem] text-center text-subtle text-[1.4rem]">
                    <FileText className="w-[3rem] h-[3rem] mx-auto mb-[1rem] opacity-30" />
                    No hay cotizaciones registradas
                  </td>
                </tr>
              )}
              {items.map((quote) => (
                <tr key={quote.id} className="border-b border-border last:border-b-0 hover:bg-body transition-colors duration-200">
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph font-mono">
                    {quote.quoteNumber}
                  </td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-heading font-bold">
                    {quote.clientName}
                  </td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph">
                    {quote.clientCompany ?? '—'}
                  </td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-heading font-bold">
                    {formatPrice(quote.totalAmount)}
                  </td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph">
                    {quote.iva}%
                  </td>
                  <td className="py-[1.2rem] px-[2rem]">
                    <select
                      className={`text-[1.2rem] font-bold px-[0.8rem] py-[0.3rem] border-0 cursor-pointer focus:outline-none ${STATUS_STYLES[quote.status]}`}
                      value={quote.status}
                      onChange={(e) => handleStatusChange(quote.id, e.target.value as QuoteStatus)}
                    >
                      {Object.entries(STATUS_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph">
                    {new Date(quote.validUntil).toLocaleDateString('es-MX')}
                  </td>
                  <td className="py-[1.2rem] px-[2rem]">
                    <div className="flex items-center gap-[0.8rem]">
                      <button
                        onClick={() => router.push(`/admin/inventory/quotes/${quote.id}`)}
                        className="button button-muted button-small flex items-center gap-[0.4rem]"
                      >
                        <Eye className="w-[1.2rem] h-[1.2rem]" /> Ver
                      </button>
                      <button
                        onClick={() => handleDelete(quote.id)}
                        disabled={deletingId === quote.id}
                        className="button button-danger button-small flex items-center gap-[0.4rem]"
                      >
                        {deletingId === quote.id
                          ? <Loader2 className="w-[1.2rem] h-[1.2rem] animate-spin" />
                          : <Trash2 className="w-[1.2rem] h-[1.2rem]" />}
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
