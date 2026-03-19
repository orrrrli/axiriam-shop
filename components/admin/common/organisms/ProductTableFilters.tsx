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
  { value: 'date-newest', label: 'Fecha más reciente' },
  { value: 'date-oldest', label: 'Fecha más antigua' },
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
    <div className="flex flex-col gap-[2rem] mb-[2.4rem]">
      {/* Tabs */}
      <div className="flex gap-[3.2rem] border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={
              activeTab === tab.key
                ? 'pb-[1.2rem] text-[1.4rem] font-semibold text-blue-600 border-b-2 border-blue-600 transition-colors duration-150'
                : 'pb-[1.2rem] text-[1.4rem] font-medium text-gray-400 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 transition-colors duration-150'
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters + Sort */}
      <div className="flex items-center justify-between gap-[1.6rem] flex-wrap">
        {/* Type filter chips */}
        <div className="flex items-center gap-[0.8rem] flex-wrap">
          <button
            type="button"
            onClick={() => onTypeChange(null)}
            className={
              selectedType === null
                ? 'px-[1.4rem] py-[0.6rem] rounded-full text-[1.2rem] font-medium bg-blue-600 text-white transition-colors duration-150'
                : 'px-[1.4rem] py-[0.6rem] rounded-full text-[1.2rem] font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors duration-150'
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
                  ? 'px-[1.4rem] py-[0.6rem] rounded-full text-[1.2rem] font-medium bg-blue-600 text-white transition-colors duration-150'
                  : 'px-[1.4rem] py-[0.6rem] rounded-full text-[1.2rem] font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors duration-150'
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
            className="appearance-none bg-[#f5f5f5] border-0 border-b border-gray-300 px-[1.2rem] py-[0.8rem] pr-[3.2rem] text-[1.3rem] text-gray-600 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-[0.8rem] top-1/2 -translate-y-1/2 w-[1.4rem] h-[1.4rem] text-gray-400" />
        </div>
      </div>
    </div>
  );
}
