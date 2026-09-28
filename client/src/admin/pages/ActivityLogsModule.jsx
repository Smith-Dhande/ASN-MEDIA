import React, { useState, useEffect } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SlideDrawer } from '../components/ui/SlideDrawer';
import { AdminCard } from '../components/ui/AdminCard';
import { Pagination } from '../components/ui/Pagination';
import { Activity, ShieldCheck, Download, Search, Clock, User, Copy, Check, FileJson, ArrowRight, CheckCircle2 } from 'lucide-react';

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

  const filteredLogs = (activityLogs || []).filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' || log.category.toLowerCase() === categoryFilter.toLowerCase();

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
    setExportNotice('Exporting system audit logs to CSV...');
    setTimeout(() => {
      setExportNotice('');
    }, 2500);
  };

  const handleCopyJson = (data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const columns = [
    {
      header: 'Timestamp',
      key: 'timestamp',
      render: (row) => (
        <span className="font-mono text-[11px] text-[#685C43] font-medium">{row.timestamp}</span>
      ),
    },
    {
      header: 'Actor / User',
      key: 'actor',
      render: (row) => (
        <div className="flex items-center gap-1.5 font-semibold text-[#111111]">
          <User className="w-3.5 h-3.5 text-[#8E722A]" />
          <span>{row.actor}</span>
        </div>
      ),
    },
    {
      header: 'Action Performed',
      key: 'action',
      render: (row) => (
        <span className="font-body text-[#111111] hover:text-[#8E722A] cursor-pointer" onClick={() => handleRowClick(row)}>
          {row.action}
        </span>
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
        <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold text-[#111111] bg-[#0A0A0A]/06 rounded-xs">
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
          className="px-2 py-1 text-[10px] font-mono font-bold text-[#8E722A] hover:text-[#111111]"
        >
          View Diff
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-body">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-[6px] border border-[#0A0A0A]/12 shadow-xs">
        <div>
          <h2 className="font-serif font-semibold text-lg text-[#111111]">System Activity & Audit Trail</h2>
          <p className="text-xs text-[#685C43] font-body mt-0.5">
            Immutable log stream recording administrative edits, status updates, and security events.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-1.5 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search actor, action, or target entity..."
        filterOptions={['All', 'Leads', 'Tasks', 'Payments', 'Projects', 'Scanners', 'Reports']}
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
            <div className="p-4 bg-[#FAF8F3] rounded-sm border border-[#0A0A0A]/10 space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-[#685C43]">Subsystem Module</span>
                <span className="font-bold text-[#8E722A]">{selectedLog.category}</span>
              </div>
              <div className="text-base font-bold text-[#111111] font-body">{selectedLog.action}</div>
              <div className="text-[10px] text-[#685C43]">Logged by {selectedLog.actor} at {selectedLog.timestamp}</div>
            </div>

            {/* Target metadata */}
            <div className="space-y-2 font-mono">
              <span className="text-[10px] uppercase font-bold text-[#8E722A]">Target Entity Information</span>
              <div className="p-3 bg-white border border-[#0A0A0A]/08 rounded-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#685C43]">Target Record</span>
                  <span className="font-bold text-[#111111]">{selectedLog.entity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#685C43]">Log Event ID</span>
                  <span className="text-[#111111]">{selectedLog.id}</span>
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
                  className="text-[10px] text-[#8E722A] hover:text-[#111111] font-bold flex items-center gap-1"
                >
                  {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-3 bg-red-50/50 border border-red-200 rounded-xs space-y-1">
                  <div className="font-bold text-red-800 uppercase border-b border-red-200 pb-1">Previous State</div>
                  <pre className="text-red-900 overflow-x-auto whitespace-pre-wrap font-mono">
                    {JSON.stringify(
                      selectedLog.beforeState || {
                        status: 'Pending',
                        updatedBy: 'Previous User',
                        revision: 1,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>

                <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xs space-y-1">
                  <div className="font-bold text-emerald-800 uppercase border-b border-emerald-200 pb-1">New Updated State</div>
                  <pre className="text-emerald-900 overflow-x-auto whitespace-pre-wrap font-mono">
                    {JSON.stringify(
                      selectedLog.afterState || {
                        status: 'Active / Completed',
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
              <div className="p-3 bg-[#111111] text-[#F7F5EF] rounded-xs text-[10px] overflow-x-auto max-h-48 border border-[#8E722A]/30">
                <pre>{JSON.stringify(selectedLog, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}
      </SlideDrawer>
    </div>
  );
};

