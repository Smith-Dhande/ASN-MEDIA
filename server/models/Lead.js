const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  id: { type: String, default: () => `flw_${Date.now()}_${Math.random().toString(36).substr(2, 4)}` },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  note: { type: String, default: '' },
  notes: { type: String, default: '' },
  staff: { type: String, default: 'Admin' },
  outcome: { type: String, default: 'Pending' },
  completed: { type: Boolean, default: false }
}, { _id: false });

const leadSchema = new mongoose.Schema({
  customerName: { type: String, default: '' },
  name: { type: String, default: '' },
  businessName: { type: String, default: '' },
  company: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  serviceInterested: { type: String, default: 'General Marketing' },
  serviceRequested: { type: String, default: 'Social Media Management' },
  budgetTier: { type: String, default: '$5,000 - $10,000' },
  timeline: { type: String, default: 'Within 1 Month' },
  source: { type: String, default: 'Website Contact Form' },
  date: { type: String, default: () => new Date().toISOString() },
  dateSubmitted: { type: String, default: () => new Date().toISOString().replace('T', ' ').slice(0, 16) },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'In Contact', 'Converted', 'Closed'],
    default: 'New'
  },
  assignedStaffId: { type: String, default: '' },
  assignedTo: { type: String, default: 'Sarah Jenkins' },
  message: { type: String, default: '' },
  description: { type: String, default: '' },
  notes: [{ type: String }],
  followUpHistory: [followUpSchema],
  followUps: [followUpSchema],
  nextFollowUpDate: { type: String, default: null }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

leadSchema.pre('save', function (next) {
  if (!this.name && this.customerName) this.name = this.customerName;
  if (!this.customerName && this.name) this.customerName = this.name;
  if (!this.company && this.businessName) this.company = this.businessName;
  if (!this.businessName && this.company) this.businessName = this.company;
  if (!this.serviceRequested && this.serviceInterested) this.serviceRequested = this.serviceInterested;
  if (!this.serviceInterested && this.serviceRequested) this.serviceInterested = this.serviceRequested;
  if (!this.description && this.message) this.description = this.message;
  if (!this.message && this.description) this.message = this.description;
  if (this.followUps && this.followUps.length > 0 && (!this.followUpHistory || this.followUpHistory.length === 0)) {
    this.followUpHistory = this.followUps;
  }
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Lead', leadSchema);
