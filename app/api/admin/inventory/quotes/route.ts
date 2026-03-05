import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateQuoteNumber } from '@/lib/utils/inventory';

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

    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true, extras: true },
    });

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error('GET /api/admin/inventory/quotes:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const count = await prisma.quote.count();
    const quoteNumber = generateQuoteNumber(count);

    // Calculate subtotal from items
    const subtotal = items.reduce((sum: number, item: any) => {
      const itemTotal = item.unitPrice * item.quantity;
      const itemDiscount = item.discount ?? 0;
      return sum + itemTotal - itemDiscount;
    }, 0) + extras.reduce((sum: number, e: any) => {
      return sum + e.price * (e.quantity ?? 1) - (e.discount ?? 0);
    }, 0);

    const totalAmount = subtotal - (discount ?? 0);

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
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

    return NextResponse.json({
      quote: {
        ...quote,
        paymentMethod: quote.paymentMethod.replace(/_/g, ' '),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/inventory/quotes:', error);
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}
