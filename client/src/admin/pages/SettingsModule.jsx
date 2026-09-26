import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminCard } from '../components/ui/AdminCard';
import { FormInput } from '../components/ui/FormInput';
import { FormSelect } from '../components/ui/FormSelect';
import { FormToggle } from '../components/ui/FormToggle';
import { User, Building, Sliders, Database, Save, CheckCircle2, ShieldCheck, Download, RefreshCw } from 'lucide-react';

export const SettingsModule = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Profile Form State
  const [profile, setProfile] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah@asnmedia.in',
    phone: '+91 98765 00112',
    role: 'Super Admin',
  });

  // Company Form State
  const [company, setCompany] = useState({
    agencyName: 'ASN Media & Creative House',
    supportEmail: 'contact@asnmedia.in',
    phone: '+91 98765 43210',
    address: 'Level 14, One Horizon Center, DLF Phase 5, Gurugram',
    taxId: '07AAAAA0000A1Z5',
    currency: 'USD ($)',
  });

  // Platform Config Form State
  const [platform, setPlatform] = useState({
    emailNotifs: true,
    weeklyReportEmail: true,
    scannerIntervalHours: '24',
    googlePlacesApiKey: 'AIzaSyA_*********************',
    webhookEndpoint: 'https://api.asnmedia.in/v1/webhooks/google-reviews',
  });

  // Backup Form State
  const [backup, setBackup] = useState({
    autoBackupEnabled: true,
    backupFrequency: 'Daily at 02:00 AM UTC',
    lastBackupDate: '2026-09-26 02:00 UTC',
  });

  const path = location.pathname;
  const isCompany = path.includes('/company');
  const isPlatform = path.includes('/platform');
  const isBackup = path.includes('/backup');
  // default is profile

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Configuration saved successfully! All settings updated.</span>
        </div>
      )}

      {isCompany ? (
        /* Company Profile Settings */
        <AdminCard className="p-6 space-y-6">
          <div className="border-b border-[#0A0A0A]/10 pb-4">
            <h2 className="font-serif font-semibold text-lg text-[#111111]">Company Profile & Branding</h2>
            <p className="text-xs text-[#66615A] font-body mt-0.5">
              Agency metadata, tax IDs, contact details, and invoice header credentials.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <FormInput
              label="Agency Registered Name"
              value={company.agencyName}
              onChange={(e) => setCompany({ ...company, agencyName: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Support Email Address"
                type="email"
                value={company.supportEmail}
                onChange={(e) => setCompany({ ...company, supportEmail: e.target.value })}
                required
              />
              <FormInput
                label="Contact Hotline"
                value={company.phone}
                onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                required
              />
            </div>

            <FormInput
              label="Corporate Headquarters Address"
              value={company.address}
              onChange={(e) => setCompany({ ...company, address: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="GSTIN / Tax Identification Number"
                value={company.taxId}
                onChange={(e) => setCompany({ ...company, taxId: e.target.value })}
                required
              />
              <FormSelect
                label="Default Invoicing Currency"
                value={company.currency}
                onChange={(e) => setCompany({ ...company, currency: e.target.value })}
                options={['USD ($)', 'INR (₹)', 'EUR (€)', 'GBP (£)']}
              />
            </div>

            <div className="pt-4 border-t border-[#0A0A0A]/10 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-mono font-bold bg-[#8E722A] hover:bg-[#725B20] text-white rounded-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Company Info</span>
              </button>
            </div>
          </form>
        </AdminCard>
      ) : isPlatform ? (
        /* Platform Configuration Settings */
        <AdminCard className="p-6 space-y-6">
          <div className="border-b border-[#0A0A0A]/10 pb-4">
            <h2 className="font-serif font-semibold text-lg text-[#111111]">Platform Configuration & Integrations</h2>
            <p className="text-xs text-[#66615A] font-body mt-0.5">
              API integrations, notification dispatch toggles, and review scanner polling intervals.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8E722A]">
                Notification Toggles
              </h3>
              <FormToggle
                label="Enable Real-Time Email Alerts for New Website Enquiries"
                checked={platform.emailNotifs}
                onChange={(val) => setPlatform({ ...platform, emailNotifs: val })}
              />
              <FormToggle
                label="Send Weekly Consolidated Executive Performance Summary"
                checked={platform.weeklyReportEmail}
                onChange={(val) => setPlatform({ ...platform, weeklyReportEmail: val })}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-[#0A0A0A]/10">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8E722A]">
                Google Places API & Webhooks
              </h3>

              <FormInput
                label="Google Places API Key"
                type="password"
                value={platform.googlePlacesApiKey}
                onChange={(e) => setPlatform({ ...platform, googlePlacesApiKey: e.target.value })}
              />

              <FormInput
                label="Review Scanner Webhook Listener Endpoint"
                value={platform.webhookEndpoint}
                onChange={(e) => setPlatform({ ...platform, webhookEndpoint: e.target.value })}
              />

              <FormSelect
                label="Google Review Scanner Sync Frequency"
                value={platform.scannerIntervalHours}
                onChange={(e) => setPlatform({ ...platform, scannerIntervalHours: e.target.value })}
                options={[
                  { label: 'Every 6 Hours', value: '6' },
                  { label: 'Every 12 Hours', value: '12' },
                  { label: 'Every 24 Hours (Daily)', value: '24' },
                ]}
              />
            </div>

            <div className="pt-4 border-t border-[#0A0A0A]/10 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-mono font-bold bg-[#8E722A] hover:bg-[#725B20] text-white rounded-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Platform Config</span>
              </button>
            </div>
          </form>
        </AdminCard>
      ) : isBackup ? (
        /* Backup & Recovery Settings */
        <AdminCard className="p-6 space-y-6">
          <div className="border-b border-[#0A0A0A]/10 pb-4">
            <h2 className="font-serif font-semibold text-lg text-[#111111]">Data Backup & Recovery System</h2>
            <p className="text-xs text-[#66615A] font-body mt-0.5">
              Automated database snapshot schedules, manual backups, and data restoration utilities.
            </p>
          </div>

          <div className="p-4 bg-[#F7F5EF] rounded-sm border border-[#0A0A0A]/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#66615A]">Automated Snapshot Status</span>
              <span className="font-bold text-emerald-700 uppercase">Active & Protected</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#66615A]">Last Successful Full Backup</span>
              <span className="font-semibold text-[#111111]">{backup.lastBackupDate}</span>
            </div>
          </div>

          <div className="space-y-4">
            <FormToggle
              label="Enable Automated Nightly Encrypted Snapshots"
              checked={backup.autoBackupEnabled}
              onChange={(val) => setBackup({ ...backup, autoBackupEnabled: val })}
            />

            <FormSelect
              label="Snapshot Frequency Schedule"
              value={backup.backupFrequency}
              onChange={(e) => setBackup({ ...backup, backupFrequency: e.target.value })}
              options={[
                'Daily at 02:00 AM UTC',
                'Every 12 Hours',
                'Weekly on Sunday midnight',
              ]}
            />
          </div>

          <div className="pt-4 border-t border-[#0A0A0A]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => {
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 2000);
              }}
              className="w-full sm:w-auto px-4 py-2 text-xs font-mono font-bold bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Data Backup (.JSON)</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-auto px-5 py-2 text-xs font-mono font-bold bg-[#8E722A] hover:bg-[#725B20] text-white rounded-xs transition-colors"
            >
              Save Schedule Settings
            </button>
          </div>
        </AdminCard>
      ) : (
        /* Admin Profile Settings (Default) */
        <AdminCard className="p-6 space-y-6">
          <div className="border-b border-[#0A0A0A]/10 pb-4">
            <h2 className="font-serif font-semibold text-lg text-[#111111]">Admin Profile Settings</h2>
            <p className="text-xs text-[#66615A] font-body mt-0.5">
              Manage your personal credentials, contact phone, and account security.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[#F7F5EF] rounded-sm border border-[#0A0A0A]/08">
              <div className="w-12 h-12 rounded-full bg-[#8E722A] text-white font-mono font-bold text-lg flex items-center justify-center">
                SJ
              </div>
              <div>
                <div className="font-semibold text-sm text-[#111111]">{profile.name}</div>
                <div className="text-xs font-mono text-[#66615A]">{profile.role} • ASN Media Admin</div>
              </div>
            </div>

            <FormInput
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Email Address"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
              />
              <FormInput
                label="Contact Phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                required
              />
            </div>

            <div className="pt-4 border-t border-[#0A0A0A]/10 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-mono font-bold bg-[#8E722A] hover:bg-[#725B20] text-white rounded-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </AdminCard>
      )}
    </div>
  );
};
