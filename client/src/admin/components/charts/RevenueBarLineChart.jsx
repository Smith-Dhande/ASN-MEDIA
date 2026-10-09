import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ASN_CHART_COLORS, AsnCustomTooltip } from './asnChartTheme';
import { useAdminData } from '../../context/AdminDataContext';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const RevenueBarLineChart = () => {
  const { payments = [] } = useAdminData();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const currentDate = new Date();
  const currentMonthIdx = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonthName = MONTH_FULL[currentMonthIdx];

  // Dynamic monthly aggregation from live payments
  const revenueData = useMemo(() => {
    // Show months up to current month (at least 6-9 months minimum for visual balance)
    const endMonthIdx = Math.max(currentMonthIdx, 8);
    const monthsToShow = MONTH_NAMES.slice(0, endMonthIdx + 1);

    return monthsToShow.map((mName, mIdx) => {
      // Find payments in this month
      const monthlyPayments = (payments || []).filter((p) => {
        const isPaid = p.status === 'Paid' || (Number(p.amountReceived) > 0);
        if (!isPaid) return false;

        const dateStr = p.date || p.createdAt;
        if (!dateStr) return false;
        const pDate = new Date(dateStr);
        return pDate.getMonth() === mIdx;
      });

      const collected = monthlyPayments.reduce(
        (sum, p) => sum + (Number(p.amountReceived) || Number(p.amount) || 0),
        0
      );

      const isCurrent = mIdx === currentMonthIdx;

      return {
        month: mName,
        collected,
        isCurrent,
        status: isCurrent ? 'Current' : collected > 0 ? 'Completed' : 'None',
      };
    });
  }, [payments, currentMonthIdx]);

  const currentMonthCollected = useMemo(() => {
    return (payments || [])
      .filter((p) => {
        const isPaid = p.status === 'Paid' || (Number(p.amountReceived) > 0);
        if (!isPaid) return false;
        const dateStr = p.date || p.createdAt;
        if (!dateStr) return false;
        return new Date(dateStr).getMonth() === currentMonthIdx;
      })
      .reduce((sum, p) => sum + (Number(p.amountReceived) || Number(p.amount) || 0), 0);
  }, [payments, currentMonthIdx]);

  const totalYtd = useMemo(() => {
    return (payments || [])
      .filter((p) => p.status === 'Paid' || (Number(p.amountReceived) > 0))
      .reduce((sum, p) => sum + (Number(p.amountReceived) || Number(p.amount) || 0), 0);
  }, [payments]);

  const maxCollected = Math.max(...revenueData.map((d) => d.collected), 0);

  return (
    <div className="bg-white rounded-xl p-5 shadow-2xs border border-[#0A0A0A]/06">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#0A0A0A]/06">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest">
              FINANCIAL ANALYTICS
            </span>
            <span className="text-[#0A0A0A]/20">•</span>
            <span className="text-[10px] font-mono text-[#685C43]">{currentYear} YTD REVENUE</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-normal text-[#111111] tracking-tight">
            Total Revenue Collected
          </h2>
        </div>

        {/* Current Month Highlight Badge */}
        <div className="flex items-center gap-2 font-mono text-xs self-start sm:self-auto">
          <span className="text-[#685C43]">{currentMonthName} {currentYear}:</span>
          <span className="font-bold text-[#111111] bg-[#F7F5EF] border border-[#0A0A0A]/08 px-2.5 py-1 rounded-lg">
            ₹{currentMonthCollected.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Primary Custom Recharts Canvas */}
      <div className="pt-4 h-60 sm:h-68 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={revenueData}
            barCategoryGap="15%"
            margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
            onMouseMove={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                setHoveredIndex(state.activeTooltipIndex);
              } else {
                setHoveredIndex(null);
              }
            }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Soft Vertical Tonal SVG Gradients */}
            <defs>
              {/* Standard Month Bar Gradient */}
              <linearGradient id="asnGoldBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8E722A" stopOpacity={0.92} />
                <stop offset="55%" stopColor="#C8A13A" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#F7F5EF" stopOpacity={0.1} />
              </linearGradient>

              {/* Active/Current Month Bar Gradient */}
              <linearGradient id="asnActiveBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#111111" stopOpacity={0.95} />
                <stop offset="55%" stopColor="#221C11" stopOpacity={0.65} />
                <stop offset="100%" stopColor="#8E722A" stopOpacity={0.2} />
              </linearGradient>

              {/* Zero/Empty State Bar Gradient */}
              <linearGradient id="asnZeroBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D5C7A5" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#FAF8F3" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            {/* Subtle Horizontal Reference Lines Only */}
            <CartesianGrid strokeDasharray="4 4" stroke="#0A0A0A" strokeOpacity={0.04} vertical={false} />

            <XAxis
              dataKey="month"
              tick={({ x, y, payload, index }) => {
                const isCurrent = revenueData[index]?.isCurrent;
                const isHovered = hoveredIndex === index;
                return (
                  <text
                    x={x}
                    y={y + 12}
                    textAnchor="middle"
                    fill={isCurrent || isHovered ? '#111111' : '#685C43'}
                    fontSize={10}
                    fontFamily="monospace"
                    fontWeight={isCurrent || isHovered ? 'bold' : 'normal'}
                  >
                    {payload.value}
                  </text>
                );
              }}
              axisLine={{ stroke: '#0A0A0A', strokeOpacity: 0.08 }}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 10, fontFamily: 'monospace', fill: ASN_CHART_COLORS.textMuted }}
              axisLine={false}
              tickLine={false}
              domain={[0, maxCollected > 0 ? 'auto' : 10000]}
              tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />

            <Tooltip content={<AsnCustomTooltip unit="₹" />} cursor={{ fill: 'rgba(10,10,10,0.02)' }} />

            {/* Vertical Bar with Noticeably Rounded Top Corners */}
            <Bar
              name="Payment Collected"
              dataKey="collected"
              radius={[14, 14, 0, 0]}
              barSize={52}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {revenueData.map((entry, index) => {
                const isCurrent = entry.isCurrent;
                const isHovered = hoveredIndex === index;
                const isZero = entry.collected === 0;

                let fill = 'url(#asnGoldBarGradient)';
                if (isCurrent || isHovered) {
                  fill = 'url(#asnActiveBarGradient)';
                } else if (isZero) {
                  fill = 'url(#asnZeroBarGradient)';
                }

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={fill}
                    className="transition-all duration-300 cursor-pointer"
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Minimal Legend & Tonal Summary */}
      <div className="mt-3 pt-3 border-t border-[#0A0A0A]/06 flex items-center justify-between text-[11px] font-mono text-[#685C43]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#111111]" />
            <span>Current Month ({MONTH_NAMES[currentMonthIdx]})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#8E722A]" />
            <span>Previous Months</span>
          </span>
        </div>

        <div className="text-[#111111] font-bold">
          Total Payment Collected YTD: <strong>₹{totalYtd.toLocaleString('en-IN')}</strong>
        </div>
      </div>
    </div>
  );
};
