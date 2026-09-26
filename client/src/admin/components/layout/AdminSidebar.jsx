import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Inbox,
  Package,
  Kanban,
  CreditCard,
  QrCode,
  BarChart3,
  Bell,
  UserCheck,
  History,
  Settings,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export const AdminSidebar = () => {
  const { sidebarCollapsed, rawMockData } = useAdminData();
  const location = useLocation();

  const [openSections, setOpenSections] = useState({
    clients: true,
    enquiries: true,
    packages: false,
    projects: false,
    payments: false,
    scanners: false,
    staff: false,
    settings: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'clients',
      label: 'Clients',
      path: '/admin/clients',
      icon: Users,
      badge: rawMockData?.dashboardMetrics?.activeClients,
      children: [
        { label: 'All Clients', path: '/admin/clients' },
        { label: 'Add Client', path: '/admin/clients/add' },
        { label: 'Expiring Packages', path: '/admin/clients/expiring', badge: rawMockData?.dashboardMetrics?.expiringPackages, alert: true },
      ],
    },
    {
      id: 'enquiries',
      label: 'Leads & Enquiries',
      path: '/admin/enquiries',
      icon: Inbox,
      badge: rawMockData?.dashboardMetrics?.newEnquiries,
      children: [
        { label: 'All Enquiries', path: '/admin/enquiries' },
        { label: 'Follow-ups', path: '/admin/enquiries/follow-ups' },
        { label: 'Converted Leads', path: '/admin/enquiries/converted' },
      ],
    },
    {
      id: 'packages',
      label: 'Packages & Services',
      path: '/admin/packages',
      icon: Package,
      children: [
        { label: 'Packages', path: '/admin/packages' },
        { label: 'Services', path: '/admin/services' },
        { label: 'Client Assignments', path: '/admin/assignments' },
      ],
    },
    {
      id: 'projects',
      label: 'Projects & Tasks',
      path: '/admin/projects',
      icon: Kanban,
      badge: rawMockData?.dashboardMetrics?.activeProjects,
      children: [
        { label: 'Projects', path: '/admin/projects' },
        { label: 'Task Board', path: '/admin/tasks' },
        { label: 'Team Workload', path: '/admin/workload' },
      ],
    },
    {
      id: 'payments',
      label: 'Payments',
      path: '/admin/payments',
      icon: CreditCard,
      children: [
        { label: 'Transactions', path: '/admin/payments' },
        { label: 'Outstanding', path: '/admin/payments/outstanding', alert: true },
        { label: 'Due Payments', path: '/admin/payments/due' },
      ],
    },
    {
      id: 'scanners',
      label: 'Review Scanners',
      path: '/admin/scanners',
      icon: QrCode,
      children: [
        { label: 'All Scanners', path: '/admin/scanners' },
        { label: 'Create Scanner', path: '/admin/scanners/create' },
      ],
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      path: '/admin/reports',
      icon: BarChart3,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      path: '/admin/notifications',
      icon: Bell,
      badge: rawMockData?.notifications?.filter((n) => !n.read)?.length,
    },
    {
      id: 'staff',
      label: 'Staff & Roles',
      path: '/admin/staff',
      icon: UserCheck,
      children: [
        { label: 'Staff Accounts', path: '/admin/staff' },
        { label: 'Permissions', path: '/admin/staff/permissions' },
      ],
    },
    {
      id: 'activity',
      label: 'Activity Logs',
      path: '/admin/activity',
      icon: History,
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/admin/settings',
      icon: Settings,
      children: [
        { label: 'Profile', path: '/admin/settings/profile' },
        { label: 'Company', path: '/admin/settings/company' },
        { label: 'Platform Config', path: '/admin/settings/platform' },
      ],
    },
  ];

  return (
    <aside
      className={`bg-[#0A0A0A] text-[#F7F5EF] border-r border-white/10 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-white/10 shrink-0">
        <NavLink to="/admin/dashboard" className="flex items-center gap-3 group focus:outline-none">
          <img
            src="/favicon.PNG"
            alt="ASN Media Logo"
            className="w-8 h-8 rounded-full object-cover border border-[#C8A13A] shrink-0"
          />
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-xs tracking-[0.16em] uppercase text-white font-body leading-none">
                ASN MEDIA
              </span>
              <span className="text-[9px] tracking-widest uppercase text-[#C8A13A] mt-0.5">
                INTERNAL SYSTEM
              </span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Navigation Links List */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1 font-body text-xs scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isSectionOpen = openSections[item.id];
          const isParentActive = location.pathname.startsWith(item.path);

          if (!hasChildren) {
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xs transition-colors group focus:outline-none ${
                    isActive
                      ? 'bg-[#C8A13A] text-[#0A0A0A] font-bold shadow-sm'
                      : 'text-white/80 hover:bg-white/10 hover:text-white font-medium'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="tracking-wide text-xs">{item.label}</span>
                  )}
                </div>
                {!sidebarCollapsed && item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-xs font-bold ${
                      item.alert
                        ? 'bg-red-500 text-white'
                        : isParentActive
                        ? 'bg-black text-white'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          }

          return (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => toggleSection(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs transition-colors group focus:outline-none ${
                  isParentActive
                    ? 'bg-white/10 text-white font-bold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 text-[#C8A13A]" />
                  {!sidebarCollapsed && (
                    <span className="tracking-wide text-xs">{item.label}</span>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-white/20 text-white font-bold">
                        {item.badge}
                      </span>
                    )}
                    {isSectionOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    )}
                  </div>
                )}
              </button>

              {/* Sub-menu Children */}
              {!sidebarCollapsed && isSectionOpen && (
                <div className="pl-9 pr-2 space-y-1 py-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      end={child.path === item.path}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-2.5 py-1.5 rounded-xs text-[11px] font-mono transition-colors focus:outline-none ${
                          isActive
                            ? 'text-[#C8A13A] font-bold bg-white/5 border-l-2 border-[#C8A13A]'
                            : 'text-white/70 hover:text-white hover:bg-white/5 font-medium'
                        }`
                      }
                    >
                      <span>{child.label}</span>
                      {child.badge && (
                        <span
                          className={`text-[9px] px-1 rounded-xs font-bold ${
                            child.alert
                              ? 'bg-red-500 text-white'
                              : 'bg-white/10 text-white/80'
                          }`}
                        >
                          {child.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Security Badge */}
      {!sidebarCollapsed && (
        <div className="p-3 border-t border-white/10 text-[10px] font-mono text-white/50 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[#C8A13A]">
            <ShieldCheck className="w-3 h-3" /> SECURE SESSION
          </span>
          <span>v1.0-P1</span>
        </div>
      )}
    </aside>
  );
};
