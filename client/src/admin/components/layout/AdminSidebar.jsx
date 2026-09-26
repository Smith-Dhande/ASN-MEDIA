import React from 'react';
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
  ShieldCheck,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export const AdminSidebar = () => {
  const { sidebarCollapsed, rawMockData } = useAdminData();
  const location = useLocation();

  const mainModules = [
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
    },
    {
      id: 'enquiries',
      label: 'Leads & Enquiries',
      path: '/admin/enquiries',
      icon: Inbox,
      badge: rawMockData?.dashboardMetrics?.newEnquiries,
    },
    {
      id: 'packages',
      label: 'Packages & Services',
      path: '/admin/packages',
      icon: Package,
    },
    {
      id: 'projects',
      label: 'Projects & Tasks',
      path: '/admin/projects',
      icon: Kanban,
      badge: rawMockData?.dashboardMetrics?.activeProjects,
    },
    {
      id: 'payments',
      label: 'Payments',
      path: '/admin/payments',
      icon: CreditCard,
    },
    {
      id: 'scanners',
      label: 'Review Scanners',
      path: '/admin/scanners',
      icon: QrCode,
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
              <span className="text-[9px] tracking-widest uppercase text-[#C8A13A] mt-0.5 font-mono font-semibold">
                ADMIN PANEL
              </span>
            </div>
          )}
        </NavLink>
      </div>

      {/* 12 Main Top-Level Modules List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 font-body text-xs scrollbar-none">
        {mainModules.map((item) => {
          const Icon = item.icon;
          // Check if current path matches or starts with the main module route
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xs transition-colors group focus:outline-none ${
                isActive
                  ? 'bg-[#C8A13A] text-[#0A0A0A] font-bold shadow-sm'
                  : 'text-white/80 hover:bg-white/10 hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0A0A0A]' : 'text-[#C8A13A]'}`} />
                {!sidebarCollapsed && (
                  <span className="tracking-wide text-xs">{item.label}</span>
                )}
              </div>
              {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-xs font-bold ${
                    isActive ? 'bg-black text-white' : 'bg-white/20 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
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
