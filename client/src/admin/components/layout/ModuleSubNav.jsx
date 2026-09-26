import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const moduleSubNavConfig = {
  clients: [
    { label: 'All Clients', path: '/admin/clients', exact: true },
    { label: 'Add Client', path: '/admin/clients/add' },
    { label: 'Expiring Packages', path: '/admin/clients/expiring' },
  ],
  enquiries: [
    { label: 'All Enquiries', path: '/admin/enquiries', exact: true },
    { label: 'Follow-ups', path: '/admin/enquiries/follow-ups' },
    { label: 'Converted Leads', path: '/admin/enquiries/converted' },
  ],
  packages: [
    { label: 'Packages', path: '/admin/packages', exact: true },
    { label: 'Services', path: '/admin/services' },
    { label: 'Client Assignments', path: '/admin/assignments' },
  ],
  services: [
    { label: 'Packages', path: '/admin/packages' },
    { label: 'Services', path: '/admin/services', exact: true },
    { label: 'Client Assignments', path: '/admin/assignments' },
  ],
  assignments: [
    { label: 'Packages', path: '/admin/packages' },
    { label: 'Services', path: '/admin/services' },
    { label: 'Client Assignments', path: '/admin/assignments', exact: true },
  ],
  projects: [
    { label: 'Projects', path: '/admin/projects', exact: true },
    { label: 'Task Board', path: '/admin/tasks' },
    { label: 'Team Workload', path: '/admin/workload' },
  ],
  tasks: [
    { label: 'Projects', path: '/admin/projects' },
    { label: 'Task Board', path: '/admin/tasks', exact: true },
    { label: 'Team Workload', path: '/admin/workload' },
  ],
  workload: [
    { label: 'Projects', path: '/admin/projects' },
    { label: 'Task Board', path: '/admin/tasks' },
    { label: 'Team Workload', path: '/admin/workload', exact: true },
  ],
  payments: [
    { label: 'Transactions', path: '/admin/payments', exact: true },
    { label: 'Outstanding', path: '/admin/payments/outstanding' },
    { label: 'Due Payments', path: '/admin/payments/due' },
  ],
  scanners: [
    { label: 'All Scanners', path: '/admin/scanners', exact: true },
    { label: 'Create Scanner', path: '/admin/scanners/create' },
  ],
  staff: [
    { label: 'Staff Accounts', path: '/admin/staff', exact: true },
    { label: 'Permissions', path: '/admin/staff/permissions' },
  ],
  settings: [
    { label: 'Profile', path: '/admin/settings/profile' },
    { label: 'Company', path: '/admin/settings/company' },
    { label: 'Platform Config', path: '/admin/settings/platform' },
    { label: 'Backup & Recovery', path: '/admin/settings/backup' },
  ],
};

export const ModuleSubNav = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Find which top module key matches current route
  const moduleKey = pathSegments[1]; // e.g. 'clients', 'enquiries', 'packages', 'projects', etc.

  const subItems = moduleSubNavConfig[moduleKey];

  if (!subItems || subItems.length === 0) return null;

  return (
    <div className="bg-white border-b border-[#0A0A0A]/12 px-4 sm:px-6 mb-6 shadow-2xs">
      <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none" aria-label="Contextual Sub-Navigation">
        {subItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `py-2.5 px-4 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all shrink-0 focus:outline-none ${
                isActive
                  ? 'border-[#C8A13A] text-[#0A0A0A] font-bold bg-[#F7F5EF]/60'
                  : 'border-transparent text-[#66615A] hover:text-[#0A0A0A] hover:border-[#0A0A0A]/20'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
