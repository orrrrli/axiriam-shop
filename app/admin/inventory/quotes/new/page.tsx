import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import QuoteFormPage from '@/components/admin/inventory/quotes/quote-form-page';

export default async function NewQuotePage(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  return <QuoteFormPage />;
}
