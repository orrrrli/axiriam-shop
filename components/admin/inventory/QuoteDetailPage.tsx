'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Pencil,
  Download,
  Calendar,
  User,
  Mail,
  Phone,
  Building2,
  CreditCard,
  FileText,
} from 'lucide-react';
import { Quote } from '@/types/inventory';
import { formatPrice, formatDate } from '@/lib/utils/helpers';
import { generateQuotePDFFromQuote } from '@/lib/pdf/quote-pdf';
import {
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_STYLES,
} from '@/lib/constants/admin/quotes.constants';

interface QuoteDetailPageProps {
  quote: Quote;
}

export default function QuoteDetailPage({ quote }: QuoteDetailPageProps): React.ReactElement {
  const router = useRouter();

  function handleEdit(): void {
    router.push(`/admin/inventory/quotes/${quote.quoteNumber}/edit`);
  }

  function handleBack(): void {
    router.push('/admin/inventory/quotes');
  }

  const ivaLabel = quote.includingIva ? 'IVA incluido' : 'IVA no incluido';

  return (
    <div className="w-full max-w-[80rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
      {/* Back navigation */}
      <button
        type="button"
        onClick={handleBack}
        className="flex items-center gap-[0.8rem] text-[1.3rem] text-subtle hover:text-heading transition-colors duration-150 mb-[2.4rem]"
      >
        <ArrowLeft className="w-[1.6rem] h-[1.6rem]" />
        Volver a Cotizaciones
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-[3rem] flex-wrap gap-[1.6rem]">
        <div>
          <div className="flex items-center gap-[1.2rem] mb-[0.6rem]">
            <h1 className="text-heading text-[2.4rem]">{quote.quoteNumber}</h1>
            <span
              className={`inline-block text-[1.2rem] font-bold px-[1rem] py-[0.3rem] rounded-full ${QUOTE_STATUS_STYLES[quote.status]}`}
            >
              {QUOTE_STATUS_LABELS[quote.status]}
            </span>
          </div>
          <p className="text-subtle text-[1.3rem]">
            Creada el {formatDate(quote.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-[1rem]">
          <button
            type="button"
            onClick={handleEdit}
            className="button flex items-center gap-[0.8rem] text-[1.3rem]"
          >
            <Pencil className="w-[1.4rem] h-[1.4rem]" />
            Editar
          </button>
          <button
            type="button"
            onClick={() => generateQuotePDFFromQuote(quote)}
            className="button button-muted flex items-center gap-[0.8rem] text-[1.3rem]"
          >
            <Download className="w-[1.4rem] h-[1.4rem]" />
            PDF
          </button>
        </div>
      </div>

      {/* Client info + Quote settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2.4rem] mb-[3rem]">
        {/* Client info */}
        <div className="border border-border p-[2rem]">
          <h2 className="text-heading text-[1.6rem] font-bold mb-[1.6rem]">Información del cliente</h2>
          <div className="space-y-[1.2rem]">
            <InfoRow icon={<User className="w-[1.4rem] h-[1.4rem]" />} label="Nombre" value={quote.clientName} />
            {quote.clientEmail && (
              <InfoRow icon={<Mail className="w-[1.4rem] h-[1.4rem]" />} label="Email" value={quote.clientEmail} />
            )}
            {quote.clientPhone && (
              <InfoRow icon={<Phone className="w-[1.4rem] h-[1.4rem]" />} label="Teléfono" value={quote.clientPhone} />
            )}
            {quote.clientCompany && (
              <InfoRow icon={<Building2 className="w-[1.4rem] h-[1.4rem]" />} label="Empresa" value={quote.clientCompany} />
            )}
          </div>
        </div>

        {/* Quote settings */}
        <div className="border border-border p-[2rem]">
          <h2 className="text-heading text-[1.6rem] font-bold mb-[1.6rem]">Detalles de la cotización</h2>
          <div className="space-y-[1.2rem]">
            <InfoRow icon={<Calendar className="w-[1.4rem] h-[1.4rem]" />} label="Válida hasta" value={formatDate(quote.validUntil)} />
            <InfoRow icon={<CreditCard className="w-[1.4rem] h-[1.4rem]" />} label="Método de pago" value={quote.paymentMethod} />
            <InfoRow icon={<FileText className="w-[1.4rem] h-[1.4rem]" />} label="IVA" value={`${quote.iva}% — ${ivaLabel}`} />
          </div>
        </div>
      </div>

      {/* Items table */}
      {quote.items.length > 0 && (
        <div className="mb-[3rem]">
          <h2 className="text-heading text-[1.6rem] font-bold mb-[1.2rem]">Productos</h2>
          <div className="border border-border overflow-x-auto">
            <table className="w-full text-[1.3rem]">
              <thead>
                <tr className="border-b border-border bg-body-alt">
                  <th className="text-left px-[1.6rem] py-[1rem] text-subtle font-medium">Producto</th>
                  <th className="text-center px-[1.6rem] py-[1rem] text-subtle font-medium">Cant.</th>
                  <th className="text-right px-[1.6rem] py-[1rem] text-subtle font-medium">P. Unit.</th>
                  <th className="text-right px-[1.6rem] py-[1rem] text-subtle font-medium">Desc.</th>
                  <th className="text-right px-[1.6rem] py-[1rem] text-subtle font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item, i) => {
                  const sub = item.unitPrice * item.quantity - (item.discount ?? 0);
                  return (
                    <tr key={i} className="border-b border-border last:border-b-0">
                      <td className="px-[1.6rem] py-[1.2rem] text-heading">
                        {item.manualName || item.description || item.itemId}
                        {item.manualCategory && (
                          <span className="block text-[1.1rem] text-subtle mt-[0.2rem]">
                            {item.manualCategory}{item.manualType ? ` · ${item.manualType}` : ''}
                          </span>
                        )}
                      </td>
                      <td className="px-[1.6rem] py-[1.2rem] text-center text-paragraph">{item.quantity}</td>
                      <td className="px-[1.6rem] py-[1.2rem] text-right text-paragraph">{formatPrice(item.unitPrice)}</td>
                      <td className="px-[1.6rem] py-[1.2rem] text-right text-paragraph">
                        {item.discount ? formatPrice(item.discount) : '—'}
                      </td>
                      <td className="px-[1.6rem] py-[1.2rem] text-right font-medium text-heading">{formatPrice(sub)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Extras table */}
      {quote.extras.length > 0 && (
        <div className="mb-[3rem]">
          <h2 className="text-heading text-[1.6rem] font-bold mb-[1.2rem]">Extras</h2>
          <div className="border border-border overflow-x-auto">
            <table className="w-full text-[1.3rem]">
              <thead>
                <tr className="border-b border-border bg-body-alt">
                  <th className="text-left px-[1.6rem] py-[1rem] text-subtle font-medium">Descripción</th>
                  <th className="text-center px-[1.6rem] py-[1rem] text-subtle font-medium">Cant.</th>
                  <th className="text-right px-[1.6rem] py-[1rem] text-subtle font-medium">Precio</th>
                  <th className="text-right px-[1.6rem] py-[1rem] text-subtle font-medium">Desc.</th>
                  <th className="text-right px-[1.6rem] py-[1rem] text-subtle font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {quote.extras.map((extra, i) => {
                  const sub = extra.price * (extra.quantity ?? 1) - (extra.discount ?? 0);
                  return (
                    <tr key={i} className="border-b border-border last:border-b-0">
                      <td className="px-[1.6rem] py-[1.2rem] text-heading">{extra.description}</td>
                      <td className="px-[1.6rem] py-[1.2rem] text-center text-paragraph">{extra.quantity ?? 1}</td>
                      <td className="px-[1.6rem] py-[1.2rem] text-right text-paragraph">{formatPrice(extra.price)}</td>
                      <td className="px-[1.6rem] py-[1.2rem] text-right text-paragraph">
                        {extra.discount ? formatPrice(extra.discount) : '—'}
                      </td>
                      <td className="px-[1.6rem] py-[1.2rem] text-right font-medium text-heading">{formatPrice(sub)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes + Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2.4rem]">
        {/* Notes */}
        <div>
          {quote.notes && (
            <div className="border border-border p-[2rem]">
              <h2 className="text-heading text-[1.6rem] font-bold mb-[1rem]">Notas</h2>
              <p className="text-[1.3rem] text-paragraph whitespace-pre-wrap">{quote.notes}</p>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="border border-border p-[2rem]">
          <h2 className="text-heading text-[1.6rem] font-bold mb-[1.2rem]">Resumen</h2>
          <div className="space-y-[0.8rem] text-[1.3rem]">
            <div className="flex justify-between">
              <span className="text-subtle">Subtotal</span>
              <span className="text-heading">{formatPrice(quote.subtotal)}</span>
            </div>
            {quote.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-subtle">Descuento</span>
                <span className="text-red-600">-{formatPrice(quote.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-subtle">IVA ({quote.iva}%)</span>
              <span className="text-heading">{ivaLabel}</span>
            </div>
            <div className="border-t border-border pt-[1rem] mt-[1rem] flex justify-between">
              <span className="text-heading font-bold text-[1.5rem]">Total</span>
              <span className="text-heading font-bold text-[1.5rem]">{formatPrice(quote.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helper component ──────────────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }): React.ReactElement {
  return (
    <div className="flex items-center gap-[1rem] text-[1.3rem]">
      <span className="text-subtle">{icon}</span>
      <span className="text-subtle min-w-[8rem]">{label}</span>
      <span className="text-heading font-medium">{value}</span>
    </div>
  );
}
