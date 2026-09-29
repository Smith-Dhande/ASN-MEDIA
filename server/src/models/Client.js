import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contactName: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Completed', 'Archived'],
      default: 'Active',
    },
    packageAssigned: { type: String, default: 'Social Media Retainer (Tier A)' },
    monthlyRetainer: { type: Number, default: 0 },
    startDate: { type: String },
    expiryDate: { type: String },
    accountManager: { type: String, default: 'Sarah Jenkins' },
    website: { type: String, default: 'https://asnmedia.in' },
  },
  { timestamps: true }
);

export const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);
