import React, { useState, useEffect } from 'react';
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
import { FilterBar } from '../components/ui/FilterBar';
import { ReportsSkeleton } from '../components/ui/LoadingSkeleton';
import { TrendingUp, Download, Calendar, DollarSign, Users, Briefcase, FileText, CheckCircle2, FileSpreadsheet, Filter } from 'lucide-react';

export const ReportsModule = () => {
  const { clients, projects, payments, services, packages, staff } = useAdminData();
  const [selectedPeriod, setSelectedPeriod] = useState('This Quarter');
  const [clientFilter, setClientFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [staffFilter, setStaffFilter] = useState('All');

  const [exportNotice, setExportNotice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, [selectedPeriod, clientFilter, serviceFilter, staffFilter]);

  if (loading) {
    return <ReportsSkeleton />;
  }

  // Filtered dataset calculations
  const filteredProjects = projects.filter((p) => {
    const matchClient = clientFilter === 'All' || p.clientName === clientFilter;
    const matchService = serviceFilter === 'All' || p.serviceName === serviceFilter;
    const matchStaff = staffFilter === 'All' || p.leadStaff === staffFilter;
    return matchClient && matchService && matchStaff;
  });

  const filteredPayments = payments.filter((pay) => {
    const matchClient = clientFilter === 'All' || pay.clientName === clientFilter;
    return matchClient;
  });

  // Reporting monthly revenue data
  const revenueReportData = [
    { month: 'May', collected: 52000, outstanding: 8500 },
    { month: 'Jun', collected: 64000, outstanding: 9200 },
    { month: 'Jul', collected: 71000, outstanding: 11000 },
    { month: 'Aug', collected: 78500, outstanding: 10400 },
    { month: 'Sep', collected: payments.filter(p => p.status === 'Paid').reduce((acc, p) => acc + (Number(p.amountReceived) || Number(p.amount) || 0), 0) || 84500, outstanding: 12800 },
  ];

  // Client growth trajectory data
  const clientGrowthData = [
    { month: 'May', total: 16, retainers: 12 },
    { month: 'Jun', total: 18, retainers: 14 },
    { month: 'Jul', total: 20, retainers: 15 },
    { month: 'Aug', total: 22, retainers: 17 },
    { month: 'Sep', total: clients.length, retainers: clients.filter(c => c.status === 'Active').length },
  ];

  // Project Category distribution pie data
  const projectCategoryData = [
    { name: 'Social Media Retainers', value: projects.filter(p => p.serviceName?.includes('Social')).length || 10, color: '#8E722A' },
    { name: 'Video Production', value: projects.filter(p => p.serviceName?.includes('Video')).length || 6, color: '#111111' },
    { name: 'Brand Strategy', value: projects.filter(p => p.serviceName?.includes('Brand')).length || 5, color: '#C8A13A' },
    { name: 'Content Suite', value: 4, color: '#A39987' },
  ];

  const handleExport = (format) => {
    setExportNotice(`Exporting ${format} analytical report for period: ${selectedPeriod}...`);
    setTimeout(() => {
      setExportNotice('');
    }, 3000);
  };

  return (
    <div className="space-y-6 font-body">
      {/* Executive Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[6px] border border-[#0A0A0A]/12 shadow-xs">
        <div>
          <h2 className="font-serif font-semibold text-lg text-[#111111]">Executive Reports & Analytics</h2>
          <p className="text-xs text-[#685C43] font-body mt-0.5">
            Consolidated operational metrics across revenue, portfolio growth, and production pipeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#FAF8F3] px-3 py-1.5 rounded-xs border border-[#0A0A0A]/12 text-xs font-mono">
            <Calendar className="w-3.5 h-3.5 text-[#8E722A]" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-[#111111] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="This Month">This Month (Sept 2026)</option>
              <option value="This Quarter">This Quarter (Q3 2026)</option>
              <option value="Year to Date">Year to Date (2026)</option>
              <option value="All Time">All Time</option>
            </select>
          </div>

          <button
            onClick={() => handleExport('CSV')}
            className="px-3 py-1.5 bg-[#FAF8F3] border border-[#0A0A0A]/14 text-[#111111] hover:bg-[#8E722A] hover:text-white text-xs font-mono font-bold rounded-xs transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => handleExport('PDF')}
            className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#8E722A] text-[#F7F5EF] text-xs font-mono font-bold rounded-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF Report</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Advanced Filter Bar for Reports */}
      <div className="flex flex-wrap items-center gap-3 bg-[#FAF8F3] p-3 rounded-xs border border-[#0A0A0A]/08 font-mono text-xs">
        <div className="flex items-center gap-1 text-[#8E722A] font-bold uppercase tracking-wider text-[10px]">
          <Filter className="w-3.5 h-3.5" />
          <span>Report Filters:</span>
        </div>

        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="px-2.5 py-1 bg-white border border-[#0A0A0A]/14 rounded-xs text-[#111111]"
        >
          <option value="All">All Clients</option>
          {clients.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="px-2.5 py-1 bg-white border border-[#0A0A0A]/14 rounded-xs text-[#111111]"
        >
          <option value="All">All Services</option>
          {services.map((s) => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>

        <select
          value={staffFilter}
          onChange={(e) => setStaffFilter(e.target.value)}
          className="px-2.5 py-1 bg-white border border-[#0A0A0A]/14 rounded-xs text-[#111111]"
        >
          <option value="All">All Lead Staff</option>
          {staff.map((s) => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <AdminCard className="p-4 border-l-4 border-l-[#8E722A]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#685C43]">Total Revenue Collected</div>
          <div className="text-2xl font-bold font-mono text-[#111111] mt-1">
            ${payments.filter(p => p.status === 'Paid').reduce((acc, p) => acc + (Number(p.amountReceived) || Number(p.amount) || 0), 0).toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-emerald-700 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.5% vs target</span>
          </div>
        </AdminCard>

        <AdminCard className="p-4 border-l-4 border-l-[#111111]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#685C43]">Active Retainer Clients</div>
          <div className="text-2xl font-bold font-mono text-[#111111] mt-1">{clients.filter(c => c.status === 'Active').length} Active</div>
          <div className="text-[10px] font-mono text-[#685C43] mt-1">Out of {clients.length} total client accounts</div>
        </AdminCard>

        <AdminCard className="p-4 border-l-4 border-l-[#C8A13A]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#685C43]">Filtered Projects</div>
          <div className="text-2xl font-bold font-mono text-[#111111] mt-1">{filteredProjects.length} Projects</div>
          <div className="text-[10px] font-mono text-emerald-700 mt-1">In active production</div>
        </AdminCard>

        <AdminCard className="p-4 border-l-4 border-l-amber-600">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#685C43]">Outstanding Due</div>
          <div className="text-2xl font-bold font-mono text-amber-800 mt-1">
            ${payments.filter(p => p.status === 'Overdue' || p.status === 'Pending').reduce((acc, p) => acc + (Number(p.amount) - (Number(p.amountReceived) || 0)), 0).toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-[#685C43] mt-1">Pending payment ledger</div>
        </AdminCard>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Performance Bar Chart */}
        <AdminCard className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#0A0A0A]/08 pb-3">
            <div>
              <h3 className="font-serif font-semibold text-base text-[#111111]">Revenue Collection vs Outstanding</h3>
              <p className="text-[11px] font-mono text-[#685C43]">Monthly financial comparison ($ USD)</p>
            </div>
            <span className="text-[10px] font-mono bg-[#8E722A]/10 text-[#8E722A] px-2 py-0.5 rounded-xs font-bold uppercase">
              Financial Ledger
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueReportData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0A0A0A" strokeOpacity={0.06} vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#685C43', fontFamily: 'monospace' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#685C43', fontFamily: 'monospace' }} />
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
              <p className="text-[11px] font-mono text-[#685C43]">Total Active Clients vs Monthly Retainers</p>
            </div>
            <span className="text-[10px] font-mono bg-[#111111] text-[#F7F5EF] px-2 py-0.5 rounded-xs font-bold uppercase">
              Growth Trajectory
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={clientGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0A0A0A" strokeOpacity={0.06} vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#685C43', fontFamily: 'monospace' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#685C43', fontFamily: 'monospace' }} />
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
            <p className="text-[11px] font-mono text-[#685C43]">Distribution of active packages</p>
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
                  <span className="text-[#685C43]">{item.name}</span>
                </div>
                <span className="font-bold text-[#111111]">{item.value}</span>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Operational Highlights Table */}
        <AdminCard className="p-5 space-y-4 lg:col-span-2">
          <div className="border-b border-[#0A0A0A]/08 pb-3">
            <h3 className="font-serif font-semibold text-base text-[#111111]">Filtered Operational Deliverables</h3>
            <p className="text-[11px] font-mono text-[#685C43]">Active production projects matching filter parameters</p>
          </div>

          <div className="overflow-x-auto">
            {filteredProjects.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-[#685C43] italic border border-dashed border-[#0A0A0A]/10 rounded-xs">
                No active projects found matching selected report filter parameters.
              </div>
            ) : (
              <table className="w-full text-xs font-body border-collapse">
                <thead>
                  <tr className="border-b border-[#0A0A0A]/10 text-left text-[11px] font-mono text-[#8E722A] uppercase">
                    <th className="py-2.5 px-3">Project Title</th>
                    <th className="py-2.5 px-3">Client</th>
                    <th className="py-2.5 px-3">Lead Staff</th>
                    <th className="py-2.5 px-3">Progress</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0A0A0A]/08 text-[#111111]">
                  {filteredProjects.slice(0, 5).map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 px-3 font-semibold">{p.title}</td>
                      <td className="py-3 px-3 font-mono text-[#685C43]">{p.clientName}</td>
                      <td className="py-3 px-3 font-mono">{p.leadStaff}</td>
                      <td className="py-3 px-3 font-mono font-bold">{p.progressPct}%</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#8E722A]">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </AdminCard>
      </div>
    </div>
  );
};

