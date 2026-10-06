import React, { useRef, useState, useLayoutEffect } from 'react';
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
  const moduleKey = pathSegments[1];

  const subItems = moduleSubNavConfig[moduleKey];

  const navRef = useRef(null);
  const tabRefs = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const activeIndex = subItems
    ? subItems.findIndex((item) =>
        item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
      )
    : -1;

  useLayoutEffect(() => {
    if (activeIndex >= 0 && tabRefs.current[activeIndex] && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const tabRect = tabRefs.current[activeIndex].getBoundingClientRect();
      setIndicatorStyle({
        left: tabRect.left - navRect.left,
        width: tabRect.width,
        opacity: 1,
      });
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [location.pathname, activeIndex, moduleKey]);

  if (!subItems || subItems.length === 0) return null;

  return (
    <div className="bg-[#FAF8F3] border-b border-[#0A0A0A]/08 px-4 sm:px-6 shrink-0 relative">
      <div className="max-w-7xl mx-auto relative">
        <nav
          ref={navRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none relative pt-2 pb-0.5"
          aria-label="Contextual Sub-Navigation"
        >
          {/* Animated Sliding Organic Water-Drop Tab Container */}
          {indicatorStyle.opacity === 1 && (
            <div
              className="absolute top-2 bottom-0 transition-all duration-300 ease-out pointer-events-none z-10 motion-reduce:transition-none"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            >
              {/* Left Concave Water-Drop Fillet Curve */}
              <div className="absolute -left-2.5 bottom-0 w-2.5 h-2.5 bg-white pointer-events-none overflow-hidden">
                <div className="w-full h-full bg-[#FAF8F3] rounded-br-[10px]" />
              </div>

              {/* Main Active Organic Tab Body */}
              <div className="w-full h-full bg-white rounded-t-xl shadow-2xs border-t border-x border-[#0A0A0A]/06" />

              {/* Right Concave Water-Drop Fillet Curve */}
              <div className="absolute -right-2.5 bottom-0 w-2.5 h-2.5 bg-white pointer-events-none overflow-hidden">
                <div className="w-full h-full bg-[#FAF8F3] rounded-bl-[10px]" />
              </div>
            </div>
          )}

          {/* Nav Items Interactive Layer */}
          {subItems.map((item, index) => {
            const isActive =
              item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                ref={(el) => (tabRefs.current[index] = el)}
                to={item.path}
                end={item.exact}
                className={`relative z-20 py-2.5 px-4 text-xs font-mono tracking-wider uppercase transition-colors duration-200 shrink-0 focus:outline-none no-underline ${
                  isActive
                    ? 'text-[#111111] font-bold'
                    : 'text-[#685C43] hover:text-[#111111] font-semibold'
                }`}
              >
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
