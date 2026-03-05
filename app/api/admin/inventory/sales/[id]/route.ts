import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { toDbLocalShipping, fromDbLocalShipping } from '@/lib/utils/inventory';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') return null;
  return session;
}

function formatSale(sale: any) {
  return {
    ...sale,
    localShippingOption: sale.localShippingOption
      ? fromDbLocalShipping(sale.localShippingOption)
      : undefined,
    saleItems: sale.saleItems ?? [],
    extras: sale.extras ?? [],
  };
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sale = await prisma.sale.findUnique({
      where: { id: params.id },
      include: { saleItems: true, extras: true },
    });

    if (!sale) return NextResponse.json({ error: 'Sale not found' }, { status: 404 });

    return NextResponse.json({ sale: formatSale(sale) });
  } catch (error) {
    console.error('GET /api/admin/inventory/sales/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch sale' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name, status, socialMediaPlatform, socialMediaUsername,
      trackingNumber, invoiceRequired, shippingType,
      localShippingOption, localAddress, nationalShippingCarrier,
      shippingDescription, discount, totalAmount, deliveryDate,
      saleItems = [], extras = [],
    } = body;

    await prisma.saleItem.deleteMany({ where: { saleId: params.id } });
    await prisma.saleExtra.deleteMany({ where: { saleId: params.id } });

    const sale = await prisma.sale.update({
      where: { id: params.id },
      data: {
        name,
        status,
        socialMediaPlatform,
        socialMediaUsername,
        trackingNumber,
        invoiceRequired,
        shippingType,
        localShippingOption: localShippingOption
          ? toDbLocalShipping(localShippingOption) as any
          : null,
        localAddress,
        nationalShippingCarrier,
        shippingDescription,
        discount,
        totalAmount,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        saleItems: {
          create: saleItems.map((si: any) => ({
            itemId: si.itemId || null,
            quantity: si.quantity,
            addToInventory: si.addToInventory ?? false,
            customDesignName: si.customDesignName,
          })),
        },
        extras: {
          create: extras.map((e: any) => ({
            description: e.description,
            price: e.price,
            quantity: e.quantity,
            discount: e.discount,
          })),
        },
      },
      include: { saleItems: true, extras: true },
    });

    return NextResponse.json({ sale: formatSale(sale) });
  } catch (error) {
    console.error('PUT /api/admin/inventory/sales/[id]:', error);
    return NextResponse.json({ error: 'Failed to update sale' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.saleItem.deleteMany({ where: { saleId: params.id } });
    await prisma.saleExtra.deleteMany({ where: { saleId: params.id } });
    await prisma.sale.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/inventory/sales/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete sale' }, { status: 500 });
  }
}
