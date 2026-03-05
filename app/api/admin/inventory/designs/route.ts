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

export async function GET() {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const designs = await prisma.rawMaterial.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formatted = designs.map((d) => ({
      ...d,
      type: fromDbMaterialType(d.type),
    }));

    return NextResponse.json({ designs: formatted });
  } catch (error) {
    console.error('GET /api/admin/inventory/designs:', error);
    return NextResponse.json({ error: 'Failed to fetch designs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, type, width, height, quantity, price, supplier, imageUrl } = body;

    const design = await prisma.rawMaterial.create({
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

    return NextResponse.json({
      design: { ...design, type: fromDbMaterialType(design.type) },
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/inventory/designs:', error);
    return NextResponse.json({ error: 'Failed to create design' }, { status: 500 });
  }
}
