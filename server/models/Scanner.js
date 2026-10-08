const mongoose = require('mongoose');

const questionOptionSchema = new mongoose.Schema({
  id: { type: String, default: () => `opt_${Date.now()}` },
  label: { type: String, required: true },
  value: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { _id: false });

const scannerQuestionSchema = new mongoose.Schema({
  id: { type: String, default: () => `q_${Date.now()}` },
  question: { type: String, required: true },
  type: { type: String, default: 'dropdown' },
  required: { type: Boolean, default: true },
  options: [questionOptionSchema]
}, { _id: false });

const doctorSchema = new mongoose.Schema({
  id: { type: String, default: () => `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` },
  name: { type: String, required: true },
  department: { type: String, default: 'General Medicine' },
  qualification: { type: String, default: '' },
  available: { type: Boolean, default: true }
}, { _id: false });

const scannerSchema = new mongoose.Schema({
  clientId: { type: String, default: '' },
  clientName: { type: String, default: '' },
  businessName: { type: String, default: '' },
  name: { type: String, default: '' },
  placeName: { type: String, default: '' },
  placeId: { type: String, default: '' },
  slug: { type: String, required: true, unique: true },
  industry: { type: String, default: 'General Business' },
  doctorName: { type: String, default: '' },
  doctors: [doctorSchema],
  hospitalServices: [{ type: String }],
  googleUrl: { type: String, default: '' },
  googleReviewUrl: { type: String, default: '' },
  logoUrl: { type: String, default: '' },
  themeColor: { type: String, default: '#6366f1' },
  customerMessage: { type: String, default: 'Thank you for your visit! Tap below to generate an instant review or share your experience.' },
  ratingRequired: { type: Boolean, default: true },
  redirectTimer: { type: Number, default: 5 },
  questions: [scannerQuestionSchema],
  aiPrompts: {
    tone: { type: String, default: 'Professional & Caring' },
    keywords: [{ type: String }]
  },
  aiSettings: {
    tone: { type: String, default: 'Friendly & Professional' },
    length: { type: String, default: 'Medium' }
  },
  avgRating: { type: Number, default: 4.9 },
  totalReviewsScraped: { type: Number, default: 0 },
  totalScans: { type: Number, default: 0 },
  totalAiGenerated: { type: Number, default: 0 },
  totalRedirects: { type: Number, default: 0 },
  metrics: {
    scans: { type: Number, default: 0 },
    formStarted: { type: Number, default: 0 },
    formSubmitted: { type: Number, default: 0 },
    reviewsGenerated: { type: Number, default: 0 },
    googleClicked: { type: Number, default: 0 }
  },
  
  // Status and Auto-Pause Configuration
  status: { type: String, enum: ['Active', 'Paused', 'Disabled', 'Inactive'], default: 'Active' },
  autoPauseEnabled: { type: Boolean, default: false },
  autoPauseAt: { type: Date, default: null },
  autoPauseDurationMinutes: { type: Number, default: 0 },
  
  // Demo Mode Configuration (No Client required & auto-expires after allotted duration)
  isDemo: { type: Boolean, default: false },
  demoDurationMinutes: { type: Number, default: 60 },
  demoExpiresAt: { type: Date, default: null },
  
  lastScanAt: { type: String, default: 'Never' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

scannerSchema.pre('validate', function (next) {
  if (!this.clientName && this.businessName) this.clientName = this.businessName;
  if (!this.businessName && this.clientName) this.businessName = this.clientName;
  if (!this.name && this.businessName) this.name = this.businessName;
  if (!this.businessName && this.name) this.businessName = this.name;
  if (!this.placeName && this.name) this.placeName = this.name;
  if (!this.googleUrl && this.googleReviewUrl) this.googleUrl = this.googleReviewUrl;
  if (!this.googleReviewUrl && this.googleUrl) this.googleReviewUrl = this.googleUrl;
  if (!this.slug) {
    const baseSlug = (this.businessName || this.name || this.clientName || 'scanner')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    this.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
  }
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Scanner', scannerSchema);
