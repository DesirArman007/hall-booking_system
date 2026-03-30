const mongoose = require('mongoose');

const seminarHallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    amenities: {
      type: [String], // Array of strings like "Projector", "Whiteboard", "AC"
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'maintenance'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const SeminarHall = mongoose.model('SeminarHall', seminarHallSchema);

module.exports = SeminarHall;
