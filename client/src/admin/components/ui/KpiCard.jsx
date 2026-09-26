import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const KpiCard = ({
  label,
  value,
  trend,
  trendLabel = 'vs last month',
  icon: Icon,
  to,
  isFeatured = false,
  accentColor = 'gold', // 'gold' | 'emerald' | 'amber' | 'crimson' | 'charcoal'
  className = '',
}) => {
  const accentClasses = {
    gold: 'border-l-2 border-l-[#C8A13A]',
    emerald: 'border-l-2 border-l-emerald-600',
    amber: 'border-l-2 border-l-amber-600',
    crimson: 'border-l-2 border-l-red-600',
    charcoal: 'border-l-2 border-l-[#111111]',
  };

  const Content = isFeatured ? (
    <div
      className={`group relative bg-[#111111] text-[#F7F5EF] rounded-xl p-3.5 sm:p-4 shadow-2xs border border-[#111111] transition-all duration-200 hover:shadow-xs hover:-translate-y-0.5 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] font-bold tracking-wider text-[#C8A13A] uppercase truncate">
          {label}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {Icon && (
            <div className="p-1 rounded-md bg-[#221C11] text-[#C8A13A]">
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
          {to && (
            <ArrowUpRight className="w-3.5 h-3.5 text-[#C8A13A] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          )}
        </div>
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <span className="font-display text-2xl sm:text-3xl text-white font-normal tracking-tight leading-none">
          {value}
        </span>
      </div>

      {(trend !== undefined || trendLabel) && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-body">
          {trend !== undefined && (
            <span
              className={`font-semibold font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                trend >= 0
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                  : 'bg-red-950/80 text-red-400 border border-red-800/40'
              }`}
            >
              {trend >= 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
          <span className="text-[#A39B8B] text-[10px] font-mono truncate">{trendLabel}</span>
        </div>
      )}
    </div>
  ) : (
    <div
      className={`group relative bg-white rounded-xl border border-[#0A0A0A]/08 p-3.5 sm:p-4 shadow-2xs transition-all duration-200 hover:border-[#8E722A]/30 hover:shadow-xs hover:-translate-y-0.5 ${
        accentClasses[accentColor] || accentClasses.gold
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] font-bold tracking-wider text-[#685C43] uppercase truncate">
          {label}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {Icon && (
            <div className="p-1 rounded-md bg-[#F7F5EF] text-[#8E722A]">
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
          {to && (
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8E722A] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          )}
        </div>
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <span className="font-display text-2xl sm:text-3xl text-[#111111] font-normal tracking-tight leading-none">
          {value}
        </span>
      </div>

      {(trend !== undefined || trendLabel) && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-body">
          {trend !== undefined && (
            <span
              className={`font-semibold font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                trend >= 0
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {trend >= 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
          <span className="text-[#685C43] text-[10px] font-mono truncate">{trendLabel}</span>
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block no-underline">
        {Content}
      </Link>
    );
  }

  return Content;
};
