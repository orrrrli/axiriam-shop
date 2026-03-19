import prisma from '@/lib/prisma';
import {
  InventoryItemFormData,
  RawMaterialFormData,
  OrderMaterialFormData,
  SaleFormData,
  QuoteFormData,
} from '@/types/inventory';
import {
  toDbMaterialType,
  toDbCategory,
  fromDbMaterialType,
  fromDbCategory,
  toDbLocalShipping,
  fromDbLocalShipping,
  generateQuoteNumber,
} from '@/lib/utils/inventory';

// ─── ITEMS ────────────────────────────────────────────────

export async function getItems() {
  const items = await prisma.inventoryItem.findMany({
    orderBy: { createdAt: 'desc' },
    include: { materials: { select: { rawMaterialId: true } } },
  });

  return items.map((item) => ({
    ...item,
    category: fromDbCategory(item.category),
    type: fromDbMaterialType(item.type),
    materials: item.materials.map((m) => m.rawMaterialId),
  }));
}

export async function getItemById(id: string) {
  const item = await prisma.inventoryItem.findUnique({
    where: { id },
    include: { materials: { select: { rawMaterialId: true } } },
  });

  if (!item) return null;

  return {
    ...item,
    category: fromDbCategory(item.category),
    type: fromDbMaterialType(item.type),
    materials: item.materials.map((m) => m.rawMaterialId),
  };
}

export async function createItem(data: InventoryItemFormData) {
  const item = await prisma.inventoryItem.create({
    data: {
      name: data.name,
      category: toDbCategory(data.category) as any,
      type: toDbMaterialType(data.type) as any,
      description: data.description,
      quantityCompleto: data.quantityCompleto,
      quantitySencillo: data.quantitySencillo,
      price: data.price,
      photoUrl: data.photoUrl || null,
      tags: data.tags ?? [],
      materials: {
        create: data.materials.map((rawMaterialId) => ({ rawMaterialId })),
      },
    },
    include: { materials: { select: { rawMaterialId: true } } },
  });

  return {
    ...item,
    category: fromDbCategory(item.category),
    type: fromDbMaterialType(item.type),
    materials: item.materials.map((m) => m.rawMaterialId),
  };
}

export async function updateItem(id: string, data: InventoryItemFormData) {
  await prisma.inventoryItemMaterial.deleteMany({ where: { itemId: id } });

  const item = await prisma.inventoryItem.update({
    where: { id },
    data: {
      name: data.name,
      category: toDbCategory(data.category) as any,
      type: toDbMaterialType(data.type) as any,
      description: data.description,
      quantityCompleto: data.quantityCompleto,
      quantitySencillo: data.quantitySencillo,
      price: data.price,
      photoUrl: data.photoUrl || null,
      tags: data.tags ?? [],
      materials: {
        create: data.materials.map((rawMaterialId) => ({ rawMaterialId })),
      },
    },
    include: { materials: { select: { rawMaterialId: true } } },
  });

  return {
    ...item,
    category: fromDbCategory(item.category),
    type: fromDbMaterialType(item.type),
    materials: item.materials.map((m) => m.rawMaterialId),
  };
}

export async function deleteItem(id: string) {
  const item = await prisma.inventoryItem.findUnique({ where: { id }, select: { photoUrl: true } });

  await prisma.inventoryItemMaterial.deleteMany({ where: { itemId: id } });
  await prisma.inventoryItem.delete({ where: { id } });

  if (item?.photoUrl) {
    const { deleteCloudinaryImage } = await import('@/lib/utils/cloudinary');
    await deleteCloudinaryImage(item.photoUrl).catch((err) =>
      console.error('Failed to delete Cloudinary image:', err),
    );
  }
}

// ─── DISEÑOS ──────────────────────────────────────────────

export async function getDesigns() {
  const designs = await prisma.rawMaterial.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return designs.map((d) => ({ ...d, type: fromDbMaterialType(d.type) }));
}

export async function getDesignById(id: string) {
  const design = await prisma.rawMaterial.findUnique({ where: { id } });
  if (!design) return null;
  return { ...design, type: fromDbMaterialType(design.type) };
}

export async function createDesign(data: RawMaterialFormData) {
  const design = await prisma.rawMaterial.create({
    data: {
      ...data,
      type: toDbMaterialType(data.type) as any,
      imageUrl: data.imageUrl || null,
    },
  });
  return { ...design, type: fromDbMaterialType(design.type) };
}

export async function updateDesign(id: string, data: RawMaterialFormData) {
  const design = await prisma.rawMaterial.update({
    where: { id },
    data: {
      ...data,
      type: toDbMaterialType(data.type) as any,
      imageUrl: data.imageUrl || null,
    },
  });
  return { ...design, type: fromDbMaterialType(design.type) };
}

export async function deleteDesign(id: string) {
  await prisma.rawMaterial.delete({ where: { id } });
}

// ─── PEDIDOS ──────────────────────────────────────────────

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

const orderInclude = {
  groups: { include: { designs: true } },
};

export async function getOrders() {
  const orders = await prisma.orderMaterial.findMany({
    orderBy: { createdAt: 'desc' },
    include: orderInclude,
  });
  return orders.map(formatOrder);
}

export async function getOrderById(id: string) {
  const order = await prisma.orderMaterial.findUnique({
    where: { id },
    include: orderInclude,
  });
  if (!order) return null;
  return formatOrder(order);
}

export async function createOrder(data: OrderMaterialFormData) {
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
              type: d.type ? toDbMaterialType(d.type) as any : null,
            })),
          },
        })),
      },
    },
    include: orderInclude,
  });
  return formatOrder(order);
}

export async function updateOrder(id: string, data: OrderMaterialFormData) {
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
              type: d.type ? toDbMaterialType(d.type) as any : null,
            })),
          },
        })),
      },
    },
    include: orderInclude,
  });
  return formatOrder(order);
}

export async function deleteOrder(id: string) {
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

// ─── ENVIOS ───────────────────────────────────────────────

function formatSale(sale: any) {
  return {
    ...sale,
    localShippingOption: sale.localShippingOption
      ? fromDbLocalShipping(sale.localShippingOption)
      : undefined,
  };
}

const saleInclude = { saleItems: true, extras: true };

export async function getSales() {
  const sales = await prisma.sale.findMany({
    orderBy: { createdAt: 'desc' },
    include: saleInclude,
  });
  return sales.map(formatSale);
}

export async function getSaleById(id: string) {
  const sale = await prisma.sale.findUnique({ where: { id }, include: saleInclude });
  if (!sale) return null;
  return formatSale(sale);
}

export async function createSale(data: SaleFormData) {
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
        ? toDbLocalShipping(data.localShippingOption) as any
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
          quantity: e.quantity,
          discount: e.discount,
        })),
      },
    },
    include: saleInclude,
  });
  return formatSale(sale);
}

export async function updateSale(id: string, data: SaleFormData) {
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
        ? toDbLocalShipping(data.localShippingOption) as any
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
          quantity: e.quantity,
          discount: e.discount,
        })),
      },
    },
    include: saleInclude,
  });
  return formatSale(sale);
}

export async function deleteSale(id: string) {
  await prisma.saleItem.deleteMany({ where: { saleId: id } });
  await prisma.saleExtra.deleteMany({ where: { saleId: id } });
  await prisma.sale.delete({ where: { id } });
}

// ─── COTIZACIONES ─────────────────────────────────────────

function formatQuote(quote: any) {
  return {
    ...quote,
    paymentMethod: quote.paymentMethod.replace(/_/g, ' '),
  };
}

const quoteInclude = { items: true, extras: true };

export async function getQuotes() {
  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: 'desc' },
    include: quoteInclude,
  });
  return quotes.map(formatQuote);
}

export async function getQuoteById(id: string) {
  const quote = await prisma.quote.findUnique({ where: { id }, include: quoteInclude });
  if (!quote) return null;
  return formatQuote(quote);
}

export async function createQuote(data: QuoteFormData) {
  const quoteNumber = generateQuoteNumber();

  const subtotal =
    data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity - (item.discount ?? 0), 0) +
    data.extras.reduce((sum, e) => sum + e.price * (e.quantity ?? 1) - (e.discount ?? 0), 0);

  const totalAmount = subtotal - (data.discount ?? 0);

  const quote = await prisma.quote.create({
    data: {
      quoteNumber,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      clientCompany: data.clientCompany,
      status: data.status,
      validUntil: new Date(data.validUntil),
      subtotal,
      discount: data.discount ?? 0,
      totalAmount,
      notes: data.notes,
      iva: data.iva,
      includingIva: data.includingIva ?? false,
      paymentMethod: data.paymentMethod.replace(/ /g, '_') as any,
      items: {
        create: data.items.map((item) => ({
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
        create: data.extras.map((e) => ({
          description: e.description,
          price: e.price,
          quantity: e.quantity,
          discount: e.discount,
        })),
      },
    },
    include: quoteInclude,
  });
  return formatQuote(quote);
}

export async function updateQuote(id: string, data: QuoteFormData) {
  await prisma.quoteItem.deleteMany({ where: { quoteId: id } });
  await prisma.quoteExtra.deleteMany({ where: { quoteId: id } });

  const subtotal =
    data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity - (item.discount ?? 0), 0) +
    data.extras.reduce((sum, e) => sum + e.price * (e.quantity ?? 1) - (e.discount ?? 0), 0);

  const totalAmount = subtotal - (data.discount ?? 0);

  const quote = await prisma.quote.update({
    where: { id },
    data: {
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      clientCompany: data.clientCompany,
      status: data.status,
      validUntil: new Date(data.validUntil),
      subtotal,
      discount: data.discount ?? 0,
      totalAmount,
      notes: data.notes,
      iva: data.iva,
      includingIva: data.includingIva ?? false,
      paymentMethod: data.paymentMethod.replace(/ /g, '_') as any,
      items: {
        create: data.items.map((item) => ({
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
        create: data.extras.map((e) => ({
          description: e.description,
          price: e.price,
          quantity: e.quantity,
          discount: e.discount,
        })),
      },
    },
    include: quoteInclude,
  });
  return formatQuote(quote);
}

export async function deleteQuote(id: string) {
  await prisma.quoteItem.deleteMany({ where: { quoteId: id } });
  await prisma.quoteExtra.deleteMany({ where: { quoteId: id } });
  await prisma.quote.delete({ where: { id } });
}
