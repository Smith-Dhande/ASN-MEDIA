const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getProjects)
  .post(protect, authorize('Super Admin', 'Admin', 'Project Manager'), createProject);

router.route('/:id')
  .put(protect, authorize('Super Admin', 'Admin', 'Project Manager'), updateProject)
  .delete(protect, authorize('Super Admin', 'Admin', 'Project Manager'), deleteProject);

module.exports = router;
