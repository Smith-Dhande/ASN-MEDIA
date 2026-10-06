const ActivityLog = require('../models/ActivityLog');

// @desc    Get all audit activity logs
// @route   GET /api/activity
exports.getActivityLogs = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { action: { $regex: search, $options: 'i' } },
        { target: { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } },
        { user: { $regex: search, $options: 'i' } }
      ];
    }

    let logs = await ActivityLog.find(query).sort({ createdAt: -1 }).limit(200);

    // Auto-seed initial audit logs if collection is empty
    if (logs.length === 0 && !search && (!category || category === 'All')) {
      const initialLogs = [
        { user: 'Vikramaditya S.', userRole: 'Admin', action: 'Created Client Profile', target: 'Dev Cafe', details: 'Configured client workspace & branding', category: 'Clients', timestamp: '2026-10-02 14:30' },
        { user: 'System Sentinel', userRole: 'System', action: 'Deployed AI Review Scanner', target: 'Dev Cafe Review', details: 'Generated smart QR code standee & URL slug', category: 'Scanners', timestamp: '2026-10-02 14:15' },
        { user: 'Sarah Jenkins', userRole: 'Manager', action: 'Updated Task Status to In Progress', target: 'Social Media Campaign Assets', details: 'Assigned deliverable production to creative team', category: 'Tasks', timestamp: '2026-10-02 13:45' },
        { user: 'Rohan Verma', userRole: 'Finance', action: 'Generated Monthly Invoice', target: 'INV-2026-0901', details: 'Logged package retainer payment in INR', category: 'Payments', timestamp: '2026-10-02 12:20' },
        { user: 'Ananya Sen', userRole: 'Staff', action: 'Captured New Lead Enquiry', target: 'Apex Retailers Retainer', details: 'Follow-up touchpoint scheduled', category: 'Leads', timestamp: '2026-10-02 11:05' },
        { user: 'System Sentinel', userRole: 'System', action: 'Automated System Health Check', target: 'Security & Database Cluster', details: 'All subsystems operational', category: 'Reports', timestamp: '2026-10-02 10:00' },
        { user: 'Vikramaditya S.', userRole: 'Admin', action: 'Updated General Settings', target: 'System Currency (₹ INR)', details: 'Platform default currency set to INR', category: 'General', timestamp: '2026-10-02 09:30' }
      ];

      await ActivityLog.insertMany(initialLogs);
      logs = await ActivityLog.find(query).sort({ createdAt: -1 }).limit(200);
    }

    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    next(err);
  }
};

// @desc    Create manual activity log entry
// @route   POST /api/activity
exports.createActivityLog = async (req, res, next) => {
  try {
    const log = await ActivityLog.create({
      user: req.body.user || req.body.actor || req.user?.name || 'Staff',
      userRole: req.body.userRole || req.user?.role || 'Staff',
      action: req.body.action || 'System Event',
      target: req.body.target || req.body.entity || '',
      details: req.body.details || '',
      category: req.body.category || 'general'
    });
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear activity logs
// @route   DELETE /api/activity
exports.clearActivityLogs = async (req, res, next) => {
  try {
    await ActivityLog.deleteMany({});
    res.status(200).json({ success: true, message: 'Activity logs cleared' });
  } catch (err) {
    next(err);
  }
};
