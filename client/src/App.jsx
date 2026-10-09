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
import { PublicReviewScanner } from './pages/PublicReviewScanner';

// Admin Imports
import { AdminLayout, AdminAppWrapper } from './admin/components/layout/AdminLayout';
import { AdminProtectedRoute } from './admin/components/auth/AdminProtectedRoute';
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

// Client Portal Imports
import { PortalLayout } from './portal/components/layout/PortalLayout';
import { PortalDashboard } from './portal/pages/PortalDashboard';
import { PortalPackages } from './portal/pages/PortalPackages';
import { PortalServices } from './portal/pages/PortalServices';
import { PortalProjects } from './portal/pages/PortalProjects';
import { PortalPayments } from './portal/pages/PortalPayments';
import { PortalEnquiries } from './portal/pages/PortalEnquiries';
import { PortalProfile } from './portal/pages/PortalProfile';
import { PortalNotifications } from './portal/pages/PortalNotifications';

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
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden p-0 m-0 bg-[#F7F5EF] text-[#111111] font-body selection:bg-[#C8A13A] selection:text-black">
      <Navbar />
      <main className="flex-grow w-full max-w-full p-0 m-0 overflow-x-hidden">
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
        {/* PUBLIC REVIEW SCANNER ROUTE (STANDALONE BRANDED EXPERIENCE) */}
        <Route path="/review/:slug" element={<PublicReviewScanner />} />

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

        {/* CLIENT PORTAL ROUTES */}
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<Navigate to="/portal/dashboard" replace />} />
          <Route path="dashboard" element={<PortalDashboard />} />
          <Route path="packages" element={<PortalPackages />} />
          <Route path="services" element={<PortalServices />} />
          <Route path="projects" element={<PortalProjects />} />
          <Route path="projects/:projectId" element={<PortalProjects />} />
          <Route path="payments" element={<PortalPayments />} />
          <Route path="enquiries" element={<PortalEnquiries />} />
          <Route path="profile" element={<PortalProfile />} />
          <Route path="notifications" element={<PortalNotifications />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ADMIN PANEL ROUTES (ISOLATED NAMESPACE WITH SHARED RBAC DATA PROVIDER) */}
        <Route element={<AdminAppWrapper />}>
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route
              path="dashboard"
              element={
                <AdminProtectedRoute moduleKey="dashboard">
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />

            {/* Clients Subsystem */}
            <Route
              path="clients"
              element={
                <AdminProtectedRoute moduleKey="clients">
                  <ClientsModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="clients/add"
              element={
                <AdminProtectedRoute moduleKey="clients">
                  <ClientsModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="clients/expiring"
              element={
                <AdminProtectedRoute moduleKey="clients">
                  <ClientsModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="clients/:id"
              element={
                <AdminProtectedRoute moduleKey="clients">
                  <ClientsModule />
                </AdminProtectedRoute>
              }
            />

            {/* Leads & Enquiries Subsystem */}
            <Route
              path="enquiries"
              element={
                <AdminProtectedRoute moduleKey="enquiries">
                  <EnquiriesModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="enquiries/follow-ups"
              element={
                <AdminProtectedRoute moduleKey="enquiries">
                  <EnquiriesModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="enquiries/converted"
              element={
                <AdminProtectedRoute moduleKey="enquiries">
                  <EnquiriesModule />
                </AdminProtectedRoute>
              }
            />

            {/* Packages & Services Subsystem */}
            <Route
              path="packages"
              element={
                <AdminProtectedRoute moduleKey="packages">
                  <PackagesServicesModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="packages/create"
              element={
                <AdminProtectedRoute moduleKey="packages">
                  <PackagesServicesModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="packages/edit/:id"
              element={
                <AdminProtectedRoute moduleKey="packages">
                  <PackagesServicesModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="services"
              element={
                <AdminProtectedRoute moduleKey="packages">
                  <PackagesServicesModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="services/create"
              element={
                <AdminProtectedRoute moduleKey="packages">
                  <PackagesServicesModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="services/edit/:id"
              element={
                <AdminProtectedRoute moduleKey="packages">
                  <PackagesServicesModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="assignments"
              element={
                <AdminProtectedRoute moduleKey="packages">
                  <PackagesServicesModule />
                </AdminProtectedRoute>
              }
            />

            {/* Projects & Tasks Subsystem */}
            <Route
              path="projects"
              element={
                <AdminProtectedRoute moduleKey="projects">
                  <ProjectsTasksModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="projects/create"
              element={
                <AdminProtectedRoute moduleKey="projects">
                  <ProjectsTasksModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="projects/edit/:id"
              element={
                <AdminProtectedRoute moduleKey="projects">
                  <ProjectsTasksModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="tasks"
              element={
                <AdminProtectedRoute moduleKey="projects">
                  <ProjectsTasksModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="tasks/create"
              element={
                <AdminProtectedRoute moduleKey="projects">
                  <ProjectsTasksModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="tasks/edit/:id"
              element={
                <AdminProtectedRoute moduleKey="projects">
                  <ProjectsTasksModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="workload"
              element={
                <AdminProtectedRoute moduleKey="projects">
                  <ProjectsTasksModule />
                </AdminProtectedRoute>
              }
            />

            {/* Payments Subsystem */}
            <Route
              path="payments"
              element={
                <AdminProtectedRoute moduleKey="payments">
                  <PaymentsModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="payments/create"
              element={
                <AdminProtectedRoute moduleKey="payments">
                  <PaymentsModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="payments/edit/:id"
              element={
                <AdminProtectedRoute moduleKey="payments">
                  <PaymentsModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="payments/outstanding"
              element={
                <AdminProtectedRoute moduleKey="payments">
                  <PaymentsModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="payments/due"
              element={
                <AdminProtectedRoute moduleKey="payments">
                  <PaymentsModule />
                </AdminProtectedRoute>
              }
            />

            {/* Review Scanners Subsystem */}
            <Route
              path="scanners"
              element={
                <AdminProtectedRoute moduleKey="scanners">
                  <ReviewScannersModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="scanners/create"
              element={
                <AdminProtectedRoute moduleKey="scanners">
                  <ReviewScannersModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="scanners/edit/:id"
              element={
                <AdminProtectedRoute moduleKey="scanners">
                  <ReviewScannersModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="scanners/:id"
              element={
                <AdminProtectedRoute moduleKey="scanners">
                  <ReviewScannersModule />
                </AdminProtectedRoute>
              }
            />

            {/* Reports & Analytics */}
            <Route
              path="reports"
              element={
                <AdminProtectedRoute moduleKey="reports">
                  <ReportsModule />
                </AdminProtectedRoute>
              }
            />

            {/* Notifications */}
            <Route
              path="notifications"
              element={
                <AdminProtectedRoute moduleKey="notifications">
                  <NotificationsModule />
                </AdminProtectedRoute>
              }
            />

            {/* Staff & Roles Subsystem */}
            <Route
              path="staff"
              element={
                <AdminProtectedRoute moduleKey="staff">
                  <StaffRolesModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="staff/add"
              element={
                <AdminProtectedRoute moduleKey="staff">
                  <StaffRolesModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="staff/edit/:id"
              element={
                <AdminProtectedRoute moduleKey="staff">
                  <StaffRolesModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="staff/permissions"
              element={
                <AdminProtectedRoute moduleKey="staff">
                  <StaffRolesModule />
                </AdminProtectedRoute>
              }
            />

            {/* Activity Logs */}
            <Route
              path="activity"
              element={
                <AdminProtectedRoute moduleKey="activity">
                  <ActivityLogsModule />
                </AdminProtectedRoute>
              }
            />

            {/* System Settings Subsystem */}
            <Route
              path="settings"
              element={
                <AdminProtectedRoute moduleKey="settings">
                  <Navigate to="/admin/settings/profile" replace />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="settings/profile"
              element={
                <AdminProtectedRoute moduleKey="settings">
                  <SettingsModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="settings/company"
              element={
                <AdminProtectedRoute moduleKey="settings">
                  <SettingsModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="settings/platform"
              element={
                <AdminProtectedRoute moduleKey="settings">
                  <SettingsModule />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="settings/backup"
              element={
                <AdminProtectedRoute moduleKey="settings">
                  <SettingsModule />
                </AdminProtectedRoute>
              }
            />

            {/* Admin Catch-All 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
