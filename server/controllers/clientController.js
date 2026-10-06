const Client = require('../models/Client');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all clients (with search & filter)
// @route   GET /api/clients
exports.getClients = async (req, res, next) => {
  try {
    const { search, status, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const clients = await Client.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: clients.length, data: clients });
  } catch (err) {
    next(err);
  }
};


exports.getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.status(200).json({ success: true, data: client });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new client
// @route   POST /api/clients
exports.createClient = async (req, res, next) => {
  try {
    const client = await Client.create(req.body);

    // Log Activity
    await ActivityLog.create({
      user: req.user?.name || 'Admin',
      userRole: req.user?.role || 'Admin',
      action: 'Client Created',
      target: `Client: ${client.businessName}`,
      details: `Created new client profile for ${client.name}`,
      category: 'clients'
    });

    res.status(201).json({ success: true, data: client });
  } catch (err) {
    next(err);
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
exports.updateClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    await ActivityLog.create({
      user: req.user?.name || 'Admin',
      userRole: req.user?.role || 'Admin',
      action: 'Client Updated',
      target: `Client: ${client.businessName}`,
      details: `Updated profile details and status to ${client.status}`,
      category: 'clients'
    });

    res.status(200).json({ success: true, data: client });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete/Archive client
// @route   DELETE /api/clients/:id
exports.deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    await ActivityLog.create({
      user: req.user?.name || 'Admin',
      userRole: req.user?.role || 'Admin',
      action: 'Client Archived',
      target: `Client: ${client.businessName}`,
      details: 'Archived client profile from active database',
      category: 'clients'
    });

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
