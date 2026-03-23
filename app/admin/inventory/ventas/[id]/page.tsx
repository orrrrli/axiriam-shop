import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getStoreOrderById } from '@/lib/services/inventory.service';
import VentaDetail from '@/components/admin/inventory/ventas/VentaDetail';

export default async function VentaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const { id } = await params;
  const order = await getStoreOrderById(id);

  if (!order) notFound();

  return <VentaDetail order={order} />;
}
