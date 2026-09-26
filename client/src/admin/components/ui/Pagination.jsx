import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-[#0A0A0A]/12 text-xs font-mono text-[#66615A]">
      <div>
        Showing <span className="font-bold text-[#0A0A0A]">{totalItems > 0 ? startItem : 0}</span> to{' '}
        <span className="font-bold text-[#0A0A0A]">{endItem}</span> of{' '}
        <span className="font-bold text-[#0A0A0A]">{totalItems}</span> entries
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-xs border border-[#0A0A0A]/14 text-[#0A0A0A] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F7F5EF]"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-[11px]">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-xs border border-[#0A0A0A]/14 text-[#0A0A0A] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F7F5EF]"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
