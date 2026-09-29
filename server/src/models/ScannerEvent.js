import mongoose from 'mongoose';

const scannerEventSchema = new mongoose.Schema(
  {
    scannerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReviewScanner', required: true, index: true },
    slug: { type: String, required: true, index: true },
    eventType: {
      type: String,
      required: true,
      enum: ['SCAN', 'FORM_STARTED', 'FORM_SUBMITTED', 'REVIEW_GENERATED', 'GOOGLE_CLICKED'],
    },
    rating: { type: Number, min: 1, max: 5 },
    metadata: { type: mongoose.Schema.Types.Mixed },
    userAgent: { type: String },
  },
  { timestamps: true }
);

export const ScannerEvent = mongoose.models.ScannerEvent || mongoose.model('ScannerEvent', scannerEventSchema);
