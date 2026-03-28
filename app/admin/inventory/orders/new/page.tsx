import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDesigns } from '@/services/inventory.service';
import OrderForm from '@/components/admin/inventory/orders/order-form';

export default async function NewOrderPage(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const materials = await getDesigns();

  return <OrderForm warehouseMaterials={materials} />;
}
