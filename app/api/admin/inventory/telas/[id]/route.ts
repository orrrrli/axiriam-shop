import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDesignById, updateDesign, deleteDesign } from '@/lib/services/inventory.service';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') return null;
  return session;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const design = await getDesignById(id);
    if (!design) return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    return NextResponse.json({ design });
  } catch (error) {
    console.error('GET /api/admin/inventory/telas/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch design' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    return NextResponse.json({ design: await updateDesign(id, await req.json()) });
  } catch (error) {
    console.error('PUT /api/admin/inventory/telas/[id]:', error);
    return NextResponse.json({ error: 'Failed to update design' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    await deleteDesign(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/inventory/telas/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete design' }, { status: 500 });
  }
}
