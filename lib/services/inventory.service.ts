import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import {
  InventoryItem,
  InventoryItemFormData,
  ItemCreatePayload,
  InventoryItemSalesStats,
  RawMaterial,
  RawMaterialFormData,
  OrderMaterial,
  OrderMaterialGroup,
  OrderMaterialDesign,
  OrderMaterialFormData,
  OrderMaterialStatus,
  ParcelService,
  Sale,
  SaleItem,
  SaleExtra,
  SaleFormData,
  SaleStatus,
  SocialMediaPlatform,
  ShippingType,
  LocalShippingOption,
  NationalShippingCarrier,
  Quote,
  QuoteFormData,
  IvaRate,
  PaymentMethod,
  QuoteItem,
  QuoteStatus,
  StoreOrder,
  StoreOrderUpdateData,
} from '@/types/inventory';
import { toDbMaterialType, toDbLocalShipping, fromDbLocalShipping, fromDbMaterialType, slugifyItemName } from '@/lib/utils/inventory';
import {
  findAllItems,
  findItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  createItemAndDeductStock,
  createItemWithNewWarehouse,
  findItemsSalesStats,
  findAllDesigns,
  findDesignById,
  createDesignRecord,
  updateDesignRecord,
  deleteDesignRecord,
  countItemsLinkedToMaterial,
  findAllStoreOrders,
  findStoreOrderById,
  updateStoreOrderRecord,
} from '@/repositories/inventory.repository';
import {
  getQuotes as getQuotesFromRepo,
  getQuoteById as getQuoteByIdFromRepo,
  createQuote as createQuoteInRepo,
  updateQuote as updateQuoteInRepo,
  deleteQuote as deleteQuoteFromRepo,
} from '@/repositories/quote-repository';

// ─── ITEMS ────────────────────────────────────────────────────────────────────

export class InventoryError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = 'InventoryError';
  }
}

export async function getItems(): Promise<InventoryItem[]> {
  return findAllItems();
}

export async function getItemById(id: string): Promise<InventoryItem | null> {
  return findItemById(id);
}

export async function getItemBySlug(slug: string): Promise<InventoryItem | null> {
  const items = await findAllItems();
  return items.find((item) => slugifyItemName(item.name) === slug) ?? null;
}

export async function createItem(data: ItemCreatePayload): Promise<InventoryItem> {
  const items = await findAllItems();
  const targetSlug = slugifyItemName(data.name);
  if (items.some((item) => slugifyItemName(item.name) === targetSlug)) {
    throw new InventoryError('DUPLICATE_NAME', `Ya existe un producto con el nombre "${data.name}"`);
  }

  if (data.warehouseMaterialId) {
    const consumed = data.materialConsumedQty ?? 0;
    const material = await findDesignById(data.warehouseMaterialId);
    if (!material) {
      throw new InventoryError('NOT_FOUND', 'Material de almacén no encontrado');
    }
    if (consumed > 0 && material.quantity < consumed) {
      throw new InventoryError(
        'INSUFFICIENT_STOCK',
        `Stock insuficiente. Disponible: ${material.quantity}, Requerido: ${consumed}`,
      );
    }
    return createItemAndDeductStock(data, data.warehouseMaterialId, consumed);
  }

  return createItemWithNewWarehouse(data);
}

export async function updateItem(id: string, data: InventoryItemFormData): Promise<InventoryItem> {
  const items = await findAllItems();
  const targetSlug = slugifyItemName(data.name);
  if (items.some((item) => item.id !== id && slugifyItemName(item.name) === targetSlug)) {
    throw new InventoryError('DUPLICATE_NAME', `Ya existe un producto con el nombre "${data.name}"`);
  }
  return updateInventoryItem(id, data);
}

export async function getItemsSalesStats(): Promise<InventoryItemSalesStats[]> {
  return findItemsSalesStats();
}

export async function deleteItem(id: string): Promise<void> {
  const photoUrl = await deleteInventoryItem(id);
  if (photoUrl) {
    const { deleteCloudinaryImage } = await import('@/lib/utils/cloudinary');
    await deleteCloudinaryImage(photoUrl).catch((err) =>
      console.error('Failed to delete Cloudinary image:', err),
    );
  }
}

// ─── DISEÑOS ──────────────────────────────────────────────────────────────────

export async function getDesigns(): Promise<RawMaterial[]> {
  return findAllDesigns();
}

export async function getDesignById(id: string): Promise<RawMaterial | null> {
  return findDesignById(id);
}

export async function createDesign(data: RawMaterialFormData): Promise<RawMaterial> {
  return createDesignRecord(data);
}

export async function updateDesign(id: string, data: RawMaterialFormData): Promise<RawMaterial> {
  return updateDesignRecord(id, data);
}

export async function deleteDesign(id: string): Promise<void> {
  const linked = await countItemsLinkedToMaterial(id);
  if (linked > 0) {
    throw new InventoryError(
      'MATERIAL_IN_USE',
      'Este material está vinculado a uno o más productos y no puede eliminarse.',
    );
  }
  return deleteDesignRecord(id);
}

// ─── PEDIDOS ──────────────────────────────────────────────────────────────────

const orderInclude = {
  groups: { include: { designs: true } },
} as const;

type DbOrder = Prisma.OrderMaterialGetPayload<{
  include: { groups: { include: { designs: true } } };
}>;

function mapToOrder(raw: DbOrder): OrderMaterial {
  return {
    id: raw.id,
    distributor: raw.distributor,
    description: raw.description,
    status: raw.status as OrderMaterialStatus,
    trackingNumber: raw.trackingNumber ?? undefined,
    parcel_service: raw.parcelService as ParcelService | undefined,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    materials: raw.groups.map((group): OrderMaterialGroup => ({
      designs: group.designs.map((d): OrderMaterialDesign => ({
        rawMaterialId: d.rawMaterialId ?? '',
        quantity: d.quantity,
        addToInventory: d.addToInventory,
        customDesignName: d.customDesignName ?? undefined,
        type: d.type ? (fromDbMaterialType(d.type) as OrderMaterialDesign['type']) : undefined,
      })),
    })),
  };
}

export async function getOrders(): Promise<OrderMaterial[]> {
  const orders = await prisma.orderMaterial.findMany({
    orderBy: { createdAt: 'desc' },
    include: orderInclude,
  });
  return orders.map(mapToOrder);
}

export async function getOrderById(id: string): Promise<OrderMaterial | null> {
  const order = await prisma.orderMaterial.findUnique({
    where: { id },
    include: orderInclude,
  });
  return order ? mapToOrder(order) : null;
}

export async function createOrder(data: OrderMaterialFormData): Promise<OrderMaterial> {
  const order = await prisma.orderMaterial.create({
    data: {
      distributor: data.distributor,
      description: data.description,
      status: data.status,
      trackingNumber: data.trackingNumber,
      parcelService: data.parcel_service,
      groups: {
        create: data.materials.map((group) => ({
          designs: {
            create: group.designs.map((d) => ({
              rawMaterialId: d.rawMaterialId || null,
              quantity: d.quantity,
              addToInventory: d.addToInventory ?? false,
              customDesignName: d.customDesignName,
              type: d.type ? (toDbMaterialType(d.type) as Prisma.OrderMaterialDesignCreateInput['type']) : null,
            })),
          },
        })),
      },
    },
    include: orderInclude,
  });
  return mapToOrder(order);
}

export async function updateOrder(id: string, data: OrderMaterialFormData): Promise<OrderMaterial> {
  const existingGroups = await prisma.orderMaterialGroup.findMany({
    where: { orderMaterialId: id },
    select: { id: true },
  });
  await prisma.orderMaterialDesign.deleteMany({
    where: { groupId: { in: existingGroups.map((g) => g.id) } },
  });
  await prisma.orderMaterialGroup.deleteMany({ where: { orderMaterialId: id } });

  const order = await prisma.orderMaterial.update({
    where: { id },
    data: {
      distributor: data.distributor,
      description: data.description,
      status: data.status,
      trackingNumber: data.trackingNumber,
      parcelService: data.parcel_service,
      groups: {
        create: data.materials.map((group) => ({
          designs: {
            create: group.designs.map((d) => ({
              rawMaterialId: d.rawMaterialId || null,
              quantity: d.quantity,
              addToInventory: d.addToInventory ?? false,
              customDesignName: d.customDesignName,
              type: d.type ? (toDbMaterialType(d.type) as Prisma.OrderMaterialDesignCreateInput['type']) : null,
            })),
          },
        })),
      },
    },
    include: orderInclude,
  });
  return mapToOrder(order);
}

export async function deleteOrder(id: string): Promise<void> {
  const groups = await prisma.orderMaterialGroup.findMany({
    where: { orderMaterialId: id },
    select: { id: true },
  });
  await prisma.orderMaterialDesign.deleteMany({
    where: { groupId: { in: groups.map((g) => g.id) } },
  });
  await prisma.orderMaterialGroup.deleteMany({ where: { orderMaterialId: id } });
  await prisma.orderMaterial.delete({ where: { id } });
}

// ─── ENVIOS ───────────────────────────────────────────────────────────────────

const saleInclude = { saleItems: true, extras: true } as const;

type DbSale = Prisma.SaleGetPayload<{
  include: { saleItems: true; extras: true };
}>;

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

export async function getSales(): Promise<Sale[]> {
  const sales = await prisma.sale.findMany({
    orderBy: { createdAt: 'desc' },
    include: saleInclude,
  });
  return sales.map(mapToSale);
}

export async function getSaleById(id: string): Promise<Sale | null> {
  const sale = await prisma.sale.findUnique({ where: { id }, include: saleInclude });
  return sale ? mapToSale(sale) : null;
}

export async function createSale(data: SaleFormData): Promise<Sale> {
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

export async function updateSale(id: string, data: SaleFormData): Promise<Sale> {
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

export async function deleteSale(id: string): Promise<void> {
  await prisma.saleItem.deleteMany({ where: { saleId: id } });
  await prisma.saleExtra.deleteMany({ where: { saleId: id } });
  await prisma.sale.delete({ where: { id } });
}

// ─── COTIZACIONES ─────────────────────────────────────────────────────────────

export async function getQuotes(): Promise<Quote[]> {
  return getQuotesFromRepo();
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  return getQuoteByIdFromRepo(id);
}

export async function createQuote(data: QuoteFormData): Promise<Quote> {
  const subtotal =
    data.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity - (item.discount ?? 0),
      0,
    ) +
    data.extras.reduce(
      (sum, e) => sum + e.price * (e.quantity ?? 1) - (e.discount ?? 0),
      0,
    );

  const totalAmount = subtotal - (data.discount ?? 0);

  return createQuoteInRepo({ ...data, subtotal, totalAmount });
}

export async function updateQuote(id: string, data: QuoteFormData): Promise<Quote> {
  const subtotal =
    data.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity - (item.discount ?? 0),
      0,
    ) +
    data.extras.reduce(
      (sum, e) => sum + e.price * (e.quantity ?? 1) - (e.discount ?? 0),
      0,
    );

  const totalAmount = subtotal - (data.discount ?? 0);

  return updateQuoteInRepo(id, { ...data, subtotal, totalAmount });
}

export async function deleteQuote(id: string): Promise<void> {
  return deleteQuoteFromRepo(id);
}

// ─── VENTAS (Store Orders) ────────────────────────────────────────────────────

export async function getStoreOrders(): Promise<StoreOrder[]> {
  return findAllStoreOrders();
}

export async function getStoreOrderById(id: string): Promise<StoreOrder | null> {
  return findStoreOrderById(id);
}

export async function updateStoreOrder(id: string, data: StoreOrderUpdateData): Promise<StoreOrder> {
  return updateStoreOrderRecord(id, data);
}
