import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { useAdminData } from '../context/AdminDataContext';
import { AdminCard } from '../components/ui/AdminCard';
import { TrendingUp, Download, Calendar, DollarSign, Users, Briefcase, FileText, CheckCircle2 } from 'lucide-react';

export const ReportsModule = () => {
  const { dashboardMetrics, clients, projects, payments } = useAdminData();
  const [selectedPeriod, setSelectedPeriod] = useState('This Quarter');
  const [exportNotice, setExportNotice] = useState('');

  // Sample reporting monthly revenue data
  const revenueReportData = [
    { month: 'May', collected: 52000, outstanding: 8500 },
    { month: 'Jun', collected: 64000, outstanding: 9200 },
    { month: 'Jul', collected: 71000, outstanding: 11000 },
    { month: 'Aug', collected: 78500, outstanding: 10400 },
    { month: 'Sep', collected: 84500, outstanding: 12800 },
  ];

  // Client growth trajectory data
  const clientGrowthData = [
    { month: 'May', total: 16, retainers: 12 },
    { month: 'Jun', total: 18, retainers: 14 },
    { month: 'Jul', total: 20, retainers: 15 },
    { month: 'Aug', total: 22, retainers: 17 },
    { month: 'Sep', total: 24, retainers: 18 },
  ];

  // Project Category distribution pie data
  const projectCategoryData = [
    { name: 'Social Media Retainers', value: 10, color: '#8E722A' },
    { name: 'Video Production', value: 6, color: '#111111' },
    { name: 'Brand Strategy', value: 5, color: '#C8A13A' },
    { name: 'Content Suite', value: 3, color: '#A39987' },
  ];

  const handleExport = (type) => {
    setExportNotice(`Exporting ${type} report for ${selectedPeriod}...`);
    setTimeout(() => {
      setExportNotice('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Executive Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-[6px] border border-[#0A0A0A]/12 shadow-xs">
        <div>
          <h2 className="font-serif font-semibold text-lg text-[#111111]">Executive Reports & Analytics</h2>
          <p className="text-xs text-[#66615A] font-body mt-0.5">
            Consolidated operational overview across revenue, client acquisition, and project velocity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#F7F5EF] px-3 py-1.5 rounded-xs border border-[#0A0A0A]/12 text-xs font-mono">
            <Calendar className="w-3.5 h-3.5 text-[#8E722A]" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-[#111111] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="This Month">This Month (Sept 2026)</option>
              <option value="This Quarter">This Quarter (Q3 2026)</option>
              <option value="Year to Date">Year to Date (2026)</option>
            </select>
          </div>

          <button
            onClick={() => handleExport('PDF')}
            className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#8E722A] text-[#F7F5EF] text-xs font-mono font-bold rounded-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <AdminCard className="p-4 border-l-4 border-l-[#8E722A]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#66615A]">Total Collected Revenue</div>
          <div className="text-2xl font-bold font-mono text-[#111111] mt-1">$84,500</div>
          <div className="text-[10px] font-mono text-emerald-700 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.5% vs previous period</span>
          </div>
        </AdminCard>

        <AdminCard className="p-4 border-l-4 border-l-[#111111]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#66615A]">Active Retainer MRR</div>
          <div className="text-2xl font-bold font-mono text-[#111111] mt-1">$24,800 /mo</div>
          <div className="text-[10px] font-mono text-[#66615A] mt-1">18 active clients</div>
        </AdminCard>

        <AdminCard className="p-4 border-l-4 border-l-[#C8A13A]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#66615A]">Project On-Time Rate</div>
          <div className="text-2xl font-bold font-mono text-[#111111] mt-1">94.2%</div>
          <div className="text-[10px] font-mono text-emerald-700 mt-1">14 active projects</div>
        </AdminCard>

        <AdminCard className="p-4 border-l-4 border-l-amber-600">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#66615A]">Outstanding Receivables</div>
          <div className="text-2xl font-bold font-mono text-amber-800 mt-1">$12,800</div>
          <div className="text-[10px] font-mono text-[#66615A] mt-1">Pending payment sync</div>
        </AdminCard>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Performance Bar Chart */}
        <AdminCard className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#0A0A0A]/08 pb-3">
            <div>
              <h3 className="font-serif font-semibold text-base text-[#111111]">Revenue Collection vs Outstanding</h3>
              <p className="text-[11px] font-mono text-[#66615A]">Monthly financial comparison ($ USD)</p>
            </div>
            <span className="text-[10px] font-mono bg-[#8E722A]/10 text-[#8E722A] px-2 py-0.5 rounded-xs font-bold uppercase">
              Financial Ledger
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueReportData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0A0A0A" strokeOpacity={0.06} vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#66615A', fontFamily: 'monospace' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#66615A', fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111111', borderColor: '#8E722A', borderRadius: '4px', color: '#F7F5EF', fontSize: '11px', fontFamily: 'monospace' }}
                  formatter={(val) => [`$${val.toLocaleString()}`, '']}
                />
                <Bar dataKey="collected" name="Collected Revenue" fill="#8E722A" radius={[4, 4, 0, 0]} barSize={28} />
                <Bar dataKey="outstanding" name="Outstanding Due" fill="#C8A13A" opacity={0.5} radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>

        {/* Portfolio Growth Area Chart */}
        <AdminCard className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#0A0A0A]/08 pb-3">
            <div>
              <h3 className="font-serif font-semibold text-base text-[#111111]">Client Portfolio Trajectory</h3>
              <p className="text-[11px] font-mono text-[#66615A]">Total Active Clients vs Monthly Retainers</p>
            </div>
            <span className="text-[10px] font-mono bg-[#111111] text-[#F7F5EF] px-2 py-0.5 rounded-xs font-bold uppercase">
              Growth Trajectory
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={clientGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0A0A0A" strokeOpacity={0.06} vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#66615A', fontFamily: 'monospace' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#66615A', fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111111', borderColor: '#8E722A', borderRadius: '4px', color: '#F7F5EF', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="total" name="Total Clients" stroke="#8E722A" strokeWidth={2} fill="#8E722A" fillOpacity={0.15} />
                <Area type="monotone" dataKey="retainers" name="Retainer Subscribers" stroke="#111111" strokeWidth={2} fill="#111111" fillOpacity={0.05} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>

      {/* Secondary Service Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart Distribution */}
        <AdminCard className="p-5 space-y-4 lg:col-span-1">
          <div className="border-b border-[#0A0A0A]/08 pb-3">
            <h3 className="font-serif font-semibold text-base text-[#111111]">Service Category Mix</h3>
            <p className="text-[11px] font-mono text-[#66615A]">Distribution of active packages</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {projectCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111111', borderColor: '#8E722A', borderRadius: '4px', color: '#F7F5EF', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#0A0A0A]/08">
            {projectCategoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#66615A]">{item.name}</span>
                </div>
                <span className="font-bold text-[#111111]">{item.value}</span>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Operational Highlights Table */}
        <AdminCard className="p-5 space-y-4 lg:col-span-2">
          <div className="border-b border-[#0A0A0A]/08 pb-3">
            <h3 className="font-serif font-semibold text-base text-[#111111]">Key Operational Performance Summary</h3>
            <p className="text-[11px] font-mono text-[#66615A]">Synthesized operational metrics across agency workflows</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body border-collapse">
              <thead>
                <tr className="border-b border-[#0A0A0A]/10 text-left text-[11px] font-mono text-[#8E722A] uppercase">
                  <th className="py-2.5 px-3">Metric Category</th>
                  <th className="py-2.5 px-3">Current Benchmark</th>
                  <th className="py-2.5 px-3">Target Objective</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0A0A0A]/08 text-[#111111]">
                <tr>
                  <td className="py-3 px-3 font-semibold">Average Package Value</td>
                  <td className="py-3 px-3 font-mono">$4,850 /mo</td>
                  <td className="py-3 px-3 font-mono">$4,500 /mo</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">Exceeding</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">Client Renewal Rate</td>
                  <td className="py-3 px-3 font-mono">92.0%</td>
                  <td className="py-3 px-3 font-mono">90.0%</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">On Track</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">Average Lead Response Time</td>
                  <td className="py-3 px-3 font-mono">2.4 hours</td>
                  <td className="py-3 px-3 font-mono font-bold">&lt; 4.0 hours</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">Optimal</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">Google Place Review Score</td>
                  <td className="py-3 px-3 font-mono">4.8 / 5.0</td>
                  <td className="py-3 px-3 font-mono">4.5 / 5.0</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">High Quality</td>
                </tr>
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>
    </div>
  );
};
