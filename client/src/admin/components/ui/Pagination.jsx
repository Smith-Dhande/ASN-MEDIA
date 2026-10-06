import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100],
  className = '',
}) => {
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers array with ellipsis logic
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-[#0A0A0A]/12 text-xs font-mono text-[#66615A] ${className}`}
    >
      {/* Items count & Per-page selector */}
      <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
        <div>
          Showing <span className="font-bold text-[#111111]">{startItem}</span>–
          <span className="font-bold text-[#111111]">{endItem}</span> of{' '}
          <span className="font-bold text-[#111111]">{totalItems}</span> entries
        </div>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 border-l border-[#0A0A0A]/10 pl-4">
            <span>Rows:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 text-xs font-mono bg-[#F7F5EF] text-[#111111] font-semibold rounded-xs border border-[#0A0A0A]/14 focus:outline-none focus:border-[#C8A13A]"
            >
              {itemsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 flex-wrap justify-center">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-xs border border-[#0A0A0A]/14 text-[#111111] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F7F5EF] transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-[#66615A]">
                ...
              </span>
            );
          }

          const isSelected = currentPage === page;

          return (
            <button
              key={page}
              onClick={() => onPageChange && onPageChange(page)}
              className={`min-w-[28px] h-7 px-2 text-xs font-mono font-semibold rounded-xs border transition-all ${
                isSelected
                  ? 'bg-[#8E722A] text-white border-[#8E722A] shadow-2xs font-bold'
                  : 'bg-white text-[#111111] border-[#0A0A0A]/14 hover:bg-[#F7F5EF]'
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || totalPages === 0}
          className="p-1.5 rounded-xs border border-[#0A0A0A]/14 text-[#111111] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F7F5EF] transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
