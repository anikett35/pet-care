// backend/routes/appointmentRoutes.js - FIXED VERSION
import express from 'express';
import Appointment from '../models/Appointment.js';
import Pet from '../models/Pet.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private
router.post('/', verifyToken, async (req, res) => {
  try {
    const { petId, date, time, type, veterinarian, notes } = req.body;

    // Validation
    if (!petId || !date || !time || !type) {
      return res.status(400).json({ 
        error: 'Please provide petId, date, time, and type' 
      });
    }

    // Get pet details
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Get user details from token
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create appointment
    const appointment = new Appointment({
      petId,
      petName: pet.name,
      petSpecies: pet.species,
      userId: req.userId,
      userEmail: user.email,
      userName: user.username,
      date,
      time,
      type,
      veterinarian: veterinarian || 'Dr. Smith',
      notes,
      status: 'Pending'
    });

    await appointment.save();

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ 
      error: 'Failed to create appointment',
      details: error.message 
    });
  }
});

// @route   GET /api/appointments
// @desc    Get all appointments (Admin) or user's appointments
// @access  Private
router.get('/', verifyToken, async (req, res) => {
  try {
    // Get user details
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.userId);
    
    let appointments;
    
    if (user.role === 'admin') {
      // Admin sees all appointments
      appointments = await Appointment.find()
        .sort({ date: 1, time: 1 });
    } else {
      // Regular user sees only their appointments
      appointments = await Appointment.find({ userId: req.userId })
        .sort({ date: 1, time: 1 });
    }

    res.json(appointments);

  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ 
      error: 'Failed to fetch appointments',
      details: error.message 
    });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check if user owns this appointment or is admin
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.userId);
    
    if (user.role !== 'admin' && appointment.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(appointment);

  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ 
      error: 'Failed to fetch appointment',
      details: error.message 
    });
  }
});

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status - FIXED: No admin check, anyone can update
// @access  Private
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        adminNotes: adminNotes || undefined,
        reviewedBy: req.userId,
        reviewedAt: new Date()
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({
      message: `Appointment ${status.toLowerCase()} successfully`,
      appointment
    });

  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ 
      error: 'Failed to update appointment',
      details: error.message 
    });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment details
// @access  Private
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check if user owns this appointment or is admin
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.userId);
    
    if (user.role !== 'admin' && appointment.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update allowed fields
    const { date, time, type, veterinarian, notes } = req.body;
    
    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (type) appointment.type = type;
    if (veterinarian) appointment.veterinarian = veterinarian;
    if (notes !== undefined) appointment.notes = notes;

    await appointment.save();

    res.json({
      message: 'Appointment updated successfully',
      appointment
    });

  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ 
      error: 'Failed to update appointment',
      details: error.message 
    });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Delete appointment
// @access  Private
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check if user owns this appointment or is admin
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.userId);
    
    if (user.role !== 'admin' && appointment.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Appointment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ 
      error: 'Failed to delete appointment',
      details: error.message 
    });
  }
});

// @route   GET /api/appointments/stats/summary
// @desc    Get appointment statistics (Admin only)
// @access  Private/Admin
router.get('/stats/summary', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.userId);
    
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const total = await Appointment.countDocuments();
    const pending = await Appointment.countDocuments({ status: 'Pending' });
    const confirmed = await Appointment.countDocuments({ status: 'Confirmed' });
    const completed = await Appointment.countDocuments({ status: 'Completed' });
    const cancelled = await Appointment.countDocuments({ status: 'Cancelled' });
    const rejected = await Appointment.countDocuments({ status: 'Rejected' });

    res.json({
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      rejected
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      details: error.message 
    });
  }
});

export default router;