import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getItems, getDesigns } from '@/lib/services/inventory.service';
import ItemsView from '@/components/admin/inventory/items/items-view';
import type { InventoryItem } from '@/types/inventory';

export default async function ItemsPage(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const [items, warehouseMaterials] = await Promise.all([
    getItems(),
    getDesigns(),
  ]);

  return <ItemsView initialItems={items as InventoryItem[]} warehouseMaterials={warehouseMaterials} />;
}
