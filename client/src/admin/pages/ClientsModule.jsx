import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SlideDrawer } from '../components/ui/SlideDrawer';
import { AdminCard } from '../components/ui/AdminCard';
import { FormInput } from '../components/ui/FormInput';
import { FormSelect } from '../components/ui/FormSelect';
import { Pagination } from '../components/ui/Pagination';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { AdminModal } from '../components/ui/AdminModal';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Users, UserPlus, Clock, Mail, Phone, Building, Calendar, CreditCard, ArrowRight,
  CheckCircle2, Edit, Archive, Trash2, Plus, Globe, FileText,
  Star, Kanban, RefreshCw, AlertTriangle, Download
} from 'lucide-react';

export const ClientsModule = () => {
  const { clients, projects, tasks, payments, reviewScanners, enquiries, addClient, updateClient, archiveClient, deleteClient } = useAdminData();
  const location = useLocation();
  const navigate = useNavigate();

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  // Modal & Dialog States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Note State inside Drawer
  const [newNote, setNewNote] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form State for Add / Edit Client
  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    company: '',
    packageAssigned: 'Social Media Retainer (Tier A)',
    monthlyRetainer: '4500',
    startDate: '2026-04-01',
    expiryDate: '2027-03-31',
    website: 'https://asnmedia.in',
    status: 'Active',
    accountManager: 'Sarah Jenkins',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Determine active sub-tab from path
  const isAddMode = location.pathname.endsWith('/add');
  const isExpiringMode = location.pathname.endsWith('/expiring');

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, location.pathname]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Filter clients based on tab & filters
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.company.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || client.status === statusFilter;

    if (isExpiringMode) {
      const isExpiring = client.expiryDate && (client.expiryDate.startsWith('2026-04') || client.expiryDate.startsWith('2026-05') || client.expiryDate.startsWith('2026-10'));
      return matchesSearch && isExpiring;
    }

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredClients.length / pageSize) || 1;
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Client Detail Drawer trigger
  const handleOpen360 = (client) => {
    setSelectedClient(client);
    setActiveTab('Overview');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name || '',
      contactName: client.contactName || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      packageAssigned: client.packageAssigned || 'Social Media Retainer (Tier A)',
      monthlyRetainer: String(client.monthlyRetainer || 4500),
      startDate: client.startDate || '2026-04-01',
      expiryDate: client.expiryDate || '2027-03-31',
      website: client.website || 'https://asnmedia.in',
      status: client.status || 'Active',
      accountManager: client.accountManager || 'Sarah Jenkins',
    });
    setIsEditModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEditModalOpen && selectedClient) {
      updateClient(selectedClient.id, {
        name: formData.name,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        packageAssigned: formData.packageAssigned,
        monthlyRetainer: Number(formData.monthlyRetainer),
        startDate: formData.startDate,
        expiryDate: formData.expiryDate,
        website: formData.website,
        status: formData.status,
        accountManager: formData.accountManager,
      });
      setSelectedClient((prev) => ({ ...prev, ...formData, monthlyRetainer: Number(formData.monthlyRetainer) }));
      setIsEditModalOpen(false);
      showToast('Client profile updated successfully!');
    } else {
      addClient(formData);
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        navigate('/admin/clients');
      }, 1200);
    }
  };

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedClient) return;
    const currentNotes = selectedClient.internalNotes || [];
    const updatedNotes = [{ id: `note_${Date.now()}`, text: newNote, author: 'Sarah Jenkins', date: new Date().toLocaleDateString() }, ...currentNotes];
    updateClient(selectedClient.id, { internalNotes: updatedNotes });
    setSelectedClient((prev) => ({ ...prev, internalNotes: updatedNotes }));
    setNewNote('');
    showToast('Internal note saved!');
  };

  const handleConfirmArchive = () => {
    if (!selectedClient) return;
    archiveClient(selectedClient.id);
    setSelectedClient((prev) => ({ ...prev, status: 'Archived' }));
    showToast(`Client ${selectedClient.name} archived.`);
  };

  const handleConfirmDelete = () => {
    if (!selectedClient) return;
    deleteClient(selectedClient.id);
    setIsDrawerOpen(false);
    showToast(`Client ${selectedClient.name} permanently deleted.`);
  };

  // Columns definition for Clients Table
  const columns = [
    {
      header: 'CLIENT & PORTFOLIO',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E5D9BC] text-[#111111] font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-[#8E722A]">
            {row.name ? row.name.charAt(0) : 'C'}
          </div>
          <div>
            <span className="font-bold text-[#111111] block font-body">{row.name}</span>
            <span className="text-[11px] text-[#685C43]">{row.company}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'ASSIGNED PACKAGE',
      key: 'packageAssigned',
      render: (row) => (
        <span className="font-mono text-[11px] font-bold text-[#8E722A]">{row.packageAssigned}</span>
      ),
    },
    {
      header: 'RETAINER',
      key: 'monthlyRetainer',
      render: (row) => (
        <span className="font-mono font-bold text-[#111111] text-xs">${row.monthlyRetainer?.toLocaleString()}/mo</span>
      ),
    },
    {
      header: 'EXPIRY DATE',
      key: 'expiryDate',
      render: (row) => <span className="font-mono text-[11px] text-[#685C43]">{row.expiryDate || 'N/A'}</span>,
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
            onClick={() => handleOpen360(row)}
            className="text-xs font-mono font-bold text-[#8E722A] hover:text-[#111111] uppercase underline cursor-pointer"
          >
            View 360 →
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1 text-[#685C43] hover:text-[#111111]"
            title="Edit Client"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // Client Detail Linked Data Subsets
  const clientProjects = selectedClient ? projects.filter((p) => p.clientName === selectedClient.name || p.clientId === selectedClient.id) : [];
  const clientTasks = selectedClient ? tasks.filter((t) => t.clientName === selectedClient.name) : [];
  const clientPayments = selectedClient ? payments.filter((p) => p.clientName === selectedClient.name || p.clientId === selectedClient.id) : [];
  const clientEnquiries = selectedClient ? enquiries.filter((e) => e.company === selectedClient.company || e.email === selectedClient.email) : [];
  const clientScanner = selectedClient ? reviewScanners.find((s) => s.clientName === selectedClient.name || s.id === selectedClient.reviewScannerId) : null;

  return (
    <div className="space-y-6 font-body">
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* View 1: Add Client Form View */}
      {isAddMode ? (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#0A0A0A]/08">
            <div>
              <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
                CLIENT ONBOARDING
              </span>
              <h2 className="font-display text-2xl font-normal text-[#111111]">
                Register New Client Account
              </h2>
            </div>
            <button
              onClick={() => navigate('/admin/clients')}
              className="text-xs font-mono text-[#685C43] hover:text-[#111111]"
            >
              ← Back to All Clients
            </button>
          </div>

          {formSubmitted ? (
            <div className="py-12 text-center space-y-3 bg-white p-6 rounded-xl border border-[#0A0A0A]/10">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <div className="font-serif text-xl font-semibold text-[#111111]">Client Account Onboarded</div>
              <p className="text-xs font-mono text-[#685C43]">Redirecting to main clients directory...</p>
            </div>
          ) : (
            <AdminCard className="p-6">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormInput
                  label="Client / Brand Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Maison de Luxe"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Primary Contact Name"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    required
                  />
                  <FormInput
                    label="Company Entity Name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <FormInput
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect
                    label="Assigned Retainer Package"
                    value={formData.packageAssigned}
                    onChange={(e) => setFormData({ ...formData, packageAssigned: e.target.value })}
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
                    value={formData.monthlyRetainer}
                    onChange={(e) => setFormData({ ...formData, monthlyRetainer: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Contract Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                  <FormInput
                    label="Contract Expiry Date"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                  />
                </div>

                <div className="pt-4 border-t border-[#0A0A0A]/08 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/clients')}
                    className="px-4 py-2 text-xs font-mono text-[#685C43] hover:text-[#111111]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-lg hover:bg-[#8E722A] transition-colors"
                  >
                    Create Client Profile
                  </button>
                </div>
              </form>
            </AdminCard>
          )}
        </div>
      ) : (
        /* View 2: Client Table / Expiring View */
        <div className="space-y-4">
          <FilterBar
            searchPlaceholder="Search client name, company, email..."
            searchValue={search}
            onSearchChange={setSearch}
            filterOptions={['All', 'Active', 'Pending', 'Completed', 'Archived']}
            selectedFilter={statusFilter}
            onFilterChange={setStatusFilter}
            actions={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setToastMessage(`Exporting ${filteredClients.length} client directory records to CSV...`);
                    setTimeout(() => setToastMessage(''), 3000);
                  }}
                  className="px-3 py-2 text-xs font-mono font-bold bg-[#FAF8F3] border border-[#0A0A0A]/14 text-[#111111] hover:bg-[#8E722A] hover:text-white rounded-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Directory</span>
                </button>
                <button
                  onClick={() => navigate('/admin/clients/add')}
                  className="px-3.5 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded-xs transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Client</span>
                </button>
              </div>
            }
          />

          <AdminCard noPadding>
            <DataTable
              columns={columns}
              data={paginatedClients}
              onRowClick={(row) => handleOpen360(row)}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredClients.length}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setPageSize}
            />
          </AdminCard>
        </div>
      )}

      {/* Client 360 Profile Slide Drawer with Contextual Sub-tabs */}
      <SlideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedClient?.name || 'Client 360 Profile'}
        subtitle={selectedClient?.company}
      >
        {selectedClient && (
          <div className="space-y-6">
            {/* Top Client Header Bar with Status & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/08">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#111111] text-[#F7F5EF] font-mono text-sm font-bold flex items-center justify-center border border-[#8E722A]">
                  {selectedClient.name ? selectedClient.name.charAt(0) : 'C'}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#111111]">{selectedClient.name}</h3>
                  <span className="text-[11px] font-mono text-[#685C43]">{selectedClient.company}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={selectedClient.status} />
                <button
                  onClick={() => handleOpenEdit(selectedClient)}
                  className="px-2.5 py-1 text-xs font-mono bg-white hover:bg-[#111111] hover:text-white border border-[#0A0A0A]/10 rounded-md transition-colors flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setIsArchiveConfirmOpen(true)}
                  className="px-2.5 py-1 text-xs font-mono bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-md transition-colors flex items-center gap-1"
                >
                  <Archive className="w-3 h-3" />
                  <span>Archive</span>
                </button>
              </div>
            </div>

            {/* Contextual Sub-tabs Navigation */}
            <div className="flex items-center gap-1 border-b border-[#0A0A0A]/10 overflow-x-auto scrollbar-none pb-0.5">
              {[
                'Overview',
                'Packages',
                'Services',
                'Projects & Tasks',
                'Payments',
                'Enquiries & Follow-ups',
                'Review Scanners',
                'Activity History',
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-mono font-semibold uppercase whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                    activeTab === tab
                      ? 'border-[#8E722A] text-[#111111] bg-white rounded-t-md'
                      : 'border-transparent text-[#685C43] hover:text-[#111111]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab 1: OVERVIEW */}
            {activeTab === 'Overview' && (
              <div className="space-y-5">
                {/* Metric Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#FAF8F3] rounded-lg border border-[#0A0A0A]/06">
                    <span className="text-[10px] font-mono text-[#685C43] uppercase block">Monthly Fee</span>
                    <span className="font-display text-lg font-bold text-[#111111]">${selectedClient.monthlyRetainer?.toLocaleString()}/mo</span>
                  </div>
                  <div className="p-3 bg-[#FAF8F3] rounded-lg border border-[#0A0A0A]/06">
                    <span className="text-[10px] font-mono text-[#685C43] uppercase block">Total Paid YTD</span>
                    <span className="font-display text-lg font-bold text-emerald-700">${selectedClient.totalPaid?.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-[#FAF8F3] rounded-lg border border-[#0A0A0A]/06">
                    <span className="text-[10px] font-mono text-[#685C43] uppercase block">Joining Date</span>
                    <span className="font-display text-sm font-bold text-[#111111]">{selectedClient.startDate || '2025-11-01'}</span>
                  </div>
                </div>

                {/* Information Sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-[#0A0A0A]/08 space-y-2 text-xs">
                    <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">CONTACT INFORMATION</span>
                    <div>Primary Contact: <strong className="text-[#111111]">{selectedClient.contactName}</strong></div>
                    <div>Email: <span className="font-mono text-[#685C43]">{selectedClient.email}</span></div>
                    <div>Phone: <span className="font-mono text-[#685C43]">{selectedClient.phone}</span></div>
                    <div>Account Manager: <span className="font-mono text-[#8E722A]">{selectedClient.accountManager || 'Sarah Jenkins'}</span></div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-[#0A0A0A]/08 space-y-2 text-xs">
                    <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">BUSINESS & LINKS</span>
                    <div>Company Entity: <strong className="text-[#111111]">{selectedClient.company}</strong></div>
                    <div>Website: <a href={selectedClient.website || '#'} target="_blank" rel="noreferrer" className="text-[#8E722A] hover:underline font-mono">{selectedClient.website || 'https://asnmedia.in'}</a></div>
                    <div>Social: <span className="font-mono text-[#685C43]">Instagram ({selectedClient.socialLinks?.instagram || '@client'})</span></div>
                  </div>
                </div>

                {/* Internal Notes Section */}
                <div className="p-4 bg-[#FAF8F3] rounded-lg border border-[#0A0A0A]/08 space-y-3">
                  <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">INTERNAL AGENCY NOTES</span>
                  <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add an internal note for account team..."
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#0A0A0A]/12 rounded-md focus:outline-none focus:border-[#8E722A]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-md hover:bg-[#8E722A]"
                    >
                      Add Note
                    </button>
                  </form>

                  <div className="space-y-2 pt-2">
                    {selectedClient.internalNotes && selectedClient.internalNotes.length > 0 ? (
                      selectedClient.internalNotes.map((note, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded border border-[#0A0A0A]/06 text-xs space-y-0.5">
                          <p className="text-[#111111]">{typeof note === 'string' ? note : note.text}</p>
                          <span className="text-[10px] font-mono text-[#685C43] block">
                            Logged by {note.author || 'Sarah Jenkins'} • {note.date || 'Today'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#685C43] italic">No internal notes logged yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: PACKAGES */}
            {activeTab === 'Packages' && (
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-[#0A0A0A]/08 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-[#8E722A] uppercase font-bold block">ACTIVE CONTRACT</span>
                      <h4 className="font-bold text-sm text-[#111111]">{selectedClient.packageAssigned}</h4>
                    </div>
                    <span className="font-mono text-sm font-bold text-[#111111]">${selectedClient.monthlyRetainer?.toLocaleString()}/mo</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#685C43] pt-2 border-t border-[#0A0A0A]/06">
                    <span>Start Date: {selectedClient.startDate}</span>
                    <span>Expiry Date: {selectedClient.expiryDate}</span>
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      onClick={() => showToast('Package renewed for 12 months!')}
                      className="px-3 py-1.5 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-md hover:bg-[#8E722A]"
                    >
                      Renew Package
                    </button>
                    <button
                      onClick={() => showToast('Contract expiry extended by 30 days!')}
                      className="px-3 py-1.5 text-xs font-mono bg-[#FAF8F3] text-[#111111] border border-[#0A0A0A]/10 rounded-md hover:bg-white"
                    >
                      Extend 30 Days
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: SERVICES */}
            {activeTab === 'Services' && (
              <div className="space-y-3">
                <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">INCLUDED DISCRETE SERVICES</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Social Media Management', 'Content Creation', 'Video Production', 'Brand Strategy'].map((svc, i) => (
                    <div key={i} className="p-3 bg-white rounded-lg border border-[#0A0A0A]/08 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111111]">{svc}</span>
                      <StatusBadge status="Active" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: PROJECTS & TASKS */}
            {activeTab === 'Projects & Tasks' && (
              <div className="space-y-4">
                <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">LINKED PROJECTS ({clientProjects.length})</span>
                {clientProjects.length > 0 ? (
                  clientProjects.map((p) => (
                    <div key={p.id} className="p-3 bg-white rounded-lg border border-[#0A0A0A]/08 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-[#111111]">{p.title}</span>
                        <StatusBadge status={p.status} />
                      </div>
                      <div className="w-full bg-[#FAF8F3] h-1.5 rounded-full overflow-hidden border border-[#0A0A0A]/06">
                        <div className="bg-[#8E722A] h-full" style={{ width: `${p.progressPct}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#685C43] italic">No active projects linked.</p>
                )}

                <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block pt-2">LINKED PRODUCTION TASKS ({clientTasks.length})</span>
                {clientTasks.length > 0 ? (
                  <div className="space-y-2">
                    {clientTasks.map((t) => (
                      <div key={t.id} className="p-2.5 bg-white rounded border border-[#0A0A0A]/06 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-[#111111] block">{t.title}</span>
                          <span className="text-[10px] font-mono text-[#685C43]">Assignee: {t.assignee}</span>
                        </div>
                        <StatusBadge status={t.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#685C43] italic">No pending tasks.</p>
                )}
              </div>
            )}

            {/* Tab 5: PAYMENTS */}
            {activeTab === 'Payments' && (
              <div className="space-y-3">
                <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">FINANCIAL TRANSACTION HISTORY</span>
                {clientPayments.length > 0 ? (
                  <div className="space-y-2">
                    {clientPayments.map((pay) => (
                      <div key={pay.id} className="p-3 bg-white rounded border border-[#0A0A0A]/08 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-[#8E722A] block">{pay.invoiceNumber}</span>
                          <span className="text-[10px] font-mono text-[#685C43]">Date: {pay.date}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-[#111111] block">${pay.amount?.toLocaleString()}</span>
                          <StatusBadge status={pay.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#685C43] italic">No transaction ledger records.</p>
                )}
              </div>
            )}

            {/* Tab 6: ENQUIRIES & FOLLOW-UPS */}
            {activeTab === 'Enquiries & Follow-ups' && (
              <div className="space-y-3">
                <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">ORIGINAL ENQUIRY RECORD</span>
                {clientEnquiries.length > 0 ? (
                  clientEnquiries.map((e) => (
                    <div key={e.id} className="p-3 bg-white rounded border border-[#0A0A0A]/08 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="font-bold text-[#111111]">{e.serviceRequested}</span>
                        <StatusBadge status={e.status} />
                      </div>
                      <p className="text-[#685C43] italic">"{e.description}"</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#685C43] italic">No historical lead enquiry linked.</p>
                )}
              </div>
            )}

            {/* Tab 7: REVIEW SCANNERS */}
            {activeTab === 'Review Scanners' && (
              <div className="space-y-3">
                <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">GOOGLE REVIEW MONITOR</span>
                {clientScanner ? (
                  <div className="p-4 bg-white rounded border border-[#0A0A0A]/08 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#111111]">{clientScanner.placeName}</span>
                      <div className="flex items-center gap-1 font-mono font-bold text-amber-600">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span>{clientScanner.avgRating} / 5.0</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-[#685C43] block">Total Scraped: {clientScanner.totalReviewsScraped} reviews</span>
                  </div>
                ) : (
                  <p className="text-xs text-[#685C43] italic">No Google Place Scanner linked.</p>
                )}
              </div>
            )}

            {/* Tab 8: ACTIVITY HISTORY */}
            {activeTab === 'Activity History' && (
              <div className="space-y-3">
                <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">CLIENT ACTIVITY TIMELINE</span>
                <div className="space-y-2">
                  {(selectedClient.activityHistory || [
                    { id: '1', action: 'Client Retainer Package Renewed', timestamp: '2026-09-01', actor: 'Sarah Jenkins' },
                    { id: '2', action: 'Invoice INV-2026-0901 Paid', timestamp: '2026-09-05', actor: 'Client' },
                  ]).map((act) => (
                    <div key={act.id} className="p-2.5 bg-white rounded border border-[#0A0A0A]/06 text-xs flex justify-between">
                      <span className="text-[#111111] font-semibold">{act.action}</span>
                      <span className="font-mono text-[10px] text-[#685C43]">{act.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Footer Actions */}
            <div className="pt-4 border-t border-[#0A0A0A]/08 flex justify-between items-center">
              <button
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="px-3 py-1.5 text-xs font-mono text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </button>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 text-xs font-mono bg-[#111111] text-[#F7F5EF] rounded-lg hover:bg-[#8E722A]"
              >
                Close 360 View
              </button>
            </div>
          </div>
        )}
      </SlideDrawer>

      {/* Edit Client Modal */}
      {isEditModalOpen && (
        <AdminModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Profile: ${selectedClient?.name}`}
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <FormInput
              label="Client / Brand Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Contact Person"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                required
              />
              <FormInput
                label="Company Entity"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <FormInput
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormSelect
                label="Account Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={['Active', 'Pending', 'Completed', 'Archived']}
              />
              <FormInput
                label="Monthly Retainer ($ USD)"
                type="number"
                value={formData.monthlyRetainer}
                onChange={(e) => setFormData({ ...formData, monthlyRetainer: e.target.value })}
                required
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-[#0A0A0A]/10">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-xs font-mono text-[#685C43]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-mono font-bold bg-[#8E722A] text-white rounded-md hover:bg-[#725B20]"
              >
                Save Client Changes
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {/* Archive Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isArchiveConfirmOpen}
        onClose={() => setIsArchiveConfirmOpen(false)}
        onConfirm={handleConfirmArchive}
        title="Archive Client Account"
        message={`Are you sure you want to archive ${selectedClient?.name}? The client status will be updated to Archived.`}
        confirmText="Archive Client"
        isDanger={false}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Permanently Delete Client"
        message={`Warning: Are you sure you want to delete ${selectedClient?.name}? All client records will be permanently removed.`}
        confirmText="Delete Account"
        isDanger={true}
      />
    </div>
  );
};

