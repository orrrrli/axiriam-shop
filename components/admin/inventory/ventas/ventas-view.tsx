'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { StoreOrder, StoreOrderStatus } from '@/types/inventory';
import { formatPrice, formatDate } from '@/lib/utils/helpers';
import { VENTA_STATUS_LABELS, VENTA_STATUS_STYLES } from '@/lib/constants/admin/ventas.constants';
import { useVentasMutations } from '@/lib/hooks/use-ventas-mutations';
import { DataTable } from '@/components/admin/common/organisms/data-table';

export default function VentasView({ initialOrders }: { initialOrders: StoreOrder[] }): React.ReactElement {
  const router = useRouter();
  const { update } = useVentasMutations();
  const [orders, setOrders] = useState(initialOrders);

  async function handleStatusChange(id: string, status: StoreOrderStatus): Promise<void> {
    const order = orders.find((o) => o.id === id);
    if (!order) return;

    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

    const result = await update(id, {
      status,
      trackingNumber: order.trackingNumber,
      isDelivered: status === 'delivered',
      deliveredAt: status === 'delivered' ? new Date().toISOString() : undefined,
    });

    if (!result.success) {
      setOrders((prev) => prev.map((o) => (o.id === id ? order : o)));
    }
  }

  const columns = [
    {
      header: '#',
      key: 'id',
      render: (value: string) => (
        <span className="font-mono text-[1.2rem] text-subtle">#{value.slice(-8).toUpperCase()}</span>
      ),
    },
    {
      header: 'Cliente',
      key: 'customer',
      render: (value: StoreOrder['customer']) => (
        <div>
          <p className="font-bold text-heading text-[1.3rem]">{value.name}</p>
          <p className="text-subtle text-[1.1rem]">{value.email}</p>
        </div>
      ),
    },
    {
      header: 'Productos',
      key: 'orderItems',
      render: (value: StoreOrder['orderItems']) => (
        <span className="text-paragraph text-[1.3rem]">
          {value.length} {value.length === 1 ? 'producto' : 'productos'}
        </span>
      ),
    },
    {
      header: 'Total',
      key: 'totalPrice',
      render: (value: number) => (
        <span className="font-bold text-heading">{formatPrice(value)}</span>
      ),
    },
    {
      header: 'Pago',
      key: 'isPaid',
      render: (value: boolean, row: StoreOrder) => (
        <div>
          <span className={`inline-block px-[0.8rem] py-[0.2rem] text-[1.1rem] font-semibold rounded-[0.4rem] ${value ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#fce4ec] text-[#c62828]'}`}>
            {value ? 'Pagado' : 'Pendiente'}
          </span>
          <p className="text-subtle text-[1.1rem] mt-[0.2rem]">{row.paymentMethod}</p>
        </div>
      ),
    },
    {
      header: 'Estado',
      key: 'status',
      render: (value: StoreOrderStatus, row: StoreOrder) => (
        <select
          className={`text-[1.2rem] font-bold px-[0.8rem] py-[0.3rem] border-0 cursor-pointer focus:outline-none rounded-[0.4rem] ${VENTA_STATUS_STYLES[value]}`}
          value={value}
          onChange={(e) => handleStatusChange(row.id, e.target.value as StoreOrderStatus)}
        >
          {Object.entries(VENTA_STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      ),
    },
    {
      header: 'Fecha',
      key: 'createdAt',
      render: (value: Date) => (
        <span className="text-subtle text-[1.2rem]">{formatDate(value)}</span>
      ),
    },
  ];

  return (
    <div className="w-full max-w-[120rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
      <div className="flex items-center justify-between mb-[3rem]">
        <div>
          <h1 className="text-heading text-[2.4rem]">Ventas</h1>
          <p className="text-subtle text-[1.4rem] mt-[0.4rem]">
            {orders.length} {orders.length === 1 ? 'pedido registrado' : 'pedidos registrados'}
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        emptyMessage="No hay ventas registradas"
        emptyIcon={<ShoppingCart className="w-[3rem] h-[3rem] opacity-30" />}
        onRowClick={(order) => router.push(`/admin/inventory/ventas/${order.id}`)}
      />
    </div>
  );
}
