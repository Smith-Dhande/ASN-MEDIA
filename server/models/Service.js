const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, default: '' },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  deliverables: [{ type: String }],
  internalInstructions: { type: String, default: '' },
  turnaroundTime: { type: String, default: 'Ongoing Monthly' },
  priceRange: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  activeClientsCount: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

serviceSchema.pre('save', function (next) {
  if (!this.code && this.name) {
    this.code = this.name.split(' ').map(w => w[0]).join('').toUpperCase();
  }
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Service', serviceSchema);
