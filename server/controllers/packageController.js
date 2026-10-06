const Package = require('../models/Package');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all marketing packages
// @route   GET /api/packages
exports.getPackages = async (req, res, next) => {
  try {
    const packages = await Package.find().sort({ price: 1 });
    res.status(200).json({ success: true, count: packages.length, data: packages });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new package
// @route   POST /api/packages
exports.createPackage = async (req, res, next) => {
  try {
    const pkg = await Package.create(req.body);

    await ActivityLog.create({
      user: req.user?.name || 'Admin',
      userRole: req.user?.role || 'Admin',
      action: 'Package Created',
      target: `Package: ${pkg.name}`,
      details: `Created marketing package with price ₹${pkg.price}`,
      category: 'packages'
    });

    res.status(201).json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
};

// @desc    Update package
// @route   PUT /api/packages/:id
exports.updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    res.status(200).json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete package
// @route   DELETE /api/packages/:id
exports.deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
