'use client';

import { useState, useMemo } from 'react';
import { Check, SlidersHorizontal, X } from 'lucide-react';
import ProductGrid from '@/components/organisms/product-grid';
import type { Product, SortBy } from '@/types/product';

interface CatalogViewProps {
  initialProducts: Product[];
}

const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: 'Más recientes',         value: ''            },
  { label: 'Nombre A–Z',            value: 'name-asc'    },
  { label: 'Nombre Z–A',            value: 'name-desc'   },
  { label: 'Precio: menor a mayor', value: 'price-asc'   },
  { label: 'Precio: mayor a menor', value: 'price-desc'  },
];

// ─── Sidebar content (shared between desktop sidebar & mobile drawer) ───────

interface FilterPanelProps {
  categories:     string[];
  activeCategory: string;
  sortBy:         SortBy;
  totalDisplayed: number;
  onCategory:     (cat: string) => void;
  onSort:         (sort: SortBy) => void;
  onClose?:       () => void;
}

function FilterPanel({
  categories, activeCategory, sortBy, totalDisplayed, onCategory, onSort, onClose,
}: FilterPanelProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-[3.2rem]">

      {/* Mobile close row */}
      {onClose && (
        <div className="flex items-center justify-between">
          <span className="text-[1.6rem] font-semibold text-[#101010] [font-family:var(--font-inter)]">
            Filtros
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-[3.2rem] h-[3.2rem] rounded-full bg-[#f5f5f5] flex items-center justify-center hover:bg-[#ebebeb] transition-colors"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>
      )}

      {/* ── Categoría ── */}
      <div>
        <p className="text-[1.1rem] font-semibold uppercase tracking-[0.1em] text-[rgba(0,0,0,0.35)] mb-[1.4rem] [font-family:var(--font-inter)]">
          Categoría
        </p>
        <div className="flex flex-col gap-[0.2rem]">
          {['', ...categories].map((cat) => {
            const active = activeCategory === cat;
            const label  = cat === '' ? 'Todos' : cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategory(cat)}
                className={`
                  flex items-center justify-between w-full
                  px-[1.2rem] py-[0.9rem] rounded-[0.8rem]
                  text-[1.35rem] capitalize text-left
                  transition-all duration-150
                  [font-family:var(--font-inter)]
                  ${active
                    ? 'bg-[#101010] text-white font-semibold'
                    : 'text-[rgba(0,0,0,0.6)] hover:bg-[#f5f5f5] hover:text-[#101010]'
                  }
                `}
              >
                {label}
                {active && (
                  <Check size={13} strokeWidth={2.5} className={active ? 'text-white' : 'text-[#101010]'} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#f0f0f0]" />

      {/* ── Ordenar ── */}
      <div>
        <p className="text-[1.1rem] font-semibold uppercase tracking-[0.1em] text-[rgba(0,0,0,0.35)] mb-[1.4rem] [font-family:var(--font-inter)]">
          Ordenar por
        </p>
        <div className="flex flex-col gap-[0.2rem]">
          {SORT_OPTIONS.map((opt) => {
            const selected = sortBy === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSort(opt.value)}
                className={`
                  flex items-center justify-between w-full
                  px-[1.2rem] py-[0.9rem] rounded-[0.8rem]
                  text-[1.35rem] text-left
                  transition-all duration-150
                  [font-family:var(--font-inter)]
                  ${selected
                    ? 'bg-[#101010] text-white font-semibold'
                    : 'text-[rgba(0,0,0,0.6)] hover:bg-[#f5f5f5] hover:text-[#101010]'
                  }
                `}
              >
                {opt.label}
                {selected && <Check size={13} strokeWidth={2.5} className="text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      {(activeCategory !== '' || sortBy !== '') && (
        <>
          <div className="h-px bg-[#f0f0f0]" />
          <div className="flex items-center justify-between">
            <span className="text-[1.25rem] text-[rgba(0,0,0,0.4)] [font-family:var(--font-inter)]">
              {totalDisplayed} resultado{totalDisplayed !== 1 ? 's' : ''}
            </span>
            <button
              type="button"
              onClick={() => { onCategory(''); onSort(''); }}
              className="text-[1.25rem] text-[#101010] underline underline-offset-2 [font-family:var(--font-inter)] hover:opacity-60 transition-opacity"
            >
              Limpiar
            </button>
          </div>
        </>
      )}

    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function CatalogView({ initialProducts }: CatalogViewProps): React.ReactElement {
  const [activeCategory, setActiveCategory] = useState('');
  const [sortBy, setSortBy]                 = useState<SortBy>('');
  const [mobileOpen, setMobileOpen]         = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(initialProducts.map((p) => p.category).filter(Boolean))).sort(),
    [initialProducts],
  );

  const displayed = useMemo(() => {
    let result = activeCategory
      ? initialProducts.filter((p) => p.category === activeCategory)
      : [...initialProducts];
    switch (sortBy) {
      case 'name-asc':   result.sort((a, b) => a.name.localeCompare(b.name));  break;
      case 'name-desc':  result.sort((a, b) => b.name.localeCompare(a.name));  break;
      case 'price-asc':  result.sort((a, b) => a.price - b.price);             break;
      case 'price-desc': result.sort((a, b) => b.price - a.price);             break;
    }
    return result;
  }, [initialProducts, activeCategory, sortBy]);

  const activeFiltersCount = (activeCategory !== '' ? 1 : 0) + (sortBy !== '' ? 1 : 0);

  return (
    <div className="w-full min-h-screen pt-[10rem] pb-[8rem] max-xs:pt-[8.5rem] [font-family:var(--font-source-sans)]">

      {/* ── Page header ── */}
      <div className="px-[5rem] max-xs:px-[2rem] mb-[4rem]">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[3.2rem] font-bold text-[#101010] m-0 tracking-tight [font-family:var(--font-inter)]">
              Catálogo
            </h1>
            <p className="text-[1.4rem] text-[rgba(0,0,0,0.4)] mt-[0.4rem] m-0 [font-family:var(--font-inter)]">
              {displayed.length} producto{displayed.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Mobile filter button */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center gap-[0.8rem] px-[1.4rem] py-[0.9rem] rounded-full border border-[#e0e0e0] text-[1.3rem] font-medium text-[#101010] [font-family:var(--font-inter)]"
          >
            <SlidersHorizontal size={14} />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="w-[1.8rem] h-[1.8rem] rounded-full bg-[#101010] text-white text-[1rem] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Layout: sidebar + grid ── */}
      <div className="flex gap-0 px-[5rem] max-xs:px-[2rem]">

        {/* ── Desktop sidebar ── */}
        <aside className="hidden lg:block w-[22rem] shrink-0 mr-[5rem]">
          <div className="sticky top-[9rem]">
            <FilterPanel
              categories={categories}
              activeCategory={activeCategory}
              sortBy={sortBy}
              totalDisplayed={displayed.length}
              onCategory={setActiveCategory}
              onSort={setSortBy}
            />
          </div>
        </aside>

        {/* ── Product area ── */}
        <div className="flex-1 min-w-0">
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[12rem] gap-[1.2rem]">
              <p className="text-[1.8rem] font-semibold text-[#101010] [font-family:var(--font-inter)]">
                Sin resultados
              </p>
              <p className="text-[1.4rem] text-[rgba(0,0,0,0.4)] [font-family:var(--font-inter)]">
                Prueba con otra categoría.
              </p>
              <button
                type="button"
                className="mt-[0.8rem] px-[2rem] py-[1rem] rounded-full bg-[#101010] text-white text-[1.3rem] font-medium [font-family:var(--font-inter)]"
                onClick={() => { setActiveCategory(''); setSortBy(''); }}
              >
                Ver todos
              </button>
            </div>
          ) : (
            <ProductGrid products={displayed} />
          )}
        </div>

      </div>

      {/* ── Mobile filter drawer ── */}
      <>
        <div
          className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 lg:hidden
            ${mobileOpen ? 'opacity-40 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`
            fixed bottom-0 left-0 right-0 z-50 lg:hidden
            bg-white rounded-t-[2rem] px-[2.4rem] pt-[2.4rem] pb-[4rem]
            shadow-[0_-20px_60px_rgba(0,0,0,0.12)]
            transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
            max-h-[85vh] overflow-y-auto
            ${mobileOpen ? 'translate-y-0' : 'translate-y-full'}
          `}
        >
          <FilterPanel
            categories={categories}
            activeCategory={activeCategory}
            sortBy={sortBy}
            totalDisplayed={displayed.length}
            onCategory={(cat) => { setActiveCategory(cat); setMobileOpen(false); }}
            onSort={(s) => { setSortBy(s); }}
            onClose={() => setMobileOpen(false)}
          />
        </div>
      </>

    </div>
  );
}
