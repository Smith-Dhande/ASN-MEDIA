import React from 'react';
import { Search, Filter, X } from 'lucide-react';

export const FilterBar = ({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filterOptions = [],
  selectedFilter = 'All',
  onFilterChange,
  actions,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-[6px] border border-[#0A0A0A]/12 shadow-xs ${className}`}
    >
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E722A]" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-8 py-2 bg-[#F7F5EF]/60 text-xs font-body text-[#0A0A0A] placeholder-[#66615A] rounded-sm border border-[#0A0A0A]/14 focus:outline-none focus:border-[#C8A13A] focus:ring-1 focus:ring-[#C8A13A]"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange && onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#66615A] hover:text-[#0A0A0A]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills / Dropdown */}
        {filterOptions.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-[#8E722A] shrink-0 mr-1" />
            {filterOptions.map((opt) => {
              const label = typeof opt === 'string' ? opt : opt.label;
              const value = typeof opt === 'string' ? opt : opt.value;
              const isSelected = selectedFilter === value;

              return (
                <button
                  key={value}
                  onClick={() => onFilterChange && onFilterChange(value)}
                  className={`px-2.5 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider rounded-xs border transition-all shrink-0 ${
                    isSelected
                      ? 'bg-[#0A0A0A] text-[#F7F5EF] border-[#0A0A0A]'
                      : 'bg-[#F7F5EF]/50 text-[#66615A] border-[#0A0A0A]/12 hover:border-[#0A0A0A]/30 hover:text-[#0A0A0A]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
};
