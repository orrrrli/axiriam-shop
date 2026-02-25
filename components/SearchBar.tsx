'use client';

import React, { useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isRecentOpen, setIsRecentOpen] = useState(false);
  const searchbarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trimStart();
    setSearchInput(val);
  };

  const performSearch = (keyword: string) => {
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) return;

    // Add to recent searches
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== trimmed);
      return [trimmed, ...filtered].slice(0, 5);
    });

    setIsRecentOpen(false);
    router.push(`/shop?search=${encodeURIComponent(trimmed)}`);
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
      performSearch(searchInput);
    }
  };

  const onFocusInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
    if (recentSearches.length > 0) {
      setIsRecentOpen(true);
    }
  };

  const onBlurInput = () => {
    // Delay to allow click on recent items
    setTimeout(() => setIsRecentOpen(false), 200);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    setIsRecentOpen(false);
  };

  const removeRecent = (keyword: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== keyword));
  };

  return (
    <div className="w-[300px] md:w-[400px] flex relative" ref={searchbarRef}>
      <Search
        size={16}
        className="absolute left-[1.6rem] top-0 bottom-0 m-auto text-gray-10 z-10 pointer-events-none"
      />
      <input
        className="input w-full !pl-[4.8rem] bg-white"
        onChange={onSearchChange}
        onKeyUp={onKeyUp}
        onFocus={onFocusInput}
        onBlur={onBlurInput}
        placeholder="Search product..."
        type="text"
        value={searchInput}
      />

      {/* Recent searches dropdown */}
      {isRecentOpen && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white shadow-[0_5px_10px_rgba(0,0,0,0.1)] z-search">
          <div className="flex justify-between items-center px-[1.6rem] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:mx-auto after:w-[94%] after:h-px after:bg-border">
            <h5 className="text-[1.3rem] text-heading">Recent Search</h5>
            <h5
              className="text-[1.3rem] text-gray-10 cursor-pointer"
              onClick={clearRecent}
            >
              Clear
            </h5>
          </div>
          {recentSearches.map((item, index) => (
            <div
              className="flex justify-between items-center px-[1.6rem] pr-0 hover:bg-border cursor-pointer"
              key={`search-${item}-${index}`}
            >
              <h5
                className="flex-grow py-[1.2rem] m-0 text-[1.3rem] text-heading"
                onClick={() => performSearch(item)}
              >
                {item}
              </h5>
              <span
                className="font-bold p-[1.2rem] text-gray-10 cursor-pointer"
                onClick={() => removeRecent(item)}
              >
                <X size={12} />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
