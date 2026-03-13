import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getItems } from '@/lib/services/inventory.service';
import ItemsView from '@/components/admin/inventory/ItemsView';

export default async function ItemsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const items = await getItems();

  return <ItemsView initialItems={items as any} />;
}
