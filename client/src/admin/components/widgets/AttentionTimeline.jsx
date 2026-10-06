import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, ArrowUpRight, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AttentionTimeline = ({ clients = [], payments = [], tasks = [], enquiries = [] }) => {
  const expiringClients = clients.filter(
    (c) => c.expiryDate && (c.expiryDate.startsWith('2026-04') || c.expiryDate.startsWith('2026-05') || c.expiryDate.startsWith('2026-10'))
  );
  const overduePayments = payments.filter((p) => p.status === 'Overdue');
  const urgentTasks = tasks.filter((t) => t.status !== 'Completed');
  const newEnquiries = enquiries.filter((e) => e.status === 'New');

  return (
    <div className="bg-white rounded-xl p-5 shadow-2xs border border-[#0A0A0A]/06">
      {/* Timeline Header */}
      <div className="pb-3.5 border-b border-[#0A0A0A]/06">
        <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block mb-0.5">
          OPERATIONAL STREAM
        </span>
        <h3 className="font-display text-lg font-normal text-[#111111]">
          Attention & Upcoming
        </h3>
      </div>

      {/* Editorial Timeline Stream */}
      <div className="divide-y divide-[#0A0A0A]/06">
        {/* Item 1: Overdue Invoice Alert */}
        {overduePayments.length > 0 && (
          <div className="py-3 flex items-start justify-between gap-3 group">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-md bg-red-50 text-red-700 shrink-0 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#111111] font-body">
                    {overduePayments[0].clientName} (₹{overduePayments[0].amount.toLocaleString('en-IN')})
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-red-100 text-red-800">
                    Overdue Invoice
                  </span>
                </div>
                <span className="text-[11px] text-[#685C43] font-body block mt-0.5">
                  Invoice #{overduePayments[0].invoiceNumber} requires collection outreach.
                </span>
              </div>
            </div>
            <Link
              to="/admin/payments/outstanding"
              className="text-[#8E722A] group-hover:text-[#111111] transition-colors p-1 shrink-0"
              title="View Outstanding Invoices"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Item 2: Package Expiry Notice */}
        {expiringClients.length > 0 && (
          <div className="py-3 flex items-start justify-between gap-3 group">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-md bg-amber-50 text-amber-800 shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#111111] font-body">
                    {expiringClients[0].name} Retainer
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900">
                    Expiring Package
                  </span>
                </div>
                <span className="text-[11px] text-[#685C43] font-body block mt-0.5">
                  Package ({expiringClients[0].packageAssigned}) renewal due {expiringClients[0].expiryDate}.
                </span>
              </div>
            </div>
            <Link
              to="/admin/clients/expiring"
              className="text-[#8E722A] group-hover:text-[#111111] transition-colors p-1 shrink-0"
              title="View Expiring Retainers"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Item 3: Urgent Production Deliverable */}
        {urgentTasks.length > 0 && (
          <div className="py-3 flex items-start justify-between gap-3 group">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-md bg-[#FAF8F3] text-[#8E722A] shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#111111] font-body">
                    {urgentTasks[0].title}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-[#E5D9BC]/60 text-[#221C11]">
                    Due {urgentTasks[0].dueDate}
                  </span>
                </div>
                <span className="text-[11px] text-[#685C43] font-body block mt-0.5">
                  Client: {urgentTasks[0].clientName} • Assigned to {urgentTasks[0].assignee}
                </span>
              </div>
            </div>
            <Link
              to="/admin/tasks"
              className="text-[#8E722A] group-hover:text-[#111111] transition-colors p-1 shrink-0"
              title="Open Task Board"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Item 4: New Website Lead */}
        {newEnquiries.length > 0 && (
          <div className="py-3 flex items-start justify-between gap-3 group">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-md bg-[#F7F5EF] text-[#8E722A] shrink-0 mt-0.5">
                <Inbox className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#111111] font-body">
                    {newEnquiries[0].name} ({newEnquiries[0].company})
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-[#111111] text-[#F7F5EF]">
                    New Lead
                  </span>
                </div>
                <span className="text-[11px] text-[#685C43] font-body block mt-0.5">
                  Inquiry for {newEnquiries[0].serviceRequested} • Submitted {newEnquiries[0].dateSubmitted || 'today'}
                </span>
              </div>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-[#8E722A] group-hover:text-[#111111] transition-colors p-1 shrink-0"
              title="Open Enquiry Inbox"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="pt-3 mt-2 border-t border-[#0A0A0A]/06 flex items-center justify-between text-xs font-mono">
        <span className="text-[#685C43]">Operational Action Stream</span>
        <Link
          to="/admin/activity"
          className="text-[#8E722A] hover:text-[#111111] font-bold flex items-center gap-1 uppercase no-underline transition-colors"
        >
          <span>Full Audit Log</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
};
