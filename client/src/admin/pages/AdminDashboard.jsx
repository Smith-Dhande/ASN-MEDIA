import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { KpiCard } from '../components/ui/KpiCard';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { RevenueBarLineChart } from '../components/charts/RevenueBarLineChart';
import { ClientGrowthAreaChart } from '../components/charts/ClientGrowthAreaChart';
import { ProjectStatusDonutWidget } from '../components/widgets/ProjectStatusDonutWidget';
import {
  Users,
  Inbox,
  Kanban,
  CreditCard,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const AdminDashboard = () => {
  const {
    dashboardMetrics,
    clients,
    enquiries,
    projects,
    tasks,
    payments,
    dateRangeFilter,
    setDateRangeFilter,
  } = useAdminData();

  const navigate = useNavigate();
  const [dataTab, setDataTab] = useState('enquiries');

  const datePillOptions = [
    { id: 'Day', label: 'Day' },
    { id: 'Week', label: 'Week' },
    { id: 'Month', label: 'Month' },
    { id: 'Year', label: 'Year' },
  ];

  // Data subsets for Summary Tables
  const recentEnquiries = enquiries.slice(0, 5);
  const recentClients = clients.slice(0, 5);
  const urgentTasks = tasks.filter((t) => t.status !== 'Completed').slice(0, 5);

  // Columns definition for Recent Enquiries Table
  const enquiryColumns = [
    {
      header: 'LEAD & CONTACT',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#111111] text-[#F7F5EF] font-mono text-[11px] font-bold flex items-center justify-center shrink-0 border border-[#8E722A]/40">
            {row.name ? row.name.charAt(0) : 'L'}
          </div>
          <div>
            <span className="font-bold text-[#111111] block font-body text-xs">{row.name}</span>
            <span className="text-[10px] text-[#685C43] font-mono">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'COMPANY',
      key: 'company',
      render: (row) => <span className="font-body text-xs text-[#221C11] font-semibold">{row.company}</span>,
    },
    {
      header: 'SERVICE REQUESTED',
      key: 'serviceRequested',
      render: (row) => (
        <span className="font-mono text-[10px] font-bold text-[#8E722A] bg-[#F7F5EF] px-2 py-0.5 rounded-full border border-[#D5C7A5]/50">
          {row.serviceRequested}
        </span>
      ),
    },
    {
      header: 'SUBMITTED DATE',
      key: 'dateSubmitted',
      render: (row) => <span className="font-mono text-[10px] text-[#685C43]">{row.dateSubmitted || '2026-09-26'}</span>,
    },
    {
      header: 'STATUS',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  // Columns definition for Recent Clients Table
  const clientColumns = [
    {
      header: 'CLIENT & PORTFOLIO',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#E5D9BC] text-[#111111] font-mono text-[11px] font-bold flex items-center justify-center shrink-0 border border-[#8E722A]">
            {row.name ? row.name.charAt(0) : 'C'}
          </div>
          <div>
            <span className="font-bold text-[#111111] block font-body text-xs">{row.name}</span>
            <span className="text-[10px] text-[#685C43]">{row.company}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'ASSIGNED PACKAGE',
      key: 'packageAssigned',
      render: (row) => (
        <span className="font-mono text-[10px] font-bold text-[#8E722A]">{row.packageAssigned}</span>
      ),
    },
    {
      header: 'MONTHLY RETAINER',
      key: 'monthlyRetainer',
      render: (row) => (
        <span className="font-mono font-bold text-[#111111] text-xs">₹{(row.monthlyRetainer || 0).toLocaleString()}/mo</span>
      ),
    },
    {
      header: 'EXPIRY DATE',
      key: 'expiryDate',
      render: (row) => <span className="font-mono text-[10px] text-[#685C43]">{row.expiryDate || 'N/A'}</span>,
    },
    {
      header: 'STATUS',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-4 animate-fadeIn pb-8 font-body">
      {/* 1. TOP HEADER & DATE FILTER ROW */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#0A0A0A]/08">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest">
              ASN MEDIA • EXECUTIVE COMMAND CENTER
            </span>
            <span className="text-[#0A0A0A]/20">•</span>
            <span className="text-[10px] font-mono text-[#685C43]">RECHARTS ANALYTICS ENGINE</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-[#111111] font-normal tracking-tight">
            Dashboard
          </h1>
        </div>

        {/* Date Filter Row Pill Group */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-[#0A0A0A]/06 shadow-2xs">
          {datePillOptions.map((pill) => (
            <button
              key={pill.id}
              onClick={() => setDateRangeFilter(pill.id)}
              className={`px-3 py-1 text-[11px] font-mono font-semibold tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                dateRangeFilter === pill.id || (dateRangeFilter === 'This Month' && pill.id === 'Month')
                  ? 'bg-[#111111] text-[#F7F5EF] shadow-xs'
                  : 'text-[#685C43] hover:text-[#111111] hover:bg-[#F7F5EF]'
              }`}
            >
              {pill.label}
            </button>
          ))}

          {/* Custom Date Range Pill */}
          <div className="flex items-center gap-1.5 pl-2 pr-2.5 py-1 bg-[#FAF8F3] text-[#221C11] rounded-lg border border-[#0A0A0A]/06 text-[11px] font-mono font-semibold">
            <Calendar className="w-3.5 h-3.5 text-[#8E722A]" />
            <span>1 Sep 2026 – 30 Sep 2026</span>
          </div>
        </div>
      </div>

      {/* 2. CORE EXECUTIVE KPI ROW (6 Essential Business Metrics Only) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Total Payment Collected (Featured Dark Card) */}
        <KpiCard
          isFeatured
          label="Total Payment Collected"
          value={`₹${(dashboardMetrics?.totalPaymentCollected || 0).toLocaleString()}`}
          trend={+14.5}
          trendLabel="vs last month"
          icon={CreditCard}
          to="/admin/payments"
        />

        {/* Metric 2: Outstanding Payments */}
        <KpiCard
          label="Outstanding Payments"
          value={`₹${(dashboardMetrics?.outstandingPayments || 0).toLocaleString()}`}
          trendLabel="due & pending"
          icon={AlertTriangle}
          to="/admin/payments/outstanding"
          accentColor="crimson"
        />

        {/* Metric 3: Total Clients */}
        <KpiCard
          label="Total Clients"
          value={dashboardMetrics?.totalClients || 0}
          trendLabel="active & retainers"
          icon={Users}
          to="/admin/clients"
          accentColor="gold"
        />

        {/* Metric 4: Active Clients */}
        <KpiCard
          label="Active Clients"
          value={dashboardMetrics?.activeClients || 0}
          trendLabel="active retainers"
          icon={Users}
          to="/admin/clients"
          accentColor="emerald"
        />

        {/* Metric 5: New Website Enquiries */}
        <KpiCard
          label="New Website Enquiries"
          value={dashboardMetrics?.newEnquiries || 0}
          trendLabel="pending review"
          icon={Inbox}
          to="/admin/enquiries"
          accentColor="amber"
        />

        {/* Metric 6: Active Projects */}
        <KpiCard
          label="Active Projects"
          value={dashboardMetrics?.activeProjects || 0}
          trendLabel="in production"
          icon={Kanban}
          to="/admin/projects"
          accentColor="gold"
        />
      </div>

      {/* 3. MAIN ANALYTICS CENTERPIECE & PROJECT STATUS DONUT WIDGET */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Visual Centerpiece: Recharts Revenue Bar Chart (8 Cols) */}
        <div className="lg:col-span-8">
          <RevenueBarLineChart />
        </div>

        {/* Project Status Donut Widget (4 Cols) */}
        <div className="lg:col-span-4 h-full">
          <ProjectStatusDonutWidget />
        </div>
      </div>

      {/* 4. CLIENT GROWTH AREA STREAM */}
      <div>
        <ClientGrowthAreaChart />
      </div>

      {/* 5. RECENT OPERATIONS ACTIVITY (Editorial Data Presentation) */}
      <div className="bg-white rounded-xl p-5 shadow-2xs border border-[#0A0A0A]/06">
        {/* Table Header & Section Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#0A0A0A]/06">
          <div>
            <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-wider block mb-0.5">
              DATA RECORDS & AUDIT
            </span>
            <h2 className="font-display text-lg sm:text-xl font-normal text-[#111111]">
              Recent Operations Activity
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* View Filter Pills */}
            <div className="flex items-center gap-1 bg-[#F7F5EF] p-1 rounded-lg border border-[#0A0A0A]/06">
              {[
                { id: 'enquiries', label: 'Enquiries Inbox' },
                { id: 'clients', label: 'Recent Clients' },
                { id: 'tasks', label: 'Urgent Tasks' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDataTab(tab.id)}
                  className={`px-2.5 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider rounded-md transition-all duration-200 cursor-pointer ${
                    dataTab === tab.id
                      ? 'bg-[#111111] text-[#F7F5EF] shadow-2xs'
                      : 'text-[#685C43] hover:text-[#111111] hover:bg-[#E5D9BC]/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate(dataTab === 'enquiries' ? '/admin/enquiries' : dataTab === 'clients' ? '/admin/clients' : '/admin/tasks')}
              className="p-1.5 rounded-lg bg-[#FAF8F3] hover:bg-[#111111] text-[#221C11] hover:text-[#F7F5EF] border border-[#0A0A0A]/08 transition-colors"
              title="Open full page"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Editorial Table Content depending on active tab */}
        <div className="pt-2">
          {dataTab === 'enquiries' && (
            <DataTable
              columns={enquiryColumns}
              data={recentEnquiries}
              onRowClick={() => navigate('/admin/enquiries')}
            />
          )}

          {dataTab === 'clients' && (
            <DataTable
              columns={clientColumns}
              data={recentClients}
              onRowClick={(row) => navigate(`/admin/clients/${row.id}`)}
            />
          )}

          {dataTab === 'tasks' && (
            <div className="divide-y divide-[#0A0A0A]/06">
              {urgentTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => navigate('/admin/tasks')}
                  className="py-2.5 px-1 flex items-center justify-between gap-3 cursor-pointer transition-colors hover:bg-[#FAF8F3] rounded-md"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-[#E5D9BC]/50 text-[#8E722A]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-[#111111] text-xs font-body">{t.title}</span>
                        <StatusBadge status={t.priority} />
                      </div>
                      <span className="text-[11px] text-[#685C43] font-body">
                        Client: <strong className="text-[#111111]">{t.clientName}</strong> • Assigned: {t.assignee}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-[10px] text-[#8E722A] font-bold block mb-0.5">
                      Due {t.dueDate}
                    </span>
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
