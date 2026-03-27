import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getOrderByNumber, getDesigns } from '@/services/inventory.service';
import OrderDetail from '@/components/admin/inventory/orders/order-detail';
import type { RawMaterial } from '@/types/inventory';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const { orderNumber: orderNumberParam } = await params;
  const orderNumber = parseInt(orderNumberParam, 10);
  if (isNaN(orderNumber)) notFound();

  const [order, materials] = await Promise.all([getOrderByNumber(orderNumber), getDesigns()]);
  if (!order) notFound();

  const materialsById = (materials as RawMaterial[]).reduce<Record<string, RawMaterial>>(
    (acc, m) => ({ ...acc, [m.id]: m }),
    {},
  );

  return <OrderDetail order={order} materialsById={materialsById} />;
}
