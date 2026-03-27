import Navbar from '@/components/organisms/navbar';
import Footer from '@/components/organisms/footer';
import CatalogView from '@/components/organisms/catalog-view';
import { getProducts } from '@/services/admin/catalog.service';

export const dynamic = 'force-dynamic';

export default async function CatalogoPage(): Promise<React.ReactElement> {
  const products = await getProducts();

  return (
    <main className="content !p-0 !block !min-h-0">
      <Navbar />
      <CatalogView initialProducts={products} />
      <Footer />
    </main>
  );
}
