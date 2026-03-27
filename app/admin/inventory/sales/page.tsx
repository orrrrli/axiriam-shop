import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSales } from '@/services/inventory.service';
import SalesView from '@/components/admin/inventory/sales/sales-view';

export default async function SalesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const sales = await getSales();

  return <SalesView initialSales={sales as any} />;
}
