import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getOrders } from '@/lib/services/inventory.service';
import OrdersView from '@/components/admin/inventory/orders/OrdersView';

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const orders = await getOrders();

  return <OrdersView initialOrders={orders as any} />;
}
