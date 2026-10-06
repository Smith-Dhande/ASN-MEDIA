const Lead = require('../models/Lead');
const Client = require('../models/Client');
const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');

// @desc    Get all website leads
// @route   GET /api/leads
exports.getLeads = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { serviceInterested: { $regex: search, $options: 'i' } },
        { serviceRequested: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    next(err);
  }
};

// @desc    Capture new lead / website enquiry
// @route   POST /api/leads
exports.createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create(req.body);

    await ActivityLog.create({
      user: req.user?.name || 'Website Visitor',
      userRole: req.user?.role || 'Public',
      action: 'Lead Captured',
      target: `Lead: ${lead.customerName || lead.name}`,
      details: `Received enquiry for ${lead.serviceRequested || lead.serviceInterested || 'Digital Marketing'} from ${lead.source || 'Website'}`,
      category: 'leads'
    });

    await Notification.create({
      title: 'New Website Enquiry',
      message: `${lead.customerName || lead.name} submitted an enquiry for ${lead.serviceRequested || 'services'}.`,
      type: 'lead',
      link: '/admin/enquiries'
    });

    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

// @desc    Update lead details / status
// @route   PUT /api/leads/:id
exports.updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    await ActivityLog.create({
      user: req.user?.name || 'Admin',
      userRole: req.user?.role || 'Admin',
      action: 'Lead Deleted',
      target: `Lead: ${lead.customerName || lead.name}`,
      details: `Removed lead enquiry from database`,
      category: 'leads'
    });

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Add follow-up note to lead
// @route   POST /api/leads/:id/follow-up
exports.addFollowUp = async (req, res, next) => {
  try {
    const { note, notes, staff, outcome, completed, nextFollowUpDate } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const followUpEntry = {
      id: `flw_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      note: note || notes || '',
      notes: note || notes || '',
      staff: staff || req.user?.name || 'Sarah Jenkins',
      outcome: outcome || 'Pending',
      completed: Boolean(completed)
    };

    if (!lead.followUps) lead.followUps = [];
    if (!lead.followUpHistory) lead.followUpHistory = [];

    lead.followUps.unshift(followUpEntry);
    lead.followUpHistory.unshift(followUpEntry);

    if (lead.status === 'New') {
      lead.status = 'In Contact';
    }

    if (nextFollowUpDate) {
      lead.nextFollowUpDate = nextFollowUpDate;
    }

    await lead.save();

    await ActivityLog.create({
      user: req.user?.name || 'Staff',
      userRole: req.user?.role || 'Staff',
      action: 'Lead Follow-up Recorded',
      target: `Lead: ${lead.customerName || lead.name}`,
      details: note || notes || 'Follow-up logged',
      category: 'leads'
    });

    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

// @desc    ONE-CLICK Convert Lead to Active Client
// @route   POST /api/leads/:id/convert
exports.convertLeadToClient = async (req, res, next) => {
  try {
    const { assignedPackageId, packagePrice, packageAssigned, monthlyRetainer, assignedStaff } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const clientName = lead.customerName || lead.name;
    const company = lead.businessName || lead.company || `${clientName}'s Business`;
    const retainer = Number(monthlyRetainer || packagePrice || 4500);

    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);

    // Create full Client profile
    const client = await Client.create({
      name: clientName,
      contactName: clientName,
      businessName: company,
      company: company,
      email: lead.email || 'client@asnmedia.in',
      phone: lead.phone || '+91 98765 00000',
      address: 'Onboarding in progress',
      category: lead.serviceRequested || lead.serviceInterested || 'General Marketing',
      status: 'Active',
      assignedPackageId: assignedPackageId || '',
      packageAssigned: packageAssigned || 'Social Media Retainer (Tier A)',
      monthlyRetainer: retainer,
      packageStartDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      packageExpiryDate: expiry.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      accountManagerId: lead.assignedStaffId || req.user?.id || '',
      accountManager: lead.assignedTo || 'Sarah Jenkins',
      assignedStaff: assignedStaff || [lead.assignedTo || 'Sarah Jenkins'],
      totalPaid: 0,
      outstandingBalance: retainer,
      outstandingDue: retainer,
      joinedDate: new Date().toISOString().split('T')[0],
      tags: ['Converted Lead'],
      internalNotes: [`Converted from Website Enquiry on ${new Date().toLocaleDateString()}`],
      notes: `Converted from Website Enquiry: "${lead.description || lead.message || ''}"`,
      activityHistory: [
        {
          action: 'Converted from Website Enquiry',
          timestamp: new Date().toLocaleString(),
          actor: req.user?.name || 'Admin',
          details: 'Initial client record established via one-click lead conversion.'
        }
      ]
    });

    // Auto-create initial Project
    const project = await Project.create({
      title: `${company} - Onboarding & Growth Setup`,
      name: `${company} - Onboarding & Growth Setup`,
      clientId: client._id.toString(),
      clientName: company,
      managerId: client.accountManagerId,
      leadStaff: client.accountManager,
      startDate: client.packageStartDate,
      deadline: client.packageExpiryDate,
      dueDate: client.packageExpiryDate,
      priority: 'High',
      status: 'In Progress',
      progress: 15,
      progressPct: 15,
      budget: retainer,
      milestones: [
        { title: 'Onboarding Questionnaire & Asset Collection', name: 'Onboarding Questionnaire & Asset Collection', status: 'In Progress', completed: false },
        { title: 'Strategy & Visual Moodboard Kickoff', name: 'Strategy & Visual Moodboard Kickoff', status: 'Pending', completed: false },
        { title: 'Campaign Setup & Launch', name: 'Campaign Setup & Launch', status: 'Pending', completed: false }
      ],
      notes: 'Auto-generated on Lead conversion.'
    });

    // Update Lead status to Converted
    lead.status = 'Converted';
    await lead.save();

    // Log Activity
    await ActivityLog.create({
      user: req.user?.name || 'Admin',
      userRole: req.user?.role || 'Admin',
      action: 'Lead Converted to Client',
      target: `Client: ${company}`,
      details: `Successfully converted lead ${clientName} to full active client profile and initiated setup project.`,
      category: 'clients'
    });

    await Notification.create({
      title: 'Lead Converted Successfully',
      message: `${clientName} (${company}) is now an Active Client.`,
      type: 'success',
      link: `/admin/clients`
    });

    res.status(201).json({
      success: true,
      message: 'Lead converted successfully',
      data: { client, project, lead }
    });
  } catch (err) {
    next(err);
  }
};
