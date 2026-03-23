import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getQuotes } from '@/services/quote-service';
import QuotesView from '@/components/admin/inventory/quotes/quotes-view';

export default async function QuotesPage(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const quotes = await getQuotes();

  return <QuotesView initialQuotes={quotes} />;
}
