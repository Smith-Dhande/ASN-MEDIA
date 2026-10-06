import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { PortalProvider } from '../../context/PortalContext';
import { PortalNavbar } from './PortalNavbar';
import { PortalSidebar } from './PortalSidebar';
import {
  LayoutDashboard,
  Package,
  Layers,
  FolderKanban,
  CreditCard,
  MessageSquare,
  Bell,
  User,
} from 'lucide-react';

const PortalLayoutInner = () => {
  const location = useLocation();

  const mobileNavItems = [
    { to: '/portal/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/portal/packages', label: 'Package', icon: Package },
    { to: '/portal/projects', label: 'Projects', icon: FolderKanban },
    { to: '/portal/payments', label: 'Payments', icon: CreditCard },
    { to: '/portal/enquiries', label: 'Support', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#111111] font-body flex flex-col selection:bg-[#C8A13A] selection:text-black">
      {/* Top Navbar */}
      <PortalNavbar />

      {/* Main Content Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <PortalSidebar />

        {/* Scrollable Main Workspace */}
        <main
          key={location.pathname}
          className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 pb-20 md:pb-8 min-w-0"
        >
          <Outlet />

          <footer className="pt-8 border-t border-[#0A0A0A]/08 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#685C43] gap-2">
            <span>© 2026 ASN Media Client Workspace Portal</span>
            <span>
              Supported by{' '}
              <a
                href="https://clickinnovate.in/"
                target="_blank"
                rel="noreferrer"
                className="text-[#8E722A] font-bold hover:underline"
              >
                ClickInnovate
              </a>
            </span>
          </footer>
        </main>
      </div>

      {/* Mobile Navigation Toolbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#0A0A0A]/10 px-2 py-1.5 flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-[10px] font-mono transition-colors ${
                  isActive ? 'text-[#8E722A] font-bold' : 'text-[#685C43] hover:text-[#111111]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export const PortalLayout = () => {
  return (
    <PortalProvider>
      <PortalLayoutInner />
    </PortalProvider>
  );
};
