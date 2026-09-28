import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
import Lenis from 'lenis';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthProvider } from './context/AuthContext';
import { AuthDrawer } from './components/auth/AuthDrawer';
import { AccountModal } from './components/auth/AccountModal';

import { Home } from './pages/Home';
import { Work } from './pages/Work';
import { ProjectDetail } from './pages/ProjectDetail';
import { ServicesPage } from './pages/ServicesPage';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Insights } from './pages/Insights';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Imports
import { AdminLayout } from './admin/components/layout/AdminLayout';
import { AdminLogin } from './admin/pages/AdminLogin';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { ClientsModule } from './admin/pages/ClientsModule';
import { EnquiriesModule } from './admin/pages/EnquiriesModule';
import { PackagesServicesModule } from './admin/pages/PackagesServicesModule';
import { ProjectsTasksModule } from './admin/pages/ProjectsTasksModule';
import { PaymentsModule } from './admin/pages/PaymentsModule';
import { ReviewScannersModule } from './admin/pages/ReviewScannersModule';
import { ReportsModule } from './admin/pages/ReportsModule';
import { NotificationsModule } from './admin/pages/NotificationsModule';
import { StaffRolesModule } from './admin/pages/StaffRolesModule';
import { ActivityLogsModule } from './admin/pages/ActivityLogsModule';
import { SettingsModule } from './admin/pages/SettingsModule';

// Scroll To Top component on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Public Website Layout Shell
const PublicLayout = () => (
  <AuthProvider>
    <div className="min-h-screen flex flex-col bg-[#F7F5EF] text-[#111111] font-body selection:bg-[#C8A13A] selection:text-black">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <AuthDrawer />
      <AccountModal />
    </div>
  </AuthProvider>
);

export function App() {
  useEffect(() => {
    // Initialize Lenis smooth scroll if reduced motion is disabled
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      prevent: (node) =>
        node?.classList?.contains('admin-shell') ||
        Boolean(node?.closest?.('.admin-shell')),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* PUBLIC WEBSITE ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServicesPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/terms" element={<TermsPage />} />
          {/* Public Catch-All 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ADMIN PANEL ROUTES (ISOLATED NAMESPACE) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Clients Subsystem */}
          <Route path="clients" element={<ClientsModule />} />
          <Route path="clients/add" element={<ClientsModule />} />
          <Route path="clients/expiring" element={<ClientsModule />} />
          <Route path="clients/:id" element={<ClientsModule />} />

          {/* Leads & Enquiries Subsystem */}
          <Route path="enquiries" element={<EnquiriesModule />} />
          <Route path="enquiries/follow-ups" element={<EnquiriesModule />} />
          <Route path="enquiries/converted" element={<EnquiriesModule />} />

          {/* Packages & Services Subsystem */}
          <Route path="packages" element={<PackagesServicesModule />} />
          <Route path="packages/create" element={<PackagesServicesModule />} />
          <Route path="packages/edit/:id" element={<PackagesServicesModule />} />
          <Route path="services" element={<PackagesServicesModule />} />
          <Route path="services/create" element={<PackagesServicesModule />} />
          <Route path="services/edit/:id" element={<PackagesServicesModule />} />
          <Route path="assignments" element={<PackagesServicesModule />} />

          {/* Projects & Tasks Subsystem */}
          <Route path="projects" element={<ProjectsTasksModule />} />
          <Route path="projects/create" element={<ProjectsTasksModule />} />
          <Route path="projects/edit/:id" element={<ProjectsTasksModule />} />
          <Route path="tasks" element={<ProjectsTasksModule />} />
          <Route path="tasks/create" element={<ProjectsTasksModule />} />
          <Route path="tasks/edit/:id" element={<ProjectsTasksModule />} />
          <Route path="workload" element={<ProjectsTasksModule />} />

          {/* Payments Subsystem */}
          <Route path="payments" element={<PaymentsModule />} />
          <Route path="payments/create" element={<PaymentsModule />} />
          <Route path="payments/edit/:id" element={<PaymentsModule />} />
          <Route path="payments/outstanding" element={<PaymentsModule />} />
          <Route path="payments/due" element={<PaymentsModule />} />

          {/* Review Scanners Subsystem */}
          <Route path="scanners" element={<ReviewScannersModule />} />
          <Route path="scanners/create" element={<ReviewScannersModule />} />
          <Route path="scanners/:id" element={<ReviewScannersModule />} />

          {/* Reports & Analytics */}
          <Route path="reports" element={<ReportsModule />} />

          {/* Notifications */}
          <Route path="notifications" element={<NotificationsModule />} />

          {/* Staff & Roles Subsystem */}
          <Route path="staff" element={<StaffRolesModule />} />
          <Route path="staff/add" element={<StaffRolesModule />} />
          <Route path="staff/edit/:id" element={<StaffRolesModule />} />
          <Route path="staff/permissions" element={<StaffRolesModule />} />

          {/* Activity Logs */}
          <Route path="activity" element={<ActivityLogsModule />} />

          {/* System Settings Subsystem */}
          <Route path="settings" element={<Navigate to="/admin/settings/profile" replace />} />
          <Route path="settings/profile" element={<SettingsModule />} />
          <Route path="settings/company" element={<SettingsModule />} />
          <Route path="settings/platform" element={<SettingsModule />} />
          <Route path="settings/backup" element={<SettingsModule />} />

          {/* Admin Catch-All 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
