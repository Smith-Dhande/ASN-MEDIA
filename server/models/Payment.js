const mongoose = require('mongoose');

const installmentSchema = new mongoose.Schema({
  number: { type: Number, default: 1 },
  amount: { type: Number, required: true },
  dueDate: { type: String, default: '' },
  status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Paid' }
}, { _id: false });

const paymentSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  clientId: { type: String, default: '' },
  clientName: { type: String, default: 'General Client' },
  packageId: { type: String, default: '' },
  packageName: { type: String, default: '' },
  amount: { type: Number, required: true },
  amountReceived: { type: Number, default: 0 },
  totalPackageAmount: { type: Number, default: 0 },
  paymentDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  dueDate: { type: String, default: '' },
  paymentMethod: { type: String, default: 'Bank Transfer' },
  method: { type: String, default: 'Bank Transfer' },
  status: {
    type: String,
    enum: ['Paid', 'Partially Paid', 'Pending', 'Overdue'],
    default: 'Paid'
  },
  referenceNumber: { type: String, default: '' },
  notes: { type: String, default: '' },
  installments: [installmentSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

paymentSchema.pre('save', function (next) {
  if (!this.date && this.paymentDate) this.date = this.paymentDate;
  if (!this.paymentDate && this.date) this.paymentDate = this.date;
  if (!this.method && this.paymentMethod) this.method = this.paymentMethod;
  if (!this.paymentMethod && this.method) this.paymentMethod = this.method;
  if (!this.amountReceived && this.status === 'Paid') this.amountReceived = this.amount;
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Payment', paymentSchema);
