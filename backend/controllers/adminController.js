const Booking = require('../models/Booking');
const SeminarHall = require('../models/SeminarHall');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalHalls = await SeminarHall.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Calculate bookings today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bookingsToday = await Booking.countDocuments({
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    });

    res.json({
      totalBookings,
      totalHalls,
      totalUsers,
      bookingsToday
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats
};
