const express = require('express');
const router = express.Router();
const {
  getScanners,
  getScannerBySlug,
  generatePublicReview,
  trackPublicEvent,
  submitPublicReview,
  getScannerReviews,
  createScanner,
  updateScanner,
  deleteScanner,
  regenerateScanner,
  generateSuggestions
} = require('../controllers/scannerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getScanners)
  .post(protect, createScanner);

// Public routes for customer QR experience & direct in-web review posting
router.route('/public/:slug')
  .get(getScannerBySlug);

router.route('/public/:slug/generate-review')
  .post(generatePublicReview);

router.route('/public/:slug/submit-review')
  .post(submitPublicReview);

router.route('/public/:slug/reviews')
  .get(getScannerReviews);

router.route('/public/:slug/events')
  .post(trackPublicEvent);

router.route('/:id')
  .put(protect, updateScanner)
  .patch(protect, updateScanner)
  .delete(protect, deleteScanner);

router.route('/:id/regenerate')
  .post(protect, regenerateScanner);

// Customer AI Review suggestions generation
router.route('/:id/generate-suggestions')
  .post(generateSuggestions);

module.exports = router;
