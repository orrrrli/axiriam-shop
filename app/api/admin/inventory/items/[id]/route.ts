import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { toDbMaterialType, toDbCategory, fromDbMaterialType, fromDbCategory } from '@/lib/utils/inventory';

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

    const item = await prisma.inventoryItem.findUnique({
      where: { id: params.id },
      include: { materials: { select: { rawMaterialId: true } } },
    });

    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    return NextResponse.json({
      item: {
        ...item,
        category: fromDbCategory(item.category),
        type: fromDbMaterialType(item.type),
        materials: item.materials.map((m) => m.rawMaterialId),
      },
    });
  } catch (error) {
    console.error('GET /api/admin/inventory/items/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, category, type, description, quantity, price, materials = [] } = body;

    // Replace materials (delete old, create new)
    await prisma.inventoryItemMaterial.deleteMany({ where: { itemId: params.id } });

    const item = await prisma.inventoryItem.update({
      where: { id: params.id },
      data: {
        name,
        category: toDbCategory(category) as any,
        type: toDbMaterialType(type) as any,
        description,
        quantity,
        price,
        materials: {
          create: materials.map((rawMaterialId: string) => ({ rawMaterialId })),
        },
      },
      include: { materials: { select: { rawMaterialId: true } } },
    });

    return NextResponse.json({
      item: {
        ...item,
        category: fromDbCategory(item.category),
        type: fromDbMaterialType(item.type),
        materials: item.materials.map((m) => m.rawMaterialId),
      },
    });
  } catch (error) {
    console.error('PUT /api/admin/inventory/items/[id]:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.inventoryItemMaterial.deleteMany({ where: { itemId: params.id } });
    await prisma.inventoryItem.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/inventory/items/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
