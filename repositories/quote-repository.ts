import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import {
  Quote,
  QuoteFormData,
  QuoteItem,
  SaleExtra,
  PaymentMethod,
  QuoteStatus,
  IvaRate,
} from '@/types/inventory';
import { generateQuoteNumber } from '@/lib/utils/inventory';

// ─── Types ─────────────────────────────────────────────────────────────────

const quoteInclude = { items: true, extras: true } as const;

type QuoteWithRelations = Prisma.QuoteGetPayload<{
  include: { items: true; extras: true };
}>;

export interface CreateQuoteData extends QuoteFormData {
  subtotal: number;
  totalAmount: number;
}

// ─── Private mapper ────────────────────────────────────────────────────────

function mapToQuote(raw: QuoteWithRelations): Quote {
  return {
    id: raw.id,
    quoteNumber: raw.quoteNumber,
    clientName: raw.clientName,
    clientEmail: raw.clientEmail ?? undefined,
    clientPhone: raw.clientPhone ?? undefined,
    clientCompany: raw.clientCompany ?? undefined,
    status: raw.status as QuoteStatus,
    validUntil: raw.validUntil,
    subtotal: Number(raw.subtotal),
    discount: Number(raw.discount),
    totalAmount: Number(raw.totalAmount),
    notes: raw.notes ?? undefined,
    iva: raw.iva as IvaRate,
    includingIva: raw.includingIva ?? false,
    paymentMethod: raw.paymentMethod.replace(/_/g, ' ') as PaymentMethod,
    items: raw.items.map(
      (item): QuoteItem => ({
        itemId: item.itemId ?? '',
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        description: item.description ?? undefined,
        discount: item.discount ?? undefined,
        manualName: item.manualName ?? undefined,
        manualCategory: item.manualCategory ?? undefined,
        manualType: item.manualType ?? undefined,
      })
    ),
    extras: raw.extras.map(
      (extra): SaleExtra => ({
        id: extra.id,
        description: extra.description,
        price: Number(extra.price),
        quantity: extra.quantity ?? undefined,
        discount: extra.discount ?? undefined,
      })
    ),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

// ─── Repository functions ──────────────────────────────────────────────────

export async function getQuotes(): Promise<Quote[]> {
  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: 'desc' },
    include: quoteInclude,
  });
  return quotes.map(mapToQuote);
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: quoteInclude,
  });
  return quote ? mapToQuote(quote) : null;
}

export async function getQuoteByNumber(quoteNumber: string): Promise<Quote | null> {
  const quote = await prisma.quote.findUnique({
    where: { quoteNumber },
    include: quoteInclude,
  });
  return quote ? mapToQuote(quote) : null;
}

export async function createQuote(data: CreateQuoteData): Promise<Quote> {
  const quoteNumber = generateQuoteNumber();

  const quote = await prisma.quote.create({
    data: {
      quoteNumber,
      clientName: data.clientName,
      clientEmail: data.clientEmail ?? null,
      clientPhone: data.clientPhone ?? null,
      clientCompany: data.clientCompany ?? null,
      status: data.status,
      validUntil: new Date(data.validUntil),
      subtotal: data.subtotal,
      discount: data.discount ?? 0,
      totalAmount: data.totalAmount,
      notes: data.notes ?? null,
      iva: data.iva,
      includingIva: data.includingIva ?? false,
      paymentMethod: data.paymentMethod.replace(/ /g, '_') as string as Prisma.QuoteCreateInput['paymentMethod'],
      items: {
        create: data.items.map((item) => ({
          itemId: item.itemId || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          description: item.description ?? null,
          discount: item.discount ?? null,
          manualName: item.manualName ?? null,
          manualCategory: item.manualCategory ?? null,
          manualType: item.manualType ?? null,
        })),
      },
      extras: {
        create: data.extras.map((e) => ({
          description: e.description,
          price: e.price,
          quantity: e.quantity ?? null,
          discount: e.discount ?? null,
        })),
      },
    },
    include: quoteInclude,
  });

  return mapToQuote(quote);
}

export async function updateQuote(id: string, data: CreateQuoteData): Promise<Quote> {
  await prisma.quoteItem.deleteMany({ where: { quoteId: id } });
  await prisma.quoteExtra.deleteMany({ where: { quoteId: id } });

  const quote = await prisma.quote.update({
    where: { id },
    data: {
      clientName: data.clientName,
      clientEmail: data.clientEmail ?? null,
      clientPhone: data.clientPhone ?? null,
      clientCompany: data.clientCompany ?? null,
      status: data.status,
      validUntil: new Date(data.validUntil),
      subtotal: data.subtotal,
      discount: data.discount ?? 0,
      totalAmount: data.totalAmount,
      notes: data.notes ?? null,
      iva: data.iva,
      includingIva: data.includingIva ?? false,
      paymentMethod: data.paymentMethod.replace(/ /g, '_') as string as Prisma.QuoteUpdateInput['paymentMethod'],
      items: {
        create: data.items.map((item) => ({
          itemId: item.itemId || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          description: item.description ?? null,
          discount: item.discount ?? null,
          manualName: item.manualName ?? null,
          manualCategory: item.manualCategory ?? null,
          manualType: item.manualType ?? null,
        })),
      },
      extras: {
        create: data.extras.map((e) => ({
          description: e.description,
          price: e.price,
          quantity: e.quantity ?? null,
          discount: e.discount ?? null,
        })),
      },
    },
    include: quoteInclude,
  });

  return mapToQuote(quote);
}

export async function deleteQuote(id: string): Promise<void> {
  await prisma.quoteItem.deleteMany({ where: { quoteId: id } });
  await prisma.quoteExtra.deleteMany({ where: { quoteId: id } });
  await prisma.quote.delete({ where: { id } });
}
