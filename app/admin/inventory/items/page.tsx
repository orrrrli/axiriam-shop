import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getItems, getItemsSalesStats, getDesigns } from '@/services/inventory.service';
import ItemsView from '@/components/admin/inventory/items/items-view';
import type { InventoryItem, InventoryItemSalesStats } from '@/types/inventory';

export default async function ItemsPage(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const [items, statsArray, warehouseMaterials] = await Promise.all([
    getItems(),
    getItemsSalesStats(),
    getDesigns(),
  ]);

  const salesStats = statsArray.reduce<Record<string, InventoryItemSalesStats>>(
    (acc, s) => ({ ...acc, [s.itemId]: s }),
    {},
  );

  return <ItemsView initialItems={items as InventoryItem[]} salesStats={salesStats} warehouseMaterials={warehouseMaterials} />;
}
