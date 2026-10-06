const Staff = require('../models/Staff');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all staff
// @route   GET /api/staff
exports.getStaff = async (req, res, next) => {
  try {
    const staff = await Staff.find().sort({ role: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: staff.length, data: staff });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new staff member
// @route   POST /api/staff
exports.createStaff = async (req, res, next) => {
  try {
    const member = await Staff.create(req.body);

    await ActivityLog.create({
      user: req.user?.name || 'Super Admin',
      userRole: req.user?.role || 'Super Admin',
      action: 'Staff Account Created',
      target: `Staff: ${member.name}`,
      details: `Added ${member.name} with role ${member.role}`,
      category: 'staff'
    });

    res.status(201).json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

// @desc    Update staff role / profile
// @route   PUT /api/staff/:id
exports.updateStaff = async (req, res, next) => {
  try {
    const member = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    res.status(200).json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete staff member
// @route   DELETE /api/staff/:id
exports.deleteStaff = async (req, res, next) => {
  try {
    const member = await Staff.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    await ActivityLog.create({
      user: req.user?.name || 'Super Admin',
      userRole: req.user?.role || 'Super Admin',
      action: 'Staff Account Deleted',
      target: `Staff: ${member.name}`,
      details: `Deleted ${member.name}`,
      category: 'staff'
    });

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
