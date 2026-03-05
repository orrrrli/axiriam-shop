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

export async function GET() {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: 'desc' },
      include: { saleItems: true, extras: true },
    });

    return NextResponse.json({ sales: sales.map(formatSale) });
  } catch (error) {
    console.error('GET /api/admin/inventory/sales:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const sale = await prisma.sale.create({
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

    return NextResponse.json({ sale: formatSale(sale) }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/inventory/sales:', error);
    return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
  }
}
