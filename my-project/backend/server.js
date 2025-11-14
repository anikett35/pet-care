// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Connect to database
connectDB();

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

// Import routes
import petRoutes from './routes/petRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Routes
app.use('/api/auth', authRoutes);  // Authentication routes
app.use('/api/pets', petRoutes);   // Pet routes

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: '🐾 Pet Care API is running!',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Add sample data route
app.get('/api/seed', async (req, res) => {
  try {
    const Pet = (await import('./models/Pet.js')).default;
    
    console.log('🌱 Seeding sample data...');
    
    // Clear existing data
    await Pet.deleteMany({});
    console.log('✅ Cleared existing data');
    
    // Add sample pets
    const samplePets = [
      {
        name: "Buddy",
        species: "Dog",
        breed: "Golden Retriever",
        age: 3,
        weight: 25,
        gender: "Male",
        color: "Golden",
        owner: {
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          address: "123 Main St, City, State"
        },
        appointments: [
          {
            date: "2024-12-15",
            time: "10:00",
            type: "Checkup",
            veterinarian: "Dr. Smith",
            notes: "Annual checkup",
            status: "Scheduled"
          }
        ],
        vaccinations: [
          {
            name: "Rabies",
            date: "2024-01-15",
            nextDue: "2025-01-15",
            veterinarian: "Dr. Johnson"
          }
        ],
        medications: [
          {
            name: "Heartworm Prevention",
            dosage: "1 tablet",
            frequency: "Monthly",
            startDate: "2024-01-01"
          }
        ],
        medicalHistory: [
          {
            date: "2024-06-01",
            diagnosis: "Ear infection",
            treatment: "Antibiotics",
            veterinarian: "Dr. Wilson",
            notes: "Recovered well"
          }
        ]
      },
      {
        name: "Whiskers",
        species: "Cat",
        breed: "Siamese",
        age: 2,
        weight: 4,
        gender: "Female",
        color: "Cream",
        owner: {
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+0987654321",
          address: "456 Oak Ave, Town, State"
        },
        appointments: [
          {
            date: "2024-11-20",
            time: "14:30",
            type: "Vaccination",
            veterinarian: "Dr. Brown",
            status: "Scheduled"
          }
        ],
        vaccinations: [
          {
            name: "FVRCP",
            date: "2024-02-10",
            nextDue: "2025-02-10"
          }
        ],
        medications: [
          {
            name: "Flea Treatment",
            dosage: "0.5 ml",
            frequency: "Monthly",
            startDate: "2024-03-01"
          }
        ],
        medicalHistory: []
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

// Start server only when DB is connected
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 MongoDB: Connected to database`);
    console.log(`🔐 Auth routes: /api/auth/login, /api/auth/register`);
  });
});