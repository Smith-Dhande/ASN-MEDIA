const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'global_settings' },
  
  // Dynamic Admin Profile Settings
  adminProfile: {
    name: { type: String, default: 'Sarah Jenkins' },
    email: { type: String, default: 'sarah@asnmedia.in' },
    phone: { type: String, default: '+91 98765 00112' },
    role: { type: String, default: 'Super Admin' },
    designation: { type: String, default: 'Principal Brand Director & Operations Head' },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: 'Leading creative digital growth & review marketing operations at ASN Media.' }
  },

  // Dynamic Company & Invoicing Settings
  company: {
    agencyName: { type: String, default: 'ASN Media & Creative House' },
    supportEmail: { type: String, default: 'contact@asnmedia.in' },
    phone: { type: String, default: '+91 98765 43210' },
    address: { type: String, default: 'Tower B, 9th Floor, Tech Boulevard, Sector 127, Noida, Delhi NCR 201304' },
    taxId: { type: String, default: '07AAAAA0000A1Z5' },
    currency: { type: String, default: 'INR (₹)' }
  },

  // Dynamic Platform Integrations & Notification Toggles
  platform: {
    emailNotifs: { type: Boolean, default: true },
    weeklyReportEmail: { type: Boolean, default: true },
    scannerIntervalHours: { type: String, default: '24' },
    googlePlacesApiKey: { type: String, default: 'AIzaSyA_*********************' },
    webhookEndpoint: { type: String, default: 'https://api.asnmedia.in/v1/webhooks/google-reviews' }
  },

  // Dynamic Backup & Snapshot Configuration
  backup: {
    autoBackupEnabled: { type: Boolean, default: true },
    backupFrequency: { type: String, default: 'Daily at 02:00 AM UTC' },
    lastBackupDate: { type: String, default: '2026-10-02 02:00 UTC' }
  },

  // Top-level compatibility fields
  companyName: { type: String, default: 'ASN Digital Media' },
  tagline: { type: String, default: 'Premier AI-Driven Digital Growth & Reputation Agency' },
  email: { type: String, default: 'contact@asndigitalmedia.com' },
  phone: { type: String, default: '+91 98200 88990' },
  address: { type: String, default: 'Tower B, 9th Floor, Tech Boulevard, Sector 127, Noida, Delhi NCR 201304' },
  websiteUrl: { type: String, default: 'https://asndigitalmedia.com' },
  defaultCurrency: { type: String, default: 'INR (₹)' },
  currencySymbol: { type: String, default: '₹' },
  dateFormat: { type: String, default: 'DD/MM/YYYY' },
  timezone: { type: String, default: 'Asia/Kolkata (IST)' },

  aiReviewSettings: {
    model: { type: String, default: 'Gemini 2.5 Flash High-Speed' },
    temperature: { type: Number, default: 0.7 },
    apiKeyConfigured: { type: Boolean, default: true },
    reviewLengths: [{ type: String }],
    disclaimer: { type: String, default: 'Reviews are generated as suggestions for honest customer feedback.' }
  },
  branding: {
    primaryColor: { type: String, default: '#8E722A' },
    accentColor: { type: String, default: '#C8A13A' },
    theme: { type: String, default: 'dark' }
  },

  // Dynamic RBAC Permission Matrix managed by Super Admin / Admin
  rbacMatrix: {
    type: Array,
    default: [
      { module: 'Dashboard & Business Analytics', superAdmin: true, admin: true, pm: true, staff: true, accounts: false },
      { module: 'Client Management', superAdmin: true, admin: true, pm: true, staff: true, accounts: true },
      { module: 'Lead & Website Enquiries', superAdmin: true, admin: true, pm: true, staff: true, accounts: false },
      { module: 'Package Management', superAdmin: true, admin: true, pm: true, staff: false, accounts: false },
      { module: 'Service Management', superAdmin: true, admin: true, pm: true, staff: false, accounts: false },
      { module: 'Project & Task Management', superAdmin: true, admin: true, pm: true, staff: true, accounts: false },
      { module: 'Payment Management & Financials', superAdmin: true, admin: true, pm: false, staff: false, accounts: true },
      { module: 'AI-Assisted Google Review Scanners', superAdmin: true, admin: true, pm: true, staff: true, accounts: false },
      { module: 'Reports & Business Analytics', superAdmin: true, admin: true, pm: true, staff: false, accounts: true },
      { module: 'Staff & Role Management (RBAC)', superAdmin: true, admin: true, pm: false, staff: false, accounts: false },
      { module: 'Notifications & Reminders', superAdmin: true, admin: true, pm: true, staff: true, accounts: true },
      { module: 'Activity Logs & Audit Trail', superAdmin: true, admin: true, pm: false, staff: false, accounts: false },
      { module: 'System Settings & Data Recovery', superAdmin: true, admin: false, pm: false, staff: false, accounts: false },
    ]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);
