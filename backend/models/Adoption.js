// backend/models/Adoption.js
import mongoose from 'mongoose';

const adoptionApplicationSchema = new mongoose.Schema({
  // Application Information
  applicationId: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  
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
  
  // Applicant Information (Simplified)
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  
  // Housing Information (Simplified)
  housingType: {
    type: String,
    enum: ['house', 'apartment', 'condo', 'townhouse', 'other'],
    required: true
  },
  ownOrRent: {
    type: String,
    enum: ['own', 'rent'],
    required: true
  },
  householdMembers: {
    type: String,
    required: true
  },
  
  // Pet Experience (Simplified)
  petExperience: {
    type: String,
    required: true
  },
  hoursAlone: {
    type: String,
    enum: ['0-4', '4-8', '8+'],
    required: true
  },
  
  // Agreement
  agreement: {
    type: Boolean,
    required: true,
    default: false
  },
  
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  },
  
  // Review Information
  reviewNotes: String,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date
}, {
  timestamps: true
});

// Generate application ID before saving
adoptionApplicationSchema.pre('save', async function(next) {
  if (!this.applicationId) {
    // Generate unique application ID
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.applicationId = `APP-${timestamp}-${random}`;
  }
  next();
});

// Indexes for faster queries
adoptionApplicationSchema.index({ petId: 1, submittedAt: -1 });
adoptionApplicationSchema.index({ email: 1 });
adoptionApplicationSchema.index({ status: 1 });
adoptionApplicationSchema.index({ applicationId: 1 });

export default mongoose.model('Adoption', adoptionApplicationSchema);