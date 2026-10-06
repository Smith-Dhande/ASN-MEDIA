const express = require('express');
const router = express.Router();
const {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} = require('../controllers/clientController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getClients)
  .post(protect, authorize('Super Admin', 'Admin'), createClient);

router.route('/:id')
  .get(protect, getClientById)
  .put(protect, authorize('Super Admin', 'Admin'), updateClient)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteClient);

module.exports = router;
