'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, ChevronDown, Loader2 } from 'lucide-react';
import {
  QuoteFormData,
  QuoteItem,
  SaleExtra,
  QuoteStatus,
  PaymentMethod,
  IvaRate,
} from '@/types/inventory';
import { calculateTotals } from '@/lib/services/quote-domain.service';
import { QUOTE_STATUS_LABELS, EMPTY_QUOTE_FORM } from '@/lib/constants/admin/quotes.constants';
import { formatPrice } from '@/lib/utils/helpers';
import { FormField } from '@/components/admin/common/molecules/FormField';
import { FormInput } from '@/components/admin/common/atoms/FormInput';
import { FormTextarea } from '@/components/admin/common/atoms/FormTextarea';
import { Button } from '@/components/admin/common/atoms/Button';

// ─── Constants ─────────────────────────────────────────────────────────────

const PAYMENT_METHODS: PaymentMethod[] = [
  'Efectivo',
  'Tarjeta de crédito',
  'Transferencia',
  'Deposito',
];

const STATUS_OPTIONS: QuoteStatus[] = ['draft', 'sent', 'accepted'];

const INPUT =
  'w-full bg-[#f5f5f5] border-0 border-b border-gray-300 px-[1.2rem] py-[1rem] text-[1.4rem] text-heading focus:outline-none focus:border-blue-500 transition-colors duration-150 placeholder:text-gray-400';

const SELECT = `${INPUT} appearance-none pr-[3.6rem] cursor-pointer`;

const CELL_INPUT =
  'w-full bg-transparent border-0 border-b border-gray-200 px-[0.8rem] py-[0.6rem] text-[1.3rem] text-heading focus:outline-none focus:border-blue-500 transition-colors duration-150 placeholder:text-gray-400';

// ─── Types ──────────────────────────────────────────────────────────────────

interface QuoteFormProps {
  initialData?: QuoteFormData;
  onSubmit: (data: QuoteFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function toDateInputValue(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

function emptyItem(): QuoteItem {
  return { itemId: '', manualName: '', quantity: 1, unitPrice: 0, discount: 0 };
}

function emptyExtra(): SaleExtra {
  return { description: '', price: 0, quantity: 1, discount: 0 };
}

function itemSubtotal(item: QuoteItem): number {
  const total = item.unitPrice * item.quantity;
  const disc = item.discount ? total * (item.discount / 100) : 0;
  return total - disc;
}

function extraSubtotal(extra: SaleExtra): number {
  const qty = extra.quantity ?? 1;
  const total = extra.price * qty;
  const disc = extra.discount ? total * (extra.discount / 100) : 0;
  return total - disc;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function QuoteForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: QuoteFormProps): React.ReactElement {
  const [form, setForm] = useState<QuoteFormData>(initialData ?? EMPTY_QUOTE_FORM);

  const totals = useMemo(() => calculateTotals(form), [form]);

  function setField<K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]): void {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ─── Item handlers ────────────────────────────────────────────────────────

  function addItem(): void {
    setField('items', [...form.items, emptyItem()]);
  }

  function updateItem(index: number, patch: Partial<QuoteItem>): void {
    setField(
      'items',
      form.items.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  function removeItem(index: number): void {
    setField('items', form.items.filter((_, i) => i !== index));
  }

  // ─── Extra handlers ───────────────────────────────────────────────────────

  function addExtra(): void {
    setField('extras', [...form.extras, emptyExtra()]);
  }

  function updateExtra(index: number, patch: Partial<SaleExtra>): void {
    setField(
      'extras',
      form.extras.map((extra, i) => (i === index ? { ...extra, ...patch } : extra))
    );
  }

  function removeExtra(index: number): void {
    setField('extras', form.extras.filter((_, i) => i !== index));
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    onSubmit(form);
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[2.4rem]">

      {/* ── CLIENT INFO ──────────────────────────────────────────────────────── */}
      <section className="bg-white border border-border rounded-[0.8rem] p-[2.4rem]">
        <h3 className="text-[1.5rem] font-semibold text-heading mb-[2rem]">
          Información del Cliente
        </h3>
        <div className="grid grid-cols-2 gap-x-[3.2rem] gap-y-[2rem]">
          <FormField label="Nombre" required>
            <FormInput
              value={form.clientName}
              onChange={(v) => setField('clientName', v)}
              placeholder="Ej. Juan García"
              className={INPUT}
              aria-label="Nombre del cliente"
            />
          </FormField>

          <FormField label="Empresa">
            <FormInput
              value={form.clientCompany ?? ''}
              onChange={(v) => setField('clientCompany', v || undefined)}
              placeholder="Ej. Empresa SA de CV"
              className={INPUT}
              aria-label="Empresa del cliente"
            />
          </FormField>

          <FormField label="Email">
            <FormInput
              value={form.clientEmail ?? ''}
              onChange={(v) => setField('clientEmail', v || undefined)}
              placeholder="correo@empresa.com"
              className={INPUT}
              aria-label="Email del cliente"
            />
          </FormField>

          <FormField label="Teléfono">
            <FormInput
              value={form.clientPhone ?? ''}
              onChange={(v) => setField('clientPhone', v || undefined)}
              placeholder="+52 664 000 0000"
              className={INPUT}
              aria-label="Teléfono del cliente"
            />
          </FormField>
        </div>
      </section>

      {/* ── QUOTE SETTINGS ────────────────────────────────────────────────────── */}
      <section className="bg-white border border-border rounded-[0.8rem] p-[2.4rem]">
        <h3 className="text-[1.5rem] font-semibold text-heading mb-[2rem]">
          Configuración de la Cotización
        </h3>

        <div className="grid grid-cols-3 gap-x-[3.2rem] gap-y-[2rem]">
          <FormField label="Estado">
            <div className="relative">
              <select
                className={SELECT}
                value={form.status}
                onChange={(e) => setField('status', e.target.value as QuoteStatus)}
                aria-label="Estado de la cotización"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {QUOTE_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-[1.2rem] top-1/2 -translate-y-1/2 w-[1.4rem] h-[1.4rem] text-subtle" />
            </div>
          </FormField>

          <FormField label="Válido hasta">
            <input
              type="date"
              className={INPUT}
              value={toDateInputValue(form.validUntil)}
              onChange={(e) =>
                setField('validUntil', new Date(e.target.value + 'T12:00:00'))
              }
              aria-label="Fecha de vencimiento"
            />
          </FormField>

          <FormField label="Forma de pago">
            <div className="relative">
              <select
                className={SELECT}
                value={form.paymentMethod}
                onChange={(e) => setField('paymentMethod', e.target.value as PaymentMethod)}
                aria-label="Forma de pago"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-[1.2rem] top-1/2 -translate-y-1/2 w-[1.4rem] h-[1.4rem] text-subtle" />
            </div>
          </FormField>
        </div>

        <div className="mt-[2rem] flex flex-col gap-[1.2rem]">
          <label className="flex items-center gap-[0.8rem] cursor-pointer">
            <input
              type="checkbox"
              checked={form.includingIva ?? true}
              onChange={(e) => setField('includingIva', e.target.checked)}
              className="w-[1.6rem] h-[1.6rem] accent-heading"
            />
            <span className="text-[1.3rem] text-heading">IVA ya incluido en los precios</span>
          </label>

          <div>
            <p className="text-[1.2rem] font-medium text-gray-500 mb-[0.8rem]">Tasa de IVA</p>
            <div className="flex items-center gap-[2rem]">
              {([8, 16] as IvaRate[]).map((rate) => (
                <label key={rate} className="flex items-center gap-[0.6rem] cursor-pointer">
                  <input
                    type="radio"
                    name="iva"
                    value={rate}
                    checked={form.iva === rate}
                    onChange={() => setField('iva', rate)}
                    className="accent-heading w-[1.6rem] h-[1.6rem]"
                  />
                  <span className="text-[1.3rem] text-heading">{rate}%</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ITEMS ─────────────────────────────────────────────────────────────── */}
      <section className="bg-white border border-border rounded-[0.8rem] p-[2.4rem]">
        <div className="flex items-center justify-between mb-[1.6rem]">
          <h3 className="text-[1.5rem] font-semibold text-heading">Artículos</h3>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-[0.6rem] text-[1.3rem] text-blue-600 hover:text-blue-800 transition-colors duration-150"
          >
            <Plus className="w-[1.4rem] h-[1.4rem]" /> Agregar artículo
          </button>
        </div>

        {form.items.length === 0 ? (
          <p className="text-center text-[1.3rem] text-subtle py-[2.4rem] border border-dashed border-border rounded-[0.4rem]">
            Sin artículos. Haz clic en &quot;Agregar artículo&quot; para comenzar.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-[0.8rem] px-[0.8rem] text-[1.1rem] text-admin-muted font-semibold uppercase tracking-wide w-[38%]">
                    Descripción
                  </th>
                  <th className="text-left py-[0.8rem] px-[0.8rem] text-[1.1rem] text-admin-muted font-semibold uppercase tracking-wide w-[12%]">
                    Cant.
                  </th>
                  <th className="text-left py-[0.8rem] px-[0.8rem] text-[1.1rem] text-admin-muted font-semibold uppercase tracking-wide w-[18%]">
                    Precio Unit.
                  </th>
                  <th className="text-left py-[0.8rem] px-[0.8rem] text-[1.1rem] text-admin-muted font-semibold uppercase tracking-wide w-[12%]">
                    Desc. %
                  </th>
                  <th className="text-right py-[0.8rem] px-[0.8rem] text-[1.1rem] text-admin-muted font-semibold uppercase tracking-wide w-[16%]">
                    Subtotal
                  </th>
                  <th className="w-[4%]" />
                </tr>
              </thead>
              <tbody>
                {form.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-border last:border-b-0">
                    <td className="py-[0.8rem] px-[0.4rem]">
                      <input
                        type="text"
                        className={CELL_INPUT}
                        value={item.manualName ?? ''}
                        onChange={(e) => updateItem(idx, { manualName: e.target.value })}
                        placeholder="Nombre del artículo"
                        aria-label={`Artículo ${idx + 1} nombre`}
                      />
                    </td>
                    <td className="py-[0.8rem] px-[0.4rem]">
                      <input
                        type="number"
                        className={CELL_INPUT}
                        value={item.quantity || ''}
                        onChange={(e) =>
                          updateItem(idx, { quantity: Number(e.target.value) || 1 })
                        }
                        min={1}
                        placeholder="1"
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        aria-label={`Artículo ${idx + 1} cantidad`}
                      />
                    </td>
                    <td className="py-[0.8rem] px-[0.4rem]">
                      <input
                        type="number"
                        className={CELL_INPUT}
                        value={item.unitPrice || ''}
                        onChange={(e) =>
                          updateItem(idx, { unitPrice: Number(e.target.value) || 0 })
                        }
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        aria-label={`Artículo ${idx + 1} precio`}
                      />
                    </td>
                    <td className="py-[0.8rem] px-[0.4rem]">
                      <input
                        type="number"
                        className={CELL_INPUT}
                        value={item.discount ?? ''}
                        onChange={(e) =>
                          updateItem(idx, { discount: Number(e.target.value) || 0 })
                        }
                        min={0}
                        max={100}
                        placeholder="0"
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        aria-label={`Artículo ${idx + 1} descuento`}
                      />
                    </td>
                    <td className="py-[0.8rem] px-[0.8rem] text-right">
                      <span className="text-[1.3rem] font-medium text-heading">
                        {formatPrice(itemSubtotal(item))}
                      </span>
                    </td>
                    <td className="py-[0.8rem] px-[0.4rem]">
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="p-[0.4rem] text-gray-300 hover:text-red-500 transition-colors duration-150"
                        aria-label={`Eliminar artículo ${idx + 1}`}
                      >
                        <Trash2 className="w-[1.4rem] h-[1.4rem]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── EXTRAS ────────────────────────────────────────────────────────────── */}
      <section className="bg-white border border-border rounded-[0.8rem] p-[2.4rem]">
        <div className="flex items-center justify-between mb-[1.6rem]">
          <h3 className="text-[1.5rem] font-semibold text-heading">
            Extras / Servicios adicionales
          </h3>
          <button
            type="button"
            onClick={addExtra}
            className="flex items-center gap-[0.6rem] text-[1.3rem] text-blue-600 hover:text-blue-800 transition-colors duration-150"
          >
            <Plus className="w-[1.4rem] h-[1.4rem]" /> Agregar extra
          </button>
        </div>

        {form.extras.length === 0 ? (
          <p className="text-center text-[1.3rem] text-subtle py-[2.4rem] border border-dashed border-border rounded-[0.4rem]">
            Sin extras. Haz clic en &quot;Agregar extra&quot; para incluir servicios adicionales.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-[0.8rem] px-[0.8rem] text-[1.1rem] text-admin-muted font-semibold uppercase tracking-wide w-[38%]">
                    Descripción
                  </th>
                  <th className="text-left py-[0.8rem] px-[0.8rem] text-[1.1rem] text-admin-muted font-semibold uppercase tracking-wide w-[18%]">
                    Precio
                  </th>
                  <th className="text-left py-[0.8rem] px-[0.8rem] text-[1.1rem] text-admin-muted font-semibold uppercase tracking-wide w-[12%]">
                    Cant.
                  </th>
                  <th className="text-left py-[0.8rem] px-[0.8rem] text-[1.1rem] text-admin-muted font-semibold uppercase tracking-wide w-[12%]">
                    Desc. %
                  </th>
                  <th className="text-right py-[0.8rem] px-[0.8rem] text-[1.1rem] text-admin-muted font-semibold uppercase tracking-wide w-[16%]">
                    Subtotal
                  </th>
                  <th className="w-[4%]" />
                </tr>
              </thead>
              <tbody>
                {form.extras.map((extra, idx) => (
                  <tr key={idx} className="border-b border-border last:border-b-0">
                    <td className="py-[0.8rem] px-[0.4rem]">
                      <input
                        type="text"
                        className={CELL_INPUT}
                        value={extra.description}
                        onChange={(e) => updateExtra(idx, { description: e.target.value })}
                        placeholder="Descripción del servicio"
                        aria-label={`Extra ${idx + 1} descripción`}
                      />
                    </td>
                    <td className="py-[0.8rem] px-[0.4rem]">
                      <input
                        type="number"
                        className={CELL_INPUT}
                        value={extra.price || ''}
                        onChange={(e) =>
                          updateExtra(idx, { price: Number(e.target.value) || 0 })
                        }
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        aria-label={`Extra ${idx + 1} precio`}
                      />
                    </td>
                    <td className="py-[0.8rem] px-[0.4rem]">
                      <input
                        type="number"
                        className={CELL_INPUT}
                        value={extra.quantity ?? ''}
                        onChange={(e) =>
                          updateExtra(idx, { quantity: Number(e.target.value) || 1 })
                        }
                        min={1}
                        placeholder="1"
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        aria-label={`Extra ${idx + 1} cantidad`}
                      />
                    </td>
                    <td className="py-[0.8rem] px-[0.4rem]">
                      <input
                        type="number"
                        className={CELL_INPUT}
                        value={extra.discount ?? ''}
                        onChange={(e) =>
                          updateExtra(idx, { discount: Number(e.target.value) || 0 })
                        }
                        min={0}
                        max={100}
                        placeholder="0"
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        aria-label={`Extra ${idx + 1} descuento`}
                      />
                    </td>
                    <td className="py-[0.8rem] px-[0.8rem] text-right">
                      <span className="text-[1.3rem] font-medium text-heading">
                        {formatPrice(extraSubtotal(extra))}
                      </span>
                    </td>
                    <td className="py-[0.8rem] px-[0.4rem]">
                      <button
                        type="button"
                        onClick={() => removeExtra(idx)}
                        className="p-[0.4rem] text-gray-300 hover:text-red-500 transition-colors duration-150"
                        aria-label={`Eliminar extra ${idx + 1}`}
                      >
                        <Trash2 className="w-[1.4rem] h-[1.4rem]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── NOTES + TOTALS ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-[2.4rem]">

        {/* Notes */}
        <section className="bg-white border border-border rounded-[0.8rem] p-[2.4rem]">
          <h3 className="text-[1.5rem] font-semibold text-heading mb-[1.6rem]">Notas</h3>
          <FormTextarea
            value={form.notes ?? ''}
            onChange={(v) => setField('notes', v || undefined)}
            rows={7}
            placeholder="Términos, condiciones, observaciones para el cliente..."
            className="w-full bg-[#f5f5f5] border-0 border-b border-gray-300 px-[1.2rem] py-[1rem] text-[1.4rem] text-heading focus:outline-none focus:border-blue-500 resize-none placeholder:text-gray-400"
            aria-label="Notas de la cotización"
          />
        </section>

        {/* Totals */}
        <section className="bg-white border border-border rounded-[0.8rem] p-[2.4rem] flex flex-col justify-between">
          <h3 className="text-[1.5rem] font-semibold text-heading mb-[1.6rem]">Resumen</h3>

          <div className="flex flex-col gap-[1.4rem]">
            <div className="flex items-center justify-between text-[1.3rem]">
              <span className="text-subtle">Subtotal</span>
              <span className="text-heading">{formatPrice(totals.subtotal)}</span>
            </div>

            {/* Global discount inline */}
            <div className="flex items-center justify-between gap-[1.6rem]">
              <div className="flex items-center gap-[1rem]">
                <span className="text-[1.3rem] text-subtle whitespace-nowrap">Descuento global</span>
                <div className="relative w-[7rem]">
                  <input
                    type="number"
                    className="w-full bg-[#f5f5f5] border-0 border-b border-gray-300 px-[0.8rem] py-[0.4rem] pr-[2rem] text-[1.3rem] text-heading text-right focus:outline-none focus:border-blue-500"
                    value={form.discount === 0 ? '' : form.discount}
                    onChange={(e) => setField('discount', Number(e.target.value) || 0)}
                    min={0}
                    max={100}
                    placeholder="0"
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    aria-label="Descuento global"
                  />
                  <span className="absolute right-[0.4rem] top-1/2 -translate-y-1/2 text-[1.2rem] text-subtle pointer-events-none">
                    %
                  </span>
                </div>
              </div>
              {totals.discountAmount > 0 && (
                <span className="text-[1.3rem] text-red-500 font-medium">
                  -{formatPrice(totals.discountAmount)}
                </span>
              )}
            </div>

            {!form.includingIva && (
              <div className="flex items-center justify-between text-[1.3rem]">
                <span className="text-subtle">IVA ({form.iva}%)</span>
                <span className="text-heading">{formatPrice(totals.ivaAmount)}</span>
              </div>
            )}

            <div className="border-t border-border pt-[1.4rem] flex items-center justify-between">
              <span className="text-[1.5rem] font-semibold text-heading">Total</span>
              <span className="text-[2.2rem] font-bold text-heading">
                {formatPrice(totals.totalAmount)}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* ── ACTIONS ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-[1.2rem] pb-[1.6rem]">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-[0.8rem]"
        >
          {isSubmitting && <Loader2 className="w-[1.4rem] h-[1.4rem] animate-spin" />}
          {isSubmitting ? 'Guardando...' : 'Guardar Cotización'}
        </Button>
      </div>
    </form>
  );
}
