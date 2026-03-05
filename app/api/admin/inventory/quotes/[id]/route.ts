import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') return null;
  return session;
}

function formatQuote(quote: any) {
  return {
    ...quote,
    paymentMethod: quote.paymentMethod.replace(/_/g, ' '),
  };
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const quote = await prisma.quote.findUnique({
      where: { id: params.id },
      include: { items: true, extras: true },
    });

    if (!quote) return NextResponse.json({ error: 'Quote not found' }, { status: 404 });

    return NextResponse.json({ quote: formatQuote(quote) });
  } catch (error) {
    console.error('GET /api/admin/inventory/quotes/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      clientName, clientEmail, clientPhone, clientCompany,
      status, validUntil, discount, notes, iva, includingIva,
      paymentMethod, items = [], extras = [],
    } = body;

    await prisma.quoteItem.deleteMany({ where: { quoteId: params.id } });
    await prisma.quoteExtra.deleteMany({ where: { quoteId: params.id } });

    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + item.unitPrice * item.quantity - (item.discount ?? 0);
    }, 0) + extras.reduce((sum: number, e: any) => {
      return sum + e.price * (e.quantity ?? 1) - (e.discount ?? 0);
    }, 0);

    const totalAmount = subtotal - (discount ?? 0);

    const quote = await prisma.quote.update({
      where: { id: params.id },
      data: {
        clientName,
        clientEmail,
        clientPhone,
        clientCompany,
        status,
        validUntil: new Date(validUntil),
        subtotal,
        discount: discount ?? 0,
        totalAmount,
        notes,
        iva,
        includingIva: includingIva ?? false,
        paymentMethod: paymentMethod.replace(/ /g, '_') as any,
        items: {
          create: items.map((item: any) => ({
            itemId: item.itemId || null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            description: item.description,
            discount: item.discount,
            manualName: item.manualName,
            manualCategory: item.manualCategory,
            manualType: item.manualType,
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
      include: { items: true, extras: true },
    });

    return NextResponse.json({ quote: formatQuote(quote) });
  } catch (error) {
    console.error('PUT /api/admin/inventory/quotes/[id]:', error);
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.quoteItem.deleteMany({ where: { quoteId: params.id } });
    await prisma.quoteExtra.deleteMany({ where: { quoteId: params.id } });
    await prisma.quote.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/inventory/quotes/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
  }
}
