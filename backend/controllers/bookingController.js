const Booking = require('../models/Booking');
const SeminarHall = require('../models/SeminarHall');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { hall, date, startTime, endTime, purpose } = req.body;

    // Validate times
    if (startTime >= endTime) {
      return res.status(400).json({ message: 'Start time must be before end time' });
    }

    // Check if hall exists and is active
    const seminarHall = await SeminarHall.findById(hall);
    if (!seminarHall) {
      return res.status(404).json({ message: 'Seminar Hall not found' });
    }
    if (seminarHall.status !== 'active') {
      return res.status(400).json({ message: 'Seminar Hall is currently under maintenance' });
    }

    // Check for overlapping bookings
    // Logic: Existing booking overlaps if it starts before the new booking ends
    // AND it ends after the new booking starts.
    const overlappingBookings = await Booking.find({
      hall,
      date,
      status: 'confirmed',
      $and: [
        { startTime: { $lt: endTime } },
        { endTime: { $gt: startTime } }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Hall is already booked for this time slot' });
    }

    const booking = new Booking({
      user: req.user._id,
      hall,
      date,
      startTime,
      endTime,
      purpose,
    });

    const createdBooking = await booking.save();
    
    // Send confirmation email
    try {
      await sendEmail({
        email: req.user.email,
        subject: 'Seminar Hall Booking Confirmation',
        message: `
          <h1>Booking Confirmed</h1>
          <p>Dear ${req.user.name},</p>
          <p>Your booking for <strong>${seminarHall.name}</strong> on <strong>${new Date(date).toDateString()}</strong> from <strong>${startTime} to ${endTime}</strong> has been confirmed.</p>
          <p>Purpose: ${purpose}</p>
          <br>
          <p>Thank you,</p>
          <p>Schedulix Team</p>
        `,
      });
    } catch (emailError) {
      console.error('Email could not be sent', emailError);
    }

    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('hall', 'name location');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('user', 'name email').populate('hall', 'name location');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the owner or an admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    const updatedBooking = await booking.save();

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking,
};
