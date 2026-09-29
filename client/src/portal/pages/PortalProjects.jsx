import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePortalClient } from '../context/PortalContext';
import { AdminCard } from '../../admin/components/ui/AdminCard';
import { StatusBadge } from '../../admin/components/ui/StatusBadge';
import { EmptyState } from '../../admin/components/ui/EmptyState';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  Layers,
  User,
  CheckSquare,
} from 'lucide-react';

export const PortalProjects = () => {
  const { clientProjects } = usePortalClient();
  const { projectId } = useParams();
  const navigate = useNavigate();

  // If URL has projectId, render Dedicated Project Workspace View
  if (projectId) {
    const project = clientProjects.find((p) => String(p.id) === String(projectId));

    if (!project) {
      return (
        <div className="py-12">
          <EmptyState
            icon={FolderKanban}
            title="Project Workspace Not Found"
            description={`No project found matching ID "${projectId}" in your client account.`}
            actionLabel="Return to My Projects"
            onAction={() => navigate('/portal/projects')}
          />
        </div>
      );
    }

    return (
      <div className="space-y-6 font-body">
        {/* Top Header & Navigation */}
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#0A0A0A]/08">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/portal/projects')}
              className="px-3 py-1.5 text-xs font-mono font-bold bg-[#FAF8F3] hover:bg-[#8E722A] hover:text-white border border-[#0A0A0A]/12 text-[#111111] rounded-md transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Projects</span>
            </button>
            <div className="text-xs font-mono text-[#685C43]">
              Projects / <span className="font-bold text-[#111111]">{project.title}</span>
            </div>
          </div>

          <StatusBadge status={project.status} />
        </div>

        {/* Project Header Banner Card */}
        <AdminCard className="p-6 bg-white border-[#0A0A0A]/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase bg-[#FAF8F3] text-[#8E722A] border border-[#8E722A]/30 rounded-xs">
                {project.serviceName || 'Social Media Management'}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-normal text-[#111111]">
                {project.title}
              </h1>
              <p className="text-xs font-mono text-[#685C43]">
                {project.description || 'Dedicated media campaign and production deliverables stream.'}
              </p>
            </div>

            <div className="text-right font-mono text-xs text-[#685C43] space-y-1">
              <div>Start: <strong className="text-[#111111]">{project.startDate}</strong></div>
              <div>Target Deadline: <strong className="text-[#8E722A]">{project.dueDate}</strong></div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/08 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-[#111111]">Overall Project Progress</span>
              <span className="font-bold text-[#8E722A] text-sm">{project.progressPct}% Complete</span>
            </div>
            <div className="w-full bg-white h-3 rounded-full overflow-hidden border border-[#0A0A0A]/08">
              <div
                className="bg-[#8E722A] h-full transition-all duration-500 rounded-full"
                style={{ width: `${project.progressPct}%` }}
              />
            </div>
          </div>
        </AdminCard>

        {/* Milestones & Deliverables Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Milestones Timeline */}
          <AdminCard title="Campaign Milestones Timeline" className="p-5 space-y-4">
            <div className="space-y-3">
              {(
                project.milestones || [
                  { id: 'm1', title: 'Initial Concept & Content Calendar Strategy', completed: true, dueDate: '2026-04-10' },
                  { id: 'm2', title: 'Asset Creation & Video Production Phase', completed: true, dueDate: '2026-04-20' },
                  { id: 'm3', title: 'Client Review & Feedback Approval', completed: false, dueDate: '2026-04-25' },
                  { id: 'm4', title: 'Final Publishing & Distribution Launch', completed: false, dueDate: project.dueDate },
                ]
              ).map((milestone) => (
                <div
                  key={milestone.id}
                  className={`p-3.5 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                    milestone.completed
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                      : 'bg-white border-[#0A0A0A]/08 text-[#111111]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        milestone.completed ? 'text-emerald-600' : 'text-[#685C43]/40'
                      }`}
                    />
                    <div>
                      <span className="font-bold block">{milestone.title}</span>
                      <span className="text-[10px] font-mono text-[#685C43]">Target: {milestone.dueDate}</span>
                    </div>
                  </div>

                  <span
                    className={`font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                      milestone.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-[#FAF8F3] text-[#685C43]'
                    }`}
                  >
                    {milestone.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Deliverable Assets & Downloads */}
          <AdminCard title="Client Deliverables & Files" className="p-5 space-y-4">
            <div className="space-y-2">
              {[
                { name: 'Q2 Content Calendar Strategy (PDF)', size: '2.4 MB', date: '2026-04-10' },
                { name: 'Short-Form Reels Video Pack (ZIP)', size: '48.2 MB', date: '2026-04-18' },
                { name: 'Brand Creative Asset Guidelines (PDF)', size: '5.1 MB', date: '2026-04-20' },
              ].map((file, i) => (
                <div
                  key={i}
                  className="p-3 bg-white rounded-lg border border-[#0A0A0A]/08 flex items-center justify-between text-xs hover:border-[#8E722A] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#8E722A]" />
                    <div>
                      <span className="font-bold text-[#111111] block">{file.name}</span>
                      <span className="text-[10px] font-mono text-[#685C43]">{file.size} • {file.date}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Downloading asset file: ${file.name}`)}
                    className="p-1.5 text-[#8E722A] hover:bg-[#FAF8F3] rounded transition-colors"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>
    );
  }

  // Projects List View
  return (
    <div className="space-y-6 font-body">
      {/* Header */}
      <div className="pb-3 border-b border-[#0A0A0A]/08">
        <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
          PROJECT WORKSPACE
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-normal text-[#111111]">
          My Projects & Production Stream
        </h1>
      </div>

      {clientProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clientProjects.map((project) => (
            <AdminCard
              key={project.id}
              className="p-5 space-y-4 hover:border-[#8E722A] transition-colors cursor-pointer"
              onClick={() => navigate(`/portal/projects/${project.id}`)}
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="font-mono text-[10px] font-bold text-[#8E722A] block">
                    {project.serviceName || 'Social Media Management'}
                  </span>
                  <h3 className="font-bold text-base text-[#111111] hover:text-[#8E722A]">
                    {project.title}
                  </h3>
                </div>
                <StatusBadge status={project.status} />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-[#685C43]">
                  <span>Progress</span>
                  <span className="font-bold text-[#111111]">{project.progressPct}%</span>
                </div>
                <div className="w-full bg-[#FAF8F3] h-2.5 rounded-full overflow-hidden border border-[#0A0A0A]/06">
                  <div
                    className="bg-[#8E722A] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${project.progressPct}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-[#685C43] pt-2 border-t border-[#0A0A0A]/06">
                <span>Start: {project.startDate}</span>
                <span>Deadline: {project.dueDate}</span>
                <span className="text-[#8E722A] font-bold underline">View Workspace →</span>
              </div>
            </AdminCard>
          ))}
        </div>
      ) : (
        <div className="py-12">
          <EmptyState
            icon={FolderKanban}
            title="No Projects Assigned"
            description="You currently have no active projects in production."
            actionLabel="Request New Project"
            onAction={() => navigate('/portal/enquiries')}
          />
        </div>
      )}
    </div>
  );
};
