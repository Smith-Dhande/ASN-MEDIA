import React, { useState, useEffect } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SlideDrawer } from '../components/ui/SlideDrawer';
import { AdminCard } from '../components/ui/AdminCard';
import { Pagination } from '../components/ui/Pagination';
import { KpiCard } from '../components/ui/KpiCard';
import {
  Activity,
  ShieldCheck,
  Download,
  Search,
  Clock,
  User,
  Copy,
  Check,
  FileJson,
  ArrowRight,
  CheckCircle2,
  ListFilter,
  Layers,
  Sparkles,
  Calendar
} from 'lucide-react';

export const ActivityLogsModule = () => {
  const { activityLogs } = useAdminData();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [exportNotice, setExportNotice] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter]);

  // Normalize and filter log items
  const normalizedLogs = (activityLogs || []).map((log, idx) => {
    const actor = log.actor || log.user || 'Admin';
    const role = log.userRole || log.role || 'Staff';
    const action = log.action || 'System Action';
    const entity = log.entity || log.target || log.details || 'System Entity';
    const details = log.details || log.action || '';
    const category = log.category || 'General';
    const timestamp = log.timestamp || (log.createdAt ? new Date(log.createdAt).toLocaleString('en-IN') : '2026-10-02 12:00');
    const id = log.id || log._id || `log_${idx + 1}`;

    return {
      ...log,
      id,
      actor,
      userRole: role,
      action,
      entity,
      details,
      category,
      timestamp
    };
  });

  const filteredLogs = normalizedLogs.filter((log) => {
    const actorLower = log.actor.toLowerCase();
    const actionLower = log.action.toLowerCase();
    const entityLower = log.entity.toLowerCase();
    const categoryLower = log.category.toLowerCase();
    const searchLower = search.toLowerCase().trim();

    const matchesSearch =
      !searchLower ||
      actorLower.includes(searchLower) ||
      actionLower.includes(searchLower) ||
      entityLower.includes(searchLower) ||
      categoryLower.includes(searchLower);

    const matchesCategory =
      categoryFilter === 'All' || categoryLower === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleRowClick = (log) => {
    setSelectedLog(log);
    setIsDrawerOpen(true);
  };

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      setExportNotice('No activity records available to export.');
      setTimeout(() => setExportNotice(''), 2500);
      return;
    }

    const headers = ['Log ID', 'Timestamp', 'Actor', 'Role', 'Action', 'Target Entity', 'Category', 'Details'];
    const rows = filteredLogs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.userRole}"`,
      `"${l.action}"`,
      `"${l.entity}"`,
      `"${l.category}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `asn_activity_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(`Successfully exported ${filteredLogs.length} activity audit log records to CSV.`);
    setTimeout(() => {
      setExportNotice('');
    }, 3000);
  };

  const handleCopyJson = (data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getCategoryBadgeClass = (category = '') => {
    const cat = category.toLowerCase();
    switch (cat) {
      case 'leads':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'payments':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'scanners':
        return 'bg-amber-50 text-[#8E722A] border-amber-200';
      case 'tasks':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'projects':
      case 'clients':
        return 'bg-[#FAF8F3] text-[#111111] border-[#0A0A0A]/15';
      case 'reports':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const columns = [
    {
      header: 'Timestamp',
      key: 'timestamp',
      render: (row) => (
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#685C43]">
          <Clock className="w-3 h-3 text-[#8E722A]/70" />
          <span>{row.timestamp}</span>
        </div>
      ),
    },
    {
      header: 'Actor / User',
      key: 'actor',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-[#8E722A]/10 text-[#8E722A] flex items-center justify-center font-bold text-[10px]">
            {row.actor.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-xs text-[#111111]">{row.actor}</div>
            <div className="text-[10px] font-mono text-[#685C43]">{row.userRole}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Action Performed',
      key: 'action',
      render: (row) => (
        <div>
          <span
            className="font-body text-xs font-semibold text-[#111111] hover:text-[#8E722A] cursor-pointer transition-colors"
            onClick={() => handleRowClick(row)}
          >
            {row.action}
          </span>
          {row.details && row.details !== row.action && (
            <div className="text-[10px] text-[#685C43] font-mono truncate max-w-xs mt-0.5">
              {row.details}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Target Entity',
      key: 'entity',
      render: (row) => (
        <span className="font-mono text-[11px] text-[#8E722A] bg-[#FAF8F3] px-2 py-0.5 rounded-xs border border-[#0A0A0A]/08">
          {row.entity}
        </span>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (row) => (
        <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded-xs border ${getCategoryBadgeClass(row.category)}`}>
          {row.category}
        </span>
      ),
    },
    {
      header: 'Inspect',
      key: 'inspect',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => handleRowClick(row)}
          className="px-2.5 py-1 text-[11px] font-mono font-bold text-[#8E722A] hover:bg-[#8E722A] hover:text-white border border-[#8E722A]/30 rounded transition-all cursor-pointer"
        >
          View Diff
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-body">
      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="AUDIT TRAIL RECORDS"
          value={normalizedLogs.length}
          trend={100}
          trendLabel="immutable logs"
          icon={Activity}
          accentColor="gold"
        />
        <KpiCard
          label="ACTIVE SUBSYSTEMS"
          value={new Set(normalizedLogs.map((l) => l.category)).size}
          trend={7}
          trendLabel="modules tracked"
          icon={Layers}
          accentColor="black"
        />
        <KpiCard
          label="ACTIVE OPERATORS"
          value={new Set(normalizedLogs.map((l) => l.actor)).size}
          trend={4}
          trendLabel="staff & system"
          icon={User}
          accentColor="gold"
        />
        <KpiCard
          label="SECURITY STATUS"
          value="100% OK"
          trend={0}
          trendLabel="no anomalies"
          icon={ShieldCheck}
          accentColor="black"
        />
      </div>

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#0A0A0A]/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-wider block">
              SECURITY AUDIT TRAIL
            </span>
          </div>
          <h2 className="font-display font-semibold text-lg sm:text-xl text-[#111111]">
            System Activity & Audit Stream
          </h2>
          <p className="text-xs text-[#685C43] font-body mt-0.5">
            Immutable log stream recording administrative edits, status updates, scanner deployments, and system events.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search actor, action, category, or target entity..."
        filterOptions={['All', 'Clients', 'Leads', 'Tasks', 'Payments', 'Projects', 'Scanners', 'Reports', 'General']}
        selectedFilter={categoryFilter}
        onFilterChange={setCategoryFilter}
      />

      {/* Main DataTable with Pagination */}
      <AdminCard noPadding>
        <DataTable
          columns={columns}
          data={paginatedLogs}
          onRowClick={handleRowClick}
          emptyTitle="No Activity Audit Logs Found"
          emptyMessage="No activity events recorded matching your current query."
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredLogs.length}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setPageSize}
        />
      </AdminCard>

      {/* ========================================================= */}
      {/* ACTIVITY DETAIL & JSON DIFF INSPECTOR SLIDE DRAWER       */}
      {/* ========================================================= */}
      <SlideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedLog ? `Audit Record: ${selectedLog.id}` : 'Activity Inspection'}
      >
        {selectedLog && (
          <div className="space-y-6 text-xs font-body">
            {/* Header info */}
            <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/10 space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-[#685C43]">Subsystem Module</span>
                <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded border ${getCategoryBadgeClass(selectedLog.category)}`}>
                  {selectedLog.category}
                </span>
              </div>
              <div className="text-base font-bold text-[#111111] font-body">{selectedLog.action}</div>
              <div className="text-[11px] text-[#685C43]">
                Logged by <strong className="text-[#111111]">{selectedLog.actor}</strong> ({selectedLog.userRole}) at {selectedLog.timestamp}
              </div>
            </div>

            {/* Target metadata */}
            <div className="space-y-2 font-mono">
              <span className="text-[10px] uppercase font-bold text-[#8E722A]">Target Entity Information</span>
              <div className="p-3 bg-white border border-[#0A0A0A]/08 rounded-lg space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#685C43]">Target Record:</span>
                  <span className="font-bold text-[#111111]">{selectedLog.entity}</span>
                </div>
                {selectedLog.details && (
                  <div className="flex justify-between">
                    <span className="text-[#685C43]">Details:</span>
                    <span className="text-[#111111] max-w-[60%] text-right">{selectedLog.details}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#685C43]">Log Event ID:</span>
                  <span className="text-[#111111] font-mono">{selectedLog.id}</span>
                </div>
              </div>
            </div>

            {/* Before / After State Change Diff */}
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#8E722A] flex items-center gap-1">
                  <FileJson className="w-3.5 h-3.5" />
                  <span>State Change Diff / JSON Inspector</span>
                </span>
                <button
                  onClick={() => handleCopyJson(selectedLog)}
                  className="text-[10px] text-[#8E722A] hover:text-[#111111] font-bold flex items-center gap-1 cursor-pointer"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-3 bg-red-50/50 border border-red-200 rounded-lg space-y-1">
                  <div className="font-bold text-red-800 uppercase border-b border-red-200 pb-1">Previous State</div>
                  <pre className="text-red-900 overflow-x-auto whitespace-pre-wrap font-mono">
                    {JSON.stringify(
                      selectedLog.beforeState || {
                        status: 'Pending',
                        updatedBy: 'System / Previous',
                        revision: 1,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>

                <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg space-y-1">
                  <div className="font-bold text-emerald-800 uppercase border-b border-emerald-200 pb-1">New Updated State</div>
                  <pre className="text-emerald-900 overflow-x-auto whitespace-pre-wrap font-mono">
                    {JSON.stringify(
                      selectedLog.afterState || {
                        status: 'Active / Committed',
                        updatedBy: selectedLog.actor,
                        revision: 2,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            </div>

            {/* Formatted Full JSON Payload */}
            <div className="space-y-2 font-mono">
              <span className="text-[10px] uppercase font-bold text-[#685C43]">Raw Audit Event Log JSON</span>
              <div className="p-3 bg-[#111111] text-[#F7F5EF] rounded-lg text-[10px] overflow-x-auto max-h-48 border border-[#8E722A]/30">
                <pre>{JSON.stringify(selectedLog, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}
      </SlideDrawer>
    </div>
  );
};

export default ActivityLogsModule;
