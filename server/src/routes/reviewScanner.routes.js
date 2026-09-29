import express from 'express';
import {
  createScanner,
  getScanners,
  getScannerById,
  updateScanner,
  deleteScanner,
  getPublicScannerBySlug,
  generatePublicReview,
  trackPublicEvent,
  getScannerAnalytics
} from '../controllers/reviewScanner.controller.js';

const router = express.Router();

// Admin Endpoints
router.post('/', createScanner);
router.get('/', getScanners);
router.get('/:id', getScannerById);
router.patch('/:id', updateScanner);
router.delete('/:id', deleteScanner);
router.get('/:id/analytics', getScannerAnalytics);

// Public Scanner Endpoints
router.get('/public/:slug', getPublicScannerBySlug);
router.post('/public/:slug/generate-review', generatePublicReview);
router.post('/public/:slug/events', trackPublicEvent);

export default router;
