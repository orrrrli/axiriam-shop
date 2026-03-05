'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Loader2, ShoppingCart } from 'lucide-react';
import { OrderMaterial } from '@/types/inventory';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  ordered: 'Ordenado',
  received: 'Recibido',
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#fff8e1] text-[#f57f17]',
  ordered: 'bg-[#e3f2fd] text-[#1565c0]',
  received: 'bg-[#e8f5e9] text-[#2e7d32]',
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user?.role !== 'admin')) {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, session]);

  async function fetchOrders() {
    try {
      const res = await fetch('/api/admin/inventory/orders');
      const data = await res.json();
      setOrders(data.orders ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este pedido?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/inventory/orders/${id}`, { method: 'DELETE' });
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    await fetch(`/api/admin/inventory/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus as any } : o));
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
          <h1 className="text-heading text-[2.4rem]">Pedidos</h1>
          <p className="text-subtle text-[1.4rem] mt-[0.4rem]">{orders.length} pedidos de materiales</p>
        </div>
        <button
          className="button flex items-center gap-[0.8rem] text-[1.3rem]"
          onClick={() => router.push('/admin/inventory/orders/new')}
        >
          <Plus className="w-[1.6rem] h-[1.6rem]" />
          Nuevo Pedido
        </button>
      </div>

      <div className="bg-white border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-body-alt">
                {['Distribuidor', 'Descripción', 'Estado', 'Paquetería', 'Tracking', 'Fecha', 'Acciones'].map((h) => (
                  <th key={h} className="text-left py-[1.2rem] px-[2rem] text-[1.2rem] text-subtle font-bold uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-[6rem] text-center text-subtle text-[1.4rem]">
                    <ShoppingCart className="w-[3rem] h-[3rem] mx-auto mb-[1rem] opacity-30" />
                    No hay pedidos registrados
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-b-0 hover:bg-body transition-colors duration-200">
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-heading font-bold">{order.distributor}</td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph max-w-[20rem] truncate">{order.description}</td>
                  <td className="py-[1.2rem] px-[2rem]">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-[1.1rem] font-bold px-[1rem] py-[0.4rem] border-none focus:outline-none cursor-pointer ${STATUS_STYLES[order.status]}`}
                    >
                      {Object.entries(STATUS_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph">{order.parcel_service ?? '—'}</td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph">{order.trackingNumber ?? '—'}</td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-subtle">
                    {new Date(order.createdAt).toLocaleDateString('es-MX')}
                  </td>
                  <td className="py-[1.2rem] px-[2rem]">
                    <div className="flex items-center gap-[0.8rem]">
                      <button
                        onClick={() => router.push(`/admin/inventory/orders/${order.id}`)}
                        className="button button-muted button-small flex items-center gap-[0.4rem]"
                      >
                        <Pencil className="w-[1.2rem] h-[1.2rem]" /> Ver
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        disabled={deletingId === order.id}
                        className="button button-danger button-small flex items-center gap-[0.4rem]"
                      >
                        {deletingId === order.id
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
