// ─── SHARED ───────────────────────────────────────────────

export type MaterialType = 'stretch-antifluido' | 'brush';

// ─── ITEMS ────────────────────────────────────────────────

export type InventoryItemCategory = 'bandana' | 'gorrito';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryItemCategory;
  type: MaterialType;
  description: string;
  quantityCompleto: number;
  quantitySencillo: number;
  price: number;
  photoUrl?: string;
  tags: string[];
  materials: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type InventoryItemFormData = Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>;

// ─── DISEÑOS (Raw Materials) ──────────────────────────────

export interface RawMaterial {
  id: string;
  name: string;
  description: string;
  type: MaterialType;
  width: number;
  height: number;
  quantity: number;
  price: number;
  supplier: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RawMaterialFormData = Omit<RawMaterial, 'id' | 'createdAt' | 'updatedAt'>;

// ─── PEDIDOS (Order Materials) ────────────────────────────

export type OrderMaterialStatus = 'pending' | 'ordered' | 'received';
export type ParcelService = 'Estafeta' | 'DHL';

export interface OrderMaterialDesign {
  rawMaterialId: string;
  quantity: number;
  addToInventory?: boolean;
  customDesignName?: string;
  type?: MaterialType;
}

export interface OrderMaterialGroup {
  designs: OrderMaterialDesign[];
}

export interface OrderMaterial {
  id: string;
  materials: OrderMaterialGroup[];
  distributor: string;
  description: string;
  status: OrderMaterialStatus;
  trackingNumber?: string;
  parcel_service?: ParcelService;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderMaterialFormData = Omit<OrderMaterial, 'id' | 'createdAt' | 'updatedAt'>;

// ─── ENVIOS (Sales) ───────────────────────────────────────

export type SaleStatus = 'pending' | 'shipped' | 'delivered';
export type SocialMediaPlatform = 'facebook' | 'instagram' | 'whatsapp';
export type ShippingType = 'local' | 'nacional';
export type LocalShippingOption = 'meeting-point' | 'pzexpress';
export type NationalShippingCarrier = 'estafeta' | 'dhl' | 'fedex' | 'correos';

export interface SaleItem {
  itemId: string;
  quantity: number;
  addToInventory: boolean;
  customDesignName?: string;
}

export interface SaleExtra {
  id?: string;
  description: string;
  price: number;
  quantity?: number;
  discount?: number;
}

export interface Sale {
  id: string;
  name: string;
  status: SaleStatus;
  socialMediaPlatform: SocialMediaPlatform;
  socialMediaUsername: string;
  saleRef: string;
  trackingNumber?: string;
  invoiceRequired: boolean;
  shippingType: ShippingType;
  localShippingOption?: LocalShippingOption;
  localAddress?: string;
  nationalShippingCarrier?: NationalShippingCarrier;
  shippingDescription?: string;
  discount: number;
  totalAmount: number;
  deliveryDate?: Date;
  saleItems: SaleItem[];
  extras: SaleExtra[];
  createdAt: Date;
  updatedAt: Date;
}

export type SaleFormData = Omit<Sale, 'id' | 'saleRef' | 'createdAt' | 'updatedAt'>;

// ─── COTIZACIONES (Quotes) ────────────────────────────────

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
export type PaymentMethod = 'Efectivo' | 'Tarjeta de crédito' | 'Transferencia' | 'Deposito';
export type IvaRate = 8 | 16;

export interface QuoteItem {
  itemId: string;
  quantity: number;
  unitPrice: number;
  description?: string;
  discount?: number;
  manualName?: string;
  manualCategory?: string;
  manualType?: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCompany?: string;
  status: QuoteStatus;
  validUntil: Date;
  subtotal: number;
  discount: number;
  totalAmount: number;
  notes?: string;
  iva: IvaRate;
  includingIva?: boolean;
  paymentMethod: PaymentMethod;
  items: QuoteItem[];
  extras: SaleExtra[];
  createdAt: Date;
  updatedAt: Date;
}

export type QuoteFormData = Omit<Quote, 'id' | 'quoteNumber' | 'subtotal' | 'totalAmount' | 'createdAt' | 'updatedAt'>;
