import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ASN_CHART_COLORS, AsnCustomTooltip } from './asnChartTheme';
import { useAdminData } from '../../context/AdminDataContext';

export const ProjectStatusDonutChart = () => {
  const { projects = [] } = useAdminData();

  const projectStatusData = useMemo(() => {
    const inProgress = (projects || []).filter((p) => p.status === 'In Progress' || p.status === 'Active').length;
    const review = (projects || []).filter((p) => p.status === 'Review' || p.status === 'On Hold').length;
    const planning = (projects || []).filter((p) => p.status === 'Planning' || p.status === 'Pending').length;
    const completed = (projects || []).filter((p) => p.status === 'Completed').length;

    return [
      { name: 'In Progress', value: inProgress, color: ASN_CHART_COLORS.goldPrimary },
      { name: 'Review', value: review, color: ASN_CHART_COLORS.charcoal },
      { name: 'Planning', value: planning, color: ASN_CHART_COLORS.goldSecondary },
      { name: 'Completed', value: completed, color: ASN_CHART_COLORS.emerald },
    ];
  }, [projects]);

  const total = (projects || []).length;
  const chartData = total === 0 ? [{ name: 'None', value: 1, color: '#E5D9BC' }] : projectStatusData.filter((d) => d.value > 0);

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
          {total} {total === 1 ? 'Project' : 'Projects'}
        </span>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Compact Recharts Donut Pie */}
        <div className="w-32 h-32 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={56}
                paddingAngle={total > 0 ? 3 : 0}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={total > 0 ? 2 : 1} />
                ))}
              </Pie>
              {total > 0 && <Tooltip content={<AsnCustomTooltip unit="" />} />}
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-display text-base font-bold text-[#111111] leading-none">{total}</span>
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
              <span className="font-bold text-[#111111]">
                {item.value} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
