import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { toDbMaterialType, fromDbMaterialType } from '@/lib/utils/inventory';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') return null;
  return session;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const design = await prisma.rawMaterial.findUnique({ where: { id: params.id } });
    if (!design) return NextResponse.json({ error: 'Design not found' }, { status: 404 });

    return NextResponse.json({ design: { ...design, type: fromDbMaterialType(design.type) } });
  } catch (error) {
    console.error('GET /api/admin/inventory/designs/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch design' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, type, width, height, quantity, price, supplier, imageUrl } = body;

    const design = await prisma.rawMaterial.update({
      where: { id: params.id },
      data: {
        name,
        description,
        type: toDbMaterialType(type) as any,
        width,
        height,
        quantity,
        price,
        supplier,
        imageUrl,
      },
    });

    return NextResponse.json({ design: { ...design, type: fromDbMaterialType(design.type) } });
  } catch (error) {
    console.error('PUT /api/admin/inventory/designs/[id]:', error);
    return NextResponse.json({ error: 'Failed to update design' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.rawMaterial.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/inventory/designs/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete design' }, { status: 500 });
  }
}
