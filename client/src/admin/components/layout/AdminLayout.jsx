import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminBreadcrumbs } from './AdminBreadcrumbs';
import { ModuleSubNav } from './ModuleSubNav';
import { GlobalSearchModal } from '../ui/GlobalSearchModal';
import { AdminDataProvider } from '../../context/AdminDataContext';

const AdminLayoutInner = () => {
  return (
    <div className="admin-shell flex h-screen bg-[#F7F5EF] text-[#0A0A0A] font-body overflow-hidden selection:bg-[#C8A13A] selection:text-black">
      {/* Sidebar - 12 Main Top-Level Modules Only */}
      <AdminSidebar />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Fixed Header */}
        <AdminHeader />

        {/* Breadcrumb Strip */}
        <div className="bg-white border-b border-[#0A0A0A]/10 px-4 sm:px-6 py-2 shadow-2xs shrink-0">
          <AdminBreadcrumbs />
        </div>

        {/* Contextual Sub-Navigation Bar inside Content Workspace Panel */}
        <ModuleSubNav />

        {/* Scrollable Content Workspace */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-6">
          <Outlet />
        </main>
      </div>

      {/* Global Command/Search Palette */}
      <GlobalSearchModal />
    </div>
  );
};

export const AdminLayout = () => {
  return (
    <AdminDataProvider>
      <AdminLayoutInner />
    </AdminDataProvider>
  );
};
