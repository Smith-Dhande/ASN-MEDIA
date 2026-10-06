const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  scannerId: { type: String, default: '' },
  scannerSlug: { type: String, default: '' },
  clientId: { type: String, default: '' },
  clientName: { type: String, default: '' },
  businessName: { type: String, default: '' },
  reviewerName: { type: String, default: 'Anonymous Customer' },
  reviewerEmail: { type: String, default: '' },
  reviewerPhone: { type: String, default: '' },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  doctorId: { type: String, default: '' },
  doctorName: { type: String, default: '' },
  doctorDepartment: { type: String, default: '' },
  answers: [{ question: String, answer: String }],
  source: { type: String, default: 'Direct Web Submission' },
  status: { type: String, enum: ['Published', 'Pending', 'Verified'], default: 'Published' },
  googleSyncStatus: { type: String, enum: ['Direct Submitted', 'Synced to Google', 'Pending'], default: 'Direct Submitted' },
  googleReviewUrl: { type: String, default: '' },
  postedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Review', reviewSchema);
