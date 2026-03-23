import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDesignById, updateDesign, deleteDesign, InventoryError } from '@/lib/services/inventory.service';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') return null;
  return session;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const material = await getDesignById(id);
    if (!material) return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    return NextResponse.json({ material });
  } catch (error) {
    console.error('GET /api/admin/inventory/warehouse/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch material' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    return NextResponse.json({ material: await updateDesign(id, await req.json()) });
  } catch (error) {
    console.error('PUT /api/admin/inventory/warehouse/[id]:', error);
    return NextResponse.json({ error: 'Failed to update material' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    await deleteDesign(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof InventoryError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 409 });
    }
    console.error('DELETE /api/admin/inventory/warehouse/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete material' }, { status: 500 });
  }
}
