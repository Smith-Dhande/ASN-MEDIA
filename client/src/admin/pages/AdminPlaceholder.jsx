import React from 'react';
import { useLocation } from 'react-router-dom';
import { AdminCard } from '../components/ui/AdminCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export const AdminPlaceholder = ({
  moduleName,
  sectionCategory = 'Business Operations',
  plannedFeatures = [],
}) => {
  const location = useLocation();

  const formattedTitle =
    moduleName ||
    location.pathname
      .split('/')
      .pop()
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

  const defaultPlannedFeatures = plannedFeatures.length > 0 ? plannedFeatures : [
    'Comprehensive data grid with multi-column sorting and filtering',
    'Interactive search and quick-action drawers',
    'Status workflow management and relational links',
    'Export capabilities and localized audit history',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0A0A0A]/12">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-[#8E722A] uppercase tracking-wider">
              {sectionCategory}
            </span>
            <span className="text-[#0A0A0A]/30">•</span>
            <StatusBadge status="Planning" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-[#0A0A0A] font-normal tracking-tight">
            {formattedTitle}
          </h1>
          <p className="text-xs text-[#66615A] font-body mt-1">
            Route: <code className="font-mono bg-white px-2 py-0.5 rounded-xs border border-[#0A0A0A]/14 text-[#0A0A0A]">{location.pathname}</code>
          </p>
        </div>
      </div>

      {/* Info Card */}
      <AdminCard
        title="Module Architecture Placeholder"
        subtitle="Phase 1 Foundation & Router Node"
      >
        <div className="flex items-start gap-4 py-3">
          <div className="p-3 bg-[#F7F5EF] rounded-sm text-[#8E722A] shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-3">
            <p className="text-xs text-[#0A0A0A] font-body leading-relaxed">
              This route node is active and correctly wired in the Phase 1 Admin Navigation Shell matching the exact Information Architecture specification.
            </p>

            <span className="text-xs font-mono font-bold text-[#8E722A] uppercase tracking-wider block pt-2">
              PLANNED FUNCTIONALITY FOR PHASE 2+:
            </span>
            <ul className="space-y-2 text-xs text-[#66615A] font-body">
              {defaultPlannedFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C8A13A] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AdminCard>
    </div>
  );
};
