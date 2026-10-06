const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Staff = require('../models/Staff');
const ActivityLog = require('../models/ActivityLog');

// Generate JWT token helper
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    designation: user.designation,
    avatar: user.avatar
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET || 'asn_digital_media_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      designation: user.designation,
      avatar: user.avatar,
      phone: user.phone
    }
  });
};

// @desc    Login user & get JWT token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Look up user in Staff collection with password
    const user = await Staff.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.'
      });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Contact the Super Admin.'
      });
    }

    // Log Activity
    try {
      await ActivityLog.create({
        user: user.name,
        userRole: user.role,
        action: 'User Logged In',
        target: `Session: ${user.email}`,
        details: `Successful authenticated login via web portal.`,
        category: 'staff'
      });
    } catch (e) {}

    sendTokenResponse(user, 200, res, 'Logged in successfully');
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await Staff.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        avatar: user.avatar,
        phone: user.phone
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update current logged in user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, designation, bio, avatar, email } = req.body;

    let user = null;
    if (req.user && req.user.id) {
      user = await Staff.findById(req.user.id);
    }
    if (!user && req.user && req.user.email) {
      user = await Staff.findOne({ email: req.user.email.toLowerCase() });
    }
    if (!user && email) {
      user = await Staff.findOne({ email: email.toLowerCase() });
    }
    if (!user) {
      user = await Staff.findOne({ role: 'Super Admin' });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'Staff user profile record not found' });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (designation !== undefined) user.designation = designation.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (avatar !== undefined) user.avatar = avatar.trim();

    await user.save();

    // Sync global setting adminProfile
    try {
      const Setting = require('../models/Setting');
      await Setting.findOneAndUpdate(
        { key: 'global_settings' },
        {
          $set: {
            'adminProfile.name': user.name,
            'adminProfile.email': user.email,
            'adminProfile.phone': user.phone,
            'adminProfile.designation': user.designation,
            'adminProfile.bio': user.bio || '',
            'adminProfile.avatar': user.avatar || ''
          }
        },
        { upsert: true }
      );
    } catch (e) {}

    // Log Activity
    try {
      await ActivityLog.create({
        user: user.name,
        userRole: user.role,
        action: 'Updated Profile Details',
        target: `User: ${user.email}`,
        details: `Updated personal name and profile details in database.`,
        category: 'staff'
      });
    } catch (e) {}

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully in database',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        avatar: user.avatar,
        phone: user.phone
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot Password - generate reset token
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide a valid registered email address' });
    }

    const user = await Staff.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No staff account found with email: ${email}`
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // In a live SMTP environment, send email with resetUrl.
    // For admin suite UX, return the reset token directly so the user can immediately reset in the modal/form!
    const clientBase = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetUrl = `${clientBase}/reset-password/${resetToken}`;

    // Log Activity
    try {
      await ActivityLog.create({
        user: user.name,
        userRole: user.role,
        action: 'Password Reset Requested',
        target: `Account: ${user.email}`,
        details: `Reset password token generated and dispatched.`,
        category: 'staff'
      });
    } catch (e) {}

    res.status(200).json({
      success: true,
      message: `Password reset token generated for ${user.email}`,
      resetToken,
      resetUrl
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reset Password using token
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await Staff.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token'
      });
    }

    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Log Activity
    try {
      await ActivityLog.create({
        user: user.name,
        userRole: user.role,
        action: 'Password Changed',
        target: `Account: ${user.email}`,
        details: `Password was successfully updated via reset token.`,
        category: 'staff'
      });
    } catch (e) {}

    sendTokenResponse(user, 200, res, 'Password reset successful! You are now logged in.');
  } catch (err) {
    next(err);
  }
};

// @desc    Update Password for logged-in user
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await Staff.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password updated successfully');
  } catch (err) {
    next(err);
  }
};
