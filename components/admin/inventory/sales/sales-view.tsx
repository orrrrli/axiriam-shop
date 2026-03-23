'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Truck, Trash2, Loader2 } from 'lucide-react';
import { Sale, SaleStatus } from '@/types/inventory';
import { formatPrice } from '@/lib/utils/helpers';
import {
  STATUS_LABELS,
  STATUS_STYLES,
  PLATFORM_ICONS,
  SHIPPING_LABELS,
  SALE_COLUMNS,
} from '@/lib/constants/admin/sales.constants';
import { useSalesListMutations } from '@/lib/hooks/use-sales-list-mutations';
import { DataTable } from '@/components/admin/common/organisms/data-table';

export default function SalesView({ initialSales }: { initialSales: Sale[] }) {
  const router = useRouter();
  const { update, remove } = useSalesListMutations();
  const [items, setItems] = useState(initialSales);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: SaleStatus): Promise<void> {
    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );

    const sale = items.find((s) => s.id === id);
    if (!sale) return;

    const result = await update(id, {
      name: sale.name,
      status,
      socialMediaPlatform: sale.socialMediaPlatform,
      socialMediaUsername: sale.socialMediaUsername,
      trackingNumber: sale.trackingNumber,
      invoiceRequired: sale.invoiceRequired,
      shippingType: sale.shippingType,
      localShippingOption: sale.localShippingOption,
      localAddress: sale.localAddress,
      nationalShippingCarrier: sale.nationalShippingCarrier,
      shippingDescription: sale.shippingDescription,
      discount: sale.discount,
      totalAmount: sale.totalAmount,
      deliveryDate: sale.deliveryDate,
      saleItems: sale.saleItems,
      extras: sale.extras,
    });

    if (!result.success) {
      alert(result.error);
      // Revert optimistic update on error
      setItems((prev) =>
        prev.map((s) => (s.id === id ? sale : s))
      );
    }
  }

  async function handleDelete(id: string): Promise<void> {
    if (!confirm('¿Eliminar este envío?')) return;
    setDeletingId(id);
    try {
      const result = await remove(id);
      if (result.success) {
        setItems((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(result.error);
      }
    } finally {
      setDeletingId(null);
    }
  }

  const columns = [
    {
      header: 'Cliente',
      key: 'name',
      render: (value: string) => (
        <span className="text-heading font-bold">{value}</span>
      ),
    },
    {
      header: 'Red Social',
      key: 'socialMediaPlatform',
      render: (_: string, row: Sale) => (
        <span className="inline-flex items-center gap-[0.4rem] bg-body-alt px-[0.8rem] py-[0.3rem] text-[1.2rem] text-paragraph font-bold">
          {PLATFORM_ICONS[row.socialMediaPlatform] ?? row.socialMediaPlatform}
          {' '}@{row.socialMediaUsername}
        </span>
      ),
    },
    {
      header: 'Tipo Envío',
      key: 'shippingType',
      render: (value: string) => SHIPPING_LABELS[value] ?? value,
    },
    {
      header: 'Total',
      key: 'totalAmount',
      render: (value: number) => (
        <span className="text-heading font-bold">{formatPrice(value)}</span>
      ),
    },
    {
      header: 'Estado',
      key: 'status',
      render: (value: SaleStatus, row: Sale) => (
        <select
          className={`text-[1.2rem] font-bold px-[0.8rem] py-[0.3rem] border-0 cursor-pointer focus:outline-none ${STATUS_STYLES[value]}`}
          value={value}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleStatusChange(row.id, e.target.value as SaleStatus)}
        >
          {Object.entries(STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      ),
    },
    {
      header: 'Entrega',
      key: 'deliveryDate',
      render: (value: string | undefined) =>
        value ? new Date(value).toLocaleDateString('es-MX') : '—',
    },
    {
      header: 'Acciones',
      key: 'id',
      render: (_: string, row: Sale) => (
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
          <h1 className="text-heading text-[2.4rem]">Envíos</h1>
          <p className="text-subtle text-[1.4rem] mt-[0.4rem]">
            {items.length} envíos registrados
          </p>
        </div>
        <button
          className="button flex items-center gap-[0.8rem] text-[1.3rem]"
          onClick={() => router.push('/admin/inventory/sales/new')}
        >
          <Plus className="w-[1.6rem] h-[1.6rem]" /> Nuevo Envío
        </button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        emptyMessage="No hay envíos registrados"
        emptyIcon={<Truck className="w-[3rem] h-[3rem] opacity-30" />}
        onRowClick={(item) => router.push(`/admin/inventory/sales/${item.id}`)}
      />
    </div>
  );
}
