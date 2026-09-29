import React, { useState } from 'react';
import { usePortalClient } from '../context/PortalContext';
import { AdminCard } from '../../admin/components/ui/AdminCard';
import { FormInput } from '../../admin/components/ui/FormInput';
import { User, Building, Mail, Phone, Globe, CheckCircle2, Save } from 'lucide-react';

export const PortalProfile = () => {
  const { currentClient, updateProfile } = usePortalClient();
  const [toastMsg, setToastMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    contactName: currentClient?.contactName || '',
    company: currentClient?.company || '',
    email: currentClient?.email || '',
    phone: currentClient?.phone || '',
    website: currentClient?.website || 'https://asnmedia.in',
    instagram: currentClient?.socialLinks?.instagram || '@client',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      updateProfile({
        contactName: form.contactName,
        company: form.company,
        email: form.email,
        phone: form.phone,
        website: form.website,
        socialLinks: { instagram: form.instagram, linkedin: 'company/client' },
      });

      setIsSubmitting(false);
      setToastMsg('Account profile details updated successfully!');
      setTimeout(() => setToastMsg(''), 3500);
    }, 500);
  };

  return (
    <div className="space-y-6 font-body max-w-4xl mx-auto">
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-md flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-3 border-b border-[#0A0A0A]/08">
        <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-widest block">
          ACCOUNT MANAGEMENT
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-normal text-[#111111]">
          My Client Profile Settings
        </h1>
      </div>

      {/* Profile Card */}
      <AdminCard className="p-6 bg-white border-[#0A0A0A]/10 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Contact Information */}
          <div className="space-y-4">
            <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">
              01. PRIMARY CONTACT INFORMATION
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Primary Contact Person *"
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                required
              />
              <FormInput
                label="Company / Entity Name *"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Email Address *"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <FormInput
                label="Phone Number *"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Section 2: Business & Digital Links */}
          <div className="space-y-4 pt-4 border-t border-[#0A0A0A]/06">
            <span className="font-mono text-[10px] font-bold text-[#8E722A] uppercase block">
              02. BUSINESS & DIGITAL LINKS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Official Website URL"
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
              <FormInput
                label="Instagram Handle"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              />
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="pt-4 border-t border-[#0A0A0A]/08 flex justify-end gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] rounded-md hover:bg-[#8E722A] transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-[#C8A13A]" />
              <span>{isSubmitting ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </AdminCard>
    </div>
  );
};
