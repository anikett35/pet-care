// backend/routes/petRoutes.js
import express from 'express';
import Pet from '../models/Pet.js';

const router = express.Router();

// @route   GET /api/pets
// @desc    Get all pets
// @access  Public
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    console.log(`✅ Fetched ${pets.length} pets`);
    res.json(pets);
  } catch (error) {
    console.error('❌ Error fetching pets:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pets',
      message: error.message 
    });
  }
});

// @route   GET /api/pets/:id
// @desc    Get single pet by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    res.json(pet);
  } catch (error) {
    console.error('Error fetching pet:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pet',
      message: error.message 
    });
  }
});

// @route   POST /api/pets
// @desc    Create new pet
// @access  Public
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creating new pet:', req.body);
    
    const pet = new Pet(req.body);
    await pet.save();
    
    console.log('✅ Pet created:', pet);
    
    res.status(201).json({
      message: 'Pet created successfully',
      pet
    });
  } catch (error) {
    console.error('❌ Error creating pet:', error);
    res.status(400).json({ 
      error: 'Failed to create pet',
      message: error.message 
    });
  }
});

// @route   PUT /api/pets/:id
// @desc    Update pet
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    console.log('✅ Pet updated:', pet);
    res.json(pet);
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(400).json({ 
      error: 'Failed to update pet',
      message: error.message 
    });
  }
});

// @route   DELETE /api/pets/:id
// @desc    Delete pet
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    console.log('✅ Pet deleted:', pet.name);
    res.json({ 
      message: 'Pet deleted successfully',
      pet 
    });
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.status(500).json({ 
      error: 'Failed to delete pet',
      message: error.message 
    });
  }
});

export default router;