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

export async function GET() {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.orderMaterial.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        groups: {
          include: { designs: true },
        },
      },
    });

    return NextResponse.json({ orders: orders.map(formatOrder) });
  } catch (error) {
    console.error('GET /api/admin/inventory/orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { distributor, description, status, trackingNumber, parcel_service, materials = [] } = body;

    const order = await prisma.orderMaterial.create({
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
      include: {
        groups: { include: { designs: true } },
      },
    });

    return NextResponse.json({ order: formatOrder(order) }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/inventory/orders:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
