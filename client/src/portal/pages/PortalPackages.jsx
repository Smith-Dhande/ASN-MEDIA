import React, { useState } from 'react';
import { usePortalClient } from '../context/PortalContext';
import { AdminCard } from '../../admin/components/ui/AdminCard';
import { StatusBadge } from '../../admin/components/ui/StatusBadge';
import { EmptyState } from '../../admin/components/ui/EmptyState';
import { Package, CheckCircle2, Calendar, DollarSign, ArrowRight, Sparkles, Layers } from 'lucide-react';

export const PortalPackages = () => {
  const { currentClient, submitEnquiry } = usePortalClient();
  const [requestSent, setRequestSent] = useState(false);

  const handleRequestUpgrade = () => {
    submitEnquiry({
      serviceRequested: 'Package Extension / Upgrade',
      description: `Client ${currentClient?.name} requested package extension / upgrade for ${currentClient?.packageAssigned}.`,
    });
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 4000);
  };

  if (!currentClient || !currentClient.packageAssigned) {
    return (
      <div className="py-12">
        <EmptyState
          icon={Package}
          title="No Package Assigned"
          description="There is currently no active package tier assigned to your account."
          actionLabel="Request Package Consultation"
          onAction={handleRequestUpgrade}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-body">
      {requestSent && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-md flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your package upgrade request has been sent to your Account Manager!</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-3 border-b border-[#0A0A0A]/08">
        <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
          AGREEMENT & RETAINER TIER
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-normal text-[#111111]">
          My Package Subscription
        </h1>
      </div>

      {/* Main Active Package Card */}
      <AdminCard className="p-6 bg-white border-[#0A0A0A]/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#0A0A0A]/08">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase bg-[#FAF8F3] text-[#8E722A] border border-[#8E722A]/30 rounded-xs">
                ACTIVE SUBSCRIPTION
              </span>
              <StatusBadge status={currentClient.status} />
            </div>
            <h2 className="font-display text-3xl font-normal text-[#111111]">
              {currentClient.packageAssigned}
            </h2>
            <p className="text-xs font-mono text-[#685C43]">
              Monthly Media & Strategy Retainer • Dedicated Account Team
            </p>
          </div>

          <div className="text-left md:text-right bg-[#FAF8F3] p-4 rounded-xl border border-[#0A0A0A]/08">
            <span className="text-[10px] font-mono text-[#685C43] uppercase block font-bold">
              MONTHLY RETAINER
            </span>
            <div className="font-mono text-3xl font-bold text-[#111111]">
              ₹{currentClient.monthlyRetainer?.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-[#685C43]">/mo</span>
            </div>
          </div>
        </div>

        {/* Contract Dates Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 text-xs font-mono">
          <div className="p-4 bg-[#FAF8F3] rounded-lg border border-[#0A0A0A]/06 space-y-1">
            <span className="text-[#685C43] block">Contract Start Date:</span>
            <strong className="text-[#111111] font-bold text-sm block">
              {currentClient.startDate || '2026-04-01'}
            </strong>
          </div>
          <div className="p-4 bg-[#FAF8F3] rounded-lg border border-[#0A0A0A]/06 space-y-1">
            <span className="text-[#685C43] block">Contract Expiry / Renewal Date:</span>
            <strong className="text-[#8E722A] font-bold text-sm block">
              {currentClient.expiryDate || '2027-03-31'}
            </strong>
          </div>
        </div>

        {/* Included Deliverables List */}
        <div className="pt-6 space-y-3">
          <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">
            INCLUDED MONTHLY DELIVERABLES & SERVICES
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Comprehensive Social Media Management & Publishing',
              'Short-Form Video Content Production (Reels/Shorts)',
              'Custom Graphic Design & Brand Collateral Assets',
              'Monthly Performance Analytics & Growth Reporting',
              'Bi-Weekly Strategy Calls with Account Manager',
              'Google Review Management & Reputation Monitoring',
            ].map((deliv, idx) => (
              <div
                key={idx}
                className="p-3 bg-white rounded-lg border border-[#0A0A0A]/08 flex items-center gap-2.5 text-xs text-[#111111]"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{deliv}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Package Upgrade CTA */}
        <div className="mt-8 pt-6 border-t border-[#0A0A0A]/08 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-xs text-[#111111]">Need to scale your deliverables or extend your agreement?</h4>
            <p className="text-xs font-mono text-[#685C43]">Request a tier adjustment directly with your account lead.</p>
          </div>
          <button
            onClick={handleRequestUpgrade}
            className="px-4 py-2 bg-[#111111] text-[#F7F5EF] text-xs font-mono font-bold rounded-md hover:bg-[#8E722A] transition-colors shrink-0"
          >
            Request Upgrade / Extension
          </button>
        </div>
      </AdminCard>
    </div>
  );
};
