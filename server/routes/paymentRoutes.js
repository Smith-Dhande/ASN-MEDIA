const express = require('express');
const router = express.Router();
const {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('Super Admin', 'Admin', 'Accounts'), getPayments)
  .post(protect, authorize('Super Admin', 'Admin', 'Accounts'), createPayment);

router.route('/:id')
  .put(protect, authorize('Super Admin', 'Admin', 'Accounts'), updatePayment)
  .delete(protect, authorize('Super Admin', 'Admin', 'Accounts'), deletePayment);

module.exports = router;
