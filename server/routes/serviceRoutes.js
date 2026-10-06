const express = require('express');
const router = express.Router();
const {
  getServices,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getServices)
  .post(protect, authorize('Super Admin', 'Admin'), createService);

router.route('/:id')
  .put(protect, authorize('Super Admin', 'Admin'), updateService)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteService);

module.exports = router;
