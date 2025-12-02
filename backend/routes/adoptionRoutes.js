// backend/routes/adoptionRoutes.js
import express from 'express';
import Adoption from '../models/Adoption.js';
import Pet from '../models/Pet.js';

const router = express.Router();

// @route   GET /api/adoption/stats
// @desc    Get statistics of user interest by pet type
// @access  Public (Admin)
router.get('/stats', async (req, res) => {
  try {
    // Get all adoption applications
    const applications = await Adoption.find();
    
    // Count applications by pet species
    const stats = {};
    
    for (const application of applications) {
      // Get the pet details to find species
      const pet = await Pet.findById(application.petId);
      if (pet && pet.species) {
        const species = pet.species.toLowerCase();
        stats[species] = (stats[species] || 0) + 1;
      }
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching adoption stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      message: error.message 
    });
  }
});

// @route   GET /api/adoption/available-pets
// @desc    Get all available pets for adoption
// @access  Public
router.get('/available-pets', async (req, res) => {
  try {
    const pets = await Pet.find({ 
      availableForAdoption: true,
      adoptionStatus: { $in: ['available', null] }
    }).sort({ createdAt: -1 });
    
    res.json(pets);
  } catch (error) {
    console.error('Error fetching available pets:', error);
    res.status(500).json({ 
      error: 'Failed to fetch available pets',
      message: error.message 
    });
  }
});

// @route   POST /api/adoption/applications
// @desc    Submit adoption application (UPDATED FOR SHORTENED FORM)
// @access  Public (requires auth in production)
router.post('/applications', async (req, res) => {
  try {
    console.log('Received application data:', req.body);
    
    const { 
      petId,
      fullName,
      email,
      phone,
      address,
      housingType,
      ownOrRent,
      householdMembers,
      petExperience,
      hoursAlone,
      agreement
    } = req.body;

    // Detailed validation with specific error messages
    if (!petId) {
      return res.status(400).json({ error: 'Pet ID is required' });
    }
    if (!fullName) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!phone) {
      return res.status(400).json({ error: 'Phone is required' });
    }
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    if (!housingType) {
      return res.status(400).json({ error: 'Housing type is required' });
    }
    if (!ownOrRent) {
      return res.status(400).json({ error: 'Own/Rent status is required' });
    }
    if (!householdMembers) {
      return res.status(400).json({ error: 'Household members information is required' });
    }
    if (!petExperience) {
      return res.status(400).json({ error: 'Pet experience is required' });
    }
    if (!hoursAlone) {
      return res.status(400).json({ error: 'Hours alone information is required' });
    }
    if (!agreement) {
      return res.status(400).json({ error: 'You must accept the adoption agreement' });
    }

    // Check if pet exists and is available
    const pet = await Pet.findById(petId);
    console.log('Found pet:', pet);
    
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Check availability (handle both field names for compatibility)
    const isAvailable = pet.availableForAdoption || 
                       pet.adoptionStatus === 'available' || 
                       !pet.adoptionStatus;
    
    if (!isAvailable && pet.adoptionStatus === 'adopted') {
      return res.status(400).json({ 
        error: 'This pet is no longer available for adoption' 
      });
    }

    console.log('Creating application...');

    // Create adoption application
    const application = new Adoption({
      petId,
      petName: pet.name,
      petSpecies: pet.species,
      fullName,
      email,
      phone,
      address,
      housingType,
      ownOrRent,
      householdMembers,
      petExperience,
      hoursAlone,
      agreement,
      status: 'pending',
      submittedAt: new Date()
    });

    await application.save();
    console.log('Application saved:', application);

    res.status(201).json({
      message: 'Adoption application submitted successfully',
      application: {
        _id: application._id,
        applicationId: application.applicationId,
        petName: application.petName,
        status: application.status,
        submittedAt: application.submittedAt
      }
    });

  } catch (error) {
    console.error('Error submitting adoption application:', error);
    res.status(500).json({ 
      error: 'Failed to submit application',
      message: error.message,
      details: error.stack
    });
  }
});

// @route   GET /api/adoption/applications
// @desc    Get all adoption applications (Admin only)
// @access  Private/Admin
router.get('/applications', async (req, res) => {
  try {
    const { status, petId } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (petId) query.petId = petId;

    const applications = await Adoption.find(query)
      .populate('petId', 'name breed species age image')
      .sort({ submittedAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ 
      error: 'Failed to fetch applications',
      message: error.message 
    });
  }
});

// @route   GET /api/adoption/applications/:id
// @desc    Get single adoption application by ID
// @access  Private/Admin
router.get('/applications/:id', async (req, res) => {
  try {
    const application = await Adoption.findById(req.params.id)
      .populate('petId');

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

// @route   PUT /api/adoption/applications/:id
// @desc    Update adoption application status (Admin only)
// @access  Private/Admin
router.put('/applications/:id', async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;
    
    if (!['pending', 'under_review', 'approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be pending, under_review, approved, rejected, or completed' 
      });
    }

    const updateData = { 
      status,
      reviewedAt: new Date()
    };

    if (reviewNotes) {
      updateData.reviewNotes = reviewNotes;
    }

    const application = await Adoption.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('petId');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // If approved, update pet status
    if (status === 'approved') {
      await Pet.findByIdAndUpdate(application.petId, {
        availableForAdoption: false,
        adoptionStatus: 'adopted'
      });
    }

    res.json({
      message: 'Application updated successfully',
      application
    });

  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ 
      error: 'Failed to update application',
      message: error.message 
    });
  }
});

// @route   DELETE /api/adoption/applications/:id
// @desc    Delete adoption application (Admin only)
// @access  Private/Admin
router.delete('/applications/:id', async (req, res) => {
  try {
    const application = await Adoption.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({
      message: 'Application deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ 
      error: 'Failed to delete application',
      message: error.message 
    });
  }
});

export default router;