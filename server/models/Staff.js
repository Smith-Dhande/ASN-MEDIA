const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, default: 'admin123', select: false },
  phone: { type: String, default: '' },
  role: {
    type: String,
    enum: [
      'Super Admin',
      'Admin',
      'Project Manager',
      'Creative Director & Lead Editor',
      'Video Editor',
      'Motion Designer',
      'Copywriter',
      'Social Media Strategist',
      'Content Strategist',
      'Content Creator & Designer',
      'Accountant',
      'Accounts',
      'Staff'
    ],
    default: 'Staff'
  },
  designation: { type: String, default: 'Marketing Specialist' },
  avatar: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  activeTasksCount: { type: Number, default: 0 },
  clientsManaged: { type: Number, default: 0 },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Encrypt password using bcrypt before saving
staffSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
staffSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
staffSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire to 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('Staff', staffSchema);
