const Setting = require('../models/Setting');
const Staff = require('../models/Staff');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get company & platform settings
// @route   GET /api/settings
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne({ key: 'global_settings' });
    if (!settings) {
      settings = await Setting.create({ key: 'global_settings' });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

// @desc    Update company & platform settings
// @route   PUT /api/settings
exports.updateSettings = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;

    let settings = await Setting.findOneAndUpdate(
      { key: 'global_settings' },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    // Sync adminProfile changes directly with MongoDB Staff collection
    if (req.body.adminProfile) {
      const { name, email, phone, designation, bio, avatarUrl } = req.body.adminProfile;
      const staffFilter = req.user?.id
        ? { _id: req.user.id }
        : (email ? { email: email.toLowerCase() } : { role: 'Super Admin' });
      
      await Staff.findOneAndUpdate(
        staffFilter,
        {
          $set: {
            ...(name ? { name: name.trim() } : {}),
            ...(phone !== undefined ? { phone: phone.trim() } : {}),
            ...(designation !== undefined ? { designation: designation.trim() } : {}),
            ...(bio !== undefined ? { bio: bio.trim() } : {}),
            ...(avatarUrl !== undefined ? { avatar: avatarUrl.trim() } : {})
          }
        },
        { new: true }
      );
    }

    const updatedSection = req.body.adminProfile ? 'Admin Profile Settings' :
      req.body.company ? 'Company Branding Settings' :
      req.body.platform ? 'Platform Integrations' : 'Platform Settings';

    try {
      await ActivityLog.create({
        user: req.user?.name || req.body.adminProfile?.name || 'Admin',
        userRole: req.user?.role || req.body.adminProfile?.role || 'Super Admin',
        action: 'Updated Configuration',
        target: updatedSection,
        details: `Persisted dynamic changes to ${updatedSection} in database.`,
        category: 'General'
      });
    } catch (e) {}

    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};
