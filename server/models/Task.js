const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  id: { type: String, default: () => `c_${Date.now()}` },
  user: { type: String, required: true },
  time: { type: String, default: () => new Date().toISOString() },
  text: { type: String, required: true }
}, { _id: false });

const taskHistorySchema = new mongoose.Schema({
  id: { type: String, default: () => `th_${Date.now()}` },
  text: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toLocaleString() }
}, { _id: false });

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  projectId: { type: String, default: '' },
  clientId: { type: String, default: '' },
  clientName: { type: String, default: '' },
  assignee: { type: String, default: 'Sarah Jenkins' },
  assignedStaffId: { type: String, default: '' },
  assignedStaffName: { type: String, default: 'Sarah Jenkins' },
  dueDate: { type: String, default: '' },
  expectedCompletion: { type: String, default: '' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Review', 'Completed'],
    default: 'To Do'
  },
  description: { type: String, default: '' },
  comments: [commentSchema],
  history: [taskHistorySchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

taskSchema.pre('save', function (next) {
  if (!this.assignedStaffName && this.assignee) this.assignedStaffName = this.assignee;
  if (!this.assignee && this.assignedStaffName) this.assignee = this.assignedStaffName;
  if (!this.expectedCompletion && this.dueDate) this.expectedCompletion = this.dueDate;
  if (!this.dueDate && this.expectedCompletion) this.dueDate = this.expectedCompletion;
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Task', taskSchema);
