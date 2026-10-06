const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['lead', 'payment', 'task', 'package', 'scanner', 'client', 'system', 'info', 'warning', 'success', 'urgent'],
    default: 'info'
  },
  read: { type: Boolean, default: false },
  link: { type: String, default: '' },
  targetId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
