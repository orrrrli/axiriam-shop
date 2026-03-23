'use client';

import { useState, useMemo } from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import type { Product, SortBy } from '@/types/product';
import CatalogProductCard from './CatalogProductCard';

interface CatalogViewProps {
  initialProducts: Product[];
}

const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: 'Más recientes', value: '' },
  { label: 'Nombre A-Z', value: 'name-asc' },
  { label: 'Nombre Z-A', value: 'name-desc' },
  { label: 'Precio: menor a mayor', value: 'price-asc' },
  { label: 'Precio: mayor a menor', value: 'price-desc' },
];

export default function CatalogView({ initialProducts }: CatalogViewProps): React.ReactElement {
  const [activeCategory, setActiveCategory] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('');
  const [sortOpen, setSortOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(initialProducts.map((p) => p.category).filter(Boolean)),
    ).sort();
    return cats;
  }, [initialProducts]);

  const displayedProducts = useMemo(() => {
    let result = [...initialProducts];

    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }

    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [initialProducts, activeCategory, sortBy]);

  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Más recientes';

  return (
    <div className="flex flex-col gap-[2.4rem]">
      {/* Header */}
      <div>
        <h1 className="text-[2.4rem] font-bold text-heading">Catálogo</h1>
        <p className="text-[1.4rem] text-admin-muted mt-[0.4rem]">
          {displayedProducts.length} producto{displayedProducts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters row */}
      <div className="flex items-center justify-between gap-[1.6rem] flex-wrap">
        {/* Category tabs */}
        <div className="flex items-center gap-[0.8rem] flex-wrap">
          <button
            type="button"
            onClick={() => setActiveCategory('')}
            className={`
              px-[1.6rem] py-[0.7rem] rounded-full text-[1.3rem] font-medium transition-all duration-150
              ${activeCategory === ''
                ? 'bg-admin-active-border text-white'
                : 'bg-white border border-border text-admin-nav-text hover:border-admin-active-border hover:text-heading'
              }
            `}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`
                px-[1.6rem] py-[0.7rem] rounded-full text-[1.3rem] font-medium capitalize transition-all duration-150
                ${activeCategory === cat
                  ? 'bg-admin-active-border text-white'
                  : 'bg-white border border-border text-admin-nav-text hover:border-admin-active-border hover:text-heading'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort By dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((prev) => !prev)}
            className="flex items-center gap-[0.8rem] px-[1.4rem] py-[0.8rem] bg-white border border-border rounded-[0.8rem] text-[1.3rem] font-medium text-heading hover:border-admin-active-border transition-colors duration-150"
          >
            <SlidersHorizontal className="w-[1.4rem] h-[1.4rem] text-admin-muted" />
            {activeSortLabel}
            <ChevronDown
              className={`w-[1.4rem] h-[1.4rem] text-admin-muted transition-transform duration-150 ${sortOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-[calc(100%+0.6rem)] z-10 bg-white border border-border rounded-[0.8rem] shadow-lg min-w-[18rem] py-[0.4rem]">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSortBy(opt.value);
                    setSortOpen(false);
                  }}
                  className={`
                    w-full text-left px-[1.4rem] py-[0.9rem] text-[1.3rem] transition-colors duration-100
                    ${sortBy === opt.value
                      ? 'text-admin-active-border font-medium bg-admin-active'
                      : 'text-heading hover:bg-body-alt'
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product grid */}
      {displayedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[8rem] text-admin-muted">
          <p className="text-[1.6rem] font-medium">No hay productos</p>
          <p className="text-[1.3rem] mt-[0.4rem]">
            {activeCategory ? 'Prueba con otra categoría.' : 'Aún no hay productos en el catálogo.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[1.6rem]">
          {displayedProducts.map((product) => (
            <CatalogProductCard key={product.id ?? product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
