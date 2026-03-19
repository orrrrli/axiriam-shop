'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import AppliedFilters from '@/components/AppliedFilters';
import FiltersToggle from '@/components/FiltersToggle';
import type { Product, FilterState, SortBy } from '@/types/product';

const PRODUCTS_PER_PAGE = 12;

const defaultFilter: FilterState = {
  category: '',
  sortBy: '' as SortBy,
  minPrice: 0,
  maxPrice: 0,
  keyword: '',
};

export default function ShopPage() {
  const searchParams = useSearchParams();

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Filter state
  const [filter, setFilter] = useState<FilterState>(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const filterParam = searchParams.get('filter');

    return {
      ...defaultFilter,
      keyword: search,
      category: filterParam === 'featured' ? '' : category,
    };
  });

  const [showFeaturedOnly, setShowFeaturedOnly] = useState(
    searchParams.get('filter') === 'featured'
  );

  // Compute categories and price range from loaded products
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [products]);

  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  // Build query string from filter state
  const buildQuery = useCallback(
    (offset = 0) => {
      const params = new URLSearchParams();

      if (filter.keyword) params.set('search', filter.keyword);
      if (filter.category) params.set('category', filter.category);
      if (filter.sortBy) params.set('sortBy', filter.sortBy);
      if (filter.minPrice) params.set('minPrice', String(filter.minPrice));
      if (filter.maxPrice) params.set('maxPrice', String(filter.maxPrice));
      if (showFeaturedOnly) params.set('featured', 'true');

      params.set('limit', String(PRODUCTS_PER_PAGE));
      if (offset > 0) params.set('offset', String(offset));

      return params.toString();
    },
    [filter, showFeaturedOnly]
  );

  // Fetch products
  const fetchProducts = useCallback(
    async (append = false) => {
      try {
        if (append) {
          setIsFetchingMore(true);
        } else {
          setIsLoading(true);
        }

        const offset = append ? products.length : 0;
        const query = buildQuery(offset);
        const res = await fetch(`/api/products?${query}`);
        const data = await res.json();

        if (append) {
          setProducts((prev) => [...prev, ...(data.products || [])]);
        } else {
          setProducts(data.products || []);
        }

        setTotal(data.total ?? data.products?.length ?? 0);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    },
    [buildQuery, products.length]
  );

  // Fetch on filter change
  useEffect(() => {
    fetchProducts(false);
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, showFeaturedOnly]);

  // Apply filters from modal
  const onApplyFilter = (newFilter: FilterState) => {
    setShowFeaturedOnly(false);
    setFilter(newFilter);
  };

  // Reset filters
  const onResetFilter = () => {
    setShowFeaturedOnly(false);
    setFilter({ ...defaultFilter });
  };

  // Remove a single applied filter
  const onRemoveFilter = (key: keyof FilterState, value: any) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  // Show More handler
  const handleShowMore = () => {
    fetchProducts(true);
  };

  const hasMore = products.length < total;

  return (
    <main className="content !p-0 !block !min-h-0">
      <Navbar />
      <div className="w-full pt-[10rem] px-[5rem] max-xs:pt-[8.5rem] max-xs:px-[1.6rem]">
        <section className="flex-grow relative max-xs:mt-[5rem]">
          {/* Filters row */}
          <div className="flex items-center justify-between mb-[2rem] max-xs:flex-col max-xs:items-start max-xs:gap-[1rem]">
            <h2 className="text-heading text-[2rem] m-0">
              {showFeaturedOnly ? 'Featured Products' : 'Shop'}
            </h2>
            <div className="flex items-center gap-[1rem]">
              {showFeaturedOnly && (
                <button
                  className="button button-border button-small"
                  onClick={() => {
                    setShowFeaturedOnly(false);
                    setFilter({ ...defaultFilter });
                  }}
                  type="button"
                >
                  View All Products
                </button>
              )}
              <FiltersToggle
                filter={filter}
                categories={categories}
                priceRange={priceRange}
                isLoading={isLoading}
                onApply={onApplyFilter}
                onReset={onResetFilter}
              />
            </div>
          </div>

          {/* Applied filter pills */}
          <AppliedFilters
            filter={filter}
            filteredCount={total}
            onRemoveFilter={onRemoveFilter}
          />

          {/* Product grid */}
          {!isLoading && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[10rem]">
              <h3 className="text-heading text-[1.8rem] mb-[1rem]">No products found.</h3>
              <p className="text-gray-10 text-[1.4rem] mb-[2rem]">
                Try adjusting your filters or search query.
              </p>
              <button
                className="button button-small"
                onClick={onResetFilter}
                type="button"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <ProductGrid products={isLoading ? [] : products} />

              {/* Show More button */}
              {hasMore && !isLoading && (
                <div className="flex justify-center py-[3rem]">
                  <button
                    className="button button-small"
                    disabled={isFetchingMore}
                    onClick={handleShowMore}
                    type="button"
                  >
                    {isFetchingMore ? 'Fetching Items...' : 'Show More Items'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}
