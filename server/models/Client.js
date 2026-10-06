const mongoose = require('mongoose');

const clientActivitySchema = new mongoose.Schema({
  action: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toLocaleString() },
  actor: { type: String, default: 'Admin' },
  details: { type: String, default: '' }
}, { _id: false });

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactName: { type: String, default: '' },
  businessName: { type: String, default: '' },
  company: { type: String, default: '' },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, default: '' },
  category: { type: String, default: 'General Business' },
  website: { type: String, default: '' },
  socials: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  socialLinks: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: ['New', 'Active', 'Pending', 'On Hold', 'Completed', 'Expired', 'Cancelled', 'Archived'],
    default: 'Active'
  },
  assignedPackageId: { type: String, default: '' },
  packageAssigned: { type: String, default: '' },
  monthlyRetainer: { type: Number, default: 0 },
  packageStartDate: { type: String, default: '' },
  startDate: { type: String, default: '' },
  packageExpiryDate: { type: String, default: '' },
  expiryDate: { type: String, default: '' },
  accountManagerId: { type: String, default: '' },
  accountManager: { type: String, default: 'Sarah Jenkins' },
  assignedStaff: [{ type: String }],
  totalPaid: { type: Number, default: 0 },
  outstandingBalance: { type: Number, default: 0 },
  outstandingDue: { type: Number, default: 0 },
  scannerId: { type: String, default: '' },
  reviewScannerId: { type: String, default: '' },
  activeProjectsCount: { type: Number, default: 0 },
  pendingTasksCount: { type: Number, default: 0 },
  joinedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  tags: [{ type: String }],
  internalNotes: [{ type: String }],
  notes: { type: String, default: '' },
  specificInstructions: { type: String, default: '' },
  activityHistory: [clientActivitySchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Sync aliases before saving
clientSchema.pre('save', function (next) {
  if (!this.businessName && this.company) this.businessName = this.company;
  if (!this.company && this.businessName) this.company = this.businessName;
  if (!this.contactName && this.name) this.contactName = this.name;
  if (!this.startDate && this.packageStartDate) this.startDate = this.packageStartDate;
  if (!this.packageStartDate && this.startDate) this.packageStartDate = this.startDate;
  if (!this.expiryDate && this.packageExpiryDate) this.expiryDate = this.packageExpiryDate;
  if (!this.packageExpiryDate && this.expiryDate) this.packageExpiryDate = this.expiryDate;
  if (!this.outstandingBalance && this.outstandingDue) this.outstandingBalance = this.outstandingDue;
  if (!this.outstandingDue && this.outstandingBalance) this.outstandingDue = this.outstandingBalance;
  if (!this.scannerId && this.reviewScannerId) this.scannerId = this.reviewScannerId;
  if (!this.reviewScannerId && this.scannerId) this.reviewScannerId = this.scannerId;
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Client', clientSchema);
