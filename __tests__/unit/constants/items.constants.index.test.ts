import { describe, it, expect } from 'vitest';
import {
  CATEGORY_LABELS,
  TYPE_LABELS,
  ITEM_COLUMNS,
  EMPTY_ITEM_FORM,
} from '@/lib/constants/admin';

describe('Items Constants - Index Export', () => {
  it('should export CATEGORY_LABELS from index', () => {
    expect(CATEGORY_LABELS).toBeDefined();
    expect(CATEGORY_LABELS.bandana).toBe('Bandana');
  });

  it('should export TYPE_LABELS from index', () => {
    expect(TYPE_LABELS).toBeDefined();
    expect(TYPE_LABELS['stretch-antifluido']).toBe('Stretch Antifluido');
  });

  it('should export ITEM_COLUMNS from index', () => {
    expect(ITEM_COLUMNS).toBeDefined();
    expect(ITEM_COLUMNS).toHaveLength(8);
  });

  it('should export EMPTY_ITEM_FORM from index', () => {
    expect(EMPTY_ITEM_FORM).toBeDefined();
    expect(EMPTY_ITEM_FORM.category).toBe('bandana');
  });
});
