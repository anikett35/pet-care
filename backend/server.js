// backend/server.js - Updated with CORS for Vercel
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - UPDATED FOR VERCEL
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://pet-care-roan-three.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/petcare';
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ MongoDB Connected Successfully');
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.log('💡 Make sure MongoDB is running locally or use MongoDB Atlas');
    process.exit(1);
  }
};

connectDB();

mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

// Import routes
import petRoutes from './routes/petRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adoptionRoutes from './routes/adoptionRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adoption', adoptionRoutes);
app.use('/api/appointments', appointmentRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: '🐾 Pet Care API is running!',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Enable adoption for all pets
app.put('/api/pets/enable-adoption', async (req, res) => {
  try {
    const Pet = (await import('./models/Pet.js')).default;
    const result = await Pet.updateMany({}, { 
      availableForAdoption: true,
      adoptionStatus: 'available'
    });
    res.json({ 
      message: 'All pets are now available for adoption!',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error enabling adoption:', error);
    res.status(500).json({ error: error.message });
  }
});

// Seed route
app.get('/api/seed', async (req, res) => {
  try {
    const Pet = (await import('./models/Pet.js')).default;
    const Adoption = (await import('./models/Adoption.js')).default;
    
    console.log('🌱 Seeding sample data...');
    
    await Pet.deleteMany({});
    await Adoption.deleteMany({});
    console.log('✅ Cleared existing data');
    
    const samplePets = [
      {
        name: "Max",
        species: "Dog",
        breed: "Golden Retriever",
        age: "2 years",
        gender: "Male",
        size: "Large",
        location: "New York, NY",
        description: "Friendly and energetic golden retriever looking for an active family. Great with kids and other pets.",
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
        availableForAdoption: true,
        adoptionFee: 250,
        vaccinated: true,
        neutered: true,
        goodWith: ["Kids", "Dogs", "Cats"],
        specialNeeds: "None",
        energyLevel: "High",
        trainingLevel: "Basic",
        featured: true
      },
      {
        name: "Luna",
        species: "Cat",
        breed: "Domestic Shorthair",
        age: "1 year",
        gender: "Female",
        size: "Small",
        location: "Brooklyn, NY",
        description: "Sweet and affectionate cat who loves cuddles. Perfect for apartment living.",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
        availableForAdoption: true,
        adoptionFee: 150,
        vaccinated: true,
        neutered: true,
        goodWith: ["Kids", "Cats"],
        specialNeeds: "None",
        energyLevel: "Medium",
        trainingLevel: "Litter Trained",
        featured: false
      }
    ];
    
    const savedPets = await Pet.insertMany(samplePets);
    console.log(`✅ Added ${savedPets.length} sample pets`);
    
    res.json({ 
      message: 'Sample data added successfully!', 
      pets: savedPets 
    });
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    res.status(500).json({ 
      error: 'Failed to seed data',
      message: error.message 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('⚠️ Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
  });
});

// Start server
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 MongoDB: Connected`);
    console.log(`🌐 CORS enabled for: localhost:5173 & Vercel`);
  });
});