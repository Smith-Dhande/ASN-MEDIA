import React from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { KpiCard } from '../components/ui/KpiCard';
import { AdminCard } from '../components/ui/AdminCard';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ActivityTimeline } from '../components/widgets/ActivityTimeline';
import {
  Users,
  Inbox,
  Kanban,
  Package,
  CreditCard,
  QrCode,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Calendar,
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
    activityLogs,
    dateRangeFilter,
    setDateRangeFilter,
  } = useAdminData();

  const navigate = useNavigate();

  const dateFilterOptions = ['This Month', 'Last 30 Days', 'This Quarter', 'All Time'];

  // Data subsets for Dashboard Summary Widgets
  const recentEnquiries = enquiries.slice(0, 4);
  const recentClients = clients.slice(0, 4);
  const expiringClients = clients.filter(
    (c) => c.expiryDate && (c.expiryDate.startsWith('2026-04') || c.expiryDate.startsWith('2026-05'))
  );
  const overduePayments = payments.filter((p) => p.status === 'Overdue');
  const urgentTasks = tasks.filter((t) => t.status !== 'Completed' && t.priority === 'High');

  // Columns definition for Recent Enquiries Table
  const enquiryColumns = [
    {
      header: 'LEAD NAME',
      key: 'name',
      render: (row) => (
        <div>
          <span className="font-bold text-[#0A0A0A] block">{row.name}</span>
          <span className="text-[11px] text-[#66615A] font-mono">{row.email}</span>
        </div>
      ),
    },
    { header: 'COMPANY', key: 'company' },
    {
      header: 'SERVICE',
      key: 'serviceRequested',
      render: (row) => (
        <span className="font-mono text-[11px] text-[#8E722A]">{row.serviceRequested}</span>
      ),
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
      header: 'CLIENT & COMPANY',
      key: 'name',
      render: (row) => (
        <div>
          <span className="font-bold text-[#0A0A0A] block">{row.name}</span>
          <span className="text-[11px] text-[#66615A]">{row.company}</span>
        </div>
      ),
    },
    {
      header: 'PACKAGE ASSIGNED',
      key: 'packageAssigned',
      render: (row) => (
        <span className="font-mono text-[11px] text-[#8E722A]">{row.packageAssigned}</span>
      ),
    },
    {
      header: 'RETAINER',
      key: 'monthlyRetainer',
      render: (row) => (
        <span className="font-mono font-bold">${row.monthlyRetainer.toLocaleString()}/mo</span>
      ),
    },
    {
      header: 'STATUS',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Executive Top Bar & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0A0A0A]/12">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-[#8E722A] uppercase tracking-wider">
              OPERATIONS DASHBOARD
            </span>
            <span className="text-[#0A0A0A]/30">•</span>
            <span className="text-xs font-mono text-[#66615A]">SYSTEM OVERVIEW</span>
          </div>
          <h1 className="font-display text-4xl text-[#0A0A0A] font-normal tracking-tight">
            Business Performance & Activity
          </h1>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xs border border-[#0A0A0A]/14 shadow-xs">
          <Calendar className="w-4 h-4 text-[#8E722A] ml-2 shrink-0" />
          <span className="text-xs font-mono text-[#66615A] mr-1 hidden md:inline">FILTER:</span>
          {dateFilterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setDateRangeFilter(opt)}
              className={`px-2.5 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider rounded-xs transition-colors ${
                dateRangeFilter === opt
                  ? 'bg-[#0A0A0A] text-[#F7F5EF]'
                  : 'text-[#66615A] hover:text-[#0A0A0A] hover:bg-[#F7F5EF]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Primary KPI Metrics Grid (11 Required Business Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Clients"
          value={dashboardMetrics.totalClients}
          trend={+12}
          trendLabel="active & retainers"
          icon={Users}
          to="/admin/clients"
          accentColor="gold"
        />

        <KpiCard
          label="Active Retainers"
          value={dashboardMetrics.activeClients}
          trend={+8}
          trendLabel="generating MRR"
          icon={Users}
          to="/admin/clients"
          accentColor="emerald"
        />

        <KpiCard
          label="New Enquiries"
          value={dashboardMetrics.newEnquiries}
          trend={+25}
          trendLabel="pending review"
          icon={Inbox}
          to="/admin/enquiries"
          accentColor="amber"
        />

        <KpiCard
          label="Active Projects"
          value={dashboardMetrics.activeProjects}
          trend={+5}
          trendLabel="in production"
          icon={Kanban}
          to="/admin/projects"
          accentColor="gold"
        />

        <KpiCard
          label="Collected Revenue"
          value={`$${dashboardMetrics.totalPaymentCollected.toLocaleString()}`}
          trend={+14.5}
          trendLabel="YTD payments"
          icon={CreditCard}
          to="/admin/payments"
          accentColor="emerald"
        />

        <KpiCard
          label="Outstanding Due"
          value={`$${dashboardMetrics.outstandingPayments.toLocaleString()}`}
          trend={-4.2}
          trendLabel="requires collection"
          icon={AlertTriangle}
          to="/admin/payments/outstanding"
          accentColor="crimson"
        />

        <KpiCard
          label="Expiring Packages"
          value={dashboardMetrics.expiringPackages}
          trendLabel="within 30 days"
          icon={Clock}
          to="/admin/clients/expiring"
          accentColor="amber"
        />

        <KpiCard
          label="Active Review Scanners"
          value={dashboardMetrics.activeReviewScanners}
          trendLabel="Google Place monitors"
          icon={QrCode}
          to="/admin/scanners"
          accentColor="charcoal"
        />
      </div>

      {/* 3. High-Priority Action Alerts Banner */}
      {(expiringClients.length > 0 || overduePayments.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {expiringClients.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-[6px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-800 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold font-mono text-amber-900 uppercase">
                    Expiring Retainers ({expiringClients.length})
                  </h4>
                  <p className="text-xs text-amber-800 font-body">
                    {expiringClients.map((c) => c.name).join(', ')} require renewal outreach.
                  </p>
                </div>
              </div>
              <Link
                to="/admin/clients/expiring"
                className="text-xs font-mono font-bold text-amber-900 underline uppercase hover:text-black shrink-0 ml-2"
              >
                Review →
              </Link>
            </div>
          )}

          {overduePayments.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-300 rounded-[6px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-800 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold font-mono text-red-900 uppercase">
                    Overdue Invoices ({overduePayments.length})
                  </h4>
                  <p className="text-xs text-red-800 font-body">
                    {overduePayments.map((p) => `${p.clientName} ($${p.amount})`).join(', ')} overdue.
                  </p>
                </div>
              </div>
              <Link
                to="/admin/payments/outstanding"
                className="text-xs font-mono font-bold text-red-900 underline uppercase hover:text-black shrink-0 ml-2"
              >
                Collect →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 4. Main Tables Dual Column Spread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Enquiries Inbox (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <AdminCard
            title="Recent Website Enquiries"
            subtitle="Latest incoming project submissions"
            noPadding
            headerAction={
              <Link
                to="/admin/enquiries"
                className="text-xs font-mono font-bold text-[#8E722A] hover:text-[#0A0A0A] flex items-center gap-1 uppercase"
              >
                <span>View Inbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <DataTable
              columns={enquiryColumns}
              data={recentEnquiries}
              onRowClick={() => navigate('/admin/enquiries')}
            />
          </AdminCard>
        </div>

        {/* Right Column: Active Client Portfolio (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <AdminCard
            title="Active Client Retainers"
            subtitle="Recently onboarded client accounts"
            noPadding
            headerAction={
              <Link
                to="/admin/clients"
                className="text-xs font-mono font-bold text-[#8E722A] hover:text-[#0A0A0A] flex items-center gap-1 uppercase"
              >
                <span>All Clients</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <DataTable
              columns={clientColumns}
              data={recentClients}
              onRowClick={(row) => navigate(`/admin/clients/${row.id}`)}
            />
          </AdminCard>
        </div>
      </div>

      {/* 5. Bottom Section: Production Tasks & Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Urgent Tasks Stream (7 Cols) */}
        <div className="lg:col-span-7">
          <AdminCard
            title="Urgent Production Tasks"
            subtitle="High-priority deliverables due this week"
            headerAction={
              <Link
                to="/admin/tasks"
                className="text-xs font-mono font-bold text-[#8E722A] hover:text-[#0A0A0A] flex items-center gap-1 uppercase"
              >
                <span>Task Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <div className="space-y-3">
              {urgentTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => navigate('/admin/tasks')}
                  className="p-3 bg-[#F7F5EF]/60 rounded-xs border border-[#0A0A0A]/10 flex items-center justify-between gap-3 hover:bg-[#F7F5EF] cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#0A0A0A] text-xs">{t.title}</span>
                      <StatusBadge status={t.priority} />
                    </div>
                    <span className="text-[11px] text-[#66615A] font-body">
                      Client: {t.clientName} • Assigned to: <strong className="text-[#0A0A0A]">{t.assignee}</strong>
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-[11px] text-[#8E722A] font-semibold block">
                      Due {t.dueDate}
                    </span>
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        {/* System Activity Stream (5 Cols) */}
        <div className="lg:col-span-5">
          <AdminCard
            title="Recent Activity Log"
            subtitle="Real-time system event audit stream"
            headerAction={
              <Link
                to="/admin/activity"
                className="text-xs font-mono font-bold text-[#8E722A] hover:text-[#0A0A0A] flex items-center gap-1 uppercase"
              >
                <span>Audit Logs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <ActivityTimeline logs={activityLogs} limit={4} />
          </AdminCard>
        </div>
      </div>
    </div>
  );
};
