const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  id: { type: String, default: () => `m_${Date.now()}_${Math.random().toString(36).substr(2, 4)}` },
  title: { type: String, default: '' },
  name: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  dueDate: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
}, { _id: false });

const projectActivitySchema = new mongoose.Schema({
  id: { type: String, default: () => `pa_${Date.now()}` },
  title: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toLocaleString() }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  name: { type: String, default: '' },
  clientId: { type: String, default: '' },
  clientName: { type: String, default: 'General Client' },
  serviceName: { type: String, default: 'Social Media Management' },
  serviceIds: [{ type: String }],
  description: { type: String, default: '' },
  managerId: { type: String, default: '' },
  leadStaff: { type: String, default: 'Sarah Jenkins' },
  startDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  deadline: { type: String, default: '' },
  dueDate: { type: String, default: '' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'High' },
  status: {
    type: String,
    enum: ['Active', 'In Progress', 'Planning', 'Not Started', 'On Hold', 'Completed', 'Cancelled'],
    default: 'In Progress'
  },
  progress: { type: Number, default: 0 },
  progressPct: { type: Number, default: 0 },
  budget: { type: Number, default: 0 },
  deliverables: [{ type: String }],
  milestones: [milestoneSchema],
  files: [{ type: String }],
  activity: [projectActivitySchema],
  notes: { type: String, default: '' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

projectSchema.pre('save', function (next) {
  if (!this.title && this.name) this.title = this.name;
  if (!this.name && this.title) this.name = this.title;
  if (!this.dueDate && this.deadline) this.dueDate = this.deadline;
  if (!this.deadline && this.dueDate) this.deadline = this.dueDate;
  if (!this.progressPct && this.progress) this.progressPct = this.progress;
  if (!this.progress && this.progressPct) this.progress = this.progressPct;
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Project', projectSchema);
