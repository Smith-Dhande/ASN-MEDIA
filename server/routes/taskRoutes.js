const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addTaskComment
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.route('/:id/comments')
  .post(protect, addTaskComment);

module.exports = router;
