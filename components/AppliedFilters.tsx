'use client';

import React from 'react';
import { X } from 'lucide-react';
import type { FilterState } from '@/types/product';

interface AppliedFiltersProps {
  filter: FilterState;
  filteredCount: number;
  onRemoveFilter: (key: keyof FilterState, value: any) => void;
}

const sortLabels: Record<string, string> = {
  'name-asc': 'Name A - Z',
  'name-desc': 'Name Z - A',
  'price-asc': 'Price Low - High',
  'price-desc': 'Price High - Low',
};

const AppliedFilters: React.FC<AppliedFiltersProps> = ({
  filter,
  filteredCount,
  onRemoveFilter,
}) => {
  const isFiltered =
    !!filter.keyword ||
    !!filter.category ||
    !!filter.sortBy ||
    !!filter.minPrice ||
    !!filter.maxPrice;

  if (!isFiltered) return null;

  return (
    <>
      {/* Header with count */}
      <div className="w-full mb-[2.4rem]">
        <div className="text-center">
          <h5 className="text-[1.4rem] text-paragraph">
            {filteredCount > 0 &&
              `Found ${filteredCount} ${filteredCount > 1 ? 'products' : 'product'}`}
          </h5>
        </div>
      </div>

      {/* Filter pills */}
      <div className="py-[1.2rem] flex items-center justify-center flex-wrap gap-[1rem] max-xs:block">
        {filter.keyword && (
          <PillWrapper label="Keyword">
            <Pill
              text={filter.keyword}
              onRemove={() => onRemoveFilter('keyword', '')}
            />
          </PillWrapper>
        )}
        {filter.category && (
          <PillWrapper label="Category">
            <Pill
              text={filter.category}
              onRemove={() => onRemoveFilter('category', '')}
            />
          </PillWrapper>
        )}
        {(!!filter.minPrice || !!filter.maxPrice) && (
          <PillWrapper label="Price Range">
            <Pill
              text={`$${filter.minPrice} - $${filter.maxPrice}`}
              onRemove={() => {
                onRemoveFilter('minPrice', 0);
                onRemoveFilter('maxPrice', 0);
              }}
            />
          </PillWrapper>
        )}
        {filter.sortBy && (
          <PillWrapper label="Sort By">
            <Pill
              text={sortLabels[filter.sortBy] || filter.sortBy}
              onRemove={() => onRemoveFilter('sortBy', '')}
            />
          </PillWrapper>
        )}
      </div>
    </>
  );
};

// Sub-components

const PillWrapper: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="inline-block">
    <span className="block text-[1.1rem] text-gray-10 mb-[0.4rem]">{label}</span>
    {children}
  </div>
);

const Pill: React.FC<{ text: string; onRemove: () => void }> = ({
  text,
  onRemove,
}) => (
  <div className="inline-flex items-center border border-border bg-white pr-[1.6rem]">
    <h5 className="m-0 text-[1.3rem] text-heading px-[1.2rem] py-[0.6rem]">
      {text}
    </h5>
    <div
      className="cursor-pointer text-gray-10 hover:text-heading transition-colors ml-[0.4rem]"
      onClick={onRemove}
      role="button"
      tabIndex={0}
    >
      <X size={14} />
    </div>
  </div>
);

export default AppliedFilters;
