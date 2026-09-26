import React, { useState, useEffect } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AdminCard } from '../components/ui/AdminCard';
import { Pagination } from '../components/ui/Pagination';
import { Activity, ShieldCheck, Download, Search, Clock, User } from 'lucide-react';

export const ActivityLogsModule = () => {
  const { activityLogs: initialLogs } = useAdminData();
  const [logs, setLogs] = useState(initialLogs || []);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [exportNotice, setExportNotice] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter]);

  const filteredLogs = logs.filter((log) => {
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

  const handleExportCSV = () => {
    setExportNotice('Exporting system audit logs to CSV...');
    setTimeout(() => {
      setExportNotice('');
    }, 2000);
  };

  const columns = [
    {
      header: 'Timestamp',
      key: 'timestamp',
      render: (row) => (
        <span className="font-mono text-[11px] text-[#66615A] font-medium">{row.timestamp}</span>
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
      render: (row) => <span className="font-body text-[#111111]">{row.action}</span>,
    },
    {
      header: 'Target Entity',
      key: 'entity',
      render: (row) => (
        <span className="font-mono text-[11px] text-[#8E722A] bg-[#F7F5EF] px-2 py-0.5 rounded-xs border border-[#0A0A0A]/08">
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
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-[6px] border border-[#0A0A0A]/12 shadow-xs">
        <div>
          <h2 className="font-serif font-semibold text-lg text-[#111111]">System Activity & Audit Trail</h2>
          <p className="text-xs text-[#66615A] font-body mt-0.5">
            Immutable log stream recording administrative edits, status updates, and security events.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-1.5 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded-xs transition-colors flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-xs">
          {exportNotice}
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search actor, action, or target entity..."
        filterOptions={['All', 'Leads', 'Tasks', 'Payments', 'Projects']}
        selectedFilter={categoryFilter}
        onFilterChange={setCategoryFilter}
      />

      {/* Main DataTable with Pagination */}
      <AdminCard noPadding>
        <DataTable
          columns={columns}
          data={paginatedLogs}
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
    </div>
  );
};
