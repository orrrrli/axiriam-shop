import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getQuotes } from '@/lib/services/inventory.service';
import QuotesView from '@/components/admin/inventory/QuotesView';

export default async function QuotesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  const quotes = await getQuotes();

  return <QuotesView initialQuotes={quotes as any} />;
}
