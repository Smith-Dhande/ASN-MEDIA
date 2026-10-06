const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all projects
// @route   GET /api/projects
exports.getProjects = async (req, res, next) => {
  try {
    const { clientId, status } = req.query;
    let query = {};
    if (clientId) query.clientId = clientId;
    if (status && status !== 'All') query.status = status;

    const projects = await Project.find(query).sort({ deadline: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    next(err);
  }
};

// @desc    Create project
// @route   POST /api/projects
exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);

    await ActivityLog.create({
      user: req.user?.name || 'Admin',
      userRole: req.user?.role || 'Admin',
      action: 'Project Created',
      target: `Project: ${project.title || project.name}`,
      details: `Created project for ${project.clientName}`,
      category: 'projects'
    });

    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await ActivityLog.create({
      user: req.user?.name || 'Admin',
      userRole: req.user?.role || 'Admin',
      action: 'Project Deleted',
      target: `Project: ${project.title || project.name}`,
      details: `Removed project record`,
      category: 'projects'
    });

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
