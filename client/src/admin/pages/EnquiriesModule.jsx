import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SlideDrawer } from '../components/ui/SlideDrawer';
import { AdminCard } from '../components/ui/AdminCard';
import { FormInput } from '../components/ui/FormInput';
import { FormSelect } from '../components/ui/FormSelect';
import { Pagination } from '../components/ui/Pagination';
import { AdminModal } from '../components/ui/AdminModal';
import { Inbox, Mail, Phone, Building, Calendar, DollarSign, ArrowRight, UserCheck, Plus, CheckCircle2, UserPlus, Clock } from 'lucide-react';

export const EnquiriesModule = () => {
  const { enquiries, updateEnquiry, addFollowUpToEnquiry, convertEnquiryToClient } = useAdminData();
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Conversion & Follow-up Modal States
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Follow-up Form State
  const [followUpForm, setFollowUpForm] = useState({
    date: new Date().toISOString().split('T')[0],
    staff: 'Sarah Jenkins',
    notes: '',
    outcome: 'Pending',
    completed: false,
  });

  // Conversion Form State (pre-filled from enquiry)
  const [convertForm, setConvertForm] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    company: '',
    packageAssigned: 'Social Media Retainer (Tier A)',
    monthlyRetainer: '4500',
    assignedStaff: ['Sarah Jenkins'],
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const isFollowUpMode = location.pathname.endsWith('/follow-ups');
  const isConvertedMode = location.pathname.endsWith('/converted');

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, location.pathname]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

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

  const handleStatusChange = (newStatus) => {
    if (!selectedEnquiry) return;
    updateEnquiry(selectedEnquiry.id, { status: newStatus });
    setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
    showToast(`Lead status updated to ${newStatus}`);
  };

  const handleOpenConvertModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setConvertForm({
      name: enquiry.company || enquiry.name,
      contactName: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone || '+91 98000 11122',
      company: enquiry.company || enquiry.name,
      packageAssigned: enquiry.serviceRequested?.includes('Video') ? 'Video Production & Retainer' : 'Social Media Retainer (Tier A)',
      monthlyRetainer: '4500',
      assignedStaff: [enquiry.assignedTo || 'Sarah Jenkins'],
    });
    setIsConvertModalOpen(true);
  };

  const handleConvertSubmit = (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    const newClientId = convertEnquiryToClient(selectedEnquiry.id, convertForm);
    setSelectedEnquiry((prev) => ({ ...prev, status: 'Converted' }));
    setIsConvertModalOpen(false);
    showToast(`Enquiry converted to client profile: ${convertForm.name}!`);
    if (newClientId) {
      setTimeout(() => {
        navigate(`/admin/clients/${newClientId}`);
      }, 500);
    }
  };

  const handleFollowUpSubmit = (e) => {
    e.preventDefault();
    if (!selectedEnquiry || !followUpForm.notes.trim()) return;
    addFollowUpToEnquiry(selectedEnquiry.id, followUpForm);
    setIsFollowUpModalOpen(false);
    setFollowUpForm({
      date: new Date().toISOString().split('T')[0],
      staff: 'Sarah Jenkins',
      notes: '',
      outcome: 'Pending',
      completed: false,
    });
    showToast('Follow-up activity logged!');
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
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleOpenDetail(row)}
            className="text-xs font-mono font-bold text-[#8E722A] hover:text-[#111111] uppercase underline cursor-pointer"
          >
            Review Lead →
          </button>
          {row.status !== 'Converted' && (
            <button
              onClick={() => handleOpenConvertModal(row)}
              className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded transition-colors"
            >
              Convert
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 font-body">
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <FilterBar
        searchPlaceholder="Search lead name, company, email..."
        searchValue={search}
        onSearchChange={setSearch}
        filterOptions={['All', 'New', 'In Contact', 'Proposal Sent', 'Converted', 'Closed']}
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
            {/* Lead Status & Workflow Action Header */}
            <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/06 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#685C43] uppercase block font-bold">WORKFLOW STATUS</span>
                <FormSelect
                  value={selectedEnquiry.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  options={['New', 'In Contact', 'Proposal Sent', 'Converted', 'Closed']}
                  className="text-xs"
                />
              </div>

              {selectedEnquiry.status !== 'Converted' && (
                <button
                  onClick={() => handleOpenConvertModal(selectedEnquiry)}
                  className="w-full py-2 bg-[#111111] hover:bg-[#8E722A] text-[#F7F5EF] text-xs font-mono font-bold rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Convert Lead to Active Client</span>
                </button>
              )}
            </div>

            {/* Request Summary */}
            <div className="p-4 bg-white rounded-xl border border-[#0A0A0A]/08 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#685C43] uppercase block">Requested Service</span>
                <span className="font-mono text-xs font-bold text-[#8E722A]">{selectedEnquiry.serviceRequested}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#685C43] uppercase block">Budget Bracket</span>
                <span className="font-mono text-xs font-bold text-[#111111]">{selectedEnquiry.budgetTier}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#685C43] uppercase block">Timeline</span>
                <span className="font-mono text-xs text-[#111111]">{selectedEnquiry.timeline || 'Within 1 Month'}</span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase tracking-wider block">CONTACT & ASSIGNMENT</span>
              <div className="space-y-2 text-xs font-body text-[#221C11] p-3 bg-white rounded-lg border border-[#0A0A0A]/08">
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
                  <UserCheck className="w-4 h-4 text-[#8E722A]" />
                  <span>Assigned Staff: {selectedEnquiry.assignedTo || 'Sarah Jenkins'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#8E722A]" />
                  <span>Received Date: {selectedEnquiry.dateSubmitted}</span>
                </div>
              </div>
            </div>

            {/* Inquiry Notes */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase tracking-wider block">PROJECT INQUIRY MESSAGE</span>
              <p className="text-xs text-[#221C11] font-body bg-white p-3 rounded-lg border border-[#0A0A0A]/08 italic leading-relaxed">
                "{selectedEnquiry.description}"
              </p>
            </div>

            {/* Follow-up Timeline Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase tracking-wider block">FOLLOW-UP HISTORY</span>
                <button
                  onClick={() => setIsFollowUpModalOpen(true)}
                  className="px-2.5 py-1 text-xs font-mono font-bold bg-[#FAF8F3] hover:bg-white text-[#111111] border border-[#0A0A0A]/10 rounded-md transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-[#8E722A]" />
                  <span>Log Follow-up</span>
                </button>
              </div>

              <div className="space-y-2">
                {selectedEnquiry.followUps && selectedEnquiry.followUps.length > 0 ? (
                  selectedEnquiry.followUps.map((flw) => (
                    <div key={flw.id} className="p-3 bg-white rounded-lg border border-[#0A0A0A]/08 space-y-1 text-xs font-body">
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="font-bold text-[#111111]">{flw.date}</span>
                        <span className="text-[#8E722A]">{flw.staff}</span>
                      </div>
                      <p className="text-[#221C11]">{flw.notes}</p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#685C43] pt-1">
                        <span>Outcome: {flw.outcome}</span>
                        <span className="text-emerald-700 font-bold">✓ Logged</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#685C43] italic bg-white p-3 rounded-lg border border-[#0A0A0A]/08">No follow-up entries logged yet.</p>
                )}
              </div>
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

      {/* Convert Lead to Client Modal */}
      {isConvertModalOpen && (
        <AdminModal
          isOpen={isConvertModalOpen}
          onClose={() => setIsConvertModalOpen(false)}
          title="Convert Lead to Active Client Account"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleConvertSubmit} className="space-y-4">
            <p className="text-xs text-[#685C43] font-body">
              Review and pre-fill client account parameters for <strong className="text-[#111111]">{selectedEnquiry?.name}</strong>.
            </p>

            <FormInput
              label="Client / Brand Name"
              value={convertForm.name}
              onChange={(e) => setConvertForm({ ...convertForm, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Primary Contact Person"
                value={convertForm.contactName}
                onChange={(e) => setConvertForm({ ...convertForm, contactName: e.target.value })}
                required
              />
              <FormInput
                label="Company Entity Name"
                value={convertForm.company}
                onChange={(e) => setConvertForm({ ...convertForm, company: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Email Address"
                type="email"
                value={convertForm.email}
                onChange={(e) => setConvertForm({ ...convertForm, email: e.target.value })}
                required
              />
              <FormInput
                label="Phone Number"
                value={convertForm.phone}
                onChange={(e) => setConvertForm({ ...convertForm, phone: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormSelect
                label="Assigned Retainer Package"
                value={convertForm.packageAssigned}
                onChange={(e) => setConvertForm({ ...convertForm, packageAssigned: e.target.value })}
                options={[
                  'Social Media Retainer (Tier A)',
                  'Social Media Retainer (Tier B)',
                  'Video Production & Retainer',
                  'Content Creation Suite',
                  'Brand Strategy & Launch Package',
                ]}
              />
              <FormInput
                label="Monthly Retainer Fee ($ USD)"
                type="number"
                value={convertForm.monthlyRetainer}
                onChange={(e) => setConvertForm({ ...convertForm, monthlyRetainer: e.target.value })}
                required
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-[#0A0A0A]/10">
              <button
                type="button"
                onClick={() => setIsConvertModalOpen(false)}
                className="px-4 py-2 text-xs font-mono text-[#685C43]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-md hover:bg-[#8E722A]"
              >
                Confirm Client Conversion
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {/* Log Follow-up Activity Modal */}
      {isFollowUpModalOpen && (
        <AdminModal
          isOpen={isFollowUpModalOpen}
          onClose={() => setIsFollowUpModalOpen(false)}
          title="Log Lead Follow-up Touchpoint"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleFollowUpSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Follow-up Date"
                type="date"
                value={followUpForm.date}
                onChange={(e) => setFollowUpForm({ ...followUpForm, date: e.target.value })}
                required
              />
              <FormSelect
                label="Staff Member"
                value={followUpForm.staff}
                onChange={(e) => setFollowUpForm({ ...followUpForm, staff: e.target.value })}
                options={['Sarah Jenkins', 'Vikramaditya Sharma', 'Rohan Verma', 'Ananya Sen']}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0A0A0A]">
                Follow-up Notes & Discussion <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={3}
                value={followUpForm.notes}
                onChange={(e) => setFollowUpForm({ ...followUpForm, notes: e.target.value })}
                placeholder="Log discussion points, proposal updates, or next steps..."
                required
                className="px-3 py-2 bg-[#F7F5EF]/50 text-xs font-body text-[#0A0A0A] rounded-sm border border-[#0A0A0A]/14 focus:outline-none focus:border-[#C8A13A]"
              />
            </div>

            <FormSelect
              label="Outcome / Status"
              value={followUpForm.outcome}
              onChange={(e) => setFollowUpForm({ ...followUpForm, outcome: e.target.value })}
              options={['Pending Response', 'Proposal Sent', 'Meeting Scheduled', 'Converted', 'Closed / Lost']}
            />

            <div className="pt-3 flex justify-end gap-2 border-t border-[#0A0A0A]/10">
              <button
                type="button"
                onClick={() => setIsFollowUpModalOpen(false)}
                className="px-4 py-2 text-xs font-mono text-[#685C43]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-mono font-bold bg-[#8E722A] text-white rounded-md hover:bg-[#725B20]"
              >
                Save Follow-up Entry
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
};

