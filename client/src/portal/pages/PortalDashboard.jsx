import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortalClient } from '../context/PortalContext';
import { AdminCard } from '../../admin/components/ui/AdminCard';
import { StatusBadge } from '../../admin/components/ui/StatusBadge';
import { KpiCard } from '../../admin/components/ui/KpiCard';
import {
  Package,
  FolderKanban,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  CreditCard,
  MessageSquare,
  Building,
  Mail,
  Calendar,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const PortalDashboard = () => {
  const { currentClient, clientProjects, clientPayments, clientEnquiries } = usePortalClient();
  const navigate = useNavigate();

  // Progress metrics calculation
  const totalProjects = clientProjects.length;
  const avgProgress = totalProjects > 0
    ? Math.round(clientProjects.reduce((acc, p) => acc + (p.progressPct || 0), 0) / totalProjects)
    : 0;

  const pendingPayment = clientPayments.find((p) => p.status === 'Overdue' || p.status === 'Pending');

  return (
    <div className="space-y-6 font-body">
      {/* Top Welcome Banner */}
      <AdminCard className="p-6 bg-gradient-to-r from-white to-[#FAF8F3] border-[#0A0A0A]/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-[#8E722A] uppercase tracking-widest block">
              CLIENT WORKSPACE OVERVIEW
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-normal text-[#111111]">
              Welcome back, {currentClient?.contactName || 'Client'}
            </h1>
            <p className="text-xs font-mono text-[#685C43]">
              Active Retainer Account • <strong className="text-[#111111]">{currentClient?.company}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 font-mono text-xs font-bold bg-[#111111] text-[#F7F5EF] rounded-md shadow-2xs">
              {currentClient?.packageAssigned || 'Retainer Account'}
            </span>
            <StatusBadge status={currentClient?.status || 'Active'} />
          </div>
        </div>
      </AdminCard>

      {/* 4 Client Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="MY PACKAGE TIER"
          value={`₹${currentClient?.monthlyRetainer?.toLocaleString('en-IN')}/mo`}
          trendLabel={currentClient?.packageAssigned || 'Active Agreement'}
          icon={Package}
          to="/portal/packages"
          accentColor="gold"
        />
        <KpiCard
          label="ACTIVE PROJECTS"
          value={totalProjects}
          trendLabel={`${clientProjects.filter(p => p.status === 'In Progress').length} in active production`}
          icon={FolderKanban}
          to="/portal/projects"
          accentColor="emerald"
        />
        <KpiCard
          label="OVERALL PROGRESS"
          value={`${avgProgress}%`}
          trend={avgProgress >= 50 ? 10 : 0}
          trendLabel="deliverable completion rate"
          icon={CheckCircle2}
          to="/portal/projects"
          accentColor="emerald"
        />
        <KpiCard
          label="PAYMENT STATUS"
          value={pendingPayment ? `₹${pendingPayment.amount?.toLocaleString('en-IN')}` : '₹0 Due'}
          trendLabel={pendingPayment ? `Due ${pendingPayment.dueDate}` : 'All Invoices Settled'}
          icon={CreditCard}
          to="/portal/payments"
          accentColor={pendingPayment ? 'amber' : 'emerald'}
        />
      </div>

      {/* Active Projects Overview */}
      <AdminCard
        title="Active Projects & Production Status"
        action={
          <Link
            to="/portal/projects"
            className="text-xs font-mono font-bold text-[#8E722A] hover:underline flex items-center gap-1"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
        className="p-5"
      >
        {clientProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/portal/projects/${project.id}`)}
                className="p-4 bg-white rounded-lg border border-[#0A0A0A]/08 hover:border-[#8E722A] transition-all cursor-pointer space-y-3 shadow-2xs"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-[#111111] hover:text-[#8E722A]">
                      {project.title}
                    </h3>
                    <span className="text-[11px] font-mono text-[#685C43]">
                      Service: {project.serviceName || 'Social Media Management'}
                    </span>
                  </div>
                  <StatusBadge status={project.status} />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-[#685C43]">
                    <span>Completion Progress</span>
                    <span className="font-bold text-[#111111]">{project.progressPct}%</span>
                  </div>
                  <div className="w-full bg-[#FAF8F3] h-2 rounded-full overflow-hidden border border-[#0A0A0A]/06">
                    <div
                      className="bg-[#8E722A] h-full transition-all duration-500"
                      style={{ width: `${project.progressPct}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-[#685C43] pt-2 border-t border-[#0A0A0A]/04">
                  <span>Target Deadline: {project.dueDate}</span>
                  <span className="text-[#8E722A] font-bold underline">View Workspace →</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2">
            <FolderKanban className="w-10 h-10 text-[#685C43] mx-auto opacity-50" />
            <p className="text-xs font-mono text-[#685C43]">No active projects assigned to your account.</p>
          </div>
        )}
      </AdminCard>

      {/* Account Lead & Support Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Manager Contact Card */}
        <AdminCard title="Your Dedicated Agency Team" className="p-5 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#FAF8F3] rounded-lg border border-[#0A0A0A]/06">
            <div className="w-10 h-10 rounded-full bg-[#111111] text-[#F7F5EF] font-mono text-sm font-bold flex items-center justify-center border border-[#8E722A]">
              SJ
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#111111]">
                {currentClient?.accountManager || 'Sarah Jenkins'}
              </h4>
              <span className="text-[11px] font-mono text-[#685C43]">
                Account Manager & Senior Strategist
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono text-[#685C43]">
            <div className="flex justify-between pb-1 border-b border-[#0A0A0A]/06">
              <span>Direct Email:</span>
              <a href="mailto:sarah@asnmedia.in" className="text-[#8E722A] hover:underline font-bold">
                sarah@asnmedia.in
              </a>
            </div>
            <div className="flex justify-between">
              <span>Agency Office:</span>
              <span className="text-[#111111]">+91 98765 00000</span>
            </div>
          </div>

          <Link
            to="/portal/enquiries"
            className="w-full py-2 bg-[#111111] text-[#F7F5EF] text-xs font-mono font-bold rounded-md hover:bg-[#8E722A] transition-colors flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#C8A13A]" />
            <span>Send Message / Support Request</span>
          </Link>
        </AdminCard>

        {/* Contract & Retainer Summary */}
        <AdminCard title="Retainer Contract Summary" className="p-5 space-y-4">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between pb-2 border-b border-[#0A0A0A]/06">
              <span className="font-mono text-[#685C43]">Assigned Package:</span>
              <strong className="text-[#111111] font-mono">{currentClient?.packageAssigned}</strong>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#0A0A0A]/06">
              <span className="font-mono text-[#685C43]">Monthly Retainer:</span>
              <strong className="text-[#111111] font-mono">₹{currentClient?.monthlyRetainer?.toLocaleString('en-IN')}/mo</strong>
            </div>
            <div className="flex justify-between pb-2 border-b border-[#0A0A0A]/06">
              <span className="font-mono text-[#685C43]">Agreement Start:</span>
              <span className="font-mono text-[#111111]">{currentClient?.startDate || '2026-04-01'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[#685C43]">Renewal Date:</span>
              <span className="font-mono font-bold text-[#8E722A]">{currentClient?.expiryDate || '2027-03-31'}</span>
            </div>
          </div>

          <Link
            to="/portal/packages"
            className="block text-center text-xs font-mono font-bold text-[#8E722A] hover:underline pt-2"
          >
            Review Included Services & Deliverables →
          </Link>
        </AdminCard>
      </div>
    </div>
  );
};
