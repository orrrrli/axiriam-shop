import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ShopDetailPage({ params }: Props): Promise<never> {
  const { id } = await params;
  redirect(`/catalogo/${id}`);
}
