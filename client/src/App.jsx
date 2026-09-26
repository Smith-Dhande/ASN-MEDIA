import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
import Lenis from 'lenis';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { Home } from './pages/Home';
import { Work } from './pages/Work';
import { ProjectDetail } from './pages/ProjectDetail';
import { ServicesPage } from './pages/ServicesPage';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Insights } from './pages/Insights';

// Admin Imports
import { AdminLayout } from './admin/components/layout/AdminLayout';
import { AdminLogin } from './admin/pages/AdminLogin';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { AdminPlaceholder } from './admin/pages/AdminPlaceholder';

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
  <div className="min-h-screen flex flex-col bg-[#F7F5EF] text-[#111111] font-body selection:bg-[#C8A13A] selection:text-black">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
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
        </Route>

        {/* ADMIN PANEL ROUTES (ISOLATED NAMESPACE) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Clients Subsystem */}
          <Route path="clients" element={<AdminPlaceholder moduleName="All Clients List" sectionCategory="Client Management" />} />
          <Route path="clients/add" element={<AdminPlaceholder moduleName="Add Client Form" sectionCategory="Client Management" />} />
          <Route path="clients/expiring" element={<AdminPlaceholder moduleName="Expiring Packages Warning" sectionCategory="Client Management" />} />
          <Route path="clients/:id" element={<AdminPlaceholder moduleName="Client History & 360 View" sectionCategory="Client Management" />} />

          {/* Leads & Enquiries Subsystem */}
          <Route path="enquiries" element={<AdminPlaceholder moduleName="All Website Enquiries Inbox" sectionCategory="Leads & Enquiries" />} />
          <Route path="enquiries/follow-ups" element={<AdminPlaceholder moduleName="Enquiry Follow-ups & Notes" sectionCategory="Leads & Enquiries" />} />
          <Route path="enquiries/converted" element={<AdminPlaceholder moduleName="Converted Leads" sectionCategory="Leads & Enquiries" />} />

          {/* Packages & Services Subsystem */}
          <Route path="packages" element={<AdminPlaceholder moduleName="Packages List" sectionCategory="Packages & Services" />} />
          <Route path="services" element={<AdminPlaceholder moduleName="Services List" sectionCategory="Packages & Services" />} />
          <Route path="assignments" element={<AdminPlaceholder moduleName="Client Assignments" sectionCategory="Packages & Services" />} />

          {/* Projects & Tasks Subsystem */}
          <Route path="projects" element={<AdminPlaceholder moduleName="Active Projects List" sectionCategory="Projects & Tasks" />} />
          <Route path="tasks" element={<AdminPlaceholder moduleName="Kanban Task Board" sectionCategory="Projects & Tasks" />} />
          <Route path="workload" element={<AdminPlaceholder moduleName="Team Workload Distribution" sectionCategory="Projects & Tasks" />} />

          {/* Payments Subsystem */}
          <Route path="payments" element={<AdminPlaceholder moduleName="Transaction Ledger" sectionCategory="Payments" />} />
          <Route path="payments/outstanding" element={<AdminPlaceholder moduleName="Outstanding Payments Alert" sectionCategory="Payments" />} />
          <Route path="payments/due" element={<AdminPlaceholder moduleName="Upcoming Due Payments" sectionCategory="Payments" />} />

          {/* Review Scanners Subsystem */}
          <Route path="scanners" element={<AdminPlaceholder moduleName="Google Review Scanners List" sectionCategory="AI Review Scanners" />} />
          <Route path="scanners/create" element={<AdminPlaceholder moduleName="Create Place Review Scanner" sectionCategory="AI Review Scanners" />} />
          <Route path="scanners/:id" element={<AdminPlaceholder moduleName="Scanner Detail & Sentiment Analytics" sectionCategory="AI Review Scanners" />} />

          {/* Reports & Analytics */}
          <Route path="reports" element={<AdminPlaceholder moduleName="Reports & Business Analytics" sectionCategory="Analytics" />} />

          {/* Notifications */}
          <Route path="notifications" element={<AdminPlaceholder moduleName="System Notifications Feed" sectionCategory="Notifications" />} />

          {/* Staff & Roles Subsystem */}
          <Route path="staff" element={<AdminPlaceholder moduleName="Staff Accounts" sectionCategory="Staff & Roles" />} />
          <Route path="staff/permissions" element={<AdminPlaceholder moduleName="Role Permissions Matrix" sectionCategory="Staff & Roles" />} />

          {/* Activity Logs */}
          <Route path="activity" element={<AdminPlaceholder moduleName="System Activity & Audit Trail" sectionCategory="Security & Audit" />} />

          {/* System Settings Subsystem */}
          <Route path="settings" element={<AdminPlaceholder moduleName="Admin Profile & Settings" sectionCategory="Settings" />} />
          <Route path="settings/profile" element={<AdminPlaceholder moduleName="Admin Profile" sectionCategory="Settings" />} />
          <Route path="settings/company" element={<AdminPlaceholder moduleName="Company Info Settings" sectionCategory="Settings" />} />
          <Route path="settings/platform" element={<AdminPlaceholder moduleName="Platform Configuration" sectionCategory="Settings" />} />
          <Route path="settings/backup" element={<AdminPlaceholder moduleName="Data Backup & Recovery UI" sectionCategory="Settings" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
