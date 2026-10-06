import React from 'react';
import { EmptyState } from './EmptyState';
import { LoadingSkeleton } from './LoadingSkeleton';

export const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  onRowClick,
  emptyTitle = 'No records found',
  emptyMessage = 'No matching data entries exist for the current filter criteria.',
}) => {
  if (loading) {
    return <LoadingSkeleton rows={5} columns={columns.length || 4} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div className="w-full overflow-x-auto rounded-[6px] border border-[#0A0A0A]/12 bg-white shadow-xs">
      <table className="w-full text-left border-collapse text-xs font-body">
        <thead>
          <tr className="bg-[#F7F5EF] border-b border-[#0A0A0A]/14 text-[#8E722A] font-mono text-[11px] font-bold uppercase tracking-wider">
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={`py-3.5 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.headerClassName || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#0A0A0A]/08 text-[#0A0A0A]">
          {data.map((row, rowIdx) => (
            <tr
              key={row.id || rowIdx}
              onClick={() => onRowClick && onRowClick(row)}
              className={`transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-[#F7F5EF]/50' : 'hover:bg-[#F7F5EF]/30'
              }`}
            >
              {columns.map((col, colIdx) => (
                <td
                  key={col.key || colIdx}
                  className={`py-3.5 px-4 align-middle ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  } ${col.className || ''}`}
                >
                  {col.render ? col.render(row, rowIdx) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
