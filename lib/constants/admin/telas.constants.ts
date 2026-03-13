import { RawMaterialFormData } from '@/types/inventory';

/**
 * Label mappings for tela types
 * Maps internal type values to human-readable display labels
 */
export const TELA_TYPE_LABELS: Record<string, string> = {
  'stretch-antifluido': 'Stretch Antifluido',
  'brush': 'Brush',
};

/**
 * Column headers for telas table view
 */
export const TELA_COLUMNS = [
  'Nombre',
  'Tipo',
  'Ancho (m)',
  'Alto (m)',
  'Stock',
  'Precio',
  'Proveedor',
  'Acciones',
];

/**
 * Default form values for creating new telas
 */
export const EMPTY_TELA_FORM: RawMaterialFormData = {
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
