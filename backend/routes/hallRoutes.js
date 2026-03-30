const express = require('express');
const router = express.Router();
const {
  getHalls,
  getHallById,
  createHall,
  updateHall,
  deleteHall,
} = require('../controllers/hallController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getHalls).post(protect, admin, createHall);
router
  .route('/:id')
  .get(getHallById)
  .put(protect, admin, updateHall)
  .delete(protect, admin, deleteHall);

module.exports = router;
