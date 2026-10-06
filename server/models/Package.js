const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagline: { type: String, default: '' },
  type: { type: String, default: 'Monthly Retainer' },
  price: { type: Number, default: 0 },
  monthlyFee: { type: Number, default: 0 },
  deliverablesCount: { type: Number, default: 10 },
  billingCycle: { type: String, enum: ['Monthly', 'Quarterly', 'Annually'], default: 'Monthly' },
  durationMonths: { type: Number, default: 1 },
  status: { type: String, enum: ['Active', 'Inactive', 'Archived'], default: 'Active' },
  isPublic: { type: Boolean, default: true },
  publicVisibility: { type: Boolean, default: true },
  badge: { type: String, default: '' },
  includedServices: [{ type: String }],
  includedServiceIds: [{ type: String }],
  features: [{ type: String }],
  description: { type: String, default: '' },
  activeSubscriptionsCount: { type: Number, default: 0 },
  activeSubscribers: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

packageSchema.pre('save', function (next) {
  if (!this.monthlyFee && this.price) this.monthlyFee = this.price;
  if (!this.price && this.monthlyFee) this.price = this.monthlyFee;
  if (!this.isPublic && this.publicVisibility !== undefined) this.isPublic = this.publicVisibility;
  if (!this.publicVisibility && this.isPublic !== undefined) this.publicVisibility = this.isPublic;
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Package', packageSchema);
