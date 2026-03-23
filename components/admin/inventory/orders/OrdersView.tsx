'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import { OrderMaterial, OrderMaterialStatus } from '@/types/inventory';
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from '@/lib/constants/admin/orders.constants';
import { updateOrder, deleteOrder } from '@/lib/services/admin/orders.service';
import { DataTable } from '@/components/admin/common';

export default function OrdersView({ initialOrders }: { initialOrders: OrderMaterial[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialOrders);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: OrderMaterialStatus) {
    // Optimistically update UI
    setItems((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );

    // Call service layer
    const result = await updateOrder(id, { status } as any);
    if (!result.success) {
      alert(result.error);
      // Revert on error
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este pedido?')) return;
    setDeletingId(id);
    try {
      const result = await deleteOrder(id);
      if (result.success) {
        setItems((prev) => prev.filter((o) => o.id !== id));
      } else {
        alert(result.error);
      }
    } finally {
      setDeletingId(null);
    }
  }

  const columns = [
    {
      header: 'Num Pedido',
      key: 'description',
      render: (value: string) => (
        <span className="font-mono font-bold text-heading uppercase">{value || '—'}</span>
      ),
    },
    {
      header: 'Proveedor',
      key: 'distributor',
      render: (value: string) => <span className="text-paragraph">{value || '—'}</span>,
    },
    {
      header: 'Paquetería',
      key: 'parcel_service',
      render: (value: string | null) => value ?? '—',
    },
    {
      header: 'Tracking',
      key: 'trackingNumber',
      render: (value: string | null) => (
        <span className="font-mono">{value ?? '—'}</span>
      ),
    },
    {
      header: 'Fecha',
      key: 'createdAt',
      render: (value: string) => new Date(value).toLocaleDateString('es-MX'),
    },
    {
      header: 'Estado',
      key: 'status',
      render: (value: OrderMaterialStatus, row: OrderMaterial) => (
        <select
          className={`text-[1.2rem] font-bold px-[0.8rem] py-[0.3rem] border-0 cursor-pointer focus:outline-none ${ORDER_STATUS_STYLES[value]}`}
          value={value}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleStatusChange(row.id, e.target.value as OrderMaterialStatus)}
        >
          {Object.entries(ORDER_STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      ),
    },
    {
      header: 'Acciones',
      key: 'id',
      render: (_: string, row: OrderMaterial) => (
        <div className="flex items-center gap-[0.4rem]" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => handleDelete(row.id)}
            disabled={deletingId === row.id}
            className="p-[0.8rem] text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-[0.6rem] transition-colors duration-150"
            aria-label="Eliminar"
          >
            {deletingId === row.id
              ? <Loader2 className="w-[1.8rem] h-[1.8rem] animate-spin" />
              : <Trash2 className="w-[1.8rem] h-[1.8rem]" />
            }
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-[120rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
      <div className="flex items-center justify-between mb-[3rem]">
        <div>
          <h1 className="text-heading text-[2.4rem]">Pedidos</h1>
          <p className="text-subtle text-[1.4rem] mt-[0.4rem]">{items.length} pedidos registrados</p>
        </div>
        <button
          className="button flex items-center gap-[0.8rem] text-[1.3rem]"
          onClick={() => router.push('/admin/inventory/orders/new')}
        >
          <Plus className="w-[1.6rem] h-[1.6rem]" /> Nuevo Pedido
        </button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        emptyMessage="No hay pedidos registrados"
        emptyIcon={<ShoppingCart className="w-[3rem] h-[3rem] opacity-30" />}
        onRowClick={(item) => router.push(`/admin/inventory/orders/${item.id}`)}
      />
    </div>
  );
}
