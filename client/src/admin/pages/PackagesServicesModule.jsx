import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { AdminCard } from '../components/ui/AdminCard';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Pagination } from '../components/ui/Pagination';
import { SlideDrawer } from '../components/ui/SlideDrawer';
import { AdminModal } from '../components/ui/AdminModal';
import { FormInput } from '../components/ui/FormInput';
import { FormSelect } from '../components/ui/FormSelect';
import { FormToggle } from '../components/ui/FormToggle';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { KpiCard } from '../components/ui/KpiCard';
import { ModuleSkeleton } from '../components/ui/LoadingSkeleton';
import { Package, CheckCircle2, Users, Layers, Tag, Plus, Edit, Trash2, Clock, Eye, AlertCircle } from 'lucide-react';

export const PackagesServicesModule = () => {
  const { packages, services, clients, addPackage, updatePackage, deletePackage, addService, updateService, deleteService } = useAdminData();
  const location = useLocation();

  const isServicesMode = location.pathname.endsWith('/services');
  const isAssignmentsMode = location.pathname.endsWith('/assignments');

  // Active Selection & Drawer State
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Modal States
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);
  const [isSvcModalOpen, setIsSvcModalOpen] = useState(false);
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
  }, [location.pathname]);

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
    setIsPkgModalOpen(true);
  };

  const handleOpenEditPkg = (pkg) => {
    setSelectedItem(pkg);
    setIsEditMode(true);
    setPkgForm({
      name: pkg.name,
      type: pkg.type || 'Monthly Retainer',
      monthlyFee: String(pkg.monthlyFee || 4500),
      deliverablesCount: String(pkg.deliverablesCount || 10),
      description: pkg.description || '',
      status: pkg.status || 'Active',
      publicVisibility: pkg.publicVisibility !== false,
    });
    setIsPkgModalOpen(true);
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
    setIsPkgModalOpen(false);
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
    setIsSvcModalOpen(true);
  };

  const handleOpenEditSvc = (svc) => {
    setSelectedItem(svc);
    setIsEditMode(true);
    setSvcForm({
      name: svc.name,
      code: svc.code || '',
      category: svc.category || 'Digital Media',
      turnaroundTime: svc.turnaroundTime || '5 business days',
      description: svc.description || '',
      internalInstructions: svc.internalInstructions || '',
      status: svc.status || 'Active',
    });
    setIsSvcModalOpen(true);
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
    setIsSvcModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    if (isServicesMode) {
      deleteService(selectedItem.id);
      showToast(`Service deleted: ${selectedItem.name}`);
    } else {
      deletePackage(selectedItem.id);
      showToast(`Package deleted: ${selectedItem.name}`);
    }
    setIsDrawerOpen(false);
    setIsDeleteConfirmOpen(false);
  };

  // Columns for Services table
  const serviceColumns = [
    {
      header: 'SERVICE NAME',
      key: 'name',
      render: (row) => (
        <div>
          <span className="font-bold text-[#111111] text-xs font-body block">{row.name}</span>
          <span className="text-[10px] text-[#685C43] font-mono">{row.category || 'Digital Media'}</span>
        </div>
      ),
    },
    {
      header: 'SERVICE CODE',
      key: 'code',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-[#8E722A] bg-[#FAF8F3] px-2.5 py-0.5 rounded-full border border-[#0A0A0A]/08">
          {row.code}
        </span>
      ),
    },
    {
      header: 'TURNAROUND',
      key: 'turnaroundTime',
      render: (row) => <span className="font-mono text-[11px] text-[#685C43]">{row.turnaroundTime || '5 days'}</span>,
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
            onClick={() => {
              setSelectedItem(row);
              setIsDrawerOpen(true);
            }}
            className="text-xs font-mono font-bold text-[#8E722A] hover:text-[#111111] uppercase underline"
          >
            Inspect →
          </button>
          <button
            onClick={() => handleOpenEditSvc(row)}
            className="p-1 text-[#685C43] hover:text-[#111111]"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // Columns for Assignments table
  const assignmentColumns = [
    {
      header: 'CLIENT & PORTFOLIO',
      key: 'name',
      render: (row) => (
        <div>
          <span className="font-bold text-[#111111] block font-body">{row.name}</span>
          <span className="text-[11px] text-[#685C43]">{row.company}</span>
        </div>
      ),
    },
    {
      header: 'ASSIGNED RETAINER PACKAGE',
      key: 'packageAssigned',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-[#8E722A]">{row.packageAssigned}</span>
      ),
    },
    {
      header: 'MONTHLY FEE',
      key: 'monthlyRetainer',
      render: (row) => (
        <span className="font-mono font-bold text-[#111111]">${row.monthlyRetainer?.toLocaleString()}/mo</span>
      ),
    },
    {
      header: 'STATUS',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-6 font-body">
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quick Stats Summary Grid (4 Cards - Stage 4) */}
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
        /* View: Packages Grid */
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#0A0A0A]/08">
            <div>
              <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
                PACKAGE SUITE
              </span>
              <h2 className="font-display text-2xl font-normal text-[#111111]">
                Retainer & Fixed Production Packages
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {paginatedData.map((pkg) => (
              <AdminCard key={pkg.id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-[#8E722A] font-bold uppercase block">{pkg.type}</span>
                      <h3 className="font-display text-xl font-normal text-[#111111]">{pkg.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-2xl font-bold text-[#111111]">
                        ${pkg.monthlyFee?.toLocaleString()}<span className="text-xs font-mono font-normal text-[#685C43]">/mo</span>
                      </span>
                      <button
                        onClick={() => handleOpenEditPkg(pkg)}
                        className="p-1 text-[#685C43] hover:text-[#111111]"
                        title="Edit Package"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#685C43] leading-relaxed">{pkg.description}</p>

                  <div className="pt-3 border-t border-[#0A0A0A]/06 flex items-center justify-between text-xs font-mono text-[#685C43]">
                    <span className="flex items-center gap-1.5 text-[#111111] font-bold">
                      <CheckCircle2 className="w-4 h-4 text-[#8E722A]" />
                      <span>{pkg.deliverablesCount} Deliverables included</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#8E722A]" />
                      <span>{pkg.activeSubscribers} Subscribers</span>
                    </span>
                  </div>
                </div>
              </AdminCard>
            ))}
          </div>

          <AdminCard noPadding>
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

      {/* Package / Service Inspection Drawer */}
      <SlideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedItem ? selectedItem.name : 'Catalogue Item Inspection'}
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/06 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#685C43] uppercase block">Item Designation</span>
                <span className="font-mono text-xs font-bold text-[#8E722A]">{selectedItem.type || selectedItem.code || 'Standard'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#685C43] uppercase block">Status</span>
                <StatusBadge status={selectedItem.status || 'Active'} />
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase tracking-wider block">DESCRIPTION & SCOPE</span>
              <p className="text-xs text-[#221C11] font-body bg-white p-3 rounded-lg border border-[#0A0A0A]/08 leading-relaxed">
                {selectedItem.description || 'No description entered.'}
              </p>
            </div>

            {isServicesMode ? (
              <div className="space-y-3">
                <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase tracking-wider block">INTERNAL INSTRUCTIONS & TURNAROUND</span>
                <div className="p-3 bg-white rounded-lg border border-[#0A0A0A]/08 text-xs space-y-2">
                  <div>Turnaround Time: <strong className="text-[#111111]">{selectedItem.turnaroundTime || '5 days'}</strong></div>
                  <div>Instructions: <span className="text-[#685C43] italic">{selectedItem.internalInstructions || 'Standard production protocol.'}</span></div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase tracking-wider block">SUBSCRIBED CLIENTS</span>
                <div className="p-3 bg-white rounded-lg border border-[#0A0A0A]/08 text-xs">
                  Active Subscribers: <strong className="text-[#111111]">{selectedItem.activeSubscribers || 0} Clients</strong>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[#0A0A0A]/06 flex justify-between items-center">
              <button
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="px-3 py-1.5 text-xs font-mono text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 text-xs font-mono bg-[#111111] text-[#F7F5EF] rounded-lg"
              >
                Close Inspection
              </button>
            </div>
          </div>
        )}
      </SlideDrawer>

      {/* Create / Edit Package Modal */}
      {isPkgModalOpen && (
        <AdminModal
          isOpen={isPkgModalOpen}
          onClose={() => setIsPkgModalOpen(false)}
          title={isEditMode ? `Edit Package: ${selectedItem?.name}` : 'Create New Package Suite'}
          maxWidth="max-w-md"
        >
          <form onSubmit={handlePkgSubmit} className="space-y-4">
            <FormInput
              label="Package Name"
              value={pkgForm.name}
              onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })}
              placeholder="e.g. Social Media Retainer (Tier A)"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <FormSelect
                label="Package Type"
                value={pkgForm.type}
                onChange={(e) => setPkgForm({ ...pkgForm, type: e.target.value })}
                options={['Monthly Retainer', 'Fixed Project', 'Monthly Add-on']}
              />
              <FormInput
                label="Monthly Fee ($ USD)"
                type="number"
                value={pkgForm.monthlyFee}
                onChange={(e) => setPkgForm({ ...pkgForm, monthlyFee: e.target.value })}
                required
              />
            </div>

            <FormInput
              label="Deliverables Count"
              type="number"
              value={pkgForm.deliverablesCount}
              onChange={(e) => setPkgForm({ ...pkgForm, deliverablesCount: e.target.value })}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0A0A0A]">
                Description & Deliverable Scope <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={3}
                value={pkgForm.description}
                onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })}
                placeholder="Enter scope details, deliverables list, and platform terms..."
                required
                className="px-3 py-2 bg-[#F7F5EF]/50 text-xs font-body text-[#0A0A0A] rounded-sm border border-[#0A0A0A]/14 focus:outline-none focus:border-[#C8A13A]"
              />
            </div>

            <FormToggle
              label="Public Visibility in Agency Catalogue"
              checked={pkgForm.publicVisibility}
              onChange={(val) => setPkgForm({ ...pkgForm, publicVisibility: val })}
            />

            <div className="pt-3 flex justify-end gap-2 border-t border-[#0A0A0A]/10">
              <button
                type="button"
                onClick={() => setIsPkgModalOpen(false)}
                className="px-4 py-2 text-xs font-mono text-[#685C43]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-md hover:bg-[#8E722A]"
              >
                {isEditMode ? 'Save Package Changes' : 'Publish Package'}
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {/* Create / Edit Service Modal */}
      {isSvcModalOpen && (
        <AdminModal
          isOpen={isSvcModalOpen}
          onClose={() => setIsSvcModalOpen(false)}
          title={isEditMode ? `Edit Service: ${selectedItem?.name}` : 'Register New Service Capability'}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSvcSubmit} className="space-y-4">
            <FormInput
              label="Service Name"
              value={svcForm.name}
              onChange={(e) => setSvcForm({ ...svcForm, name: e.target.value })}
              placeholder="e.g. Video Production"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Service Code"
                value={svcForm.code}
                onChange={(e) => setSvcForm({ ...svcForm, code: e.target.value })}
                placeholder="e.g. VP"
                required
              />
              <FormSelect
                label="Category"
                value={svcForm.category}
                onChange={(e) => setSvcForm({ ...svcForm, category: e.target.value })}
                options={['Digital Media', 'Content Creation', 'Film Production', 'Brand Strategy', 'Reputation']}
              />
            </div>

            <FormInput
              label="Standard Turnaround Time"
              value={svcForm.turnaroundTime}
              onChange={(e) => setSvcForm({ ...svcForm, turnaroundTime: e.target.value })}
              placeholder="e.g. 5 business days"
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0A0A0A]">
                Service Description <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={3}
                value={svcForm.description}
                onChange={(e) => setSvcForm({ ...svcForm, description: e.target.value })}
                placeholder="Enter capability description..."
                required
                className="px-3 py-2 bg-[#F7F5EF]/50 text-xs font-body text-[#0A0A0A] rounded-sm border border-[#0A0A0A]/14 focus:outline-none focus:border-[#C8A13A]"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-[#0A0A0A]/10">
              <button
                type="button"
                onClick={() => setIsSvcModalOpen(false)}
                className="px-4 py-2 text-xs font-mono text-[#685C43]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-mono font-bold bg-[#8E722A] text-white rounded-md hover:bg-[#725B20]"
              >
                {isEditMode ? 'Save Service Changes' : 'Create Service'}
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${isServicesMode ? 'Service' : 'Package'}`}
        message={`Are you sure you want to delete ${selectedItem?.name}? This action cannot be undone.`}
        confirmText="Delete Record"
        isDanger={true}
      />
    </div>
  );
};

