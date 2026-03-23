import {
  InventoryItem,
  InventoryItemFormData,
  ItemCreatePayload,
  InventoryItemSalesStats,
  RawMaterial,
  RawMaterialFormData,
  OrderMaterial,
  OrderMaterialFormData,
  Sale,
  SaleFormData,
  Quote,
  QuoteFormData,
  IvaRate,
  PaymentMethod,
  QuoteItem,
  QuoteStatus,
  StoreOrder,
  StoreOrderUpdateData,
} from '@/types/inventory';
import { slugifyItemName } from '@/lib/utils/inventory';
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
import {
  findAllOrders,
  findOrderById,
  createOrderRecord,
  updateOrderRecord,
  deleteOrderRecord,
} from '@/repositories/order-material.repository';
import {
  findAllSales,
  findSaleById,
  createSaleRecord,
  updateSaleRecord,
  deleteSaleRecord,
} from '@/repositories/sale.repository';

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

export async function getOrders(): Promise<OrderMaterial[]> {
  return findAllOrders();
}

export async function getOrderById(id: string): Promise<OrderMaterial | null> {
  return findOrderById(id);
}

export async function createOrder(data: OrderMaterialFormData): Promise<OrderMaterial> {
  return createOrderRecord(data);
}

export async function updateOrder(id: string, data: OrderMaterialFormData): Promise<OrderMaterial> {
  return updateOrderRecord(id, data);
}

export async function deleteOrder(id: string): Promise<void> {
  return deleteOrderRecord(id);
}

// ─── ENVIOS ───────────────────────────────────────────────────────────────────

export async function getSales(): Promise<Sale[]> {
  return findAllSales();
}

export async function getSaleById(id: string): Promise<Sale | null> {
  return findSaleById(id);
}

export async function createSale(data: SaleFormData): Promise<Sale> {
  return createSaleRecord(data);
}

export async function updateSale(id: string, data: SaleFormData): Promise<Sale> {
  return updateSaleRecord(id, data);
}

export async function deleteSale(id: string): Promise<void> {
  return deleteSaleRecord(id);
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
