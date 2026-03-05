'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Loader2, Truck } from 'lucide-react';
import { Sale } from '@/types/inventory';
import { formatPrice } from '@/lib/utils/helpers';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  shipped: 'Enviado',
  delivered: 'Entregado',
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#fff8e1] text-[#f57f17]',
  shipped: 'bg-[#e3f2fd] text-[#1565c0]',
  delivered: 'bg-[#e8f5e9] text-[#2e7d32]',
};

const PLATFORM_ICONS: Record<string, string> = {
  facebook: 'FB',
  instagram: 'IG',
  whatsapp: 'WA',
};

export default function SalesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user?.role !== 'admin')) {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchSales();
    }
  }, [status, session]);

  async function fetchSales() {
    try {
      const res = await fetch('/api/admin/inventory/sales');
      const data = await res.json();
      setSales(data.sales ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este envío?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/inventory/sales/${id}`, { method: 'DELETE' });
      setSales((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    await fetch(`/api/admin/inventory/sales/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setSales((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus as any } : s));
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-[3rem] h-[3rem] animate-spin text-heading" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[120rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
      <div className="flex items-center justify-between mb-[3rem]">
        <div>
          <h1 className="text-heading text-[2.4rem]">Envíos</h1>
          <p className="text-subtle text-[1.4rem] mt-[0.4rem]">{sales.length} envíos registrados</p>
        </div>
        <button
          className="button flex items-center gap-[0.8rem] text-[1.3rem]"
          onClick={() => router.push('/admin/inventory/sales/new')}
        >
          <Plus className="w-[1.6rem] h-[1.6rem]" />
          Nuevo Envío
        </button>
      </div>

      <div className="bg-white border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-body-alt">
                {['Cliente', 'Red Social', 'Tipo Envío', 'Total', 'Estado', 'Entrega', 'Acciones'].map((h) => (
                  <th key={h} className="text-left py-[1.2rem] px-[2rem] text-[1.2rem] text-subtle font-bold uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-[6rem] text-center text-subtle text-[1.4rem]">
                    <Truck className="w-[3rem] h-[3rem] mx-auto mb-[1rem] opacity-30" />
                    No hay envíos registrados
                  </td>
                </tr>
              )}
              {sales.map((sale) => (
                <tr key={sale.id} className="border-b border-border last:border-b-0 hover:bg-body transition-colors duration-200">
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-heading font-bold">{sale.name}</td>
                  <td className="py-[1.2rem] px-[2rem]">
                    <span className="text-[1.1rem] font-bold bg-body-alt px-[0.8rem] py-[0.3rem] text-paragraph">
                      {PLATFORM_ICONS[sale.socialMediaPlatform]} @{sale.socialMediaUsername}
                    </span>
                  </td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph capitalize">{sale.shippingType}</td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-heading font-bold">{formatPrice(sale.totalAmount)}</td>
                  <td className="py-[1.2rem] px-[2rem]">
                    <select
                      value={sale.status}
                      onChange={(e) => handleStatusChange(sale.id, e.target.value)}
                      className={`text-[1.1rem] font-bold px-[1rem] py-[0.4rem] border-none focus:outline-none cursor-pointer ${STATUS_STYLES[sale.status]}`}
                    >
                      {Object.entries(STATUS_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-subtle">
                    {sale.deliveryDate ? new Date(sale.deliveryDate).toLocaleDateString('es-MX') : '—'}
                  </td>
                  <td className="py-[1.2rem] px-[2rem]">
                    <div className="flex items-center gap-[0.8rem]">
                      <button
                        onClick={() => router.push(`/admin/inventory/sales/${sale.id}`)}
                        className="button button-muted button-small flex items-center gap-[0.4rem]"
                      >
                        <Pencil className="w-[1.2rem] h-[1.2rem]" /> Ver
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
