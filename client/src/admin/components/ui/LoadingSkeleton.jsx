import React from 'react';

// Reusable Shimmer Bar Primitive
export const SkeletonBar = ({ className = 'h-4 w-full', rounded = 'rounded-xs' }) => (
  <div className={`asn-shimmer ${rounded} ${className}`} />
);

// KPI Grid Skeleton
export const KpiGridSkeleton = ({ count = 4 }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-${count} gap-4`}>
    {Array.from({ length: count }).map((_, idx) => (
      <div
        key={idx}
        className="p-4 bg-white border border-[#0A0A0A]/12 rounded-[6px] space-y-3 shadow-xs"
      >
        <div className="flex justify-between items-center">
          <SkeletonBar className="h-3 w-28" />
          <SkeletonBar className="h-8 w-8 rounded-full" />
        </div>
        <SkeletonBar className="h-7 w-20" />
        <SkeletonBar className="h-3 w-32" />
      </div>
    ))}
  </div>
);

// Data Table Skeleton matching ASN DataTable Layout
export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
  <div className="w-full bg-white rounded-[6px] border border-[#0A0A0A]/12 shadow-xs overflow-hidden">
    {/* Table Header Bar Skeleton */}
    <div className="bg-[#F7F5EF] p-3.5 border-b border-[#0A0A0A]/14 flex gap-4">
      {Array.from({ length: columns }).map((_, idx) => (
        <SkeletonBar key={idx} className="h-3 flex-1" />
      ))}
    </div>

    {/* Table Row Skeletons */}
    <div className="divide-y divide-[#0A0A0A]/08 p-2">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="py-3.5 px-3 flex gap-4 items-center">
          {Array.from({ length: columns }).map((_, cIdx) => (
            <SkeletonBar
              key={cIdx}
              className={`h-4 flex-1 ${cIdx === 0 ? 'w-1/3' : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Card Grid Skeleton (for Packages, Services, Projects, Workload)
export const CardGridSkeleton = ({ count = 4, cols = 'grid-cols-1 md:grid-cols-2' }) => (
  <div className={`grid ${cols} gap-4`}>
    {Array.from({ length: count }).map((_, idx) => (
      <div
        key={idx}
        className="p-5 bg-white border border-[#0A0A0A]/12 rounded-[6px] space-y-4 shadow-xs"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1.5 flex-1">
            <SkeletonBar className="h-3 w-24" />
            <SkeletonBar className="h-5 w-48" />
          </div>
          <SkeletonBar className="h-6 w-16" />
        </div>
        <SkeletonBar className="h-10 w-full" />
        <div className="pt-3 border-t border-[#0A0A0A]/08 flex justify-between">
          <SkeletonBar className="h-3 w-32" />
          <SkeletonBar className="h-3 w-20" />
        </div>
      </div>
    ))}
  </div>
);

// Reports & Analytics Skeleton
export const ReportsSkeleton = () => (
  <div className="space-y-6">
    <div className="p-4 bg-white border border-[#0A0A0A]/12 rounded-[6px] flex justify-between items-center">
      <div className="space-y-2">
        <SkeletonBar className="h-5 w-48" />
        <SkeletonBar className="h-3 w-72" />
      </div>
      <SkeletonBar className="h-8 w-32" />
    </div>

    <KpiGridSkeleton count={4} />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-5 bg-white border border-[#0A0A0A]/12 rounded-[6px] space-y-4">
        <SkeletonBar className="h-4 w-40" />
        <SkeletonBar className="h-64 w-full" />
      </div>
      <div className="p-5 bg-white border border-[#0A0A0A]/12 rounded-[6px] space-y-4">
        <SkeletonBar className="h-4 w-40" />
        <SkeletonBar className="h-64 w-full" />
      </div>
    </div>
  </div>
);

// Main Full Module Skeleton combining Filter + Table / Grid
export const ModuleSkeleton = ({ type = 'table', hasKpi = true }) => (
  <div className="space-y-6">
    {hasKpi && <KpiGridSkeleton count={4} />}

    {/* FilterBar Skeleton */}
    <div className="p-3 bg-white border border-[#0A0A0A]/12 rounded-[6px] flex justify-between items-center gap-3">
      <SkeletonBar className="h-8 w-64" />
      <SkeletonBar className="h-8 w-32" />
    </div>

    {/* Data Table or Card Grid */}
    {type === 'cards' ? <CardGridSkeleton count={4} /> : <TableSkeleton rows={5} columns={6} />}
  </div>
);

export const LoadingSkeleton = ({ rows = 4, columns = 4 }) => {
  return <TableSkeleton rows={rows} columns={columns} />;
};
