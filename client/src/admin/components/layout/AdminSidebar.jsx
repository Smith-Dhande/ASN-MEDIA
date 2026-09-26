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
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', path: '/admin/clients', icon: Users, badge: rawMockData?.dashboardMetrics?.activeClients },
    { id: 'enquiries', label: 'Leads & Enquiries', path: '/admin/enquiries', icon: Inbox, badge: rawMockData?.dashboardMetrics?.newEnquiries },
    { id: 'packages', label: 'Packages & Services', path: '/admin/packages', icon: Package },
    { id: 'projects', label: 'Projects & Tasks', path: '/admin/projects', icon: Kanban, badge: rawMockData?.dashboardMetrics?.activeProjects },
    { id: 'payments', label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { id: 'scanners', label: 'Review Scanners', path: '/admin/scanners', icon: QrCode },
    { id: 'reports', label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', path: '/admin/notifications', icon: Bell, badge: rawMockData?.notifications?.filter((n) => !n.read)?.length },
    { id: 'staff', label: 'Staff & Roles', path: '/admin/staff', icon: UserCheck },
    { id: 'activity', label: 'Activity Logs', path: '/admin/activity', icon: History },
    { id: 'settings', label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const activeIndex = mainModules.findIndex(
    (item) =>
      location.pathname === item.path ||
      (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path))
  );

  return (
    <aside
      className={`bg-[#E5D9BC] text-[#221C11] flex flex-col transition-all duration-300 relative z-20 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center px-4 border-b border-[#D5C7A5] shrink-0">
        <NavLink to="/admin/dashboard" className="flex items-center gap-3 group focus:outline-none">
          <img
            src="/favicon.PNG"
            alt="ASN Media Logo"
            className="w-8 h-8 rounded-full object-cover border border-[#8E722A] shadow-xs shrink-0"
          />
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-xs tracking-[0.16em] uppercase text-[#111111] font-body leading-none">
                ASN MEDIA
              </span>
              <span className="text-[9px] tracking-widest uppercase text-[#8E722A] mt-0.5 font-mono font-bold">
                CHAMPAGNE LUXURY
              </span>
            </div>
          )}
        </NavLink>
      </div>

      {/* 12 Main Top-Level Modules List with Animated Sliding Water-Drop Tab */}
      <div className="flex-1 overflow-y-auto py-3 pl-3 pr-0 font-body text-xs scrollbar-none relative">
        {/* Animated Sliding Organic Water-Drop Tab Underlay */}
        {activeIndex >= 0 && (
          <div
            className="absolute left-3 right-0 h-10 transition-all duration-300 ease-out pointer-events-none z-10 motion-reduce:transition-none"
            style={{
              top: `${activeIndex * 46 + 12}px`, // 40px item + 6px gap
            }}
          >
            {/* Top Concave Water-Drop Fillet Curve */}
            <div className="absolute -top-4 right-0 w-4 h-4 bg-[#F7F5EF] pointer-events-none overflow-hidden">
              <div className="w-full h-full bg-[#E5D9BC] rounded-br-[16px]" />
            </div>

            {/* Main Active Water-Drop Shape Body */}
            <div className="w-full h-full rounded-l-full bg-[#F7F5EF] shadow-2xs" />

            {/* Bottom Concave Water-Drop Fillet Curve */}
            <div className="absolute -bottom-4 right-0 w-4 h-4 bg-[#F7F5EF] pointer-events-none overflow-hidden">
              <div className="w-full h-full bg-[#E5D9BC] rounded-tr-[16px]" />
            </div>
          </div>
        )}

        {/* Navigation Items Interactive Layer */}
        <div className="space-y-1.5 relative z-20">
          {mainModules.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={`h-10 flex items-center justify-between pl-3.5 pr-4 rounded-l-full transition-colors duration-300 no-underline ${
                  isActive
                    ? 'text-[#111111] font-bold'
                    : 'text-[#221C11] hover:bg-[#DBCDAA]/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors duration-300 ${
                      isActive ? 'text-[#8E722A]' : 'text-[#7A6A48]'
                    }`}
                  />
                  {!sidebarCollapsed && (
                    <span className="tracking-wide text-xs">{item.label}</span>
                  )}
                </div>
                {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-colors duration-300 ${
                      isActive
                        ? 'bg-[#111111] text-[#F7F5EF]'
                        : 'bg-[#D5C7A5] text-[#221C11]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer Security Badge */}
      {!sidebarCollapsed && (
        <div className="p-3 border-t border-[#D5C7A5] text-[10px] font-mono text-[#685C43] flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1 text-[#8E722A] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> SECURE SESSION
          </span>
          <span>v1.0-GOLD</span>
        </div>
      )}
    </aside>
  );
};
