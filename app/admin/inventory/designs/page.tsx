import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDesigns } from '@/lib/services/inventory.service';
import DesignsView from '@/components/admin/inventory/DesignsView';

export default async function DesignsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const designs = await getDesigns();

  return <DesignsView initialDesigns={designs as any} />;
}
