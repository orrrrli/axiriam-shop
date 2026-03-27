import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import {
  OrderMaterial,
  OrderMaterialGroup,
  OrderMaterialDesign,
  OrderMaterialFormData,
  OrderMaterialStatus,
  ParcelService,
} from '@/types/inventory';
import { toDbMaterialType, fromDbMaterialType } from '@/lib/utils/inventory';

// ─── Prisma payload types ─────────────────────────────────────────────────────

const orderInclude = {
  groups: { include: { designs: true } },
} as const;

type DbOrder = Prisma.OrderMaterialGetPayload<{
  include: { groups: { include: { designs: true } } };
}>;

// ─── Domain mapper ────────────────────────────────────────────────────────────

function mapToOrder(raw: DbOrder): OrderMaterial {
  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
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

// ─── Repository functions ─────────────────────────────────────────────────────

export async function findAllOrders(): Promise<OrderMaterial[]> {
  const orders = await prisma.orderMaterial.findMany({
    orderBy: { createdAt: 'desc' },
    include: orderInclude,
  });
  return orders.map(mapToOrder);
}

export async function findOrderById(id: string): Promise<OrderMaterial | null> {
  const order = await prisma.orderMaterial.findUnique({
    where: { id },
    include: orderInclude,
  });
  return order ? mapToOrder(order) : null;
}

export async function findOrderByNumber(orderNumber: number): Promise<OrderMaterial | null> {
  const order = await prisma.orderMaterial.findUnique({
    where: { orderNumber },
    include: orderInclude,
  });
  return order ? mapToOrder(order) : null;
}

export async function createOrderRecord(data: OrderMaterialFormData): Promise<OrderMaterial> {
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
              type: d.type
                ? (toDbMaterialType(d.type) as Prisma.OrderMaterialDesignCreateInput['type'])
                : null,
            })),
          },
        })),
      },
    },
    include: orderInclude,
  });
  return mapToOrder(order);
}

export async function updateOrderRecord(
  id: string,
  data: OrderMaterialFormData,
): Promise<OrderMaterial> {
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
              type: d.type
                ? (toDbMaterialType(d.type) as Prisma.OrderMaterialDesignUpdateInput['type'])
                : null,
            })),
          },
        })),
      },
    },
    include: orderInclude,
  });
  return mapToOrder(order);
}

export async function deleteOrderRecord(id: string): Promise<void> {
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
