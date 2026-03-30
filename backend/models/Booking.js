const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'SeminarHall',
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String, // HH:mm format (e.g., '10:00')
      required: true,
    },
    endTime: {
      type: String, // HH:mm format (e.g., '12:00')
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
