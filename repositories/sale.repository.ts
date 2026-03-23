import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import {
  Sale,
  SaleItem,
  SaleExtra,
  SaleFormData,
  SaleStatus,
  SocialMediaPlatform,
  ShippingType,
  LocalShippingOption,
  NationalShippingCarrier,
} from '@/types/inventory';
import { toDbLocalShipping, fromDbLocalShipping } from '@/lib/utils/inventory';

// ─── Prisma payload types ─────────────────────────────────────────────────────

const saleInclude = { saleItems: true, extras: true } as const;

type DbSale = Prisma.SaleGetPayload<{
  include: { saleItems: true; extras: true };
}>;

// ─── Domain mapper ────────────────────────────────────────────────────────────

function mapToSale(raw: DbSale): Sale {
  return {
    id: raw.id,
    name: raw.name,
    status: raw.status as SaleStatus,
    socialMediaPlatform: raw.socialMediaPlatform as SocialMediaPlatform,
    socialMediaUsername: raw.socialMediaUsername,
    saleRef: raw.saleRef,
    trackingNumber: raw.trackingNumber ?? undefined,
    invoiceRequired: raw.invoiceRequired,
    shippingType: raw.shippingType as ShippingType,
    localShippingOption: raw.localShippingOption
      ? (fromDbLocalShipping(raw.localShippingOption) as LocalShippingOption)
      : undefined,
    localAddress: raw.localAddress ?? undefined,
    nationalShippingCarrier: raw.nationalShippingCarrier as NationalShippingCarrier | undefined,
    shippingDescription: raw.shippingDescription ?? undefined,
    discount: Number(raw.discount),
    totalAmount: Number(raw.totalAmount),
    deliveryDate: raw.deliveryDate ?? undefined,
    saleItems: raw.saleItems.map((si): SaleItem => ({
      itemId: si.itemId ?? '',
      quantity: si.quantity,
      addToInventory: si.addToInventory,
      customDesignName: si.customDesignName ?? undefined,
    })),
    extras: raw.extras.map((e): SaleExtra => ({
      id: e.id,
      description: e.description,
      price: Number(e.price),
      quantity: e.quantity ?? undefined,
      discount: e.discount ?? undefined,
    })),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

// ─── Repository functions ─────────────────────────────────────────────────────

export async function findAllSales(): Promise<Sale[]> {
  const sales = await prisma.sale.findMany({
    orderBy: { createdAt: 'desc' },
    include: saleInclude,
  });
  return sales.map(mapToSale);
}

export async function findSaleById(id: string): Promise<Sale | null> {
  const sale = await prisma.sale.findUnique({ where: { id }, include: saleInclude });
  return sale ? mapToSale(sale) : null;
}

export async function createSaleRecord(data: SaleFormData): Promise<Sale> {
  const sale = await prisma.sale.create({
    data: {
      name: data.name,
      status: data.status,
      socialMediaPlatform: data.socialMediaPlatform,
      socialMediaUsername: data.socialMediaUsername,
      trackingNumber: data.trackingNumber,
      invoiceRequired: data.invoiceRequired,
      shippingType: data.shippingType,
      localShippingOption: data.localShippingOption
        ? (toDbLocalShipping(data.localShippingOption) as Prisma.SaleCreateInput['localShippingOption'])
        : null,
      localAddress: data.localAddress,
      nationalShippingCarrier: data.nationalShippingCarrier,
      shippingDescription: data.shippingDescription,
      discount: data.discount,
      totalAmount: data.totalAmount,
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
      saleItems: {
        create: data.saleItems.map((si) => ({
          itemId: si.itemId || null,
          quantity: si.quantity,
          addToInventory: si.addToInventory,
          customDesignName: si.customDesignName,
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
    include: saleInclude,
  });
  return mapToSale(sale);
}

export async function updateSaleRecord(id: string, data: SaleFormData): Promise<Sale> {
  await prisma.saleItem.deleteMany({ where: { saleId: id } });
  await prisma.saleExtra.deleteMany({ where: { saleId: id } });

  const sale = await prisma.sale.update({
    where: { id },
    data: {
      name: data.name,
      status: data.status,
      socialMediaPlatform: data.socialMediaPlatform,
      socialMediaUsername: data.socialMediaUsername,
      trackingNumber: data.trackingNumber,
      invoiceRequired: data.invoiceRequired,
      shippingType: data.shippingType,
      localShippingOption: data.localShippingOption
        ? (toDbLocalShipping(data.localShippingOption) as Prisma.SaleUpdateInput['localShippingOption'])
        : null,
      localAddress: data.localAddress,
      nationalShippingCarrier: data.nationalShippingCarrier,
      shippingDescription: data.shippingDescription,
      discount: data.discount,
      totalAmount: data.totalAmount,
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
      saleItems: {
        create: data.saleItems.map((si) => ({
          itemId: si.itemId || null,
          quantity: si.quantity,
          addToInventory: si.addToInventory,
          customDesignName: si.customDesignName,
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
    include: saleInclude,
  });
  return mapToSale(sale);
}

export async function deleteSaleRecord(id: string): Promise<void> {
  await prisma.saleItem.deleteMany({ where: { saleId: id } });
  await prisma.saleExtra.deleteMany({ where: { saleId: id } });
  await prisma.sale.delete({ where: { id } });
}
