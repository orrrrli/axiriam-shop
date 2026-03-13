import { InventoryItemCategory, MaterialType } from '@/types/inventory';

/**
 * Display labels for inventory item categories
 * Maps internal category values to user-friendly Spanish labels
 */
export const CATEGORY_LABELS: Record<InventoryItemCategory, string> = {
  bandana: 'Bandana',
  gorrito: 'Gorrito',
};

/**
 * Display labels for material types
 * Maps internal type values to user-friendly Spanish labels
 */
export const TYPE_LABELS: Record<MaterialType, string> = {
  'stretch-antifluido': 'Stretch Antifluido',
  brush: 'Brush',
};

/**
 * Column headers for the items table view
 */
export const ITEM_COLUMNS = [
  'Foto',
  'Nombre',
  'Categoría',
  'Tipo',
  'Completo',
  'Sencillo',
  'Precio',
  'Acciones',
];

/**
 * Default form values for creating a new inventory item.
 * Quantity fields default to '' so inputs render empty rather than showing 0.
 */
export const EMPTY_ITEM_FORM = {
  name: '',
  category: 'bandana' as InventoryItemCategory,
  type: 'stretch-antifluido' as MaterialType,
  description: '',
  quantityCompleto: '' as number | '',
  quantitySencillo: '' as number | '',
  price: 0,
  photoUrl: undefined as string | undefined,
  materials: [] as string[],
};
