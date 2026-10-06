const Payment = require('../models/Payment');
const Client = require('../models/Client');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all payments
// @route   GET /api/payments
exports.getPayments = async (req, res, next) => {
  try {
    const { clientId, status } = req.query;
    let query = {};
    if (clientId) query.clientId = clientId;
    if (status && status !== 'All') query.status = status;

    const payments = await Payment.find(query).sort({ paymentDate: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (err) {
    next(err);
  }
};

// @desc    Record manual payment
// @route   POST /api/payments
exports.createPayment = async (req, res, next) => {
  try {
    const count = await Payment.countDocuments();
    const invoiceNumber = req.body.invoiceNumber || `ASN-INV-${new Date().getFullYear()}-${String(count + 101).padStart(3, '0')}`;

    let clientId = req.body.clientId || '';
    let clientName = req.body.clientName || '';

    // Auto-resolve clientName from clientId if missing
    if (clientId && (!clientName || clientName === 'General Client')) {
      try {
        const clientDoc = await Client.findById(clientId);
        if (clientDoc) {
          clientName = clientDoc.businessName || clientDoc.company || clientDoc.name;
        }
      } catch (e) {}
    }

    // Auto-resolve clientId from clientName if missing
    if (!clientId && clientName) {
      try {
        const clientDoc = await Client.findOne({
          $or: [{ businessName: clientName }, { company: clientName }, { name: clientName }]
        });
        if (clientDoc) {
          clientId = clientDoc._id.toString();
        }
      } catch (e) {}
    }

    const amount = Number(req.body.amount) || 0;
    const amountReceived = req.body.amountReceived !== undefined ? Number(req.body.amountReceived) : (req.body.status === 'Paid' ? amount : 0);

    const payment = await Payment.create({
      ...req.body,
      clientId: clientId || '',
      clientName: clientName || 'General Client',
      amount,
      amountReceived,
      invoiceNumber
    });

    // Update Client Outstanding Balance & Total Paid
    if (payment.clientId) {
      try {
        const client = await Client.findById(payment.clientId);
        if (client) {
          client.totalPaid = (client.totalPaid || 0) + amountReceived;
          client.outstandingBalance = Math.max(0, (client.outstandingBalance || 0) - amountReceived);
          client.outstandingDue = client.outstandingBalance;
          await client.save();
        }
      } catch (e) {}
    }

    await ActivityLog.create({
      user: req.user?.name || 'Accounts',
      userRole: req.user?.role || 'Accounts',
      action: 'Payment Recorded',
      target: `Invoice: ${payment.invoiceNumber}`,
      details: `Recorded ₹${payment.amount.toLocaleString()} via ${payment.paymentMethod || payment.method} for ${payment.clientName}`,
      category: 'payments'
    });

    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
};

// @desc    Update payment
// @route   PUT /api/payments/:id
exports.updatePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
exports.deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
