import { ChevronDown } from 'lucide-react';

type TabKey = 'general' | 'completos' | 'sencillos';
type SortKey = 'price-asc' | 'price-desc' | 'date-newest' | 'date-oldest';

interface ProductTableFiltersProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
  sortBy: SortKey;
  onSortChange: (sort: SortKey) => void;
  typeOptions: Record<string, string>;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'completos', label: 'Completos' },
  { key: 'sencillos', label: 'Sencillos' },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'date-newest', label: 'Más reciente' },
  { value: 'date-oldest', label: 'Más antiguo' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
];

export function ProductTableFilters({
  activeTab,
  onTabChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  typeOptions,
}: ProductTableFiltersProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-[1.6rem] mb-[2.4rem]">
      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-100">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={
              activeTab === tab.key
                ? 'px-[1.6rem] pb-[1.2rem] pt-[0.4rem] text-[1.35rem] font-semibold text-[#101010] border-b-2 border-[#101010] -mb-px transition-all duration-150'
                : 'px-[1.6rem] pb-[1.2rem] pt-[0.4rem] text-[1.35rem] font-medium text-gray-400 border-b-2 border-transparent -mb-px hover:text-gray-600 transition-all duration-150'
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters + Sort */}
      <div className="flex items-center justify-between gap-[1.6rem] flex-wrap">
        {/* Type filter chips */}
        <div className="flex items-center gap-[0.6rem] flex-wrap">
          <button
            type="button"
            onClick={() => onTypeChange(null)}
            className={
              selectedType === null
                ? 'px-[1.4rem] py-[0.5rem] rounded-full text-[1.2rem] font-semibold bg-[#101010] text-white border border-[#101010] transition-all duration-150'
                : 'px-[1.4rem] py-[0.5rem] rounded-full text-[1.2rem] font-medium bg-white text-gray-500 border border-gray-200 hover:border-gray-400 hover:text-gray-700 transition-all duration-150'
            }
          >
            Todos
          </button>
          {Object.entries(typeOptions).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onTypeChange(value)}
              className={
                selectedType === value
                  ? 'px-[1.4rem] py-[0.5rem] rounded-full text-[1.2rem] font-semibold bg-[#101010] text-white border border-[#101010] transition-all duration-150'
                  : 'px-[1.4rem] py-[0.5rem] rounded-full text-[1.2rem] font-medium bg-white text-gray-500 border border-gray-200 hover:border-gray-400 hover:text-gray-700 transition-all duration-150'
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="appearance-none bg-white border border-gray-200 rounded-[0.8rem] px-[1.4rem] py-[0.7rem] pr-[3.4rem] text-[1.3rem] font-medium text-gray-600 focus:outline-none focus:border-gray-400 cursor-pointer transition-colors duration-150 hover:border-gray-300"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-[1rem] top-1/2 -translate-y-1/2 w-[1.4rem] h-[1.4rem] text-gray-400" />
        </div>
      </div>
    </div>
  );
}
