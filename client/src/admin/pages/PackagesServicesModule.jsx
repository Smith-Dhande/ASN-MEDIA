import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { AdminCard } from '../components/ui/AdminCard';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Package, CheckCircle2, Users, Layers, Tag } from 'lucide-react';

export const PackagesServicesModule = () => {
  const { packages, services, clients } = useAdminData();
  const location = useLocation();

  const isServicesMode = location.pathname.endsWith('/services');
  const isAssignmentsMode = location.pathname.endsWith('/assignments');

  // Columns for Services table
  const serviceColumns = [
    {
      header: 'SERVICE NAME',
      key: 'name',
      render: (row) => (
        <span className="font-bold text-[#111111] text-xs font-body block">{row.name}</span>
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
      header: 'STATUS',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
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
      {isServicesMode ? (
        /* View: Services List */
        <div className="space-y-4">
          <div className="pb-3 border-b border-[#0A0A0A]/08">
            <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
              SERVICE CATALOGUE
            </span>
            <h2 className="font-display text-2xl font-normal text-[#111111]">
              Discrete Service Capabilities
            </h2>
          </div>
          <AdminCard noPadding>
            <DataTable columns={serviceColumns} data={services} />
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
            <DataTable columns={assignmentColumns} data={clients} />
          </AdminCard>
        </div>
      ) : (
        /* View: Packages Grid */
        <div className="space-y-4">
          <div className="pb-3 border-b border-[#0A0A0A]/08">
            <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
              PACKAGE SUITE
            </span>
            <h2 className="font-display text-2xl font-normal text-[#111111]">
              Retainer & Fixed Production Packages
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {packages.map((pkg) => (
              <AdminCard key={pkg.id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-[#8E722A] font-bold uppercase block">{pkg.type}</span>
                      <h3 className="font-display text-xl font-normal text-[#111111]">{pkg.name}</h3>
                    </div>
                    <span className="font-display text-2xl font-bold text-[#111111]">
                      ${pkg.monthlyFee?.toLocaleString()}<span className="text-xs font-mono font-normal text-[#685C43]">/mo</span>
                    </span>
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
        </div>
      )}
    </div>
  );
};
