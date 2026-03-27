'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sileo } from 'sileo';
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Download,
  Search,
  ChevronDown,
} from 'lucide-react';
import { Quote, QuoteStatus } from '@/types/inventory';
import { formatPrice, formatDate } from '@/lib/utils/helpers';
import {
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_STYLES,
} from '@/lib/constants/admin/quotes.constants';
import { useQuotes } from '@/lib/hooks/use-quotes';
import { DataTable, Column } from '@/components/admin/common/organisms/data-table';
import ConfirmToast from '@/components/molecules/confirm-toast';

type SortOrder = 'asc' | 'desc';

export default function QuotesView({ initialQuotes }: { initialQuotes: Quote[] }): React.ReactElement {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [pendingDelete, setPendingDelete] = useState<Quote | null>(null);

  const {
    filteredQuotes,
    handleDeleteConfirm: deleteQuoteById,
    handleDownloadPDF,
  } = useQuotes({ initialQuotes, searchQuery, sortOrder });

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function openDelete(quote: Quote): void {
    setPendingDelete(quote);
  }

  function handleDeleteCancel(): void {
    setPendingDelete(null);
  }

  function handleDeleteConfirm(): void {
    if (!pendingDelete) return;
    const quote = pendingDelete;
    setPendingDelete(null);

    const promise = deleteQuoteById(quote.id).then((success) => {
      if (!success) throw new Error('Error al eliminar la cotización');
    });

    sileo.promise(promise, {
      loading: { title: `Eliminando cotización ${quote.quoteNumber}...` },
      success: { title: `Cotización ${quote.quoteNumber} eliminada` },
      error: { title: 'Error al eliminar la cotización' },
    });
  }

  // ─── Table columns ─────────────────────────────────────────────────────────

  const columns: Column<Quote>[] = [
    {
      header: '#',
      key: 'quoteNumber',
      render: (value: unknown) => (
        <span className="font-mono text-[1.3rem] font-medium tracking-wide text-subtle">{value as string}</span>
      ),
    },
    {
      header: 'Cliente',
      key: 'clientName',
      render: (value: unknown, row: Quote) => (
        <div>
          <span className="font-bold text-heading">{value as string}</span>
          {row.clientCompany && (
            <span className="block text-[1.1rem] text-gray-400 mt-[0.2rem]">
              {row.clientCompany}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Estado',
      key: 'status',
      render: (value: unknown) => {
        const status = value as QuoteStatus;
        return (
          <span
            className={`inline-block text-[1.2rem] font-bold px-[1rem] py-[0.3rem] rounded-full ${QUOTE_STATUS_STYLES[status]}`}
          >
            {QUOTE_STATUS_LABELS[status]}
          </span>
        );
      },
    },
    {
      header: 'Válido hasta',
      key: 'validUntil',
      render: (value: unknown) => (
        <span className="text-[1.3rem]">{formatDate(value as Date)}</span>
      ),
    },
    {
      header: 'Total',
      key: 'totalAmount',
      render: (value: unknown) => (
        <span className="font-bold text-heading">{formatPrice(value as number)}</span>
      ),
    },
    {
      header: 'Acciones',
      key: 'id',
      render: (_: unknown, row: Quote) => (
        <div className="flex items-center gap-[0.8rem]">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); router.push(`/admin/inventory/quotes/${row.quoteNumber}/edit`); }}
            className="p-[0.8rem] text-gray-400 hover:text-[#101010] hover:bg-gray-100 rounded-[0.6rem] transition-colors duration-150"
            aria-label="Editar cotización"
          >
            <Pencil className="w-[1.8rem] h-[1.8rem]" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleDownloadPDF(row); }}
            className="p-[0.8rem] text-gray-400 hover:text-[#101010] hover:bg-gray-100 rounded-[0.6rem] transition-colors duration-150"
            aria-label="Descargar PDF"
          >
            <Download className="w-[1.8rem] h-[1.8rem]" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); openDelete(row); }}
            className="p-[0.8rem] text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-[0.6rem] transition-colors duration-150"
            aria-label="Eliminar cotización"
          >
            <Trash2 className="w-[1.8rem] h-[1.8rem]" />
          </button>
        </div>
      ),
    },
  ];

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
    {pendingDelete && (
      <ConfirmToast
        title="Eliminar Cotización"
        productName={pendingDelete.quoteNumber}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    )}
    <div className="w-full max-w-[120rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
      {/* Header */}
      <div className="flex items-center justify-between mb-[2.4rem]">
        <div>
          <h1 className="text-heading text-[2.4rem]">Cotizaciones</h1>
          <p className="text-subtle text-[1.4rem] mt-[0.4rem]">
            {filteredQuotes.length} cotizaciones registradas
          </p>
        </div>
        <button
          type="button"
          className="button flex items-center gap-[0.8rem] text-[1.3rem]"
          onClick={() => router.push('/admin/inventory/quotes/new')}
        >
          <Plus className="w-[1.6rem] h-[1.6rem]" /> Nueva Cotización
        </button>
      </div>

      {/* Controls: Search + Sort */}
      <div className="flex items-center justify-between gap-[1.6rem] mb-[2rem] flex-wrap">
        <div className="relative flex-1 max-w-[32rem]">
          <Search className="pointer-events-none absolute left-[1.2rem] top-1/2 -translate-y-1/2 w-[1.5rem] h-[1.5rem] text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, folio o empresa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-[3.6rem] pr-[1.2rem] py-[0.8rem] bg-white border border-gray-200 rounded-[0.8rem] text-[1.3rem] text-heading placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors duration-150 hover:border-gray-300"
          />
        </div>

        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="appearance-none bg-white border border-gray-200 rounded-[0.8rem] px-[1.4rem] py-[0.8rem] pr-[3.4rem] text-[1.3rem] font-medium text-gray-600 focus:outline-none focus:border-gray-400 cursor-pointer transition-colors duration-150 hover:border-gray-300"
          >
            <option value="desc">Más reciente</option>
            <option value="asc">Más antiguo</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-[1rem] top-1/2 -translate-y-1/2 w-[1.4rem] h-[1.4rem] text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredQuotes}
        emptyMessage="No hay cotizaciones registradas"
        emptyIcon={<FileText className="w-[3rem] h-[3rem] opacity-30" />}
        onRowClick={(item) => router.push(`/admin/inventory/quotes/${item.quoteNumber}`)}
      />

    </div>
    </>
  );
}
