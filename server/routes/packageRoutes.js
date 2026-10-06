const express = require('express');
const router = express.Router();
const {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage
} = require('../controllers/packageController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPackages) // public can fetch active packages
  .post(protect, authorize('Super Admin', 'Admin'), createPackage);

router.route('/:id')
  .put(protect, authorize('Super Admin', 'Admin'), updatePackage)
  .delete(protect, authorize('Super Admin', 'Admin'), deletePackage);

module.exports = router;
