const express = require('express');
const router = express.Router();
const {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  addFollowUp,
  convertLeadToClient
} = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getLeads)
  .post(createLead); // Open to receive web form submissions

router.route('/:id')
  .put(protect, updateLead)
  .delete(protect, deleteLead);

router.route('/:id/follow-up')
  .post(protect, addFollowUp);

router.route('/:id/convert')
  .post(protect, convertLeadToClient);

module.exports = router;
