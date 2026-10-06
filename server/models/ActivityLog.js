const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  timestamp: { type: String, default: () => new Date().toISOString() },
  user: { type: String, required: true },
  userRole: { type: String, default: 'Staff' },
  action: { type: String, required: true },
  target: { type: String, default: '' },
  details: { type: String, required: true },
  category: { type: String, default: 'general' }
}, {
  timestamps: true
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
