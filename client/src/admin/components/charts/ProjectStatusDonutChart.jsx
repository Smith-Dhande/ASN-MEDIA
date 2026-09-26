import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ASN_CHART_COLORS, AsnCustomTooltip } from './asnChartTheme';

const projectStatusData = [
  { name: 'In Progress', value: 8, color: ASN_CHART_COLORS.goldPrimary },
  { name: 'Review', value: 3, color: ASN_CHART_COLORS.charcoal },
  { name: 'Planning', value: 2, color: ASN_CHART_COLORS.goldSecondary },
  { name: 'Completed', value: 1, color: ASN_CHART_COLORS.emerald },
];

export const ProjectStatusDonutChart = () => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-2xs border border-[#0A0A0A]/06">
      <div className="flex items-center justify-between pb-3 border-b border-[#0A0A0A]/06">
        <div>
          <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block mb-0.5">
            RECHARTS DONUT BREAKDOWN
          </span>
          <h3 className="font-display text-lg font-normal text-[#111111]">
            Active Projects Status
          </h3>
        </div>
        <span className="font-mono text-xs text-[#111111] font-bold bg-[#FAF8F3] border border-[#0A0A0A]/10 px-2 py-0.5 rounded-full">
          14 Projects
        </span>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Compact Recharts Donut Pie */}
        <div className="w-32 h-32 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={56}
                paddingAngle={3}
                dataKey="value"
              >
                {projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<AsnCustomTooltip unit="" />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-display text-base font-bold text-[#111111] leading-none">14</span>
            <span className="text-[9px] font-mono text-[#685C43] uppercase mt-0.5">TOTAL</span>
          </div>
        </div>

        {/* Legend Stream */}
        <div className="flex-1 space-y-1.5 w-full text-xs font-mono">
          {projectStatusData.map((item) => (
            <div key={item.name} className="flex items-center justify-between py-1 border-b border-[#0A0A0A]/04">
              <span className="flex items-center gap-2 text-[#685C43]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </span>
              <span className="font-bold text-[#111111]">{item.value} ({Math.round((item.value / 14) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
