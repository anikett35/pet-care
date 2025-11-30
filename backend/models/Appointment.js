// backend/models/Appointment.js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  // Pet Information
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  petName: {
    type: String,
    required: true
  },
  petSpecies: {
    type: String,
    required: true
  },
  
  // User Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  
  // Appointment Details
  type: {
    type: String,
    required: true,
    enum: ['Checkup', 'Vaccination', 'Grooming', 'Surgery', 'Emergency', 'Dental', 'Other']
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  
  // Provider Information
  veterinarian: {
    type: String,
    default: 'Dr. Smith'
  },
  
  // Appointment Status
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'],
    default: 'Pending'
  },
  
  // Additional Information
  notes: {
    type: String
  },
  
  // Admin Actions
  adminNotes: {
    type: String
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
appointmentSchema.index({ userId: 1, date: 1 });
appointmentSchema.index({ petId: 1, date: 1 });
appointmentSchema.index({ status: 1 });

export default mongoose.model('Appointment', appointmentSchema);