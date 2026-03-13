'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Trash2, Loader2, Truck } from 'lucide-react';
import { Sale, SaleStatus } from '@/types/inventory';
import { formatPrice } from '@/lib/utils/helpers';

const STATUS_LABELS: Record<SaleStatus, string> = {
  pending: 'Pendiente',
  shipped: 'Enviado',
  delivered: 'Entregado',
};

const STATUS_STYLES: Record<SaleStatus, string> = {
  pending: 'bg-[#fff8e1] text-[#f57f17]',
  shipped: 'bg-[#e3f2fd] text-[#1565c0]',
  delivered: 'bg-[#e8f5e9] text-[#2e7d32]',
};

const PLATFORM_ICONS: Record<string, string> = {
  facebook: 'FB',
  instagram: 'IG',
  whatsapp: 'WA',
};

const SHIPPING_LABELS: Record<string, string> = {
  local: 'Local',
  nacional: 'Nacional',
};

const COLUMNS = ['Cliente', 'Red Social', 'Tipo Envío', 'Total', 'Estado', 'Entrega', 'Acciones'];

export default function SalesView({ initialSales }: { initialSales: Sale[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialSales);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: SaleStatus) {
    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    await fetch(`/api/admin/inventory/sales/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este envío?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/inventory/sales/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="w-full max-w-[120rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
      <div className="flex items-center justify-between mb-[3rem]">
        <div>
          <h1 className="text-heading text-[2.4rem]">Envíos</h1>
          <p className="text-subtle text-[1.4rem] mt-[0.4rem]">{items.length} envíos registrados</p>
        </div>
        <button
          className="button flex items-center gap-[0.8rem] text-[1.3rem]"
          onClick={() => router.push('/admin/inventory/sales/new')}
        >
          <Plus className="w-[1.6rem] h-[1.6rem]" /> Nuevo Envío
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
                    <Truck className="w-[3rem] h-[3rem] mx-auto mb-[1rem] opacity-30" />
                    No hay envíos registrados
                  </td>
                </tr>
              )}
              {items.map((sale) => (
                <tr key={sale.id} className="border-b border-border last:border-b-0 hover:bg-body transition-colors duration-200">
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-heading font-bold">
                    {sale.name}
                  </td>
                  <td className="py-[1.2rem] px-[2rem]">
                    <span className="inline-flex items-center gap-[0.4rem] bg-body-alt px-[0.8rem] py-[0.3rem] text-[1.2rem] text-paragraph font-bold">
                      {PLATFORM_ICONS[sale.socialMediaPlatform] ?? sale.socialMediaPlatform}
                      {' '}@{sale.socialMediaUsername}
                    </span>
                  </td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph">
                    {SHIPPING_LABELS[sale.shippingType] ?? sale.shippingType}
                  </td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-heading font-bold">
                    {formatPrice(sale.totalAmount)}
                  </td>
                  <td className="py-[1.2rem] px-[2rem]">
                    <select
                      className={`text-[1.2rem] font-bold px-[0.8rem] py-[0.3rem] border-0 cursor-pointer focus:outline-none ${STATUS_STYLES[sale.status]}`}
                      value={sale.status}
                      onChange={(e) => handleStatusChange(sale.id, e.target.value as SaleStatus)}
                    >
                      {Object.entries(STATUS_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph">
                    {sale.deliveryDate
                      ? new Date(sale.deliveryDate).toLocaleDateString('es-MX')
                      : '—'}
                  </td>
                  <td className="py-[1.2rem] px-[2rem]">
                    <div className="flex items-center gap-[0.8rem]">
                      <button
                        onClick={() => router.push(`/admin/inventory/sales/${sale.id}`)}
                        className="button button-muted button-small flex items-center gap-[0.4rem]"
                      >
                        <Eye className="w-[1.2rem] h-[1.2rem]" /> Ver
                      </button>
                      <button
                        onClick={() => handleDelete(sale.id)}
                        disabled={deletingId === sale.id}
                        className="button button-danger button-small flex items-center gap-[0.4rem]"
                      >
                        {deletingId === sale.id
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
