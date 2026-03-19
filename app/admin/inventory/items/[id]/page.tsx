import { notFound } from 'next/navigation';
import { getItemById } from '@/lib/services/inventory.service';
import ItemDetail from '@/components/admin/inventory/items/ItemDetail';
import type { InventoryItem } from '@/types/inventory';

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getItemById(id);

  if (!item) notFound();

  return <ItemDetail item={item as InventoryItem} />;
}
