import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SlideDrawer } from '../components/ui/SlideDrawer';
import { AdminCard } from '../components/ui/AdminCard';
import { Inbox, Mail, Phone, Building, Calendar, DollarSign, ArrowRight, UserCheck } from 'lucide-react';

export const EnquiriesModule = () => {
  const { enquiries } = useAdminData();
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isFollowUpMode = location.pathname.endsWith('/follow-ups');
  const isConvertedMode = location.pathname.endsWith('/converted');

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
        filters={[
          {
            id: 'status',
            label: 'Status',
            value: statusFilter,
            options: [
              { label: 'All Statuses', value: 'All' },
              { label: 'New Enquiries', value: 'New' },
              { label: 'In Contact', value: 'In Contact' },
              { label: 'Proposal Sent', value: 'Proposal Sent' },
              { label: 'Converted', value: 'Converted' },
            ],
            onChange: setStatusFilter,
          },
        ]}
      />

      <AdminCard noPadding>
        <DataTable
          columns={columns}
          data={filteredEnquiries}
          onRowClick={(row) => handleOpenDetail(row)}
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
                <span className="text-[10px] font-mono text-[#685C43] uppercase">Service Requested</span>
                <StatusBadge status={selectedEnquiry.status} />
              </div>
              <span className="font-display text-xl font-bold text-[#111111] block">{selectedEnquiry.serviceRequested}</span>
              <span className="text-xs font-mono text-[#8E722A] block">Budget Tier: {selectedEnquiry.budgetTier} • Timeline: {selectedEnquiry.timeline}</span>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase tracking-wider block">PROJECT DESCRIPTION</span>
              <p className="text-xs text-[#221C11] leading-relaxed p-3 bg-white rounded-lg border border-[#0A0A0A]/08">
                {selectedEnquiry.description}
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase tracking-wider block">CONTACT DETAILS</span>
              <div className="space-y-1.5 text-xs text-[#685C43]">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#8E722A]" />
                  <span>{selectedEnquiry.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#8E722A]" />
                  <span>{selectedEnquiry.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#8E722A]" />
                  <span>Assigned Staff: {selectedEnquiry.assignedTo || 'Unassigned'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#0A0A0A]/06 flex justify-end gap-2">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 text-xs font-mono bg-[#111111] text-[#F7F5EF] rounded-lg"
              >
                Close Drawer
              </button>
            </div>
          </div>
        )}
      </SlideDrawer>
    </div>
  );
};
