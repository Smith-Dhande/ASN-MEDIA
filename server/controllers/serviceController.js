const Service = require('../models/Service');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all agency services
// @route   GET /api/services
exports.getServices = async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    const services = await Service.find(query).sort({ category: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new service
// @route   POST /api/services
exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);

    await ActivityLog.create({
      user: req.user?.name || 'Admin',
      userRole: req.user?.role || 'Admin',
      action: 'Service Created',
      target: `Service: ${service.name}`,
      details: `Added new service under ${service.category}`,
      category: 'services'
    });

    res.status(201).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
