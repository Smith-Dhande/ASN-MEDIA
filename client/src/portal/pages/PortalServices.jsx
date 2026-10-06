import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortalClient } from '../context/PortalContext';
import { AdminCard } from '../../admin/components/ui/AdminCard';
import { StatusBadge } from '../../admin/components/ui/StatusBadge';
import { Layers, CheckCircle2, Clock, Plus, ArrowRight, Video, Image, FileText, BarChart3 } from 'lucide-react';

export const PortalServices = () => {
  const { currentClient, clientProjects } = usePortalClient();
  const navigate = useNavigate();

  const servicesList = [
    {
      name: 'Social Media Management',
      code: 'SMS-01',
      sla: 'Monthly SLA',
      deliverables: 'Complete calendar management & community engagement',
      status: 'Active',
      icon: Layers,
    },
    {
      name: 'Short-Form Video Production',
      code: 'VID-02',
      sla: '12 Videos / month',
      deliverables: 'Scripting, filming, editing, and audio licensing',
      status: 'In Production',
      icon: Video,
    },
    {
      name: 'Graphic Design & Brand Assets',
      code: 'DES-03',
      sla: '20 Assets / month',
      deliverables: 'Static posts, stories, carousels, and promotional banners',
      status: 'Active',
      icon: Image,
    },
    {
      name: 'Analytics & Growth Reporting',
      code: 'REP-04',
      sla: 'Monthly End-of-Month Report',
      deliverables: 'Reach, engagement, follower growth, and conversion metrics',
      status: 'Completed',
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#0A0A0A]/08">
        <div>
          <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
            SERVICE CAPABILITIES
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-normal text-[#111111]">
            My Assigned Services
          </h1>
        </div>
        <button
          onClick={() => navigate('/portal/enquiries')}
          className="px-4 py-2 bg-[#111111] text-[#F7F5EF] text-xs font-mono font-bold rounded-md hover:bg-[#8E722A] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#C8A13A]" />
          <span>Request New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {servicesList.map((svc, i) => {
          const Icon = svc.icon;
          const relatedProject = clientProjects.find((p) => p.serviceName?.includes(svc.name) || p.title?.includes(svc.name));
          return (
            <AdminCard key={i} className="p-5 space-y-4 hover:border-[#8E722A]/40 transition-colors">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#FAF8F3] text-[#8E722A] border border-[#0A0A0A]/08">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-[#8E722A]">{svc.code}</span>
                    <h3 className="font-bold text-sm text-[#111111]">{svc.name}</h3>
                  </div>
                </div>
                <StatusBadge status={svc.status} />
              </div>

              <p className="text-xs text-[#685C43] leading-relaxed">{svc.deliverables}</p>

              <div className="p-3 bg-[#FAF8F3] rounded-lg border border-[#0A0A0A]/06 flex items-center justify-between text-xs font-mono">
                <span className="text-[#685C43]">Service SLA / Output:</span>
                <span className="font-bold text-[#111111]">{svc.sla}</span>
              </div>

              {relatedProject && (
                <div className="pt-2 border-t border-[#0A0A0A]/06 flex justify-between items-center text-[11px] font-mono">
                  <span className="text-[#685C43]">Active Project: {relatedProject.title}</span>
                  <button
                    onClick={() => navigate(`/portal/projects/${relatedProject.id}`)}
                    className="text-[#8E722A] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View Project</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
};
