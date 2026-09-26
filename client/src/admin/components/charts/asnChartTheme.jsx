import React from 'react';

export const ASN_CHART_COLORS = {
  goldPrimary: '#8E722A',
  goldSecondary: '#C8A13A',
  goldLight: '#E5D9BC',
  charcoal: '#111111',
  charcoalMuted: '#221C11',
  ivory: '#F7F5EF',
  ivoryDark: '#FAF8F3',
  textMuted: '#685C43',
  emerald: '#059669',
  crimson: '#DC2626',
  amber: '#D97706',
};

// Custom Editorial Tooltip for Recharts
export const AsnCustomTooltip = ({ active, payload, label, unit = '$', formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111111] text-[#F7F5EF] p-3 rounded-xl shadow-lg border border-[#8E722A]/40 text-xs font-mono">
        <div className="font-bold text-[#C8A13A] mb-1 pb-1 border-b border-white/10 uppercase tracking-wider text-[10px]">
          {label} 2026
        </div>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[11px] text-[#A39B8B]">
                <span
                  className="w-2 h-2 rounded-xs"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold text-white text-xs">
                {formatter
                  ? formatter(entry.value)
                  : `${unit}${typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};
