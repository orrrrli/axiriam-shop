import {
  Prisma,
  MaterialType as PrismaMaterialType,
  InventoryItemCategory as PrismaInventoryItemCategory,
  RawMaterial as PrismaRawMaterial,
} from '@prisma/client';
import prisma from '@/lib/prisma';
import {
  InventoryItem,
  InventoryItemFormData,
  InventoryItemSalesStats,
  RawMaterial,
  RawMaterialFormData,
  StoreOrder,
  StoreOrderItem,
  StoreOrderUpdateData,
} from '@/types/inventory';
import { fromDbMaterialType, fromDbCategory } from '@/lib/utils/inventory';

// ─── Prisma payload types ─────────────────────────────────────────────────────

const itemInclude = {
  materials: { select: { rawMaterialId: true } },
} as const;

type DbItem = Prisma.InventoryItemGetPayload<{
  include: { materials: { select: { rawMaterialId: true } } };
}>;

// ─── Type converters ──────────────────────────────────────────────────────────

function toPrismaCategory(category: string): PrismaInventoryItemCategory {
  return category as PrismaInventoryItemCategory;
}

function toPrismaMaterialType(type: string): PrismaMaterialType {
  return type.replace(/-/g, '_') as PrismaMaterialType;
}

// ─── Domain mappers ───────────────────────────────────────────────────────────

function mapToItem(raw: DbItem): InventoryItem {
  return {
    id: raw.id,
    name: raw.name,
    category: fromDbCategory(raw.category) as InventoryItem['category'],
    type: fromDbMaterialType(raw.type) as InventoryItem['type'],
    description: raw.description,
    quantityCompleto: raw.quantityCompleto,
    quantitySencillo: raw.quantitySencillo,
    price: Number(raw.price),
    photoUrl: raw.photoUrl ?? undefined,
    tags: raw.tags,
    materials: raw.materials.map((m) => m.rawMaterialId),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function mapToRawMaterial(raw: PrismaRawMaterial): RawMaterial {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    type: fromDbMaterialType(raw.type) as RawMaterial['type'],
    width: Number(raw.width),
    height: Number(raw.height),
    quantity: raw.quantity,
    price: Number(raw.price),
    supplier: raw.supplier,
    imageUrl: raw.imageUrl ?? undefined,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

// ─── Item repository ──────────────────────────────────────────────────────────

export async function findAllItems(): Promise<InventoryItem[]> {
  const items = await prisma.inventoryItem.findMany({
    orderBy: { createdAt: 'desc' },
    include: itemInclude,
  });
  return items.map(mapToItem);
}

export async function findItemById(id: string): Promise<InventoryItem | null> {
  const item = await prisma.inventoryItem.findUnique({
    where: { id },
    include: itemInclude,
  });
  return item ? mapToItem(item) : null;
}

export async function createInventoryItem(data: InventoryItemFormData): Promise<InventoryItem> {
  const item = await prisma.inventoryItem.create({
    data: {
      name: data.name,
      category: toPrismaCategory(data.category),
      type: toPrismaMaterialType(data.type),
      description: data.description,
      quantityCompleto: data.quantityCompleto,
      quantitySencillo: data.quantitySencillo,
      price: data.price,
      photoUrl: data.photoUrl ?? null,
      tags: data.tags ?? [],
      materials: {
        create: data.materials.map((rawMaterialId) => ({ rawMaterialId })),
      },
    },
    include: itemInclude,
  });
  return mapToItem(item);
}

export async function updateInventoryItem(
  id: string,
  data: InventoryItemFormData,
): Promise<InventoryItem> {
  await prisma.inventoryItemMaterial.deleteMany({ where: { itemId: id } });
  const item = await prisma.inventoryItem.update({
    where: { id },
    data: {
      name: data.name,
      category: toPrismaCategory(data.category),
      type: toPrismaMaterialType(data.type),
      description: data.description,
      quantityCompleto: data.quantityCompleto,
      quantitySencillo: data.quantitySencillo,
      price: data.price,
      photoUrl: data.photoUrl ?? null,
      tags: data.tags ?? [],
      materials: {
        create: data.materials.map((rawMaterialId) => ({ rawMaterialId })),
      },
    },
    include: itemInclude,
  });
  return mapToItem(item);
}

export async function deleteInventoryItem(id: string): Promise<string | null> {
  const item = await prisma.inventoryItem.findUnique({
    where: { id },
    select: { photoUrl: true },
  });
  await prisma.inventoryItemMaterial.deleteMany({ where: { itemId: id } });
  await prisma.inventoryItem.delete({ where: { id } });
  return item?.photoUrl ?? null;
}

export async function createItemAndDeductStock(
  data: InventoryItemFormData,
  warehouseMaterialId: string,
  consumedQty: number,
): Promise<InventoryItem> {
  const [item] = await prisma.$transaction([
    prisma.inventoryItem.create({
      data: {
        name: data.name,
        category: toPrismaCategory(data.category),
        type: toPrismaMaterialType(data.type),
        description: data.description,
        quantityCompleto: data.quantityCompleto,
        quantitySencillo: data.quantitySencillo,
        price: data.price,
        photoUrl: data.photoUrl ?? null,
        tags: data.tags ?? [],
        materials: {
          create: [{ rawMaterialId: warehouseMaterialId }],
        },
      },
      include: itemInclude,
    }),
    prisma.rawMaterial.update({
      where: { id: warehouseMaterialId },
      data: { quantity: { decrement: consumedQty } },
    }),
  ]);
  return mapToItem(item);
}

export async function createItemWithNewWarehouse(
  data: InventoryItemFormData,
): Promise<InventoryItem> {
  return prisma.$transaction(async (tx) => {
    const material = await tx.rawMaterial.create({
      data: {
        name: data.name,
        description: '',
        type: toPrismaMaterialType(data.type),
        width: 0,
        height: 0,
        quantity: 0,
        price: 0,
        supplier: '',
        imageUrl: data.photoUrl ?? null,
      },
    });
    const item = await tx.inventoryItem.create({
      data: {
        name: data.name,
        category: toPrismaCategory(data.category),
        type: toPrismaMaterialType(data.type),
        description: data.description,
        quantityCompleto: data.quantityCompleto,
        quantitySencillo: data.quantitySencillo,
        price: data.price,
        photoUrl: data.photoUrl ?? null,
        tags: data.tags ?? [],
        materials: {
          create: [{ rawMaterialId: material.id }],
        },
      },
      include: itemInclude,
    });
    return mapToItem(item);
  });
}

// ─── Design (Raw Material) repository ────────────────────────────────────────

export async function findAllDesigns(): Promise<RawMaterial[]> {
  const designs = await prisma.rawMaterial.findMany({ orderBy: { createdAt: 'desc' } });
  return designs.map(mapToRawMaterial);
}

export async function findDesignById(id: string): Promise<RawMaterial | null> {
  const design = await prisma.rawMaterial.findUnique({ where: { id } });
  return design ? mapToRawMaterial(design) : null;
}

export async function createDesignRecord(data: RawMaterialFormData): Promise<RawMaterial> {
  const design = await prisma.rawMaterial.create({
    data: {
      name: data.name,
      description: data.description,
      type: toPrismaMaterialType(data.type),
      width: data.width,
      height: data.height,
      quantity: data.quantity,
      price: data.price,
      supplier: data.supplier,
      imageUrl: data.imageUrl ?? null,
    },
  });
  return mapToRawMaterial(design);
}

export async function updateDesignRecord(
  id: string,
  data: RawMaterialFormData,
): Promise<RawMaterial> {
  const design = await prisma.rawMaterial.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      type: toPrismaMaterialType(data.type),
      width: data.width,
      height: data.height,
      quantity: data.quantity,
      price: data.price,
      supplier: data.supplier,
      imageUrl: data.imageUrl ?? null,
    },
  });
  return mapToRawMaterial(design);
}

export async function countItemsLinkedToMaterial(id: string): Promise<number> {
  return prisma.inventoryItemMaterial.count({ where: { rawMaterialId: id } });
}

export async function deleteDesignRecord(id: string): Promise<void> {
  await prisma.rawMaterial.delete({ where: { id } });
}

// ─── Store Orders ─────────────────────────────────────────────────────────────

const storeOrderInclude = {
  user: { select: { id: true, name: true, email: true } },
  orderItems: true,
  shippingAddress: true,
} as const;

type DbStoreOrder = Prisma.OrderGetPayload<{
  include: {
    user: { select: { id: true; name: true; email: true } };
    orderItems: true;
    shippingAddress: true;
  };
}>;

function mapToStoreOrder(raw: DbStoreOrder): StoreOrder {
  return {
    id: raw.id,
    customer: {
      id: raw.user.id,
      name: raw.user.name,
      email: raw.user.email,
    },
    orderItems: raw.orderItems.map((oi): StoreOrderItem => ({
      id: oi.id,
      name: oi.name,
      quantity: oi.quantity,
      price: Number(oi.price),
      productId: oi.productId,
    })),
    shippingAddress: raw.shippingAddress
      ? {
          id: raw.shippingAddress.id,
          fullName: raw.shippingAddress.fullName,
          address: raw.shippingAddress.address,
          city: raw.shippingAddress.city,
          postalCode: raw.shippingAddress.postalCode,
          country: raw.shippingAddress.country,
          phone: raw.shippingAddress.phone,
        }
      : undefined,
    paymentMethod: raw.paymentMethod,
    itemsPrice: Number(raw.itemsPrice),
    taxPrice: Number(raw.taxPrice),
    shippingPrice: Number(raw.shippingPrice),
    totalPrice: Number(raw.totalPrice),
    isPaid: raw.isPaid,
    paidAt: raw.paidAt ?? undefined,
    isDelivered: raw.isDelivered,
    deliveredAt: raw.deliveredAt ?? undefined,
    status: raw.status as StoreOrder['status'],
    trackingNumber: raw.trackingNumber ?? undefined,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export async function findAllStoreOrders(): Promise<StoreOrder[]> {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: storeOrderInclude,
  });
  return orders.map(mapToStoreOrder);
}

export async function findStoreOrderById(id: string): Promise<StoreOrder | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: storeOrderInclude,
  });
  return order ? mapToStoreOrder(order) : null;
}

export async function updateStoreOrderRecord(
  id: string,
  data: StoreOrderUpdateData,
): Promise<StoreOrder> {
  const order = await prisma.order.update({
    where: { id },
    data: {
      status: data.status,
      trackingNumber: data.trackingNumber ?? null,
      isDelivered: data.isDelivered ?? false,
      deliveredAt: data.deliveredAt ? new Date(data.deliveredAt) : null,
    },
    include: storeOrderInclude,
  });
  return mapToStoreOrder(order);
}

// ─── Sales stats ──────────────────────────────────────────────────────────────

export async function findItemsSalesStats(): Promise<InventoryItemSalesStats[]> {
  const results = await prisma.saleItem.groupBy({
    by: ['itemId'],
    where: { itemId: { not: null } },
    _sum: { quantity: true },
    _count: { _all: true },
  });

  return results.map((r) => ({
    itemId: r.itemId as string,
    quantitySold: r._sum.quantity ?? 0,
    salesCount: r._count._all,
  }));
}
