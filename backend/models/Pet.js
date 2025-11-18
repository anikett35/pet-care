import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  species: {
    type: String,
    required: true,
    enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Other']
  },
  breed: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    min: 0
  },
  weight: {
    type: Number,
    min: 0
  },
  color: String,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Unknown']
  },
  imageUrl: String,
  notes: String,
  owner: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  medicalHistory: [{
    date: Date,
    diagnosis: String,
    treatment: String,
    veterinarian: String,
    notes: String
  }],
  vaccinations: [{
    name: String,
    date: Date,
    nextDue: Date,
    veterinarian: String
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date,
    notes: String
  }],
  appointments: [{
    date: Date,
    time: String,
    type: {
      type: String,
      enum: ['Checkup', 'Vaccination', 'Grooming', 'Emergency', 'Other']
    },
    veterinarian: String,
    notes: String,
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled'],
      default: 'Scheduled'
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Pet', petSchema);