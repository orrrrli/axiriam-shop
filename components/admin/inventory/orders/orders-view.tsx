'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { sileo } from 'sileo';
import { OrderMaterial, OrderMaterialFormData, OrderMaterialStatus } from '@/types/inventory';
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from '@/lib/constants/admin/orders.constants';
import { useOrderMutations } from '@/lib/hooks/use-order-mutations';
import { DataTable, Column } from '@/components/admin/common';
import ConfirmToast from '@/components/molecules/confirm-toast';

export default function OrdersView({ initialOrders }: { initialOrders: OrderMaterial[] }): React.ReactElement {
  const router = useRouter();
  const { update, remove } = useOrderMutations();
  const [items, setItems] = useState(initialOrders);
  const [pendingDelete, setPendingDelete] = useState<OrderMaterial | null>(null);

  async function handleStatusChange(id: string, status: OrderMaterialStatus): Promise<void> {
    const previous = items;
    setItems((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

    const result = await update(id, { status } as OrderMaterialFormData);
    if (result.success) {
      sileo.success({ title: 'Estado del pedido actualizado' });
    } else {
      setItems(previous);
      sileo.error({ title: 'Error al actualizar el estado' });
    }
  }

  function handleDeleteCancel(): void {
    setPendingDelete(null);
  }

  function handleDeleteConfirm(): void {
    if (!pendingDelete) return;
    const order = pendingDelete;
    setPendingDelete(null);

    const promise = remove(order.id).then((result) => {
      if (!result.success) throw new Error(result.error ?? 'Error al eliminar');
      setItems((prev) => prev.filter((o) => o.id !== order.id));
      return result;
    });

    sileo.promise(promise, {
      loading: { title: `Eliminando pedido "${order.description}"...` },
      success: { title: `Pedido "${order.description}" eliminado correctamente` },
      error: { title: 'Error al eliminar el pedido' },
    });
  }

  const columns: Column<OrderMaterial>[] = [
    {
      header: 'Num Pedido',
      key: 'description',
      render: (value: unknown) => (
        <span className="font-mono font-bold text-heading uppercase">{(value as string) || '—'}</span>
      ),
    },
    {
      header: 'Proveedor',
      key: 'distributor',
      render: (value: unknown) => <span className="text-paragraph">{(value as string) || '—'}</span>,
    },
    {
      header: 'Paquetería',
      key: 'parcel_service',
      render: (value: unknown) => (value as string | null) ?? '—',
    },
    {
      header: 'Tracking',
      key: 'trackingNumber',
      render: (value: unknown) => (
        <span className="font-mono">{(value as string | null) ?? '—'}</span>
      ),
    },
    {
      header: 'Fecha',
      key: 'createdAt',
      render: (value: unknown) => new Date(value as string).toLocaleDateString('es-MX'),
    },
    {
      header: 'Estado',
      key: 'status',
      render: (value: unknown, row: OrderMaterial) => {
        const status = value as OrderMaterialStatus;
        return (
          <select
            className={`text-[1.2rem] font-bold px-[0.8rem] py-[0.3rem] border-0 cursor-pointer focus:outline-none ${ORDER_STATUS_STYLES[status]}`}
            value={status}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleStatusChange(row.id, e.target.value as OrderMaterialStatus)}
          >
            {Object.entries(ORDER_STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      header: 'Acciones',
      key: 'id',
      render: (_: unknown, row: OrderMaterial) => (
        <div className="flex items-center gap-[0.4rem]" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setPendingDelete(row)}
            className="p-[0.8rem] text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-[0.6rem] transition-colors duration-150"
            aria-label="Eliminar"
          >
            <Trash2 className="w-[1.8rem] h-[1.8rem]" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {pendingDelete && (
        <ConfirmToast
          title="Eliminar pedido"
          productName={pendingDelete.description ?? pendingDelete.id}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
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
          onRowClick={(item) => router.push(`/admin/inventory/orders/${item.orderNumber}`)}
        />
      </div>
    </>
  );
}
