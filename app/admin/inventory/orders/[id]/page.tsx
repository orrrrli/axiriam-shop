import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getOrderById, getDesigns } from '@/lib/services/inventory.service';
import OrderDetail from '@/components/admin/inventory/orders/order-detail';
import type { RawMaterial } from '@/types/inventory';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const { id } = await params;
  const [order, materials] = await Promise.all([getOrderById(id), getDesigns()]);
  if (!order) notFound();

  const materialsById = (materials as RawMaterial[]).reduce<Record<string, RawMaterial>>(
    (acc, m) => ({ ...acc, [m.id]: m }),
    {},
  );

  return <OrderDetail order={order} materialsById={materialsById} />;
}
