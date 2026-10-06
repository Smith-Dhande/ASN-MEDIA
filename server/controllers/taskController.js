const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all tasks
// @route   GET /api/tasks
exports.getTasks = async (req, res, next) => {
  try {
    const { clientId, assignedStaffId, status, priority } = req.query;
    let query = {};
    if (clientId) query.clientId = clientId;
    if (assignedStaffId) query.assignedStaffId = assignedStaffId;
    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;

    const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);

    await ActivityLog.create({
      user: req.user?.name || 'Staff',
      userRole: req.user?.role || 'Staff',
      action: 'Task Created',
      target: `Task: ${task.title}`,
      details: `Assigned to ${task.assignedStaffName || task.assignee}`,
      category: 'tasks'
    });

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @desc    Update task status / details
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (req.body.status) {
      await ActivityLog.create({
        user: req.user?.name || 'Staff',
        userRole: req.user?.role || 'Staff',
        action: 'Task Status Changed',
        target: `Task: ${task.title}`,
        details: `Moved to ${req.body.status}`,
        category: 'tasks'
      });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await ActivityLog.create({
      user: req.user?.name || 'Staff',
      userRole: req.user?.role || 'Staff',
      action: 'Task Deleted',
      target: `Task: ${task.title}`,
      details: 'Task was deleted',
      category: 'tasks'
    });

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
exports.addTaskComment = async (req, res, next) => {
  try {
    const { text, user } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.comments.push({
      id: `c_${Date.now()}`,
      user: user || req.user?.name || 'Staff',
      time: new Date().toISOString(),
      text
    });

    await task.save();
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};
