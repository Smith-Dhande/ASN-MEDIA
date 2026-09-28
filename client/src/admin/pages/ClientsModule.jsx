import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
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
  Star, Kanban, RefreshCw, AlertTriangle, Download, ArrowLeft, Layers, DollarSign, ExternalLink
} from 'lucide-react';

export const ClientsModule = () => {
  const {
    clients,
    projects,
    tasks,
    payments,
    reviewScanners,
    enquiries,
    addClient,
    updateClient,
    archiveClient,
    deleteClient,
    addProject,
    addPayment,
    addReviewScanner,
  } = useAdminData();

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('Overview');

  // Modal & Dialog States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isDeployScannerOpen, setIsDeployScannerOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Note State inside Detail Page
  const [newNote, setNewNote] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Pagination State for Directory View
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Determine active mode from path
  const isAddMode = location.pathname.endsWith('/add');
  const isExpiringMode = location.pathname.endsWith('/expiring');
  const isDetailMode = Boolean(id) && !isAddMode && !isExpiringMode;

  // Selected client for detail view or edit
  const currentClient = isDetailMode ? clients.find((c) => String(c.id) === String(id)) : null;

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

  // Form State for Quick Project Creation
  const [quickProjectForm, setQuickProjectForm] = useState({
    title: '',
    serviceName: 'Social Media Management',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '2026-11-30',
    priority: 'Medium',
    leadStaff: 'Sarah Jenkins',
    status: 'In Progress',
  });

  // Form State for Quick Scanner Deployment
  const [quickScannerForm, setQuickScannerForm] = useState({
    placeName: '',
    googleReviewUrl: 'https://g.page/r/example',
    address: 'Mumbai, MH, India',
    assignedStaff: 'Sarah Jenkins',
  });

  // Form State for Quick Payment Record
  const [quickPaymentForm, setQuickPaymentForm] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    amount: '4500',
    amountReceived: '4500',
    method: 'Bank Transfer',
    date: new Date().toISOString().split('T')[0],
    dueDate: '2026-10-15',
    status: 'Paid',
    notes: 'Retainer Payment',
  });

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, location.pathname]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filter clients based on tab & filters in Directory View
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.company.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || client.status === statusFilter;

    if (isExpiringMode) {
      const isExpiring =
        client.expiryDate &&
        (client.expiryDate.startsWith('2026-04') ||
          client.expiryDate.startsWith('2026-05') ||
          client.expiryDate.startsWith('2026-10') ||
          client.expiryDate.startsWith('2027-03'));
      return matchesSearch && isExpiring;
    }

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredClients.length / pageSize) || 1;
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenEdit = (client) => {
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
    if (isEditModalOpen && currentClient) {
      updateClient(currentClient.id, {
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
      setIsEditModalOpen(false);
      showToast('Client profile updated successfully!');
    } else {
      const newId = addClient(formData);
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        navigate(`/admin/clients/${newId}`);
      }, 1000);
    }
  };

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNote.trim() || !currentClient) return;
    const currentNotes = currentClient.internalNotes || [];
    const updatedNotes = [
      {
        id: `note_${Date.now()}`,
        text: newNote,
        author: 'Sarah Jenkins',
        date: new Date().toLocaleDateString(),
      },
      ...currentNotes,
    ];
    updateClient(currentClient.id, { internalNotes: updatedNotes });
    setNewNote('');
    showToast('Internal agency note recorded!');
  };

  const handleConfirmArchive = () => {
    if (!currentClient) return;
    archiveClient(currentClient.id);
    setIsArchiveConfirmOpen(false);
    showToast(`Client ${currentClient.name} archived successfully.`);
  };

  const handleConfirmDelete = () => {
    if (!currentClient) return;
    deleteClient(currentClient.id);
    setIsDeleteConfirmOpen(false);
    showToast(`Client ${currentClient.name} permanently deleted.`);
    navigate('/admin/clients');
  };

  // Quick Project Submit
  const handleQuickProjectSubmit = (e) => {
    e.preventDefault();
    if (!currentClient) return;
    addProject({
      ...quickProjectForm,
      clientName: currentClient.name,
      clientId: currentClient.id,
    });
    setIsCreateProjectOpen(false);
    showToast(`New project "${quickProjectForm.title}" created for ${currentClient.name}!`);
  };

  // Quick Scanner Submit
  const handleQuickScannerSubmit = (e) => {
    e.preventDefault();
    if (!currentClient) return;
    addReviewScanner({
      placeName: quickScannerForm.placeName || `${currentClient.company} Google Reviews`,
      googleReviewUrl: quickScannerForm.googleReviewUrl,
      address: quickScannerForm.address,
      assignedStaff: quickScannerForm.assignedStaff,
      clientName: currentClient.name,
      status: 'Active',
      avgRating: 4.8,
      totalReviewsScraped: 12,
    });
    setIsDeployScannerOpen(false);
    showToast(`Review Scanner deployed for ${currentClient.name}!`);
  };

  // Quick Payment Submit
  const handleQuickPaymentSubmit = (e) => {
    e.preventDefault();
    if (!currentClient) return;
    addPayment({
      ...quickPaymentForm,
      clientName: currentClient.name,
      clientId: currentClient.id,
      packageName: currentClient.packageAssigned,
    });
    setIsRecordPaymentOpen(false);
    showToast(`Payment invoice ${quickPaymentForm.invoiceNumber} recorded for ${currentClient.name}!`);
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
            <span className="font-bold text-[#111111] block font-body hover:text-[#8E722A] transition-colors cursor-pointer">
              {row.name}
            </span>
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
        <span className="font-mono font-bold text-[#111111] text-xs">
          ${row.monthlyRetainer?.toLocaleString()}/mo
        </span>
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
            onClick={() => navigate(`/admin/clients/${row.id}`)}
            className="text-xs font-mono font-bold text-[#8E722A] hover:text-[#111111] uppercase underline cursor-pointer"
          >
            View Workspace →
          </button>
          <button
            onClick={() => {
              navigate(`/admin/clients/${row.id}`);
              setTimeout(() => handleOpenEdit(row), 100);
            }}
            className="p-1 text-[#685C43] hover:text-[#111111]"
            title="Edit Client"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // Linked datasets for Client Detail View
  const clientProjects = currentClient ? projects.filter((p) => p.clientName === currentClient.name || p.clientId === currentClient.id) : [];
  const clientTasks = currentClient ? tasks.filter((t) => t.clientName === currentClient.name) : [];
  const clientPayments = currentClient ? payments.filter((p) => p.clientName === currentClient.name || p.clientId === currentClient.id) : [];
  const clientEnquiries = currentClient ? enquiries.filter((e) => e.company === currentClient.company || e.email === currentClient.email) : [];
  const clientScanner = currentClient ? reviewScanners.find((s) => s.clientName === currentClient.name || s.id === currentClient.reviewScannerId) : null;

  return (
    <div className="space-y-6 font-body">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-md flex items-center justify-between gap-2 shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 1: DEDICATED FULL-PAGE CLIENT WORKSPACE (/admin/clients/:id) */}
      {/* ========================================================= */}
      {isDetailMode ? (
        !currentClient ? (
          /* 404 Client Not Found State */
          <div className="max-w-4xl mx-auto py-12">
            <EmptyState
              icon={Users}
              title="Client Profile Not Found"
              description={`No client record was found in system matching ID "${id}". The client may have been removed or archived.`}
              actionLabel="Return to Clients Directory"
              onAction={() => navigate('/admin/clients')}
            />
          </div>
        ) : (
          /* Dedicated Client Details Workspace */
          <div className="space-y-6">
            {/* Top Navigation Bar & Breadcrumb */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#0A0A0A]/08">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/admin/clients')}
                  className="px-3 py-1.5 text-xs font-mono font-bold bg-[#FAF8F3] hover:bg-[#8E722A] hover:text-white border border-[#0A0A0A]/12 text-[#111111] rounded-md transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Clients</span>
                </button>
                <div className="text-xs font-mono text-[#685C43]">
                  <span>Clients</span> / <span className="font-bold text-[#111111]">{currentClient.name}</span>
                </div>
              </div>

              {/* Status Indicator Pill */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#685C43]">Account Status:</span>
                <StatusBadge status={currentClient.status} />
              </div>
            </div>

            {/* Main Client Workspace Banner Header Card */}
            <AdminCard className="p-6 bg-white border-[#0A0A0A]/10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Avatar & Primary Metadata */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#111111] text-[#F7F5EF] font-mono text-xl font-bold flex items-center justify-center shrink-0 border-2 border-[#8E722A] shadow-xs">
                    {currentClient.name ? currentClient.name.charAt(0) : 'C'}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="font-display text-2xl sm:text-3xl font-normal text-[#111111]">
                        {currentClient.name}
                      </h1>
                      <span className="px-2 py-0.5 font-mono text-[10px] uppercase font-bold bg-[#FAF8F3] text-[#8E722A] border border-[#8E722A]/30 rounded-xs">
                        {currentClient.packageAssigned || 'Retainer Client'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#685C43] font-mono">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-[#8E722A]" />
                        {currentClient.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-[#8E722A]" />
                        {currentClient.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#8E722A]" />
                        {currentClient.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Primary Action Toolbar */}
                <div className="flex flex-wrap items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#0A0A0A]/08">
                  <button
                    onClick={() => handleOpenEdit(currentClient)}
                    className="px-3.5 py-2 text-xs font-mono font-bold bg-white text-[#111111] border border-[#0A0A0A]/14 hover:border-[#8E722A] rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#8E722A]" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setQuickProjectForm((prev) => ({ ...prev, title: `${currentClient.name} - New Campaign` }));
                      setIsCreateProjectOpen(true);
                    }}
                    className="px-3.5 py-2 text-xs font-mono font-bold bg-[#FAF8F3] text-[#111111] border border-[#0A0A0A]/14 hover:bg-[#8E722A] hover:text-white rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Project</span>
                  </button>

                  <button
                    onClick={() => {
                      setQuickScannerForm((prev) => ({ ...prev, placeName: `${currentClient.company} Google Reviews` }));
                      setIsDeployScannerOpen(true);
                    }}
                    className="px-3.5 py-2 text-xs font-mono font-bold bg-[#FAF8F3] text-[#111111] border border-[#0A0A0A]/14 hover:bg-[#8E722A] hover:text-white rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-600" />
                    <span>+ Scanner</span>
                  </button>

                  <button
                    onClick={() => setIsArchiveConfirmOpen(true)}
                    className="px-3.5 py-2 text-xs font-mono font-semibold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Archive</span>
                  </button>

                  <button
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-md transition-colors"
                    title="Delete Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </AdminCard>

            {/* Quick Metrics Bar (4 Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/08 space-y-1">
                <span className="text-[10px] font-mono text-[#685C43] uppercase tracking-wider block font-bold">
                  Monthly Retainer
                </span>
                <div className="font-display text-xl font-bold text-[#111111]">
                  ${currentClient.monthlyRetainer?.toLocaleString()}/mo
                </div>
                <span className="text-[11px] font-mono text-[#8E722A] block">Active Agreement</span>
              </div>

              <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/08 space-y-1">
                <span className="text-[10px] font-mono text-[#685C43] uppercase tracking-wider block font-bold">
                  Active Projects
                </span>
                <div className="font-display text-xl font-bold text-[#111111]">
                  {clientProjects.length} Active
                </div>
                <span className="text-[11px] font-mono text-emerald-700 block">
                  {clientTasks.filter((t) => t.status !== 'Completed').length} Pending Tasks
                </span>
              </div>

              <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/08 space-y-1">
                <span className="text-[10px] font-mono text-[#685C43] uppercase tracking-wider block font-bold">
                  Total Paid YTD
                </span>
                <div className="font-display text-xl font-bold text-emerald-800">
                  ${currentClient.totalPaid?.toLocaleString() || '0'}
                </div>
                <span className="text-[11px] font-mono text-[#685C43] block">
                  {clientPayments.length} Invoices Settled
                </span>
              </div>

              <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/08 space-y-1">
                <span className="text-[10px] font-mono text-[#685C43] uppercase tracking-wider block font-bold">
                  Contract Expiry
                </span>
                <div className="font-display text-base font-bold text-[#111111]">
                  {currentClient.expiryDate || '2027-03-31'}
                </div>
                <span className="text-[11px] font-mono text-[#685C43] block">
                  Started: {currentClient.startDate || '2026-04-01'}
                </span>
              </div>
            </div>

            {/* Contextual Sub-navigation Tabs Bar */}
            <div className="border-b border-[#0A0A0A]/10 bg-white px-2 rounded-xl shadow-xs">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2">
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
                    className={`px-4 py-2 text-xs font-mono font-bold uppercase whitespace-nowrap rounded-md transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-[#111111] text-[#F7F5EF] shadow-xs'
                        : 'text-[#685C43] hover:text-[#111111] hover:bg-[#FAF8F3]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Contextual Tab Content Area */}

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'Overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact & Executive Account Card */}
                  <AdminCard title="Client Account Details" className="p-5 space-y-4">
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between pb-2 border-b border-[#0A0A0A]/06">
                        <span className="font-mono text-[#685C43]">Primary Contact:</span>
                        <strong className="text-[#111111] font-semibold">{currentClient.contactName}</strong>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-[#0A0A0A]/06">
                        <span className="font-mono text-[#685C43]">Company Entity:</span>
                        <strong className="text-[#111111]">{currentClient.company}</strong>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-[#0A0A0A]/06">
                        <span className="font-mono text-[#685C43]">Email Address:</span>
                        <span className="font-mono text-[#111111]">{currentClient.email}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-[#0A0A0A]/06">
                        <span className="font-mono text-[#685C43]">Phone Number:</span>
                        <span className="font-mono text-[#111111]">{currentClient.phone}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-[#0A0A0A]/06">
                        <span className="font-mono text-[#685C43]">Account Manager:</span>
                        <span className="font-mono font-bold text-[#8E722A]">
                          {currentClient.accountManager || 'Sarah Jenkins'}
                        </span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-[#0A0A0A]/06">
                        <span className="font-mono text-[#685C43]">Official Website:</span>
                        <a
                          href={currentClient.website || 'https://asnmedia.in'}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[#8E722A] hover:underline flex items-center gap-1"
                        >
                          {currentClient.website || 'https://asnmedia.in'}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono text-[#685C43]">Contract Start Date:</span>
                        <span className="font-mono text-[#111111]">{currentClient.startDate || '2026-04-01'}</span>
                      </div>
                    </div>
                  </AdminCard>

                  {/* Retainer & Agreement Details */}
                  <AdminCard title="Agreements & Retainer Overview" className="p-5 space-y-4">
                    <div className="p-4 bg-[#FAF8F3] rounded-lg border border-[#0A0A0A]/08 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[11px] font-bold text-[#8E722A] uppercase">
                          PACKAGE TIER
                        </span>
                        <StatusBadge status={currentClient.status} />
                      </div>
                      <h4 className="font-display text-lg font-bold text-[#111111]">
                        {currentClient.packageAssigned}
                      </h4>
                      <div className="text-xs font-mono text-[#685C43]">
                        Fee: <strong className="text-[#111111]">${currentClient.monthlyRetainer?.toLocaleString()}/mo</strong>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">
                        Assigned Account Staff
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(currentClient.assignedStaff || ['Sarah Jenkins', 'Alex Rivera', 'Priya Sharma']).map((staffName, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-white border border-[#0A0A0A]/10 rounded-md font-mono text-xs text-[#111111] flex items-center gap-1.5"
                          >
                            <div className="w-2 h-2 rounded-full bg-[#8E722A]" />
                            {staffName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </AdminCard>
                </div>

                {/* Internal Agency Notes Section */}
                <AdminCard title="Internal Agency Notes & Log" className="p-5 space-y-4">
                  <form onSubmit={handleAddNoteSubmit} className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Log internal note, phone call record, or strategic memo..."
                        className="flex-1 px-3.5 py-2 text-xs bg-[#FAF8F3] border border-[#0A0A0A]/14 rounded-md focus:outline-none focus:border-[#8E722A]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-md hover:bg-[#8E722A] transition-colors"
                      >
                        Save Note
                      </button>
                    </div>
                  </form>

                  <div className="space-y-3 pt-2">
                    {currentClient.internalNotes && currentClient.internalNotes.length > 0 ? (
                      currentClient.internalNotes.map((note, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white rounded-lg border border-[#0A0A0A]/08 text-xs space-y-1"
                        >
                          <p className="text-[#111111] leading-relaxed">
                            {typeof note === 'string' ? note : note.text}
                          </p>
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#685C43]">
                            <span>Author: {note.author || 'Sarah Jenkins'}</span>
                            <span>{note.date || 'Today'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#685C43] font-mono italic">
                        No internal agency notes recorded yet for this client profile.
                      </p>
                    )}
                  </div>
                </AdminCard>
              </div>
            )}

            {/* TAB 2: PACKAGES */}
            {activeTab === 'Packages' && (
              <div className="space-y-4">
                <AdminCard title="Active Package & Retainer Agreement" className="p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/10">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">
                        CURRENT CONTRACT
                      </span>
                      <h3 className="font-display text-xl font-bold text-[#111111]">
                        {currentClient.packageAssigned}
                      </h3>
                      <p className="text-xs text-[#685C43] font-mono mt-0.5">
                        Billing Cycle: Monthly Retainer • Auto-renew enabled
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-2xl font-bold text-[#111111]">
                        ${currentClient.monthlyRetainer?.toLocaleString()}
                        <span className="text-xs font-normal text-[#685C43]">/mo</span>
                      </div>
                      <StatusBadge status={currentClient.status} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-2">
                    <div className="p-3 bg-white border border-[#0A0A0A]/08 rounded-lg">
                      <span className="text-[#685C43] block">Agreement Commencement:</span>
                      <strong className="text-[#111111]">{currentClient.startDate || '2026-04-01'}</strong>
                    </div>
                    <div className="p-3 bg-white border border-[#0A0A0A]/08 rounded-lg">
                      <span className="text-[#685C43] block">Contract Expiry Date:</span>
                      <strong className="text-[#8E722A]">{currentClient.expiryDate || '2027-03-31'}</strong>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#0A0A0A]/08 flex flex-wrap gap-3">
                    <button
                      onClick={() => showToast('Agreement extended by 12 months in system!')}
                      className="px-4 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-md hover:bg-[#8E722A] transition-colors"
                    >
                      Renew Package (12 Months)
                    </button>
                    <button
                      onClick={() => showToast('Expiry extended by 30 days.')}
                      className="px-4 py-2 text-xs font-mono font-semibold bg-[#FAF8F3] text-[#111111] border border-[#0A0A0A]/12 hover:bg-white rounded-md transition-colors"
                    >
                      Extend 30 Days
                    </button>
                  </div>
                </AdminCard>
              </div>
            )}

            {/* TAB 3: SERVICES */}
            {activeTab === 'Services' && (
              <div className="space-y-4">
                <AdminCard title="Included Discrete Services" className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'Social Media Strategy & Planning', code: 'SMS-01', sla: 'Monthly SLA' },
                      { name: 'Short-Form Video Production (Reels/TikTok)', code: 'VID-02', sla: '12 Videos/mo' },
                      { name: 'Graphic Design & Brand Assets', code: 'DES-03', sla: '20 Posts/mo' },
                      { name: 'Monthly Analytics & Performance Reporting', code: 'REP-04', sla: 'End of Month' },
                    ].map((svc, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white rounded-lg border border-[#0A0A0A]/08 space-y-2 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-mono text-[10px] font-bold text-[#8E722A]">
                            {svc.code}
                          </span>
                          <h4 className="font-bold text-xs text-[#111111]">{svc.name}</h4>
                          <span className="text-[11px] font-mono text-[#685C43]">{svc.sla}</span>
                        </div>
                        <StatusBadge status="Active" />
                      </div>
                    ))}
                  </div>
                </AdminCard>
              </div>
            )}

            {/* TAB 4: PROJECTS & TASKS */}
            {activeTab === 'Projects & Tasks' && (
              <div className="space-y-6">
                {/* Linked Projects */}
                <AdminCard
                  title={`Linked Projects (${clientProjects.length})`}
                  action={
                    <button
                      onClick={() => {
                        setQuickProjectForm((prev) => ({ ...prev, title: `${currentClient.name} - Campaign` }));
                        setIsCreateProjectOpen(true);
                      }}
                      className="px-3 py-1.5 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-md hover:bg-[#8E722A] transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Project</span>
                    </button>
                  }
                  className="p-5"
                >
                  {clientProjects.length > 0 ? (
                    <div className="space-y-3">
                      {clientProjects.map((p) => (
                        <div
                          key={p.id}
                          className="p-4 bg-white rounded-lg border border-[#0A0A0A]/08 space-y-3 hover:border-[#8E722A] transition-colors cursor-pointer"
                          onClick={() => navigate('/admin/projects')}
                        >
                          <div className="flex flex-wrap justify-between items-center gap-2">
                            <div>
                              <h4 className="font-bold text-sm text-[#111111]">{p.title}</h4>
                              <span className="text-[11px] font-mono text-[#685C43]">
                                Service: {p.serviceName || 'Social Media Management'} • Lead: {p.leadStaff}
                              </span>
                            </div>
                            <StatusBadge status={p.status} />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-mono text-[#685C43]">
                              <span>Completion Progress</span>
                              <span className="font-bold text-[#111111]">{p.progressPct}%</span>
                            </div>
                            <div className="w-full bg-[#FAF8F3] h-2 rounded-full overflow-hidden border border-[#0A0A0A]/06">
                              <div
                                className="bg-[#8E722A] h-full transition-all duration-500"
                                style={{ width: `${p.progressPct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={Kanban}
                      title="No Active Projects"
                      description="No active projects have been created for this client yet."
                      actionLabel="Create First Project"
                      onAction={() => {
                        setQuickProjectForm((prev) => ({ ...prev, title: `${currentClient.name} - Initial Campaign` }));
                        setIsCreateProjectOpen(true);
                      }}
                    />
                  )}
                </AdminCard>

                {/* Linked Tasks */}
                <AdminCard title={`Linked Tasks (${clientTasks.length})`} className="p-5">
                  {clientTasks.length > 0 ? (
                    <div className="space-y-2">
                      {clientTasks.map((t) => (
                        <div
                          key={t.id}
                          className="p-3 bg-white rounded-lg border border-[#0A0A0A]/06 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-[#111111] block">{t.title}</span>
                            <span className="text-[10px] font-mono text-[#685C43]">
                              Assignee: {t.assignee} • Priority: {t.priority} • Due: {t.dueDate}
                            </span>
                          </div>
                          <StatusBadge status={t.status} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#685C43] font-mono italic">No pending tasks for this client.</p>
                  )}
                </AdminCard>
              </div>
            )}

            {/* TAB 5: PAYMENTS */}
            {activeTab === 'Payments' && (
              <div className="space-y-4">
                <AdminCard
                  title={`Financial Invoices & Payment Ledger (${clientPayments.length})`}
                  action={
                    <button
                      onClick={() => setIsRecordPaymentOpen(true)}
                      className="px-3 py-1.5 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-md hover:bg-[#8E722A] transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Record Payment</span>
                    </button>
                  }
                  className="p-5"
                >
                  {clientPayments.length > 0 ? (
                    <div className="space-y-3">
                      {clientPayments.map((pay) => (
                        <div
                          key={pay.id}
                          className="p-3.5 bg-white rounded-lg border border-[#0A0A0A]/08 flex flex-wrap items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-[#8E722A] block">
                              {pay.invoiceNumber}
                            </span>
                            <span className="text-[11px] text-[#685C43] font-mono">
                              Date: {pay.date} • Method: {pay.method}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-sm text-[#111111] block">
                              ${pay.amount?.toLocaleString()}
                            </span>
                            <StatusBadge status={pay.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={CreditCard}
                      title="No Invoices Found"
                      description="No payment records exist for this client in the billing ledger."
                      actionLabel="Record Invoice / Payment"
                      onAction={() => setIsRecordPaymentOpen(true)}
                    />
                  )}
                </AdminCard>
              </div>
            )}

            {/* TAB 6: ENQUIRIES & FOLLOW-UPS */}
            {activeTab === 'Enquiries & Follow-ups' && (
              <div className="space-y-4">
                <AdminCard title="Original Lead Enquiry Record" className="p-5 space-y-3">
                  {clientEnquiries.length > 0 ? (
                    clientEnquiries.map((e) => (
                      <div key={e.id} className="p-4 bg-white rounded-lg border border-[#0A0A0A]/08 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#111111]">{e.serviceRequested}</span>
                          <StatusBadge status={e.status} />
                        </div>
                        <p className="text-[#685C43] italic">"{e.description}"</p>
                        <div className="text-[10px] font-mono text-[#685C43]">
                          Budget: {e.budgetTier} • Date: {e.dateSubmitted}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#685C43] font-mono italic">
                      No historical lead enquiry linked to this client profile.
                    </p>
                  )}
                </AdminCard>
              </div>
            )}

            {/* TAB 7: REVIEW SCANNERS */}
            {activeTab === 'Review Scanners' && (
              <div className="space-y-4">
                <AdminCard
                  title="Google Place Review Scanner"
                  action={
                    <button
                      onClick={() => setIsDeployScannerOpen(true)}
                      className="px-3 py-1.5 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-md hover:bg-[#8E722A] transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Deploy Scanner</span>
                    </button>
                  }
                  className="p-5"
                >
                  {clientScanner ? (
                    <div className="p-4 bg-white rounded-lg border border-[#0A0A0A]/08 space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm text-[#111111]">{clientScanner.placeName}</h4>
                        <div className="flex items-center gap-1 font-mono font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                          <span>{clientScanner.avgRating} / 5.0</span>
                        </div>
                      </div>
                      <div className="font-mono text-[#685C43]">
                        Total Reviews Scraped: <strong>{clientScanner.totalReviewsScraped} reviews</strong>
                      </div>
                      <button
                        onClick={() => navigate('/admin/scanners')}
                        className="text-xs font-mono font-bold text-[#8E722A] underline cursor-pointer"
                      >
                        View Scanner Control Panel →
                      </button>
                    </div>
                  ) : (
                    <EmptyState
                      icon={Star}
                      title="No Review Scanner Active"
                      description="No Google Place review scanner has been configured for this client."
                      actionLabel="Deploy Review Scanner"
                      onAction={() => setIsDeployScannerOpen(true)}
                    />
                  )}
                </AdminCard>
              </div>
            )}

            {/* TAB 8: ACTIVITY HISTORY */}
            {activeTab === 'Activity History' && (
              <div className="space-y-4">
                <AdminCard title="Client Activity Audit Log" className="p-5 space-y-3">
                  <div className="space-y-2">
                    {(
                      currentClient.activityHistory || [
                        { id: '1', action: 'Client Retainer Package Onboarded', timestamp: '2026-04-01', actor: 'System' },
                        { id: '2', action: 'Monthly Invoice Settled', timestamp: '2026-04-05', actor: 'Client' },
                      ]
                    ).map((act) => (
                      <div
                        key={act.id}
                        className="p-3 bg-white rounded-lg border border-[#0A0A0A]/06 text-xs flex items-center justify-between"
                      >
                        <span className="text-[#111111] font-semibold">{act.action}</span>
                        <span className="font-mono text-[10px] text-[#685C43]">
                          {act.actor} • {act.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </AdminCard>
              </div>
            )}
          </div>
        )
      ) : (
        /* ========================================================= */
        /* MODE 2: CLIENTS DIRECTORY TABLE VIEW (/admin/clients) */
        /* ========================================================= */
        isAddMode ? (
          /* Add Client Form Screen */
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
                ← Back to Clients Directory
              </button>
            </div>

            {formSubmitted ? (
              <div className="py-12 text-center space-y-3 bg-white p-6 rounded-xl border border-[#0A0A0A]/10">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <div className="font-serif text-xl font-semibold text-[#111111]">
                  Client Account Onboarded
                </div>
                <p className="text-xs font-mono text-[#685C43]">
                  Redirecting to client workspace...
                </p>
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
          /* Main Directory Table View */
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
                      showToast(`Exporting ${filteredClients.length} client directory records to CSV...`);
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
                onRowClick={(row) => navigate(`/admin/clients/${row.id}`)}
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
        )
      )}

      {/* Edit Client Modal */}
      {isEditModalOpen && (
        <AdminModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Profile: ${currentClient?.name || 'Client'}`}
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

      {/* Quick Project Creation Modal */}
      {isCreateProjectOpen && (
        <AdminModal
          isOpen={isCreateProjectOpen}
          onClose={() => setIsCreateProjectOpen(false)}
          title={`Create Project for ${currentClient?.name}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleQuickProjectSubmit} className="space-y-4">
            <FormInput
              label="Project Title"
              value={quickProjectForm.title}
              onChange={(e) => setQuickProjectForm({ ...quickProjectForm, title: e.target.value })}
              placeholder="e.g. Q4 Brand Launch Campaign"
              required
            />
            <FormSelect
              label="Primary Service"
              value={quickProjectForm.serviceName}
              onChange={(e) => setQuickProjectForm({ ...quickProjectForm, serviceName: e.target.value })}
              options={[
                'Social Media Management',
                'Video Production',
                'Content Creation Suite',
                'Brand Strategy',
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Start Date"
                type="date"
                value={quickProjectForm.startDate}
                onChange={(e) => setQuickProjectForm({ ...quickProjectForm, startDate: e.target.value })}
                required
              />
              <FormInput
                label="Due Date"
                type="date"
                value={quickProjectForm.dueDate}
                onChange={(e) => setQuickProjectForm({ ...quickProjectForm, dueDate: e.target.value })}
                required
              />
            </div>
            <FormSelect
              label="Lead Staff Assignee"
              value={quickProjectForm.leadStaff}
              onChange={(e) => setQuickProjectForm({ ...quickProjectForm, leadStaff: e.target.value })}
              options={['Sarah Jenkins', 'Alex Rivera', 'Priya Sharma', 'David Kim']}
            />
            <div className="pt-3 flex justify-end gap-2 border-t border-[#0A0A0A]/10">
              <button
                type="button"
                onClick={() => setIsCreateProjectOpen(false)}
                className="px-4 py-2 text-xs font-mono text-[#685C43]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-md hover:bg-[#8E722A]"
              >
                Create Project
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {/* Quick Deploy Review Scanner Modal */}
      {isDeployScannerOpen && (
        <AdminModal
          isOpen={isDeployScannerOpen}
          onClose={() => setIsDeployScannerOpen(false)}
          title={`Deploy Review Scanner for ${currentClient?.name}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleQuickScannerSubmit} className="space-y-4">
            <FormInput
              label="Google Place Name"
              value={quickScannerForm.placeName}
              onChange={(e) => setQuickScannerForm({ ...quickScannerForm, placeName: e.target.value })}
              required
            />
            <FormInput
              label="Google Review Target URL"
              type="url"
              value={quickScannerForm.googleReviewUrl}
              onChange={(e) => setQuickScannerForm({ ...quickScannerForm, googleReviewUrl: e.target.value })}
              required
            />
            <FormInput
              label="Business Address / Location"
              value={quickScannerForm.address}
              onChange={(e) => setQuickScannerForm({ ...quickScannerForm, address: e.target.value })}
              required
            />
            <div className="pt-3 flex justify-end gap-2 border-t border-[#0A0A0A]/10">
              <button
                type="button"
                onClick={() => setIsDeployScannerOpen(false)}
                className="px-4 py-2 text-xs font-mono text-[#685C43]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-md hover:bg-[#8E722A]"
              >
                Deploy Scanner
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {/* Quick Record Payment Modal */}
      {isRecordPaymentOpen && (
        <AdminModal
          isOpen={isRecordPaymentOpen}
          onClose={() => setIsRecordPaymentOpen(false)}
          title={`Record Payment for ${currentClient?.name}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleQuickPaymentSubmit} className="space-y-4">
            <FormInput
              label="Invoice Number"
              value={quickPaymentForm.invoiceNumber}
              onChange={(e) => setQuickPaymentForm({ ...quickPaymentForm, invoiceNumber: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Invoice Amount ($ USD)"
                type="number"
                value={quickPaymentForm.amount}
                onChange={(e) => setQuickPaymentForm({ ...quickPaymentForm, amount: e.target.value })}
                required
              />
              <FormSelect
                label="Payment Status"
                value={quickPaymentForm.status}
                onChange={(e) => setQuickPaymentForm({ ...quickPaymentForm, status: e.target.value })}
                options={['Paid', 'Pending', 'Overdue']}
              />
            </div>
            <FormSelect
              label="Payment Method"
              value={quickPaymentForm.method}
              onChange={(e) => setQuickPaymentForm({ ...quickPaymentForm, method: e.target.value })}
              options={['Bank Transfer', 'Credit Card', 'UPI', 'PayPal', 'Check']}
            />
            <div className="pt-3 flex justify-end gap-2 border-t border-[#0A0A0A]/10">
              <button
                type="button"
                onClick={() => setIsRecordPaymentOpen(false)}
                className="px-4 py-2 text-xs font-mono text-[#685C43]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-md hover:bg-[#8E722A]"
              >
                Save Payment Record
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
        message={`Are you sure you want to archive ${currentClient?.name}? The client status will be updated to Archived.`}
        confirmText="Archive Client"
        isDanger={false}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Permanently Delete Client"
        message={`Warning: Are you sure you want to delete ${currentClient?.name}? All client records, projects, and invoices will be permanently removed.`}
        confirmText="Delete Account"
        isDanger={true}
      />
    </div>
  );
};
