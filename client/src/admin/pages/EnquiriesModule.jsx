import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SlideDrawer } from '../components/ui/SlideDrawer';
import { AdminCard } from '../components/ui/AdminCard';
import { Pagination } from '../components/ui/Pagination';
import { Inbox, Mail, Phone, Building, Calendar, DollarSign, ArrowRight, UserCheck } from 'lucide-react';

export const EnquiriesModule = () => {
  const { enquiries } = useAdminData();
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const isFollowUpMode = location.pathname.endsWith('/follow-ups');
  const isConvertedMode = location.pathname.endsWith('/converted');

  // Reset page when search, status, or route changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, location.pathname]);

  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      enq.name.toLowerCase().includes(search.toLowerCase()) ||
      enq.company.toLowerCase().includes(search.toLowerCase()) ||
      enq.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || enq.status === statusFilter;

    if (isFollowUpMode) {
      return matchesSearch && (enq.status === 'In Contact' || enq.status === 'Proposal Sent');
    }
    if (isConvertedMode) {
      return matchesSearch && enq.status === 'Converted';
    }

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEnquiries.length / pageSize) || 1;
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenDetail = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      header: 'LEAD & CONTACT',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#111111] text-[#F7F5EF] font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-[#8E722A]/40">
            {row.name ? row.name.charAt(0) : 'L'}
          </div>
          <div>
            <span className="font-bold text-[#111111] block font-body">{row.name}</span>
            <span className="text-[11px] text-[#685C43] font-mono">{row.email}</span>
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
        <span className="font-mono text-[11px] font-bold text-[#8E722A] bg-[#F7F5EF] px-2.5 py-1 rounded-full border border-[#D5C7A5]/50">
          {row.serviceRequested}
        </span>
      ),
    },
    {
      header: 'BUDGET TIER',
      key: 'budgetTier',
      render: (row) => <span className="font-mono text-[11px] text-[#685C43]">{row.budgetTier || 'N/A'}</span>,
    },
    {
      header: 'SUBMITTED DATE',
      key: 'dateSubmitted',
      render: (row) => <span className="font-mono text-[11px] text-[#685C43]">{row.dateSubmitted || '2026-09-26'}</span>,
    },
    {
      header: 'STATUS',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'ACTION',
      key: 'action',
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenDetail(row);
          }}
          className="text-xs font-mono font-bold text-[#8E722A] hover:text-[#111111] uppercase underline cursor-pointer"
        >
          Review Lead →
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4 font-body">
      <FilterBar
        searchPlaceholder="Search lead name, company, email..."
        searchValue={search}
        onSearchChange={setSearch}
        filterOptions={['All', 'New', 'In Contact', 'Proposal Sent', 'Converted']}
        selectedFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <AdminCard noPadding>
        <DataTable
          columns={columns}
          data={paginatedEnquiries}
          onRowClick={(row) => handleOpenDetail(row)}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredEnquiries.length}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setPageSize}
        />
      </AdminCard>

      {/* Enquiry Detail Drawer */}
      <SlideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedEnquiry?.name || 'Enquiry Details'}
        subtitle={selectedEnquiry?.company}
      >
        {selectedEnquiry && (
          <div className="space-y-6">
            <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/06 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#685C43] uppercase block">Requested Service</span>
                <span className="font-mono text-xs font-bold text-[#8E722A]">{selectedEnquiry.serviceRequested}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#685C43] uppercase block">Budget Bracket</span>
                <span className="font-mono text-xs font-bold text-[#111111]">{selectedEnquiry.budgetTier}</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase tracking-wider block">CONTACT DETAILS</span>
              <div className="space-y-2 text-xs font-body text-[#221C11]">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#8E722A]" />
                  <span>Company: {selectedEnquiry.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#8E722A]" />
                  <span>Email: {selectedEnquiry.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#8E722A]" />
                  <span>Phone: {selectedEnquiry.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#8E722A]" />
                  <span>Received: {selectedEnquiry.dateSubmitted}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase tracking-wider block">PROJECT INQUIRY NOTES</span>
              <p className="text-xs text-[#221C11] font-body bg-white p-3 rounded-lg border border-[#0A0A0A]/08 italic">
                "{selectedEnquiry.description}"
              </p>
            </div>

            <div className="pt-4 border-t border-[#0A0A0A]/06 flex justify-end gap-2">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 text-xs font-mono bg-[#111111] text-[#F7F5EF] rounded-lg"
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </SlideDrawer>
    </div>
  );
};
