import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ASN_CHART_COLORS, AsnCustomTooltip } from './asnChartTheme';

const clientGrowthData = [
  { month: 'Jan', growth: 14, acquisition: 8 },
  { month: 'Feb', growth: 18, acquisition: 12 },
  { month: 'Mar', growth: 15, acquisition: 4 },
  { month: 'Apr', growth: 20, acquisition: 8 },
  { month: 'May', growth: 22, acquisition: 11 },
  { month: 'Jun', growth: 19, acquisition: 6 },
  { month: 'Jul', growth: 23, acquisition: 5 },
  { month: 'Aug', growth: 21, acquisition: 10 },
  { month: 'Sep', growth: 24, acquisition: 15 },
];

export const ClientGrowthAreaChart = () => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-2xs border border-[#0A0A0A]/06">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#0A0A0A]/06">
        <div>
          <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block mb-0.5">
            PORTFOLIO & ACQUISITION STREAM
          </span>
          <h3 className="font-display text-lg font-normal text-[#111111]">
            Client Portfolio Growth
          </h3>
        </div>

        {/* Legend Indicator */}
        <div className="flex items-center gap-4 text-xs font-mono text-[#685C43]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#8E722A]" />
            <span className="text-[11px]">Portfolio Growth (24 Total)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#111111]" />
            <span className="text-[11px]">New Client Acquisition</span>
          </span>
        </div>
      </div>

      {/* Smooth 2-Series Organic Flowing Recharts Area Canvas */}
      <div className="pt-4 h-52 sm:h-60 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={clientGrowthData} margin={{ top: 12, right: 15, left: -20, bottom: 5 }}>
            <defs>
              {/* Series 1: Primary ASN Gold Gradient */}
              <linearGradient id="asnGoldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8E722A" stopOpacity={0.28} />
                <stop offset="65%" stopColor="#C8A13A" stopOpacity={0.06} />
                <stop offset="100%" stopColor="#FAF8F3" stopOpacity={0.0} />
              </linearGradient>

              {/* Series 2: Secondary Charcoal Neutral Gradient */}
              <linearGradient id="asnCharcoalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#111111" stopOpacity={0.2} />
                <stop offset="65%" stopColor="#221C11" stopOpacity={0.04} />
                <stop offset="100%" stopColor="#F7F5EF" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Subtle Horizontal Reference Gridlines */}
            <CartesianGrid strokeDasharray="4 4" stroke="#0A0A0A" strokeOpacity={0.04} vertical={false} />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fontFamily: 'monospace', fill: ASN_CHART_COLORS.textMuted }}
              axisLine={{ stroke: '#0A0A0A', strokeOpacity: 0.08 }}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 10, fontFamily: 'monospace', fill: ASN_CHART_COLORS.textMuted }}
              axisLine={false}
              tickLine={false}
              domain={[0, 'dataMax + 4']}
            />

            <Tooltip content={<AsnCustomTooltip unit="" />} cursor={{ stroke: '#0A0A0A', strokeOpacity: 0.1, strokeDasharray: '3 3' }} />

            {/* Series 1: Portfolio Growth (Primary ASN Gold Curve) */}
            <Area
              type="monotone"
              name="Portfolio Growth"
              dataKey="growth"
              stroke="#8E722A"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#asnGoldGrad)"
              dot={false}
              activeDot={{
                r: 4.5,
                fill: '#111111',
                stroke: '#8E722A',
                strokeWidth: 2,
              }}
              animationDuration={900}
              animationEasing="ease-in-out"
            />

            {/* Series 2: New Client Acquisition (Restrained Charcoal Accent Curve) */}
            <Area
              type="monotone"
              name="New Client Acquisition"
              dataKey="acquisition"
              stroke="#111111"
              strokeWidth={1.8}
              fillOpacity={1}
              fill="url(#asnCharcoalGrad)"
              dot={false}
              activeDot={{
                r: 4,
                fill: '#8E722A',
                stroke: '#111111',
                strokeWidth: 2,
              }}
              animationDuration={1100}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Editorial Footer */}
      <div className="mt-3 pt-3 border-t border-[#0A0A0A]/06 flex items-center justify-between text-[11px] font-mono text-[#685C43]">
        <span>2-Series Portfolio & Acquisition Flow</span>
        <span className="font-bold text-[#111111]">Total Portfolio Peak: 24 Accounts</span>
      </div>
    </div>
  );
};
