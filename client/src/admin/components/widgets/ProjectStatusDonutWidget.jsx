import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ASN_CHART_COLORS, AsnCustomTooltip } from '../charts/asnChartTheme';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const projectDistributionData = [
  { name: 'Active', value: 8, color: ASN_CHART_COLORS.goldPrimary },
  { name: 'Pending', value: 3, color: ASN_CHART_COLORS.charcoal },
  { name: 'Completed', value: 2, color: ASN_CHART_COLORS.emerald },
  { name: 'On Hold', value: 1, color: '#D5C7A5' },
];

export const ProjectStatusDonutWidget = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const totalProjects = projectDistributionData.reduce((acc, curr) => acc + curr.value, 0);

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
                data={projectDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={86}
                paddingAngle={4}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {projectDistributionData.map((entry, index) => {
                  const isHovered = activeIndex === index;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#FFFFFF"
                      strokeWidth={3}
                      className="transition-all duration-300 cursor-pointer"
                      style={{
                        transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                        transformOrigin: 'center center',
                        filter: isHovered ? 'drop-shadow(0px 4px 8px rgba(10,10,10,0.15))' : 'none',
                      }}
                    />
                  );
                })}
              </Pie>
              <Tooltip content={<AsnCustomTooltip unit="" />} />
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
              onMouseEnter={() => setActiveIndex(index)}
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
