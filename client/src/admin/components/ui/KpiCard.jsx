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
  accentColor = 'gold', // 'gold' | 'emerald' | 'amber' | 'crimson' | 'charcoal'
  className = '',
}) => {
  const accentClasses = {
    gold: 'border-l-4 border-l-[#C8A13A]',
    emerald: 'border-l-4 border-l-emerald-600',
    amber: 'border-l-4 border-l-amber-600',
    crimson: 'border-l-4 border-l-red-600',
    charcoal: 'border-l-4 border-l-[#0A0A0A]',
  };

  const Content = (
    <div
      className={`group relative bg-white rounded-[6px] border border-[#0A0A0A]/12 p-5 shadow-xs transition-all duration-200 hover:border-[#0A0A0A]/30 hover:shadow-md ${
        accentClasses[accentColor] || accentClasses.gold
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[11px] font-semibold tracking-wider text-[#8E722A] uppercase">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          {Icon && (
            <div className="p-1.5 rounded-sm bg-[#F7F5EF] text-[#0A0A0A]">
              <Icon className="w-4 h-4" />
            </div>
          )}
          {to && (
            <ArrowUpRight className="w-4 h-4 text-[#8E722A] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          )}
        </div>
      </div>

      <div className="mt-2.5 flex items-baseline justify-between">
        <span className="font-display text-3xl sm:text-4xl text-[#0A0A0A] tracking-tight leading-none">
          {value}
        </span>
      </div>

      {(trend !== undefined || trendLabel) && (
        <div className="mt-3 flex items-center gap-2 text-xs font-body">
          {trend !== undefined && (
            <span
              className={`font-semibold font-mono text-[11px] px-1.5 py-0.5 rounded-xs ${
                trend >= 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {trend >= 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
          <span className="text-[#66615A] text-[11px]">{trendLabel}</span>
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
