import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
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
  Lock,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { hasModulePermission } from '../../utils/rbac';

export const AdminSidebar = () => {
  const { sidebarCollapsed, dashboardMetrics, notifications, currentUser } = useAdminData();
  const location = useLocation();
  const navContainerRef = useRef(null);
  const itemRefs = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 40, opacity: 0 });

  const mainModules = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      match: (pathname) => pathname === '/admin' || pathname === '/admin/' || pathname.startsWith('/admin/dashboard'),
    },
    {
      id: 'clients',
      label: 'Clients',
      path: '/admin/clients',
      icon: Users,
      badge: dashboardMetrics?.activeClients,
      match: (pathname) => pathname.startsWith('/admin/clients'),
    },
    {
      id: 'enquiries',
      label: 'Leads & Enquiries',
      path: '/admin/enquiries',
      icon: Inbox,
      badge: dashboardMetrics?.newEnquiries || dashboardMetrics?.newLeads,
      match: (pathname) => pathname.startsWith('/admin/enquiries') || pathname.startsWith('/admin/leads'),
    },
    {
      id: 'packages',
      label: 'Packages & Services',
      path: '/admin/packages',
      icon: Package,
      match: (pathname) =>
        pathname.startsWith('/admin/packages') ||
        pathname.startsWith('/admin/services') ||
        pathname.startsWith('/admin/assignments'),
    },
    {
      id: 'projects',
      label: 'Projects & Tasks',
      path: '/admin/projects',
      icon: Kanban,
      badge: dashboardMetrics?.activeProjects,
      match: (pathname) =>
        pathname.startsWith('/admin/projects') ||
        pathname.startsWith('/admin/tasks') ||
        pathname.startsWith('/admin/workload'),
    },
    {
      id: 'payments',
      label: 'Payments',
      path: '/admin/payments',
      icon: CreditCard,
      match: (pathname) => pathname.startsWith('/admin/payments'),
    },
    {
      id: 'scanners',
      label: 'Review Scanners',
      path: '/admin/scanners',
      icon: QrCode,
      badge: dashboardMetrics?.activeScannersCount,
      match: (pathname) => pathname.startsWith('/admin/scanners') || pathname.startsWith('/admin/review-scanners'),
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      path: '/admin/reports',
      icon: BarChart3,
      match: (pathname) => pathname.startsWith('/admin/reports'),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      path: '/admin/notifications',
      icon: Bell,
      badge: notifications?.filter((n) => !n.read)?.length,
      match: (pathname) => pathname.startsWith('/admin/notifications'),
    },
    {
      id: 'staff',
      label: 'Staff & Roles',
      path: '/admin/staff',
      icon: UserCheck,
      match: (pathname) => pathname.startsWith('/admin/staff'),
    },
    {
      id: 'activity',
      label: 'Activity Logs',
      path: '/admin/activity',
      icon: History,
      match: (pathname) => pathname.startsWith('/admin/activity') || pathname.startsWith('/admin/activity-logs'),
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/admin/settings',
      icon: Settings,
      match: (pathname) => pathname.startsWith('/admin/settings'),
    },
  ];

  // RBAC filtered modules list
  const filteredModules = mainModules.filter((item) =>
    hasModulePermission(currentUser?.role || 'Super Admin', item.id)
  );

  const activeIndex = filteredModules.findIndex((item) => item.match(location.pathname));

  const updateIndicator = () => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex] && navContainerRef.current) {
      const containerRect = navContainerRef.current.getBoundingClientRect();
      const itemRect = itemRefs.current[activeIndex].getBoundingClientRect();
      setIndicatorStyle({
        top: itemRect.top - containerRect.top + navContainerRef.current.scrollTop,
        height: itemRect.height,
        opacity: 1,
      });
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  useLayoutEffect(() => {
    updateIndicator();
  }, [location.pathname, activeIndex, sidebarCollapsed, currentUser?.role]);

  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeIndex]);

  return (
    <aside
      className={`bg-[#E5D9BC] text-[#221C11] flex flex-col transition-all duration-300 relative z-20 shrink-0 select-none ${
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
              <span className="text-[9px] tracking-widest uppercase text-[#8E722A] mt-0.5 font-mono font-bold truncate max-w-[140px]" title={currentUser?.role}>
                {currentUser?.role || 'OPERATIONS'}
              </span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Main Top-Level Modules List with Animated Sliding Organic Tab */}
      <div
        ref={navContainerRef}
        className="flex-1 overflow-y-auto py-3 pl-3 pr-0 font-body text-xs scrollbar-none relative"
      >
        {/* Animated Sliding Organic Water-Drop Tab Underlay */}
        {indicatorStyle.opacity === 1 && (
          <div
            className="absolute left-3 right-0 transition-all duration-300 ease-out pointer-events-none z-10 motion-reduce:transition-none"
            style={{
              top: `${indicatorStyle.top}px`,
              height: `${indicatorStyle.height}px`,
            }}
          >
            {/* Top Concave Fillet Curve */}
            <div className="absolute -top-4 right-0 w-4 h-4 bg-[#F7F5EF] pointer-events-none overflow-hidden">
              <div className="w-full h-full bg-[#E5D9BC] rounded-br-[16px]" />
            </div>

            {/* Main Active Pill Body */}
            <div className="w-full h-full rounded-l-full bg-[#F7F5EF] shadow-2xs" />

            {/* Bottom Concave Fillet Curve */}
            <div className="absolute -bottom-4 right-0 w-4 h-4 bg-[#F7F5EF] pointer-events-none overflow-hidden">
              <div className="w-full h-full bg-[#E5D9BC] rounded-tr-[16px]" />
            </div>
          </div>
        )}

        {/* Navigation Items Interactive Layer */}
        <div className="space-y-1 relative z-20">
          {filteredModules.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.match(location.pathname);

            return (
              <NavLink
                key={item.id}
                ref={(el) => (itemRefs.current[index] = el)}
                to={item.path}
                title={sidebarCollapsed ? `${item.label} (${currentUser?.role})` : undefined}
                className={`h-10 flex items-center justify-between pl-3.5 pr-4 rounded-l-full transition-all duration-200 no-underline relative ${
                  isActive
                    ? 'text-[#111111] font-bold bg-[#F7F5EF] md:bg-transparent shadow-xs md:shadow-none'
                    : 'text-[#3E321E] hover:bg-[#DBCDAA]/60 hover:text-[#111111] font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                      isActive ? 'text-[#8E722A] scale-105' : 'text-[#7A6A48]'
                    }`}
                  />
                  {!sidebarCollapsed && (
                    <span className="tracking-wide text-xs truncate">{item.label}</span>
                  )}
                </div>

                {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-colors duration-200 shrink-0 ml-2 ${
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
          <span className="flex items-center gap-1 text-[#8E722A] font-bold truncate max-w-[120px]" title={currentUser?.role}>
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{currentUser?.role || 'Live RBAC'}</span>
          </span>
          <span>v2.0-PRO</span>
        </div>
      )}
    </aside>
  );
};
