import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { AdminCard } from '../components/ui/AdminCard';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Kanban, CheckCircle2, Clock, Users, ArrowRight, AlertCircle } from 'lucide-react';

export const ProjectsTasksModule = () => {
  const { projects, tasks, staff } = useAdminData();
  const location = useLocation();

  const isTasksMode = location.pathname.endsWith('/tasks');
  const isWorkloadMode = location.pathname.endsWith('/workload');

  // Columns for Projects Table
  const projectColumns = [
    {
      header: 'PROJECT TITLE',
      key: 'title',
      render: (row) => (
        <div>
          <span className="font-bold text-[#111111] block font-body text-xs">{row.title}</span>
          <span className="text-[11px] text-[#685C43]">Client: {row.clientName}</span>
        </div>
      ),
    },
    {
      header: 'LEAD STAFF',
      key: 'leadStaff',
      render: (row) => <span className="font-body text-xs text-[#221C11] font-semibold">{row.leadStaff}</span>,
    },
    {
      header: 'PROGRESS',
      key: 'progressPct',
      render: (row) => (
        <div className="w-32 space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-[#685C43]">
            <span>Completion</span>
            <span className="font-bold text-[#111111]">{row.progressPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#FAF8F3] rounded-full overflow-hidden border border-[#0A0A0A]/06">
            <div
              className="h-full bg-[#8E722A] rounded-full transition-all duration-500"
              style={{ width: `${row.progressPct}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'DUE DATE',
      key: 'dueDate',
      render: (row) => <span className="font-mono text-[11px] text-[#685C43]">{row.dueDate}</span>,
    },
    {
      header: 'STATUS',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-6 font-body">
      {isTasksMode ? (
        /* View: Kanban Task Board View */
        <div className="space-y-4">
          <div className="pb-3 border-b border-[#0A0A0A]/08">
            <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
              TASK KANBAN BOARD
            </span>
            <h2 className="font-display text-2xl font-normal text-[#111111]">
              Production Tasks Stream
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['To Do', 'In Progress', 'Review', 'Completed'].map((statusKey) => {
              const statusTasks = tasks.filter((t) => t.status === statusKey);
              return (
                <div key={statusKey} className="bg-[#FAF8F3] rounded-xl p-3 border border-[#0A0A0A]/06 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#0A0A0A]/06">
                    <span className="font-mono text-xs font-bold text-[#111111] uppercase">{statusKey}</span>
                    <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-[#0A0A0A]/08 text-[#685C43]">
                      {statusTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {statusTasks.map((t) => (
                      <div key={t.id} className="p-3 bg-white rounded-lg border border-[#0A0A0A]/08 shadow-2xs space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-[#111111] leading-snug">{t.title}</h4>
                          <StatusBadge status={t.priority} />
                        </div>
                        <span className="text-[10px] font-mono text-[#685C43] block">Client: {t.clientName}</span>
                        <div className="pt-2 border-t border-[#0A0A0A]/04 flex items-center justify-between text-[10px] font-mono text-[#685C43]">
                          <span>{t.assignee}</span>
                          <span>Due {t.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : isWorkloadMode ? (
        /* View: Team Workload View */
        <div className="space-y-4">
          <div className="pb-3 border-b border-[#0A0A0A]/08">
            <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
              RESOURCE ALLOCATION
            </span>
            <h2 className="font-display text-2xl font-normal text-[#111111]">
              Team Workload & Active Tasks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staff.map((member) => (
              <AdminCard key={member.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#111111] text-[#F7F5EF] font-mono text-xs font-bold flex items-center justify-center border border-[#8E722A]">
                      {member.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#111111]">{member.name}</h3>
                      <span className="text-[11px] font-mono text-[#685C43]">{member.role}</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#8E722A] bg-[#FAF8F3] px-3 py-1 rounded-full border border-[#0A0A0A]/08">
                    {member.activeTasksCount} Active Tasks
                  </span>
                </div>
              </AdminCard>
            ))}
          </div>
        </div>
      ) : (
        /* View: Projects List */
        <div className="space-y-4">
          <div className="pb-3 border-b border-[#0A0A0A]/08">
            <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
              PRODUCTION PIPELINE
            </span>
            <h2 className="font-display text-2xl font-normal text-[#111111]">
              Active Client Projects
            </h2>
          </div>

          <AdminCard noPadding>
            <DataTable columns={projectColumns} data={projects} />
          </AdminCard>
        </div>
      )}
    </div>
  );
};
