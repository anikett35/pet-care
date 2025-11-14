import express from 'express';
import Pet from '../models/Pet.js';

const router = express.Router();

// GET /api/pets - Get all pets
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pets',
      message: error.message 
    });
  }
});

// GET /api/pets/:id - Get single pet
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

// POST /api/pets - Create new pet
router.post('/', async (req, res) => {
  try {
    const pet = new Pet(req.body);
    await pet.save();
    res.status(201).json(pet);
  } catch (error) {
    console.error('Error creating pet:', error);
    res.status(400).json({ 
      error: 'Failed to create pet',
      message: error.message 
    });
  }
});

// PUT /api/pets/:id - Update pet
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
    res.json(pet);
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(400).json({ 
      error: 'Failed to update pet',
      message: error.message 
    });
  }
});

// DELETE /api/pets/:id - Delete pet
router.delete('/:id', async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.status(500).json({ 
      error: 'Failed to delete pet',
      message: error.message 
    });
  }
});

export default router;