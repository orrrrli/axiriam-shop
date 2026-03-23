import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { getQuoteByNumber } from '@/services/quote-service';
import QuoteFormPage from '@/components/admin/inventory/quotes/quote-form-page';

export default async function EditQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const { id } = await params;
  const quote = await getQuoteByNumber(decodeURIComponent(id));
  if (!quote) notFound();

  return <QuoteFormPage quote={quote} />;
}
