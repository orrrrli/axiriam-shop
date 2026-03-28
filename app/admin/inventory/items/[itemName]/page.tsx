import { notFound } from 'next/navigation';
import { getItemBySlug, getDesignsByIds } from '@/services/inventory.service';
import ItemDetail from '@/components/admin/inventory/items/item-detail';
import type { InventoryItem } from '@/types/inventory';

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ itemName: string }>;
}): Promise<React.ReactElement> {
  const { itemName } = await params;
  const item: InventoryItem | null = await getItemBySlug(itemName);

  if (!item) notFound();

  const linkedMaterials = await getDesignsByIds(item.materials);

  return <ItemDetail item={item} linkedMaterials={linkedMaterials} />;
}
