import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

const chartData = {
  revenue: [
    { label: 'Jan', value: 48500 },
    { label: 'Feb', value: 62000 },
    { label: 'Mar', value: 89000 },
    { label: 'Apr', value: 74000 },
    { label: 'May', value: 105000 },
    { label: 'Jun', value: 92000 },
    { label: 'Jul', value: 118000 },
    { label: 'Aug', value: 135000 },
    { label: 'Sep', value: 84500 },
  ],
  clients: [
    { label: 'Jan', value: 12 },
    { label: 'Feb', value: 14 },
    { label: 'Mar', value: 16 },
    { label: 'Apr', value: 18 },
    { label: 'May', value: 20 },
    { label: 'Jun', value: 21 },
    { label: 'Jul', value: 22 },
    { label: 'Aug', value: 23 },
    { label: 'Sep', value: 24 },
  ],
  enquiries: [
    { label: 'Jan', value: 5 },
    { label: 'Feb', value: 7 },
    { label: 'Mar', value: 10 },
    { label: 'Apr', value: 6 },
    { label: 'May', value: 11 },
    { label: 'Jun', value: 8 },
    { label: 'Jul', value: 12 },
    { label: 'Aug', value: 14 },
    { label: 'Sep', value: 9 },
  ],
};

export const AnalyticsChart = () => {
  const [activeTab, setActiveTab] = useState('revenue');
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  const activeSeries = chartData[activeTab];
  const maxValue = Math.max(...activeSeries.map((d) => d.value)) * 1.15;

  const tabLabels = {
    revenue: { title: 'Payment Collection & Revenue Stream', unit: '$', format: (val) => `$${(val / 1000).toFixed(0)}k` },
    clients: { title: 'Client Portfolio Growth', unit: '', format: (val) => `${val}` },
    enquiries: { title: 'Website Enquiry Submissions', unit: '', format: (val) => `${val}` },
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-2xs border border-[#0A0A0A]/06">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#0A0A0A]/06">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest">
              PERFORMANCE ANALYTICS
            </span>
            <span className="text-[#0A0A0A]/20">•</span>
            <span className="text-[10px] font-mono text-[#685C43]">2026 YTD</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-normal text-[#111111] tracking-tight">
            {tabLabels[activeTab].title}
          </h2>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1 bg-[#F7F5EF] p-1 rounded-lg border border-[#0A0A0A]/06 self-start sm:self-auto">
          {[
            { id: 'revenue', label: 'Revenue' },
            { id: 'clients', label: 'Clients' },
            { id: 'enquiries', label: 'Enquiries' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider rounded-md transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#111111] text-[#F7F5EF] shadow-2xs'
                  : 'text-[#685C43] hover:text-[#111111] hover:bg-[#E5D9BC]/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Nivo-Style SVG Bar Canvas */}
      <div className="pt-5 relative">
        <div className="h-52 sm:h-60 w-full relative">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = 160 - pct * 140;
              const val = Math.round(maxValue * pct);
              return (
                <g key={i}>
                  <line
                    x1="45"
                    y1={y}
                    x2="780"
                    y2={y}
                    stroke="#0A0A0A"
                    strokeOpacity="0.06"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x="36"
                    y={y + 3}
                    fill="#685C43"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    {tabLabels[activeTab].format(val)}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {activeSeries.map((item, index) => {
              const xSlot = 45 + index * ((740 - 45) / activeSeries.length) + 16;
              const barWidth = 32;
              const barHeight = (item.value / maxValue) * 140;
              const yPos = 160 - barHeight;
              const isHovered = hoveredBarIndex === index;

              return (
                <g
                  key={item.label}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredBarIndex(index)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  {/* Primary Data Bar */}
                  <rect
                    x={xSlot}
                    y={yPos}
                    width={barWidth}
                    height={barHeight}
                    fill={isHovered ? '#111111' : index === activeSeries.length - 1 ? '#8E722A' : '#C8A13A'}
                    rx="4"
                    className="transition-colors duration-200"
                  />

                  {/* Top Accent Line on Bar */}
                  <rect
                    x={xSlot}
                    y={yPos}
                    width={barWidth}
                    height={3}
                    fill="#111111"
                    rx="1.5"
                  />

                  {/* X-Axis Label */}
                  <text
                    x={xSlot + barWidth / 2}
                    y="180"
                    fill={isHovered ? '#111111' : '#685C43'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight={isHovered ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    {item.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Hover Tooltip */}
          {hoveredBarIndex !== null && (
            <div
              className="absolute pointer-events-none bg-[#111111] text-[#F7F5EF] px-3 py-1.5 rounded-lg shadow-md z-30 text-xs font-mono transition-all duration-150 transform -translate-x-1/2 -translate-y-full border border-[#8E722A]/40"
              style={{
                left: `${((hoveredBarIndex + 0.5) / activeSeries.length) * 90 + 5}%`,
                top: '12%',
              }}
            >
              <div className="font-bold text-[#C8A13A]">
                {activeSeries[hoveredBarIndex].label} 2026
              </div>
              <div className="text-white font-bold mt-0.5">
                {tabLabels[activeTab].unit}
                {activeSeries[hoveredBarIndex].value.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Minimal Legend */}
        <div className="mt-4 pt-3 border-t border-[#0A0A0A]/06 flex items-center justify-between text-[11px] font-mono text-[#685C43]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#8E722A]" />
              <span>Current Month (Sep)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#C8A13A]" />
              <span>Previous Months</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[#111111] font-mono text-[11px]">
            <span>Total YTD Revenue: <strong>$84,500</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
