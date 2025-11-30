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
// @desc    Submit adoption application
// @access  Public (requires auth in production)
router.post('/applications', async (req, res) => {
  try {
    const { petId, applicantInfo } = req.body;

    // Validation
    if (!petId || !applicantInfo) {
      return res.status(400).json({ 
        error: 'Pet ID and applicant information are required' 
      });
    }

    // Check if pet exists and is available
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    if (!pet.availableForAdoption) {
      return res.status(400).json({ 
        error: 'This pet is no longer available for adoption' 
      });
    }

    // Create adoption application
    const application = new Adoption({
      petId,
      petName: pet.name,
      petSpecies: pet.species,
      applicantName: applicantInfo.fullName,
      applicantEmail: applicantInfo.email,
      applicantPhone: applicantInfo.phone,
      applicantAddress: applicantInfo.address,
      applicantInfo,
      status: 'pending'
    });

    await application.save();

    res.status(201).json({
      message: 'Adoption application submitted successfully',
      application
    });

  } catch (error) {
    console.error('Error submitting adoption application:', error);
    res.status(500).json({ 
      error: 'Failed to submit application',
      message: error.message 
    });
  }
});

// @route   GET /api/adoption/applications
// @desc    Get all adoption applications (Admin only)
// @access  Private/Admin
router.get('/applications', async (req, res) => {
  try {
    const applications = await Adoption.find()
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ 
      error: 'Failed to fetch applications',
      message: error.message 
    });
  }
});

// @route   PUT /api/adoption/applications/:id
// @desc    Update adoption application status (Admin only)
// @access  Private/Admin
router.put('/applications/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be pending, approved, or rejected' 
      });
    }

    const application = await Adoption.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

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