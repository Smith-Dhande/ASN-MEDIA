const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getNotifications)
  .post(protect, createNotification);

router.route('/read-all')
  .put(protect, markAllAsRead);

router.route('/:id/read')
  .put(protect, markAsRead);

router.route('/:id')
  .delete(protect, deleteNotification);

module.exports = router;
