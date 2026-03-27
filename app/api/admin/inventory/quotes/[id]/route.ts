import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getQuoteById, updateQuote, deleteQuote } from '@/services/inventory.service';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') return null;
  return session;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const quote = await getQuoteById(id);
    if (!quote) return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    return NextResponse.json({ quote });
  } catch (error) {
    console.error('GET /api/admin/inventory/quotes/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    return NextResponse.json({ quote: await updateQuote(id, await req.json()) });
  } catch (error) {
    console.error('PUT /api/admin/inventory/quotes/[id]:', error);
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    await deleteQuote(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/inventory/quotes/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
  }
}
