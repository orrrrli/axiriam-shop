import { describe, it, expect } from 'vitest';
import {
  CATEGORY_LABELS,
  TYPE_LABELS,
  ITEM_COLUMNS,
  EMPTY_ITEM_FORM,
} from '@/lib/constants/admin/items.constants';

describe('Items Constants', () => {
  describe('CATEGORY_LABELS', () => {
    it('should contain all category mappings', () => {
      expect(CATEGORY_LABELS).toEqual({
        bandana: 'Bandana',
        gorrito: 'Gorrito',
      });
    });

    it('should have string values for all categories', () => {
      Object.values(CATEGORY_LABELS).forEach((label) => {
        expect(typeof label).toBe('string');
        expect(label.length).toBeGreaterThan(0);
      });
    });
  });

  describe('TYPE_LABELS', () => {
    it('should contain all material type mappings', () => {
      expect(TYPE_LABELS).toEqual({
        'stretch-antifluido': 'Stretch Antifluido',
        brush: 'Brush',
      });
    });

    it('should have string values for all types', () => {
      Object.values(TYPE_LABELS).forEach((label) => {
        expect(typeof label).toBe('string');
        expect(label.length).toBeGreaterThan(0);
      });
    });
  });

  describe('ITEM_COLUMNS', () => {
    it('should contain all column headers', () => {
      expect(ITEM_COLUMNS).toEqual([
        'Foto',
        'Nombre',
        'Categoría',
        'Tipo',
        'Completo',
        'Sencillo',
        'Precio',
        'Acciones',
      ]);
    });

    it('should have 8 columns', () => {
      expect(ITEM_COLUMNS).toHaveLength(8);
    });

    it('should have non-empty string values', () => {
      ITEM_COLUMNS.forEach((column) => {
        expect(typeof column).toBe('string');
        expect(column.length).toBeGreaterThan(0);
      });
    });
  });

  describe('EMPTY_ITEM_FORM', () => {
    it('should have all required fields', () => {
      expect(EMPTY_ITEM_FORM).toHaveProperty('name');
      expect(EMPTY_ITEM_FORM).toHaveProperty('category');
      expect(EMPTY_ITEM_FORM).toHaveProperty('type');
      expect(EMPTY_ITEM_FORM).toHaveProperty('description');
      expect(EMPTY_ITEM_FORM).toHaveProperty('quantityCompleto');
      expect(EMPTY_ITEM_FORM).toHaveProperty('quantitySencillo');
      expect(EMPTY_ITEM_FORM).toHaveProperty('price');
      expect(EMPTY_ITEM_FORM).toHaveProperty('photoUrl');
      expect(EMPTY_ITEM_FORM).toHaveProperty('materials');
    });

    it('should have correct default values', () => {
      expect(EMPTY_ITEM_FORM.name).toBe('');
      expect(EMPTY_ITEM_FORM.category).toBe('bandana');
      expect(EMPTY_ITEM_FORM.type).toBe('stretch-antifluido');
      expect(EMPTY_ITEM_FORM.description).toBe('');
      expect(EMPTY_ITEM_FORM.quantityCompleto).toBe('');
      expect(EMPTY_ITEM_FORM.quantitySencillo).toBe('');
      expect(EMPTY_ITEM_FORM.price).toBe(0);
      expect(EMPTY_ITEM_FORM.photoUrl).toBeUndefined();
      expect(EMPTY_ITEM_FORM.materials).toEqual([]);
    });

    it('should have valid category and type values', () => {
      expect(EMPTY_ITEM_FORM.category).toBe('bandana');
      expect(EMPTY_ITEM_FORM.type).toBe('stretch-antifluido');
      expect(CATEGORY_LABELS[EMPTY_ITEM_FORM.category]).toBeDefined();
      expect(TYPE_LABELS[EMPTY_ITEM_FORM.type]).toBeDefined();
    });

    it('should have non-negative numeric values', () => {
      expect(EMPTY_ITEM_FORM.price).toBeGreaterThanOrEqual(0);
    });
  });
});
