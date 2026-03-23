import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getProducts } from '@/lib/services/admin/catalog.service';
import CatalogView from '@/components/admin/catalog/CatalogView';

export default async function CatalogoPage(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const products = await getProducts();

  return <CatalogView initialProducts={products} />;
}
