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

function formatOrder(order: any) {
  return {
    ...order,
    materials: order.groups.map((group: any) => ({
      designs: group.designs.map((d: any) => ({
        rawMaterialId: d.rawMaterialId ?? '',
        quantity: d.quantity,
        addToInventory: d.addToInventory,
        customDesignName: d.customDesignName,
        type: d.type ? fromDbMaterialType(d.type) : undefined,
      })),
    })),
    groups: undefined,
  };
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await prisma.orderMaterial.findUnique({
      where: { id: params.id },
      include: { groups: { include: { designs: true } } },
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    return NextResponse.json({ order: formatOrder(order) });
  } catch (error) {
    console.error('GET /api/admin/inventory/orders/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { distributor, description, status, trackingNumber, parcel_service, materials = [] } = body;

    // Delete existing groups + designs, then recreate
    const existingGroups = await prisma.orderMaterialGroup.findMany({
      where: { orderMaterialId: params.id },
      select: { id: true },
    });
    await prisma.orderMaterialDesign.deleteMany({
      where: { groupId: { in: existingGroups.map((g) => g.id) } },
    });
    await prisma.orderMaterialGroup.deleteMany({ where: { orderMaterialId: params.id } });

    const order = await prisma.orderMaterial.update({
      where: { id: params.id },
      data: {
        distributor,
        description,
        status,
        trackingNumber,
        parcelService: parcel_service,
        groups: {
          create: materials.map((group: any) => ({
            designs: {
              create: group.designs.map((d: any) => ({
                rawMaterialId: d.rawMaterialId || null,
                quantity: d.quantity,
                addToInventory: d.addToInventory ?? false,
                customDesignName: d.customDesignName,
                type: d.type ? toDbMaterialType(d.type) as any : null,
              })),
            },
          })),
        },
      },
      include: { groups: { include: { designs: true } } },
    });

    return NextResponse.json({ order: formatOrder(order) });
  } catch (error) {
    console.error('PUT /api/admin/inventory/orders/[id]:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groups = await prisma.orderMaterialGroup.findMany({
      where: { orderMaterialId: params.id },
      select: { id: true },
    });
    await prisma.orderMaterialDesign.deleteMany({
      where: { groupId: { in: groups.map((g) => g.id) } },
    });
    await prisma.orderMaterialGroup.deleteMany({ where: { orderMaterialId: params.id } });
    await prisma.orderMaterial.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/inventory/orders/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
