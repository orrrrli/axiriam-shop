import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/Footer';
import CatalogView from '@/components/catalog/CatalogView';
import { getProducts } from '@/lib/services/admin/catalog.service';

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
