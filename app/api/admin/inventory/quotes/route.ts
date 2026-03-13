import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getQuotes, createQuote } from '@/lib/services/inventory.service';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') return null;
  return session;
}

export async function GET() {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ quotes: await getQuotes() });
  } catch (error) {
    console.error('GET /api/admin/inventory/quotes:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ quote: await createQuote(await req.json()) }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/inventory/quotes:', error);
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}
