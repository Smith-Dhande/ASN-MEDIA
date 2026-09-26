import React from 'react';

export const LoadingSkeleton = ({ rows = 4, columns = 4 }) => {
  return (
    <div className="w-full bg-white rounded-[6px] border border-[#0A0A0A]/12 p-4 animate-pulse">
      <div className="h-8 bg-[#F7F5EF] rounded-sm mb-4 w-full" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex gap-4">
            {Array.from({ length: columns }).map((_, cIdx) => (
              <div
                key={cIdx}
                className="h-6 bg-[#F7F5EF] rounded-xs flex-1"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
