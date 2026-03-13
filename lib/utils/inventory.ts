import { MaterialType } from '@/types/inventory';

// Prisma enums use underscores, frontend types use hyphens
export function toDbMaterialType(type: string): string {
  return type.replace(/-/g, '_');
}

export function fromDbMaterialType(type: string): MaterialType {
  return type.replace(/_/g, '-') as MaterialType;
}

export function toDbCategory(category: string): string {
  return category.replace(/-/g, '_');
}

export function fromDbCategory(category: string): string {
  return category.replace(/_/g, '-');
}

export function toDbLocalShipping(option: string): string {
  return option.replace(/-/g, '_');
}

export function fromDbLocalShipping(option: string): string {
  return option.replace(/_/g, '-');
}

export function generateQuoteNumber(count: number): string {
  return `COT-${String(count + 1).padStart(4, '0')}`;
}

// ─── ITEM VALIDATION ─────────────────────────────────────

const VALID_CATEGORIES = ['bandana', 'gorrito'];
const VALID_TYPES = ['stretch-antifluido', 'brush'];
const VALID_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

export function isValidCategory(category: string): boolean {
  return VALID_CATEGORIES.includes(category);
}

export function isValidType(type: string): boolean {
  return VALID_TYPES.includes(type);
}

export function isValidImageType(filename: string): boolean {
  return VALID_IMAGE_EXTENSIONS.some(ext => filename.toLowerCase().endsWith(ext));
}

interface ItemValidationError {
  code: string;
  message: string;
  field: string;
}

export function validateItemBody(body: Record<string, unknown>): ItemValidationError | null {
  if (typeof body.category === 'string' && !isValidCategory(body.category)) {
    return { code: 'INVALID_CATEGORY', message: 'Category must be "bandana" or "gorrito"', field: 'category' };
  }
  if (typeof body.type === 'string' && !isValidType(body.type)) {
    return { code: 'INVALID_TYPE', message: 'Type must be "stretch-antifluido" or "brush"', field: 'type' };
  }
  if (typeof body.quantityCompleto === 'number' && (!Number.isInteger(body.quantityCompleto) || body.quantityCompleto < 0)) {
    return { code: 'INVALID_QUANTITY', message: 'quantityCompleto must be a non-negative integer', field: 'quantityCompleto' };
  }
  if (typeof body.quantitySencillo === 'number' && (!Number.isInteger(body.quantitySencillo) || body.quantitySencillo < 0)) {
    return { code: 'INVALID_QUANTITY', message: 'quantitySencillo must be a non-negative integer', field: 'quantitySencillo' };
  }
  return null;
}
