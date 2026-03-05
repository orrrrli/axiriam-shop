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
