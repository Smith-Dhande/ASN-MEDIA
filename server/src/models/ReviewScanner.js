import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  value: { type: String, required: true, trim: true },
  isActive: { type: Boolean, default: true }
});

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  type: { type: String, default: 'dropdown', enum: ['dropdown', 'text', 'radio', 'checkbox'] },
  required: { type: Boolean, default: true },
  options: [optionSchema]
});

const reviewScannerSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: false },
    clientName: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    googleReviewUrl: { type: String, required: true, trim: true },
    ratingRequired: { type: Boolean, default: true },
    questions: [questionSchema],
    aiSettings: {
      tone: { type: String, default: 'Friendly & Professional' },
      length: { type: String, default: 'Medium', enum: ['Short', 'Medium', 'Detailed'] }
    },
    status: { type: String, enum: ['Active', 'Paused'], default: 'Active' },
    metrics: {
      scans: { type: Number, default: 0 },
      formStarted: { type: Number, default: 0 },
      formSubmitted: { type: Number, default: 0 },
      reviewsGenerated: { type: Number, default: 0 },
      googleClicked: { type: Number, default: 0 }
    },
    createdBy: { type: String, default: 'Admin' }
  },
  { timestamps: true }
);

export const ReviewScanner = mongoose.models.ReviewScanner || mongoose.model('ReviewScanner', reviewScannerSchema);
