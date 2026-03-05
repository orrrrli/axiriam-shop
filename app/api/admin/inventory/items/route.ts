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

export async function GET() {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await prisma.inventoryItem.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        materials: { select: { rawMaterialId: true } },
      },
    });

    const formatted = items.map((item) => ({
      ...item,
      category: fromDbCategory(item.category),
      type: fromDbMaterialType(item.type),
      materials: item.materials.map((m) => m.rawMaterialId),
    }));

    return NextResponse.json({ items: formatted });
  } catch (error) {
    console.error('GET /api/admin/inventory/items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, category, type, description, quantity, price, materials = [] } = body;

    const item = await prisma.inventoryItem.create({
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
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/inventory/items:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
