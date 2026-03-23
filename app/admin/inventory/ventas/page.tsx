import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getStoreOrders } from '@/lib/services/inventory.service';
import VentasView from '@/components/admin/inventory/ventas/VentasView';

export default async function VentasPage(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const orders = await getStoreOrders();

  return <VentasView initialOrders={orders} />;
}
