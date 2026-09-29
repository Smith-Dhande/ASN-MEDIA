import React, { useState } from 'react';
import { usePortalClient } from '../context/PortalContext';
import { AdminCard } from '../../admin/components/ui/AdminCard';
import { StatusBadge } from '../../admin/components/ui/StatusBadge';
import { FormInput } from '../../admin/components/ui/FormInput';
import { FormSelect } from '../../admin/components/ui/FormSelect';
import { MessageSquare, Plus, CheckCircle2, Send, Clock, HelpCircle, FileText } from 'lucide-react';

export const PortalEnquiries = () => {
  const { currentClient, clientEnquiries, submitEnquiry } = usePortalClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    category: 'New Service Request',
    serviceRequested: 'Social Media Management',
    budgetTier: '$5,000 - $10,000',
    timeline: 'Within 1 Month',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitEnquiry(form);
      setIsSubmitting(false);
      setIsFormOpen(false);
      setForm({
        category: 'New Service Request',
        serviceRequested: 'Social Media Management',
        budgetTier: '$5,000 - $10,000',
        timeline: 'Within 1 Month',
        description: '',
      });
      setToastMessage('Your support request has been submitted to your Account Manager!');
      setTimeout(() => setToastMessage(''), 3500);
    }, 600);
  };

  return (
    <div className="space-y-6 font-body">
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-md flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#0A0A0A]/08">
        <div>
          <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
            SUPPORT & SERVICE REQUESTS
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-normal text-[#111111]">
            Enquiries & Agency Helpdesk
          </h1>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2 bg-[#111111] text-[#F7F5EF] text-xs font-mono font-bold rounded-md hover:bg-[#8E722A] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#C8A13A]" />
          <span>{isFormOpen ? 'Cancel Form' : 'New Request'}</span>
        </button>
      </div>

      {/* Embedded Food College Style Request Form */}
      {isFormOpen && (
        <AdminCard className="p-6 border-[#8E722A]/40 space-y-6 bg-white animate-in fade-in slide-in-from-top-2">
          <div className="pb-3 border-b border-[#0A0A0A]/08">
            <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
              SUBMIT NEW REQUEST
            </span>
            <h2 className="font-display text-xl font-normal text-[#111111]">
              Agency Support & Service Form
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Request Category & Type */}
            <div className="space-y-4">
              <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">
                01. REQUEST CATEGORY & SERVICE
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Request Category *"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  options={[
                    'New Service Request',
                    'Project Campaign Request',
                    'Support & Helpdesk',
                    'Billing & Invoice Query',
                    'General Inquiry',
                  ]}
                />
                <FormSelect
                  label="Target Service Scope *"
                  value={form.serviceRequested}
                  onChange={(e) => setForm({ ...form, serviceRequested: e.target.value })}
                  options={[
                    'Social Media Management',
                    'Video Production & Retainer',
                    'Content Creation Suite',
                    'Brand Strategy & Launch',
                    'Google Review Scanner Deployment',
                  ]}
                />
              </div>
            </div>

            {/* Section 2: Timeline & Details */}
            <div className="space-y-4 pt-2 border-t border-[#0A0A0A]/06">
              <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">
                02. TIMELINE & SPECIFICATIONS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Expected Timeline *"
                  value={form.timeline}
                  onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                  options={['Immediate', 'Within 1 Month', 'Next Quarter', 'Flexible']}
                />
                <FormSelect
                  label="Budget Tier *"
                  value={form.budgetTier}
                  onChange={(e) => setForm({ ...form, budgetTier: e.target.value })}
                  options={['Standard Retainer', '$3,000 - $5,000', '$5,000 - $10,000', '$10,000+']}
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#111111] mb-1">
                  Request Details / Specification Message *
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your request, campaign goals, or support needs in detail..."
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F3] border border-[#0A0A0A]/14 rounded-md focus:outline-none focus:border-[#8E722A] font-body"
                  required
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#0A0A0A]/08 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-xs font-mono text-[#685C43] hover:text-[#111111]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-md hover:bg-[#8E722A] transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-[#C8A13A]" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Support Request'}</span>
              </button>
            </div>
          </form>
        </AdminCard>
      )}

      {/* History of Requests */}
      <AdminCard title={`Submitted Support & Service Requests (${clientEnquiries.length})`} className="p-5">
        {clientEnquiries.length > 0 ? (
          <div className="space-y-3">
            {clientEnquiries.map((enq) => (
              <div key={enq.id} className="p-4 bg-white rounded-lg border border-[#0A0A0A]/08 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-[#111111]">{enq.serviceRequested}</h4>
                  <StatusBadge status={enq.status} />
                </div>
                <p className="text-[#685C43] leading-relaxed">"{enq.description}"</p>
                <div className="flex justify-between items-center text-[10px] font-mono text-[#685C43] pt-2 border-t border-[#0A0A0A]/04">
                  <span>Submitted: {enq.dateSubmitted || 'Recent'}</span>
                  <span>Assigned Lead: {enq.assignedTo || 'Sarah Jenkins'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#685C43] font-mono italic">No requests submitted yet.</p>
        )}
      </AdminCard>
    </div>
  );
};
