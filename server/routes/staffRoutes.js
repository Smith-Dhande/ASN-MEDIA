const express = require('express');
const router = express.Router();
const {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff
} = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getStaff)
  .post(protect, authorize('Super Admin', 'Admin'), createStaff);

router.route('/:id')
  .put(protect, authorize('Super Admin', 'Admin'), updateStaff)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteStaff);

module.exports = router;
