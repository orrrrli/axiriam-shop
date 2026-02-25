'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import Filters from './Filters';
import type { FilterState } from '@/types/product';

interface FiltersToggleProps {
  filter: FilterState;
  categories: string[];
  priceRange: { min: number; max: number };
  isLoading: boolean;
  onApply: (filter: FilterState) => void;
  onReset: () => void;
}

const FiltersToggle: React.FC<FiltersToggleProps> = ({
  filter,
  categories,
  priceRange,
  isLoading,
  onApply,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Count active filters
  const activeCount = [
    filter.category,
    filter.sortBy,
    filter.minPrice,
    filter.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        className="button button-muted button-small button-icon gap-[0.8rem]"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <SlidersHorizontal size={14} />
        Filters
        {activeCount > 0 && (
          <span className="bg-primary text-white text-[1rem] w-[18px] h-[18px] rounded-full flex items-center justify-center ml-[0.4rem]">
            {activeCount}
          </span>
        )}
      </button>

      {/* Modal overlay + content */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-modal flex items-center justify-center max-xs:items-end">
          <div
            ref={modalRef}
            className="w-[400px] bg-white relative p-[1.6rem] max-xs:w-full max-xs:rounded-t-[1rem]"
          >
            <Filters
              filter={filter}
              categories={categories}
              priceRange={priceRange}
              isLoading={isLoading}
              onApply={onApply}
              onReset={onReset}
              closeModal={() => setIsOpen(false)}
            />
            <button
              className="absolute top-[1rem] right-[1rem] bg-transparent border-none text-gray-10 hover:text-heading cursor-pointer p-[0.5rem]"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersToggle;
