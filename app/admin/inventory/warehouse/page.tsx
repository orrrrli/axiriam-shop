import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDesigns } from '@/services/inventory.service';
import WarehouseView from '@/components/admin/inventory/warehouse/warehouse-view';

export default async function WarehousePage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const materials = await getDesigns();

  return <WarehouseView initialMaterials={materials as any} />;
}
