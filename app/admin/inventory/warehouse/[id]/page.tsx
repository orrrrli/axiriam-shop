import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDesignById } from '@/lib/services/inventory.service';
import WarehouseDetail from '@/components/admin/inventory/warehouse/warehouse-detail';

export default async function WarehouseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const { id } = await params;
  const material = await getDesignById(id);
  if (!material) notFound();

  return <WarehouseDetail material={material} />;
}
