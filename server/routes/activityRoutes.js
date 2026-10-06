const express = require('express');
const router = express.Router();
const { getActivityLogs, createActivityLog, clearActivityLogs } = require('../controllers/activityController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getActivityLogs)
  .post(protect, createActivityLog)
  .delete(protect, authorize('Super Admin'), clearActivityLogs);

module.exports = router;
