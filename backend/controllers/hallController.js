const SeminarHall = require('../models/SeminarHall');

// @desc    Get all seminar halls
// @route   GET /api/halls
// @access  Public
const getHalls = async (req, res) => {
  try {
    const halls = await SeminarHall.find({});
    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single seminar hall
// @route   GET /api/halls/:id
// @access  Public
const getHallById = async (req, res) => {
  try {
    const hall = await SeminarHall.findById(req.params.id);

    if (hall) {
      res.json(hall);
    } else {
      res.status(404).json({ message: 'Seminar Hall not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Invalid ID or error fetching hall' });
  }
};

// @desc    Create a seminar hall
// @route   POST /api/halls
// @access  Private/Admin
const createHall = async (req, res) => {
  try {
    const { name, capacity, location, amenities, status } = req.body;

    const hallExists = await SeminarHall.findOne({ name });
    if (hallExists) {
      return res.status(400).json({ message: 'Hall name already exists' });
    }

    const hall = new SeminarHall({
      name,
      capacity,
      location,
      amenities,
      status,
    });

    const createdHall = await hall.save();
    res.status(201).json(createdHall);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a seminar hall
// @route   PUT /api/halls/:id
// @access  Private/Admin
const updateHall = async (req, res) => {
  try {
    const { name, capacity, location, amenities, status } = req.body;

    const hall = await SeminarHall.findById(req.params.id);

    if (hall) {
      hall.name = name || hall.name;
      hall.capacity = capacity || hall.capacity;
      hall.location = location || hall.location;
      hall.amenities = amenities || hall.amenities;
      hall.status = status || hall.status;

      const updatedHall = await hall.save();
      res.json(updatedHall);
    } else {
      res.status(404).json({ message: 'Seminar Hall not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a seminar hall
// @route   DELETE /api/halls/:id
// @access  Private/Admin
const deleteHall = async (req, res) => {
  try {
    const hall = await SeminarHall.findById(req.params.id);

    if (hall) {
      await SeminarHall.deleteOne({ _id: req.params.id });
      res.json({ message: 'Seminar Hall removed' });
    } else {
      res.status(404).json({ message: 'Seminar Hall not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHalls,
  getHallById,
  createHall,
  updateHall,
  deleteHall,
};
