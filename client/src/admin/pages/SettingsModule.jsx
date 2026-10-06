import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';
import { AdminCard } from '../components/ui/AdminCard';
import { FormInput } from '../components/ui/FormInput';
import { FormSelect } from '../components/ui/FormSelect';
import { FormToggle } from '../components/ui/FormToggle';
import {
  User,
  Building,
  Sliders,
  Database,
  Save,
  CheckCircle2,
  ShieldCheck,
  Download,
  RefreshCw,
  Mail,
  Phone,
  Briefcase,
  Globe,
  Lock,
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';

export const SettingsModule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings, updateSettings, updateAdminProfile, currentUser } = useAdminData();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState('');

  // Profile Form State (Dynamic with DB)
  const [profile, setProfile] = useState({
    name: currentUser?.name || 'Sarah Jenkins',
    email: currentUser?.email || 'sarah@asnmedia.in',
    phone: currentUser?.phone || '+91 98765 00112',
    role: currentUser?.role || 'Super Admin',
    designation: currentUser?.designation || 'Principal Brand Director & Operations Head',
    bio: currentUser?.bio || 'Leading creative digital growth & review marketing operations at ASN Media.',
    avatarUrl: currentUser?.avatar || ''
  });

  // Company Form State (Dynamic with DB)
  const [company, setCompany] = useState({
    agencyName: 'ASN Media & Creative House',
    supportEmail: 'contact@asnmedia.in',
    phone: '+91 98765 43210',
    address: 'Level 14, One Horizon Center, DLF Phase 5, Gurugram, Delhi NCR',
    taxId: '07AAAAA0000A1Z5',
    currency: 'INR (₹)',
  });

  // Platform Config Form State (Dynamic with DB)
  const [platform, setPlatform] = useState({
    emailNotifs: true,
    weeklyReportEmail: true,
    scannerIntervalHours: '24',
    googlePlacesApiKey: 'AIzaSyA_*********************',
    webhookEndpoint: 'https://api.asnmedia.in/v1/webhooks/google-reviews',
  });

  // Backup Form State (Dynamic with DB)
  const [backup, setBackup] = useState({
    autoBackupEnabled: true,
    backupFrequency: 'Daily at 02:00 AM UTC',
    lastBackupDate: '2026-10-02 02:00 UTC',
  });

  // Sync state with live database settings & currentUser whenever settings or user object changes
  useEffect(() => {
    if (currentUser) {
      setProfile((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        role: currentUser.role || prev.role,
        designation: currentUser.designation || prev.designation,
        avatarUrl: currentUser.avatar || prev.avatarUrl
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (!settings) return;

    if (settings.adminProfile) {
      setProfile((prev) => ({
        ...prev,
        ...settings.adminProfile,
        name: currentUser?.name || settings.adminProfile.name || prev.name,
        email: currentUser?.email || settings.adminProfile.email || prev.email,
      }));
    } else if (settings.name || settings.email) {
      setProfile((prev) => ({
        ...prev,
        name: currentUser?.name || settings.name || prev.name,
        email: currentUser?.email || settings.email || prev.email,
        phone: currentUser?.phone || settings.phone || prev.phone,
        role: currentUser?.role || settings.role || prev.role
      }));
    }

    if (settings.company) {
      setCompany((prev) => ({
        ...prev,
        ...settings.company
      }));
    } else if (settings.companyName) {
      setCompany((prev) => ({
        ...prev,
        agencyName: settings.companyName || prev.agencyName,
        supportEmail: settings.email || prev.supportEmail,
        phone: settings.phone || prev.phone,
        address: settings.address || prev.address,
        currency: settings.defaultCurrency || prev.currency
      }));
    }

    if (settings.platform) {
      setPlatform((prev) => ({
        ...prev,
        ...settings.platform
      }));
    }

    if (settings.backup) {
      setBackup((prev) => ({
        ...prev,
        ...settings.backup
      }));
    }
  }, [settings]);

  const path = location.pathname;
  const isCompany = path.includes('/company');
  const isPlatform = path.includes('/platform');
  const isBackup = path.includes('/backup');
  const isProfile = !isCompany && !isPlatform && !isBackup;

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Update personal Super Admin profile in database
      if (updateAdminProfile) {
        await updateAdminProfile(profile);
      }

      // 2. Update global platform and company settings
      const payload = {
        ...settings,
        adminProfile: profile,
        company: company,
        platform: platform,
        backup: backup,
        companyName: company.agencyName,
        email: company.supportEmail,
        phone: company.phone,
        address: company.address,
        defaultCurrency: company.currency
      };

      await updateSettings(payload);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      platformVersion: '2.5.0',
      settings: {
        adminProfile: profile,
        company,
        platform,
        backup
      }
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `asn_media_system_config_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadNotice('System configuration exported and downloaded successfully!');
    setTimeout(() => setDownloadNotice(''), 3000);
  };

  return (
    <div className="w-full space-y-6 font-body">
      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#0A0A0A]/10 text-xs font-mono">
        {[
          { path: '/admin/settings', label: 'Admin Profile', icon: User, active: isProfile },
          { path: '/admin/settings/company', label: 'Company & Branding', icon: Building, active: isCompany },
          { path: '/admin/settings/platform', label: 'Platform & APIs', icon: Sliders, active: isPlatform },
          { path: '/admin/settings/backup', label: 'Backup & Security', icon: Database, active: isBackup }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => navigate(tab.path)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                tab.active
                  ? 'bg-[#111111] text-[#F7F5EF] shadow-sm'
                  : 'bg-white text-[#685C43] hover:text-[#111111] border border-[#0A0A0A]/08 hover:bg-[#FAF8F3]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.active ? 'text-[#8E722A]' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-xl flex items-center gap-2.5 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Configuration saved successfully to MongoDB! Live system updated.</span>
        </div>
      )}

      {downloadNotice && (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono rounded-xl flex items-center gap-2.5 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {isCompany ? (
        /* Company Profile Settings */
        <AdminCard className="p-6 space-y-6">
          <div className="border-b border-[#0A0A0A]/10 pb-4">
            <h2 className="font-display font-bold text-lg text-[#111111]">Company Profile & Branding</h2>
            <p className="text-xs text-[#685C43] font-body mt-0.5">
              Agency metadata, tax GSTIN credentials, contact details, and invoice header configurations.
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
                options={['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)']}
              />
            </div>

            <div className="pt-4 border-t border-[#0A0A0A]/10 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 text-xs font-mono font-bold bg-[#111111] hover:bg-[#8E722A] text-[#F7F5EF] rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-[#8E722A]" />}
                <span>{isSaving ? 'Saving to Database...' : 'Save Company Info'}</span>
              </button>
            </div>
          </form>
        </AdminCard>
      ) : isPlatform ? (
        /* Platform Configuration Settings */
        <AdminCard className="p-6 space-y-6">
          <div className="border-b border-[#0A0A0A]/10 pb-4">
            <h2 className="font-display font-bold text-lg text-[#111111]">Platform Configuration & Integrations</h2>
            <p className="text-xs text-[#685C43] font-body mt-0.5">
              API integrations, email notification dispatch toggles, and review scanner polling intervals.
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
                disabled={isSaving}
                className="px-6 py-2.5 text-xs font-mono font-bold bg-[#111111] hover:bg-[#8E722A] text-[#F7F5EF] rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-[#8E722A]" />}
                <span>{isSaving ? 'Saving to Database...' : 'Save Platform Config'}</span>
              </button>
            </div>
          </form>
        </AdminCard>
      ) : isBackup ? (
        /* Backup & Recovery Settings */
        <AdminCard className="p-6 space-y-6">
          <div className="border-b border-[#0A0A0A]/10 pb-4">
            <h2 className="font-display font-bold text-lg text-[#111111]">Data Backup & Recovery System</h2>
            <p className="text-xs text-[#685C43] font-body mt-0.5">
              Automated database snapshot schedules, manual backups, and data restoration utilities.
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#685C43]">Automated Snapshot Status:</span>
              <span className="font-bold text-emerald-700 uppercase flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Active & Protected</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#685C43]">Last Successful Full Backup:</span>
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
              type="button"
              onClick={handleDownloadBackup}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-mono font-bold bg-[#FAF8F3] hover:bg-[#111111] text-[#111111] hover:text-[#F7F5EF] border border-[#0A0A0A]/15 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download System Backup (.JSON)</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-mono font-bold bg-[#111111] hover:bg-[#8E722A] text-[#F7F5EF] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-[#8E722A]" />}
              <span>{isSaving ? 'Saving...' : 'Save Schedule Settings'}</span>
            </button>
          </div>
        </AdminCard>
      ) : (
        /* Admin Profile Settings (Default) */
        <AdminCard className="p-6 space-y-6">
          <div className="border-b border-[#0A0A0A]/10 pb-4">
            <h2 className="font-display font-bold text-lg text-[#111111]">Admin Profile Settings</h2>
            <p className="text-xs text-[#685C43] font-body mt-0.5">
              Manage your personal credentials, contact details, operational role, and executive bio.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Profile Header Avatar Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#FAF8F3] rounded-xl border border-[#0A0A0A]/10">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-full bg-[#111111] text-[#F7F5EF] font-display font-bold text-lg flex items-center justify-center border-2 border-[#8E722A] shadow-sm">
                  {profile.name
                    ? profile.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                    : 'SJ'}
                </div>
                <div>
                  <div className="font-display font-bold text-base text-[#111111]">{profile.name}</div>
                  <div className="text-xs font-mono text-[#8E722A] font-semibold">{profile.role} • ASN Media Master Admin</div>
                  <div className="text-[11px] text-[#685C43]">{profile.designation}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Database Synced</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Full Administrator Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="e.g. Sarah Jenkins"
                required
              />

              <FormInput
                label="Executive Role / Privilege Level"
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                placeholder="e.g. Super Admin"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Official Email Address"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="admin@asnmedia.in"
                required
              />
              <FormInput
                label="Direct Contact Phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+91 98765 00112"
                required
              />
            </div>

            <FormInput
              label="Corporate Designation / Title"
              value={profile.designation}
              onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
              placeholder="e.g. Principal Brand Director & Operations Head"
            />

            <div>
              <label className="block text-xs font-semibold text-[#111111] font-mono mb-1.5">
                Executive Bio / Operational Responsibilities
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full text-xs bg-[#FAF8F3] border border-[#0A0A0A]/15 rounded-lg p-3 font-body focus:outline-none focus:border-[#8E722A] focus:ring-1 focus:ring-[#8E722A] transition-all"
                placeholder="Describe administrator focus areas and responsibilities..."
              />
            </div>

            <div className="pt-4 border-t border-[#0A0A0A]/10 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 text-xs font-mono font-bold bg-[#111111] hover:bg-[#8E722A] text-[#F7F5EF] rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-[#8E722A]" />}
                <span>{isSaving ? 'Saving to Database...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </AdminCard>
      )}
    </div>
  );
};

export default SettingsModule;
