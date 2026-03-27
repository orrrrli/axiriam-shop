import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/organisms/navbar';
import Footer from '@/components/organisms/footer';
import ProductDetail from '@/components/organisms/product-detail';
import { getProductById } from '@/services/admin/catalog.service';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props): Promise<React.ReactElement> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <main className="content !p-0 !block !min-h-0">
      <Navbar />
      <ProductDetail product={product} />
      <Footer />
    </main>
  );
}
