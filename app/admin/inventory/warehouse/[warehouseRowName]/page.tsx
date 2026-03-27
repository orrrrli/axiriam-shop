import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDesignBySlug, getItemsByMaterialId } from '@/lib/services/inventory.service';
import WarehouseDetail from '@/components/admin/inventory/warehouse/warehouse-detail';

export default async function WarehouseDetailPage({
  params,
}: {
  params: Promise<{ warehouseRowName: string }>;
}): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const { warehouseRowName } = await params;
  const material = await getDesignBySlug(warehouseRowName);
  if (!material) notFound();

  const linkedItems = await getItemsByMaterialId(material.id);

  return <WarehouseDetail material={material} linkedItems={linkedItems} />;
}
