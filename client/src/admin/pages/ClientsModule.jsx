import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SlideDrawer } from '../components/ui/SlideDrawer';
import { AdminCard } from '../components/ui/AdminCard';
import { FormInput } from '../components/ui/FormInput';
import { FormSelect } from '../components/ui/FormSelect';
import { Users, UserPlus, Clock, Mail, Phone, Building, Calendar, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ClientsModule = () => {
  const { clients, rawMockData } = useAdminData();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form State for Add Client
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
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Determine active sub-tab from path
  const isAddMode = location.pathname.endsWith('/add');
  const isExpiringMode = location.pathname.endsWith('/expiring');

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

  // Client Detail Drawer trigger
  const handleOpen360 = (client) => {
    setSelectedClient(client);
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      navigate('/admin/clients');
    }, 1200);
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
        <span className="font-mono font-bold text-[#111111] text-xs">${row.monthlyRetainer.toLocaleString()}/mo</span>
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpen360(row);
          }}
          className="text-xs font-mono font-bold text-[#8E722A] hover:text-[#111111] uppercase underline cursor-pointer"
        >
          View 360 →
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-body">
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
              ← Back to Clients List
            </button>
          </div>

          {formSubmitted ? (
            <div className="p-8 bg-white rounded-xl border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-display text-xl text-[#111111]">Client Onboarded Successfully</h3>
              <p className="text-xs text-[#685C43]">Redirecting to active client portfolio...</p>
            </div>
          ) : (
            <AdminCard title="Client Account Details" subtitle="Fill in client contact, contract, and retainer terms">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="CLIENT BRAND NAME"
                    required
                    placeholder="e.g. Luminary Atelier"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <FormInput
                    label="COMPANY LEGAL NAME"
                    required
                    placeholder="e.g. Luminary Designs Pvt Ltd"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="PRIMARY CONTACT PERSON"
                    required
                    placeholder="e.g. Alexander Wright"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  />
                  <FormInput
                    label="EMAIL ADDRESS"
                    type="email"
                    required
                    placeholder="alexander@luminary.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="PHONE NUMBER"
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <FormSelect
                    label="ASSIGNED RETAINER PACKAGE"
                    options={[
                      { value: 'Social Media Retainer (Tier A)', label: 'Social Media Retainer (Tier A)' },
                      { value: 'Video Production & Retainer', label: 'Video Production & Retainer' },
                      { value: 'Content Creation Suite', label: 'Content Creation Suite' },
                      { value: 'Brand Strategy & Launch Package', label: 'Brand Strategy & Launch Package' },
                    ]}
                    value={formData.packageAssigned}
                    onChange={(e) => setFormData({ ...formData, packageAssigned: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormInput
                    label="MONTHLY RETAINER ($)"
                    type="number"
                    required
                    value={formData.monthlyRetainer}
                    onChange={(e) => setFormData({ ...formData, monthlyRetainer: e.target.value })}
                  />
                  <FormInput
                    label="START DATE"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                  <FormInput
                    label="EXPIRY / RENEWAL DATE"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-[#0A0A0A]/06">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/clients')}
                    className="px-4 py-2 text-xs font-mono border border-[#0A0A0A]/10 rounded-lg hover:bg-[#F7F5EF]"
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
            filters={[
              {
                id: 'status',
                label: 'Status',
                value: statusFilter,
                options: [
                  { label: 'All Statuses', value: 'All' },
                  { label: 'Active Retainers', value: 'Active' },
                  { label: 'Pending Onboarding', value: 'Pending' },
                  { label: 'Completed', value: 'Completed' },
                ],
                onChange: setStatusFilter,
              },
            ]}
          />

          <AdminCard noPadding>
            <DataTable
              columns={columns}
              data={filteredClients}
              onRowClick={(row) => handleOpen360(row)}
            />
          </AdminCard>
        </div>
      )}

      {/* Client 360 Profile Slide Drawer */}
      <SlideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedClient?.name || 'Client Profile'}
        subtitle={selectedClient?.company}
      >
        {selectedClient && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/06">
              <div>
                <span className="text-[10px] font-mono text-[#685C43] uppercase block">Monthly Retainer</span>
                <span className="font-display text-2xl font-bold text-[#111111]">${selectedClient.monthlyRetainer?.toLocaleString()}/mo</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#685C43] uppercase block">Total Paid YTD</span>
                <span className="font-display text-2xl font-bold text-emerald-700">${selectedClient.totalPaid?.toLocaleString()}</span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase tracking-wider block">CONTACT & CONTRACT</span>
              <div className="space-y-2 text-xs font-body text-[#221C11]">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#8E722A]" />
                  <span>Contact: {selectedClient.contactName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#8E722A]" />
                  <span>Email: {selectedClient.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#8E722A]" />
                  <span>Phone: {selectedClient.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#8E722A]" />
                  <span>Renewal Date: {selectedClient.expiryDate || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Assigned Deliverables */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase tracking-wider block">ASSIGNED PACKAGE</span>
              <div className="p-3 bg-white rounded-lg border border-[#0A0A0A]/08">
                <span className="font-bold text-xs text-[#111111] block">{selectedClient.packageAssigned}</span>
                <span className="text-[11px] text-[#685C43] block mt-0.5">Assigned Staff: {selectedClient.assignedStaff?.join(', ')}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#0A0A0A]/06 flex justify-end">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 text-xs font-mono bg-[#111111] text-[#F7F5EF] rounded-lg"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </SlideDrawer>
    </div>
  );
};
