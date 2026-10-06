import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminBreadcrumbs } from './AdminBreadcrumbs';
import { ModuleSubNav } from './ModuleSubNav';
import { GlobalSearchModal } from '../ui/GlobalSearchModal';
import { AdminDataProvider } from '../../context/AdminDataContext';

const AdminLayoutInner = () => {
  const location = useLocation();

  return (
    <div
      className="admin-shell flex h-screen bg-[#F7F5EF] text-[#0A0A0A] font-body overflow-hidden selection:bg-[#C8A13A] selection:text-black"
      data-lenis-prevent="true"
    >
      {/* Sidebar - 12 Main Top-Level Modules Only */}
      <AdminSidebar />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Fixed Header */}
        <AdminHeader />

        {/* Breadcrumb Strip */}
        <div className="bg-[#FAF8F3] border-b border-[#0A0A0A]/10 px-4 sm:px-6 py-1.5 shrink-0">
          <AdminBreadcrumbs />
        </div>

        {/* Contextual Sub-Navigation Bar inside Content Workspace Panel */}
        <ModuleSubNav />

        {/* Scrollable Content Workspace */}
        <main
          key={location.pathname}
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-7 py-4 space-y-4 animate-admin-page flex flex-col justify-between"
        >
          <div>
            <Outlet />
          </div>

          <footer className="pt-6 pb-2 border-t border-[#0A0A0A]/08 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#66615A] shrink-0 gap-2">
            <span>© 2026 ASN Media Admin System</span>
            <span>
              Designed by{' '}
              <a
                href="https://clickinnovate.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8E722A] hover:underline font-bold"
              >
                ClickInnovate
              </a>
            </span>
          </footer>
        </main>
      </div>

      {/* Global Command/Search Palette */}
      <GlobalSearchModal />
    </div>
  );
};

export const AdminAppWrapper = () => {
  return (
    <AdminDataProvider>
      <Outlet />
    </AdminDataProvider>
  );
};

export const AdminLayout = () => {
  return <AdminLayoutInner />;
};

