







// backend/routes/adoptionRoutes.js
import express from 'express';
import Adoption from '../models/Adoption.js';
import Pet from '../models/Pet.js';

const router = express.Router();

// GET /api/adoption/applications - Get all adoption applications (admin only)
router.get('/applications', async (req, res) => {
  try {
    const applications = await Adoption.find()
      .populate('petId', 'name species breed age image')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching adoption applications:', error);
    res.status(500).json({ 
      error: 'Failed to fetch adoption applications',
      message: error.message 
    });
  }
});

// GET /api/adoption/applications/my-applications - Get user's applications
router.get('/applications/my-applications', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const applications = await Adoption.find({ 
      'applicant.email': email 
    })
    .populate('petId', 'name species breed age image')
    .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ 
      error: 'Failed to fetch your applications',
      message: error.message 
    });
  }
});

// GET /api/adoption/applications/:id - Get single application
router.get('/applications/:id', async (req, res) => {
  try {
    const application = await Adoption.findById(req.params.id)
      .populate('petId', 'name species breed age image adoptionFee');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ 
      error: 'Failed to fetch application',
      message: error.message 
    });
  }
});

// POST /api/adoption/applications - Submit new adoption application
router.post('/applications', async (req, res) => {
  try {
    const {
      petId,
      applicant,
      housing,
      family,
      carePlans,
      references,
      agreement
    } = req.body;

    // Validate required fields
    if (!petId || !applicant || !housing || !family || !carePlans || !agreement) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if pet exists
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Check if pet is available for adoption
    if (!pet.availableForAdoption) {
      return res.status(400).json({ error: 'This pet is not available for adoption' });
    }

    // Create adoption application
    const adoptionApplication = new Adoption({
      petId,
      petName: pet.name,
      petSpecies: pet.species,
      petBreed: pet.breed,
      applicant,
      housing,
      family,
      carePlans,
      references,
      agreement: {
        accepted: agreement,
        acceptedAt: new Date()
      }
    });

    await adoptionApplication.save();

    // Update pet status to pending
    await Pet.findByIdAndUpdate(petId, {
      adoptionStatus: 'pending'
    });

    // Populate the saved application for response
    const savedApplication = await Adoption.findById(adoptionApplication._id)
      .populate('petId', 'name species breed age image');

    res.status(201).json({
      message: 'Adoption application submitted successfully',
      application: savedApplication
    });

  } catch (error) {
    console.error('Error submitting adoption application:', error);
    res.status(500).json({ 
      error: 'Failed to submit adoption application',
      message: error.message 
    });
  }
});

// PUT /api/adoption/applications/:id/status - Update application status
router.put('/applications/:id/status', async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;

    const application = await Adoption.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewNotes,
        reviewedAt: new Date()
      },
      { new: true }
    ).populate('petId', 'name species breed age image');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Update pet adoption status based on application status
    if (status === 'approved' || status === 'completed') {
      await Pet.findByIdAndUpdate(application.petId, {
        adoptionStatus: 'adopted',
        availableForAdoption: false
      });
    } else if (status === 'rejected') {
      await Pet.findByIdAndUpdate(application.petId, {
        adoptionStatus: 'available'
      });
    }

    res.json({
      message: 'Application status updated successfully',
      application
    });

  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ 
      error: 'Failed to update application status',
      message: error.message 
    });
  }
});

// GET /api/adoption/available-pets - Get pets available for adoption
router.get('/available-pets', async (req, res) => {
  try {
    const { species, age, size, search } = req.query;
    
    let filter = { 
      availableForAdoption: true,
      adoptionStatus: 'available'
    };
    
    if (species) filter.species = species;
    if (age) {
      if (age === 'puppy') filter.age = { $regex: 'months|1 year', $options: 'i' };
      else if (age === 'young') filter.age = { $regex: '2|3|4 years', $options: 'i' };
      else if (age === 'adult') filter.age = { $regex: '5|6|7|8|9|10|11|12|13|14|15 years', $options: 'i' };
    }
    if (size) filter.size = size;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const pets = await Pet.find(filter)
      .select('name species breed age size gender location description image adoptionFee vaccinated neutered goodWith specialNeeds energyLevel trainingLevel featured availableForAdoption')
      .sort({ featured: -1, createdAt: -1 });

    res.json(pets);
  } catch (error) {
    console.error('Error fetching available pets:', error);
    res.status(500).json({ 
      error: 'Failed to fetch available pets',
      message: error.message 
    });
  }
});

export default router;