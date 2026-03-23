import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSaleById, getItems } from '@/lib/services/inventory.service';
import SaleDetail from '@/components/admin/inventory/sales/sale-detail';
import type { InventoryItem, Sale } from '@/types/inventory';

export default async function SaleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const { id } = await params;

  const [sale, items] = await Promise.all([
    getSaleById(id),
    getItems(),
  ]);

  if (!sale) notFound();

  const itemsById = (items as InventoryItem[]).reduce<Record<string, InventoryItem>>(
    (acc, item) => ({ ...acc, [item.id]: item }),
    {},
  );

  return <SaleDetail sale={sale as Sale} itemsById={itemsById} />;
}
