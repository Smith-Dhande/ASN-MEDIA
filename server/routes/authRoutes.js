const express = require('express');
const router = express.Router();
const {
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/updateprofile', protect, updateProfile);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
