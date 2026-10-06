const Client = require('../models/Client');
const Lead = require('../models/Lead');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Payment = require('../models/Payment');
const Scanner = require('../models/Scanner');

// @desc    Get consolidated executive dashboard KPI metrics & alerts
// @route   GET /api/dashboard/metrics
exports.getDashboardMetrics = async (req, res, next) => {
  try {
    const [
      totalClients,
      activeClients,
      pendingClients,
      completedClients,
      newLeads,
      totalLeads,
      activeProjects,
      pendingTasks,
      payments,
      scanners,
      allClients,
      allTasks
    ] = await Promise.all([
      Client.countDocuments(),
      Client.countDocuments({ status: 'Active' }),
      Client.countDocuments({ status: 'Pending' }),
      Client.countDocuments({ status: 'Completed' }),
      Lead.countDocuments({ status: 'New' }),
      Lead.countDocuments(),
      Project.countDocuments({ status: 'In Progress' }),
      Task.countDocuments({ status: { $ne: 'Completed' } }),
      Payment.find(),
      Scanner.find({ status: 'Active' }),
      Client.find(),
      Task.find({ status: { $ne: 'Completed' } })
    ]);

    const totalCollected = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    const outstandingPayments = allClients.reduce((acc, c) => acc + (Number(c.outstandingBalance) || 0), 0);
    const totalScans = scanners.reduce((acc, s) => acc + (Number(s.totalScans) || 0), 0);

    // Expiring packages within 7 days
    const expiringPackages = allClients.filter(c => {
      if (!c.packageExpiryDate) return false;
      const diffDays = (new Date(c.packageExpiryDate) - new Date()) / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 7;
    });

    // Overdue tasks
    const overdueTasks = allTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date());

    res.status(200).json({
      success: true,
      data: {
        totalClients,
        activeClients,
        pendingClients,
        completedClients,
        newLeads,
        totalLeads,
        activeProjects,
        pendingTasks,
        totalCollected,
        outstandingPayments,
        activeScannersCount: scanners.length,
        totalScans,
        expiringPackagesCount: expiringPackages.length,
        overdueTasksCount: overdueTasks.length
      }
    });
  } catch (err) {
    next(err);
  }
};
