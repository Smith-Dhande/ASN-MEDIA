import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ASN_CHART_COLORS, AsnCustomTooltip } from '../charts/asnChartTheme';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export const ProjectStatusDonutWidget = () => {
  const { projects = [] } = useAdminData();
  const [activeIndex, setActiveIndex] = useState(null);

  const projectDistributionData = useMemo(() => {
    const activeCount = (projects || []).filter((p) => p.status === 'In Progress' || p.status === 'Active').length;
    const pendingCount = (projects || []).filter((p) => p.status === 'Planning' || p.status === 'Pending').length;
    const completedCount = (projects || []).filter((p) => p.status === 'Completed').length;
    const onHoldCount = (projects || []).filter((p) => p.status === 'On Hold' || p.status === 'Review').length;

    return [
      { name: 'Active', value: activeCount, color: ASN_CHART_COLORS.goldPrimary },
      { name: 'Planning', value: pendingCount, color: ASN_CHART_COLORS.charcoal },
      { name: 'Completed', value: completedCount, color: ASN_CHART_COLORS.emerald },
      { name: 'On Hold', value: onHoldCount, color: '#D5C7A5' },
    ];
  }, [projects]);

  const totalProjects = (projects || []).length;

  // Render chart data (if 0 projects, render a subtle empty ring)
  const chartData = useMemo(() => {
    if (totalProjects === 0) {
      return [{ name: 'No Projects', value: 1, color: '#E5D9BC' }];
    }
    return projectDistributionData.filter((d) => d.value > 0);
  }, [totalProjects, projectDistributionData]);

  return (
    <div className="bg-white rounded-xl p-5 shadow-2xs border border-[#0A0A0A]/06 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="pb-3.5 border-b border-[#0A0A0A]/06 flex items-center justify-between">
        <div>
          <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block mb-0.5">
            PROJECT OVERVIEW
          </span>
          <h3 className="font-display text-lg font-normal text-[#111111]">
            Project Status Distribution
          </h3>
        </div>
        <Link
          to="/admin/projects"
          className="p-1 text-[#8E722A] hover:text-[#111111] transition-colors"
          title="Open Kanban Task Board"
        >
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Main Recharts Donut Canvas */}
      <div className="py-4 flex-1 flex flex-col items-center justify-center">
        <div className="relative w-48 h-48 sm:w-52 sm:h-52 my-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={86}
                paddingAngle={totalProjects > 0 ? 4 : 0}
                dataKey="value"
                onMouseEnter={(_, index) => totalProjects > 0 && setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => {
                  const isHovered = activeIndex === index;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#FFFFFF"
                      strokeWidth={totalProjects > 0 ? 3 : 1}
                      className="transition-all duration-300 cursor-pointer"
                      style={{
                        transform: isHovered && totalProjects > 0 ? 'scale(1.04)' : 'scale(1)',
                        transformOrigin: 'center center',
                        filter: isHovered && totalProjects > 0 ? 'drop-shadow(0px 4px 8px rgba(10,10,10,0.15))' : 'none',
                      }}
                    />
                  );
                })}
              </Pie>
              {totalProjects > 0 && <Tooltip content={<AsnCustomTooltip unit="" />} />}
            </PieChart>
          </ResponsiveContainer>

          {/* Center Title & Counter */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-display text-3xl font-normal text-[#111111] leading-none">
              {totalProjects}
            </span>
            <span className="font-mono text-[9px] text-[#685C43] uppercase tracking-wider mt-1 font-bold">
              TOTAL PROJECTS
            </span>
          </div>
        </div>
      </div>

      {/* Minimal Legend Stream */}
      <div className="pt-3 border-t border-[#0A0A0A]/06 grid grid-cols-2 gap-2 text-xs font-mono">
        {projectDistributionData.map((item, index) => {
          const isSelected = activeIndex === index;
          return (
            <div
              key={item.name}
              onMouseEnter={() => totalProjects > 0 && setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`p-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-between ${
                isSelected ? 'bg-[#FAF8F3] border border-[#0A0A0A]/10' : 'bg-transparent'
              }`}
            >
              <span className="flex items-center gap-1.5 text-[#685C43]">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px]">{item.name}</span>
              </span>
              <span className="font-bold text-[#111111] text-[11px]">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
