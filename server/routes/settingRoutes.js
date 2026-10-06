const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getSettings)
  .put(protect, authorize('Super Admin', 'Admin'), updateSettings);

module.exports = router;
