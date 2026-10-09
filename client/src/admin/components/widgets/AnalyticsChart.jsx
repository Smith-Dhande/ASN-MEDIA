import React, { useState, useMemo } from 'react';
import { useAdminData } from '../../context/AdminDataContext';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const AnalyticsChart = () => {
  const { payments = [], clients = [], enquiries = [] } = useAdminData();
  const [activeTab, setActiveTab] = useState('revenue');
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  const currentMonthIdx = new Date().getMonth();

  const chartData = useMemo(() => {
    const endMonthIdx = Math.max(currentMonthIdx, 8);
    const monthsToShow = MONTH_NAMES.slice(0, endMonthIdx + 1);

    const revenueSeries = monthsToShow.map((mName, mIdx) => {
      const val = (payments || [])
        .filter((p) => {
          const isPaid = p.status === 'Paid' || (Number(p.amountReceived) > 0);
          if (!isPaid) return false;
          const dStr = p.date || p.createdAt;
          if (!dStr) return false;
          return new Date(dStr).getMonth() === mIdx;
        })
        .reduce((sum, p) => sum + (Number(p.amountReceived) || Number(p.amount) || 0), 0);
      return { label: mName, value: val };
    });

    const clientSeries = monthsToShow.map((mName, mIdx) => {
      const val = (clients || []).filter((c) => {
        const dStr = c.startDate || c.createdAt;
        if (!dStr) return false;
        return new Date(dStr).getMonth() === mIdx;
      }).length;
      return { label: mName, value: val };
    });

    const enquirySeries = monthsToShow.map((mName, mIdx) => {
      const val = (enquiries || []).filter((e) => {
        const dStr = e.dateSubmitted || e.createdAt;
        if (!dStr) return false;
        return new Date(dStr).getMonth() === mIdx;
      }).length;
      return { label: mName, value: val };
    });

    return {
      revenue: revenueSeries,
      clients: clientSeries,
      enquiries: enquirySeries,
    };
  }, [payments, clients, enquiries, currentMonthIdx]);

  const activeSeries = chartData[activeTab];
  const calculatedMax = Math.max(...activeSeries.map((d) => d.value), 0);
  const maxValue = calculatedMax > 0 ? calculatedMax * 1.15 : (activeTab === 'revenue' ? 10000 : 5);

  const totalYtdRevenue = useMemo(() => {
    return (payments || [])
      .filter((p) => p.status === 'Paid' || Number(p.amountReceived) > 0)
      .reduce((sum, p) => sum + (Number(p.amountReceived) || Number(p.amount) || 0), 0);
  }, [payments]);

  const tabLabels = {
    revenue: {
      title: 'Payment Collection & Revenue Stream',
      unit: '₹',
      format: (val) => (val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`),
    },
    clients: {
      title: 'Client Portfolio Growth',
      unit: '',
      format: (val) => `${val}`,
    },
    enquiries: {
      title: 'Website Enquiry Submissions',
      unit: '',
      format: (val) => `${val}`,
    },
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
            <span className="text-[10px] font-mono text-[#685C43]">{new Date().getFullYear()} YTD</span>
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
              const barHeight = maxValue > 0 ? (item.value / maxValue) * 140 : 0;
              const yPos = 160 - barHeight;
              const isHovered = hoveredBarIndex === index;
              const isCurrent = index === currentMonthIdx;

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
                    height={Math.max(barHeight, item.value > 0 ? 4 : 0)}
                    fill={isHovered ? '#111111' : isCurrent ? '#8E722A' : item.value > 0 ? '#C8A13A' : '#E5D9BC'}
                    opacity={item.value === 0 ? 0.3 : 1}
                    rx="4"
                    className="transition-colors duration-200"
                  />

                  {/* Top Accent Line on Bar */}
                  {item.value > 0 && (
                    <rect
                      x={xSlot}
                      y={yPos}
                      width={barWidth}
                      height={3}
                      fill="#111111"
                      rx="1.5"
                    />
                  )}

                  {/* X-Axis Label */}
                  <text
                    x={xSlot + barWidth / 2}
                    y="180"
                    fill={isHovered || isCurrent ? '#111111' : '#685C43'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight={isHovered || isCurrent ? 'bold' : 'normal'}
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
                {activeSeries[hoveredBarIndex].label} {new Date().getFullYear()}
              </div>
              <div className="text-white font-bold mt-0.5">
                {tabLabels[activeTab].unit}
                {activeSeries[hoveredBarIndex].value.toLocaleString('en-IN')}
              </div>
            </div>
          )}
        </div>

        {/* Minimal Legend */}
        <div className="mt-4 pt-3 border-t border-[#0A0A0A]/06 flex items-center justify-between text-[11px] font-mono text-[#685C43]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#8E722A]" />
              <span>Current Month ({MONTH_NAMES[currentMonthIdx]})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#C8A13A]" />
              <span>Previous Months</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[#111111] font-mono text-[11px]">
            <span>Total YTD Revenue: <strong>₹{totalYtdRevenue.toLocaleString('en-IN')}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
