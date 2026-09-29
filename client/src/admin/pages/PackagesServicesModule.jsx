import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { AdminCard } from '../components/ui/AdminCard';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Pagination } from '../components/ui/Pagination';
import { SlideDrawer } from '../components/ui/SlideDrawer';
import { FormInput } from '../components/ui/FormInput';
import { FormSelect } from '../components/ui/FormSelect';
import { FormToggle } from '../components/ui/FormToggle';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { KpiCard } from '../components/ui/KpiCard';
import { ModuleSkeleton } from '../components/ui/LoadingSkeleton';
import {
  Package, CheckCircle2, Users, Layers, Tag, Plus, Edit, Trash2, Clock, Eye, AlertCircle, ArrowLeft, Save
} from 'lucide-react';

export const PackagesServicesModule = () => {
  const { packages, services, clients, addPackage, updatePackage, deletePackage, addService, updateService, deleteService } = useAdminData();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const isServicesMode = location.pathname.includes('/services');
  const isAssignmentsMode = location.pathname.endsWith('/assignments');

  // Dedicated Form View Detection (Food College Pattern)
  const isCreatePkgView = location.pathname.endsWith('/packages/create');
  const isEditPkgView = location.pathname.includes('/packages/edit/');
  const isCreateSvcView = location.pathname.endsWith('/services/create');
  const isEditSvcView = location.pathname.includes('/services/edit/');

  // Active Selection & Drawer State
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Local Form View States
  const [isPkgFormOpen, setIsPkgFormOpen] = useState(false);
  const [isSvcFormOpen, setIsSvcFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Package Form State
  const [pkgForm, setPkgForm] = useState({
    name: '',
    type: 'Monthly Retainer',
    monthlyFee: '4500',
    deliverablesCount: '12',
    description: '',
    status: 'Active',
    publicVisibility: true,
  });

  // Service Form State
  const [svcForm, setSvcForm] = useState({
    name: '',
    code: '',
    category: 'Digital Media',
    turnaroundTime: '5 business days',
    description: '',
    internalInstructions: '',
    status: 'Active',
  });

  useEffect(() => {
    setCurrentPage(1);

    // Sync form state if route has edit ID
    if (isEditPkgView && id) {
      const pkg = packages.find((p) => String(p.id) === String(id));
      if (pkg) handleOpenEditPkg(pkg);
    }
    if (isEditSvcView && id) {
      const svc = services.find((s) => String(s.id) === String(id));
      if (svc) handleOpenEditSvc(svc);
    }
  }, [location.pathname, id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Sliced data based on active mode
  const activeDataList = isServicesMode ? services : isAssignmentsMode ? clients : packages;
  const totalPages = Math.ceil(activeDataList.length / pageSize) || 1;
  const paginatedData = activeDataList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handlers for Package CRUD
  const handleOpenCreatePkg = () => {
    setIsEditMode(false);
    setPkgForm({
      name: '',
      type: 'Monthly Retainer',
      monthlyFee: '4500',
      deliverablesCount: '12',
      description: '',
      status: 'Active',
      publicVisibility: true,
    });
    setIsPkgFormOpen(true);
  };

  const handleOpenEditPkg = (pkg) => {
    setSelectedItem(pkg);
    setIsEditMode(true);
    setPkgForm({
      name: pkg.name || '',
      type: pkg.type || 'Monthly Retainer',
      monthlyFee: String(pkg.monthlyFee || 4500),
      deliverablesCount: String(pkg.deliverablesCount || 10),
      description: pkg.description || '',
      status: pkg.status || 'Active',
      publicVisibility: pkg.publicVisibility !== false,
    });
    setIsPkgFormOpen(true);
  };

  const handlePkgSubmit = (e) => {
    e.preventDefault();
    if (isEditMode && selectedItem) {
      updatePackage(selectedItem.id, pkgForm);
      showToast(`Package updated: ${pkgForm.name}`);
    } else {
      addPackage(pkgForm);
      showToast(`New package created: ${pkgForm.name}`);
    }
    setIsPkgFormOpen(false);
    navigate('/admin/packages');
  };

  // Handlers for Service CRUD
  const handleOpenCreateSvc = () => {
    setIsEditMode(false);
    setSvcForm({
      name: '',
      code: '',
      category: 'Digital Media',
      turnaroundTime: '5 business days',
      description: '',
      internalInstructions: '',
      status: 'Active',
    });
    setIsSvcFormOpen(true);
  };

  const handleOpenEditSvc = (svc) => {
    setSelectedItem(svc);
    setIsEditMode(true);
    setSvcForm({
      name: svc.name || '',
      code: svc.code || '',
      category: svc.category || 'Digital Media',
      turnaroundTime: svc.turnaroundTime || '5 business days',
      description: svc.description || '',
      internalInstructions: svc.internalInstructions || '',
      status: svc.status || 'Active',
    });
    setIsSvcFormOpen(true);
  };

  const handleSvcSubmit = (e) => {
    e.preventDefault();
    if (isEditMode && selectedItem) {
      updateService(selectedItem.id, svcForm);
      showToast(`Service updated: ${svcForm.name}`);
    } else {
      addService(svcForm);
      showToast(`New service created: ${svcForm.name}`);
    }
    setIsSvcFormOpen(false);
    navigate('/admin/services');
  };

  // Handlers for Delete
  const handleConfirmDelete = () => {
    if (!selectedItem) return;
    if (isServicesMode) {
      deleteService(selectedItem.id);
      showToast(`Service ${selectedItem.name} removed`);
    } else {
      deletePackage(selectedItem.id);
      showToast(`Package ${selectedItem.name} removed`);
    }
    setIsDrawerOpen(false);
    setIsDeleteConfirmOpen(false);
  };

  // Table Columns Definitions
  const packageColumns = [
    {
      header: 'PACKAGE NAME',
      key: 'name',
      render: (row) => (
        <div>
          <span className="font-bold text-[#111111] block font-body">{row.name}</span>
          <span className="text-[11px] text-[#685C43]">{row.type}</span>
        </div>
      ),
    },
    {
      header: 'MONTHLY FEE',
      key: 'monthlyFee',
      render: (row) => <span className="font-mono font-bold text-[#111111] text-xs">${row.monthlyFee?.toLocaleString()}/mo</span>,
    },
    {
      header: 'DELIVERABLES',
      key: 'deliverablesCount',
      render: (row) => <span className="font-mono text-xs font-semibold text-[#8E722A]">{row.deliverablesCount} items/mo</span>,
    },
    {
      header: 'PUBLIC VISIBILITY',
      key: 'publicVisibility',
      render: (row) => (
        <span className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded-xs ${row.publicVisibility !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600'}`}>
          {row.publicVisibility !== false ? 'Public Catalog' : 'Internal Only'}
        </span>
      ),
    },
    {
      header: 'STATUS',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'ACTIONS',
      key: 'action',
      render: (row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleOpenEditPkg(row)}
            className="p-1 text-[#685C43] hover:text-[#111111]"
            title="Edit Package"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const serviceColumns = [
    {
      header: 'SERVICE NAME & CODE',
      key: 'name',
      render: (row) => (
        <div>
          <span className="font-bold text-[#111111] block font-body">{row.name}</span>
          <span className="text-[11px] font-mono text-[#8E722A]">Code: {row.code}</span>
        </div>
      ),
    },
    {
      header: 'CATEGORY',
      key: 'category',
      render: (row) => <span className="font-mono text-xs text-[#685C43]">{row.category}</span>,
    },
    {
      header: 'TURNAROUND SLA',
      key: 'turnaroundTime',
      render: (row) => <span className="font-mono text-xs font-semibold text-[#111111]">{row.turnaroundTime}</span>,
    },
    {
      header: 'STATUS',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'ACTIONS',
      key: 'action',
      render: (row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleOpenEditSvc(row)}
            className="p-1 text-[#685C43] hover:text-[#111111]"
            title="Edit Service"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const assignmentColumns = [
    {
      header: 'CLIENT NAME',
      key: 'name',
      render: (row) => <span className="font-bold text-[#111111]">{row.name}</span>,
    },
    {
      header: 'COMPANY ENTITY',
      key: 'company',
      render: (row) => <span className="text-xs text-[#685C43] font-mono">{row.company}</span>,
    },
    {
      header: 'ASSIGNED RETAINER',
      key: 'packageAssigned',
      render: (row) => <span className="font-mono text-xs font-bold text-[#8E722A]">{row.packageAssigned}</span>,
    },
    {
      header: 'FEE',
      key: 'monthlyRetainer',
      render: (row) => <span className="font-mono font-bold text-[#111111]">${row.monthlyRetainer?.toLocaleString()}/mo</span>,
    },
    {
      header: 'STATUS',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const showPkgFormPage = isPkgFormOpen || isCreatePkgView || isEditPkgView;
  const showSvcFormPage = isSvcFormOpen || isCreateSvcView || isEditSvcView;

  return (
    <div className="w-full space-y-6 font-body">
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-md flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FOOD COLLEGE-STYLE FULL-WORKSPACE FORM VIEW: PACKAGE CREATE / EDIT */}
      {/* ========================================================================= */}
      {showPkgFormPage ? (
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#0A0A0A]/08">
            <div>
              <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
                PACKAGE CONFIGURATION WORKSPACE
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-normal text-[#111111]">
                {isEditMode ? `Edit Package Tier: ${selectedItem?.name}` : 'Create New Retainer Package'}
              </h1>
            </div>
            <button
              onClick={() => {
                setIsPkgFormOpen(false);
                navigate('/admin/packages');
              }}
              className="px-3.5 py-1.5 text-xs font-mono font-bold bg-[#FAF8F3] hover:bg-[#8E722A] hover:text-white border border-[#0A0A0A]/12 text-[#111111] rounded-md transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Packages Catalog</span>
            </button>
          </div>

          <form onSubmit={handlePkgSubmit} className="space-y-6">
            {/* Section 01: Identity & Classification */}
            <AdminCard title="01. Package Identity & Classification" className="p-6 space-y-4">
              <FormInput
                label="Package Title *"
                value={pkgForm.name}
                onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })}
                placeholder="e.g. Social Media Retainer (Tier A)"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Package Contract Type *"
                  value={pkgForm.type}
                  onChange={(e) => setPkgForm({ ...pkgForm, type: e.target.value })}
                  options={['Monthly Retainer', 'Fixed Project', 'Monthly Add-on']}
                />
                <FormSelect
                  label="Package Status *"
                  value={pkgForm.status}
                  onChange={(e) => setPkgForm({ ...pkgForm, status: e.target.value })}
                  options={['Active', 'Draft', 'Archived']}
                />
              </div>
            </AdminCard>

            {/* Section 02: Financial Terms & Deliverable Scope */}
            <AdminCard title="02. Financial Terms & Deliverable Scope" className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Monthly Retainer Fee ($ USD) *"
                  type="number"
                  value={pkgForm.monthlyFee}
                  onChange={(e) => setPkgForm({ ...pkgForm, monthlyFee: e.target.value })}
                  required
                />
                <FormInput
                  label="Monthly Included Deliverables Count *"
                  type="number"
                  value={pkgForm.deliverablesCount}
                  onChange={(e) => setPkgForm({ ...pkgForm, deliverablesCount: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#111111] mb-1">
                  Deliverable Scope & SLA Terms *
                </label>
                <textarea
                  rows={4}
                  value={pkgForm.description}
                  onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })}
                  placeholder="Detail included deliverables, video counts, posts, consultation terms..."
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F3] border border-[#0A0A0A]/14 rounded-md focus:outline-none focus:border-[#8E722A] font-body"
                  required
                />
              </div>

              <FormToggle
                label="Show in Public Agency Catalogue"
                checked={pkgForm.publicVisibility}
                onChange={(val) => setPkgForm({ ...pkgForm, publicVisibility: val })}
              />
            </AdminCard>

            {/* Form Workspace Action Footer */}
            <div className="pt-4 border-t border-[#0A0A0A]/08 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsPkgFormOpen(false);
                  navigate('/admin/packages');
                }}
                className="px-4 py-2 text-xs font-mono text-[#685C43] hover:text-[#111111]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-md hover:bg-[#8E722A] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5 text-[#C8A13A]" />
                <span>{isEditMode ? 'Save Package Changes' : 'Publish Package Tier'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : showSvcFormPage ? (
        /* ========================================================================= */
        /* FOOD COLLEGE-STYLE FULL-WORKSPACE FORM VIEW: SERVICE CREATE / EDIT */
        /* ========================================================================= */
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#0A0A0A]/08">
            <div>
              <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
                SERVICE CAPABILITY WORKSPACE
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-normal text-[#111111]">
                {isEditMode ? `Edit Service Capability: ${selectedItem?.name}` : 'Register New Discrete Service'}
              </h1>
            </div>
            <button
              onClick={() => {
                setIsSvcFormOpen(false);
                navigate('/admin/services');
              }}
              className="px-3.5 py-1.5 text-xs font-mono font-bold bg-[#FAF8F3] hover:bg-[#8E722A] hover:text-white border border-[#0A0A0A]/12 text-[#111111] rounded-md transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Services Catalogue</span>
            </button>
          </div>

          <form onSubmit={handleSvcSubmit} className="space-y-6">
            {/* Section 01: Service Identity & Code */}
            <AdminCard title="01. Service Identity & Categorization" className="p-6 space-y-4">
              <FormInput
                label="Service Title *"
                value={svcForm.name}
                onChange={(e) => setSvcForm({ ...svcForm, name: e.target.value })}
                placeholder="e.g. Short-Form Video Production"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Internal Service Code *"
                  value={svcForm.code}
                  onChange={(e) => setSvcForm({ ...svcForm, code: e.target.value })}
                  placeholder="e.g. VID-02"
                  required
                />
                <FormSelect
                  label="Service Category *"
                  value={svcForm.category}
                  onChange={(e) => setSvcForm({ ...svcForm, category: e.target.value })}
                  options={['Digital Media', 'Content Creation', 'Film Production', 'Brand Strategy', 'Reputation']}
                />
              </div>
            </AdminCard>

            {/* Section 02: Delivery SLA & Scope */}
            <AdminCard title="02. Delivery SLA & Production Scope" className="p-6 space-y-4">
              <FormInput
                label="Turnaround SLA Time *"
                value={svcForm.turnaroundTime}
                onChange={(e) => setSvcForm({ ...svcForm, turnaroundTime: e.target.value })}
                placeholder="e.g. 5 business days"
                required
              />

              <div>
                <label className="block text-xs font-mono font-bold text-[#111111] mb-1">
                  Service Description *
                </label>
                <textarea
                  rows={3}
                  value={svcForm.description}
                  onChange={(e) => setSvcForm({ ...svcForm, description: e.target.value })}
                  placeholder="Describe scope of work and capability details..."
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F3] border border-[#0A0A0A]/14 rounded-md focus:outline-none focus:border-[#8E722A] font-body"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#111111] mb-1">
                  Internal Team SLA Instructions
                </label>
                <textarea
                  rows={3}
                  value={svcForm.internalInstructions}
                  onChange={(e) => setSvcForm({ ...svcForm, internalInstructions: e.target.value })}
                  placeholder="Internal instructions for production team..."
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F3] border border-[#0A0A0A]/14 rounded-md focus:outline-none focus:border-[#8E722A] font-body"
                />
              </div>
            </AdminCard>

            {/* Form Workspace Action Footer */}
            <div className="pt-4 border-t border-[#0A0A0A]/08 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsSvcFormOpen(false);
                  navigate('/admin/services');
                }}
                className="px-4 py-2 text-xs font-mono text-[#685C43] hover:text-[#111111]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-md hover:bg-[#8E722A] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5 text-[#C8A13A]" />
                <span>{isEditMode ? 'Save Service Changes' : 'Register Service Capability'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ========================================================================= */
        /* DEFAULT LIST VIEW FOR PACKAGES / SERVICES / ASSIGNMENTS */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Quick Stats Summary Grid (4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="RETAINER PACKAGES"
              value={packages.length}
              trend={4}
              trendLabel="active package tiers"
              icon={Package}
              accentColor="gold"
            />
            <KpiCard
              label="DISCRETE SERVICES"
              value={services.filter((s) => s.status === 'Active').length}
              trend={6}
              trendLabel="active service items"
              icon={Layers}
              accentColor="emerald"
            />
            <KpiCard
              label="SUBSCRIBED CLIENTS"
              value={clients.filter((c) => c.status === 'Active').length}
              trend={12}
              trendLabel="active subscribers"
              icon={Users}
              accentColor="emerald"
            />
            <KpiCard
              label="PUBLIC VISIBILITY"
              value={packages.filter((p) => p.publicVisibility !== false).length}
              trend={0}
              trendLabel="catalog items visible"
              icon={Eye}
              accentColor="amber"
            />
          </div>

          {isServicesMode ? (
            /* View: Services List */
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#0A0A0A]/08">
                <div>
                  <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
                    SERVICE CATALOGUE
                  </span>
                  <h2 className="font-display text-2xl font-normal text-[#111111]">
                    Discrete Service Capabilities
                  </h2>
                </div>
                <button
                  onClick={handleOpenCreateSvc}
                  className="px-3.5 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Service</span>
                </button>
              </div>

              <AdminCard noPadding>
                <DataTable columns={serviceColumns} data={paginatedData} onRowClick={(row) => { setSelectedItem(row); setIsDrawerOpen(true); }} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={services.length}
                  itemsPerPage={pageSize}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setPageSize}
                />
              </AdminCard>
            </div>
          ) : isAssignmentsMode ? (
            /* View: Client Assignments Matrix */
            <div className="space-y-4">
              <div className="pb-3 border-b border-[#0A0A0A]/08">
                <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
                  CONTRACT MATRIX
                </span>
                <h2 className="font-display text-2xl font-normal text-[#111111]">
                  Active Client Package Assignments
                </h2>
              </div>
              <AdminCard noPadding>
                <DataTable columns={assignmentColumns} data={paginatedData} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={clients.length}
                  itemsPerPage={pageSize}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setPageSize}
                />
              </AdminCard>
            </div>
          ) : (
            /* View: Packages List */
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#0A0A0A]/08">
                <div>
                  <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
                    RETAINER CATALOGUE
                  </span>
                  <h2 className="font-display text-2xl font-normal text-[#111111]">
                    Agency Retainer Packages
                  </h2>
                </div>
                <button
                  onClick={handleOpenCreatePkg}
                  className="px-3.5 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Package</span>
                </button>
              </div>

              <AdminCard noPadding>
                <DataTable columns={packageColumns} data={paginatedData} onRowClick={(row) => { setSelectedItem(row); setIsDrawerOpen(true); }} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={packages.length}
                  itemsPerPage={pageSize}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setPageSize}
                />
              </AdminCard>
            </div>
          )}
        </div>
      )}

      {/* Detail Slide Drawer */}
      <SlideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedItem?.name || 'Item Details'}
        subtitle={isServicesMode ? `Code: ${selectedItem?.code}` : selectedItem?.type}
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/08 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase">
                  {isServicesMode ? 'SERVICE CODE' : 'MONTHLY FEE'}
                </span>
                <StatusBadge status={selectedItem.status} />
              </div>
              <div className="font-display text-xl font-bold text-[#111111]">
                {isServicesMode ? selectedItem.code : `$${selectedItem.monthlyFee?.toLocaleString()}/mo`}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">DESCRIPTION</span>
              <p className="text-[#111111] leading-relaxed">{selectedItem.description}</p>
            </div>

            {isServicesMode ? (
              <div className="space-y-2 text-xs font-mono">
                <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">SLA TURNAROUND</span>
                <div className="p-3 bg-white border border-[#0A0A0A]/08 rounded-lg">{selectedItem.turnaroundTime}</div>
              </div>
            ) : (
              <div className="space-y-2 text-xs font-mono">
                <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">INCLUDED DELIVERABLES COUNT</span>
                <div className="p-3 bg-white border border-[#0A0A0A]/08 rounded-lg">{selectedItem.deliverablesCount} items per month</div>
              </div>
            )}

            <div className="pt-4 border-t border-[#0A0A0A]/08 flex justify-between">
              <button
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="px-3 py-1.5 text-xs font-mono text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  if (isServicesMode) handleOpenEditSvc(selectedItem);
                  else handleOpenEditPkg(selectedItem);
                }}
                className="px-4 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-md hover:bg-[#8E722A]"
              >
                Edit Item
              </button>
            </div>
          </div>
        )}
      </SlideDrawer>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={isServicesMode ? 'Delete Service Capability' : 'Delete Package Tier'}
        message={`Are you sure you want to delete ${selectedItem?.name}? This action cannot be undone.`}
        confirmText="Delete Permanently"
        isDanger={true}
      />
    </div>
  );
};
