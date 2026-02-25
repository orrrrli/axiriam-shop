'use client';

import React, { useState } from 'react';
import type { FilterState, SortBy } from '@/types/product';

interface FiltersProps {
  filter: FilterState;
  categories: string[];
  priceRange: { min: number; max: number };
  isLoading: boolean;
  onApply: (filter: FilterState) => void;
  onReset: () => void;
  closeModal: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  filter,
  categories,
  priceRange,
  isLoading,
  onApply,
  onReset,
  closeModal,
}) => {
  const [field, setField] = useState<FilterState>({ ...filter });

  const onCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setField({ ...field, category: e.target.value });
  };

  const onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setField({ ...field, sortBy: e.target.value as SortBy });
  };

  const onMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    setField({ ...field, minPrice: val });
  };

  const onMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    setField({ ...field, maxPrice: val });
  };

  const handleApply = () => {
    if (field.minPrice > field.maxPrice && field.maxPrice > 0) return;

    const isChanged = Object.keys(field).some(
      (key) => field[key as keyof FilterState] !== filter[key as keyof FilterState]
    );

    if (isChanged) {
      onApply(field);
    }
    closeModal();
  };

  const handleReset = () => {
    onReset();
    closeModal();
  };

  return (
    <div className="flex flex-wrap relative z-filter">
      {/* Category */}
      <div className="w-full mb-[1.6rem] pb-[1.6rem] border-b border-border first:basis-1/2 [&:nth-child(2)]:basis-1/2 max-xs:!basis-full">
        <span className="text-[1.3rem] text-heading block mb-[1rem]">Category</span>
        <select
          className="input w-full"
          value={field.category}
          disabled={isLoading}
          onChange={onCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div className="w-full mb-[1.6rem] pb-[1.6rem] border-b border-border first:basis-1/2 [&:nth-child(2)]:basis-1/2 max-xs:!basis-full">
        <span className="text-[1.3rem] text-heading block mb-[1rem]">Sort By</span>
        <select
          className="input w-full"
          value={field.sortBy}
          disabled={isLoading}
          onChange={onSortChange}
        >
          <option value="">None</option>
          <option value="name-asc">Name Ascending A - Z</option>
          <option value="name-desc">Name Descending Z - A</option>
          <option value="price-desc">Price High - Low</option>
          <option value="price-asc">Price Low - High</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="w-full mb-[1.6rem] pb-[1.6rem] border-b border-border">
        <span className="text-[1.3rem] text-heading block mb-[1rem]">Price Range</span>
        {priceRange.max === 0 ? (
          <h5 className="text-[1.3rem] text-gray-10">Loading...</h5>
        ) : (
          <div className="flex items-center gap-[1rem]">
            <div className="flex-1">
              <label className="text-[1.1rem] text-gray-10 block mb-[0.4rem]">Min ($)</label>
              <input
                className="input w-full"
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={field.minPrice || ''}
                placeholder={`${priceRange.min}`}
                onChange={onMinPriceChange}
                disabled={isLoading}
              />
            </div>
            <span className="text-[1.4rem] text-gray-10 mt-[1.6rem]">—</span>
            <div className="flex-1">
              <label className="text-[1.1rem] text-gray-10 block mb-[0.4rem]">Max ($)</label>
              <input
                className="input w-full"
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={field.maxPrice || ''}
                placeholder={`${priceRange.max}`}
                onChange={onMaxPriceChange}
                disabled={isLoading}
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex w-full gap-[1rem]">
        <button
          className="button button-small flex-grow"
          disabled={isLoading}
          onClick={handleApply}
          type="button"
        >
          Apply filters
        </button>
        <button
          className="button button-border button-small flex-grow"
          disabled={isLoading}
          onClick={handleReset}
          type="button"
        >
          Reset filters
        </button>
      </div>
    </div>
  );
};

export default Filters;
