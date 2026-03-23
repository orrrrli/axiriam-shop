import { RawMaterialFormData } from '@/types/inventory';

export const WAREHOUSE_TYPE_LABELS: Record<string, string> = {
  'stretch-antifluido': 'Stretch Antifluido',
  'brush': 'Brush',
};

export const WAREHOUSE_COLUMNS = [
  'Nombre',
  'Tipo',
  'Ancho (m)',
  'Alto (m)',
  'Stock',
  'Precio',
  'Proveedor',
  'Acciones',
];

export const EMPTY_WAREHOUSE_FORM: RawMaterialFormData = {
  name: '',
  description: '',
  type: 'stretch-antifluido',
  width: 0,
  height: 0,
  quantity: 0,
  price: 0,
  supplier: '',
  imageUrl: '',
};
