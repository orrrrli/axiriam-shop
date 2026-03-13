import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDesigns } from '@/lib/services/inventory.service';
import TelasView from '@/components/admin/inventory/TelasView';

export default async function TelasPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const designs = await getDesigns();

  return <TelasView initialDesigns={designs as any} />;
}
