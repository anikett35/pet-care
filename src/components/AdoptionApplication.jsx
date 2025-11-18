// src/components/AdoptionApplication.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Home, Users, Calendar, DollarSign } from 'lucide-react';

const AdoptionApplication = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Housing Information
    housingType: '',
    ownOrRent: '',
    landlordPhone: '',
    yardAccess: '',
    yardFenced: '',
    
    // Family Information
    householdMembers: '',
    childrenAges: '',
    experienceWithPets: '',
    currentPets: '',
    veterinaryClinic: '',
    
    // Pet Care Plans
    hoursAlone: '',
    sleepingArrangements: '',
    exercisePlans: '',
    financialPreparedness: '',
    
    // References
    reference1Name: '',
    reference1Phone: '',
    reference1Relationship: '',
    reference2Name: '',
    reference2Phone: '',
    reference2Relationship: '',
    
    // Agreement
    agreement: false
  });

  // Sample pet data - in real app, fetch from API
  const samplePets = {
    1: { name: 'Max', species: 'Dog', breed: 'Golden Retriever' },
    2: { name: 'Luna', species: 'Cat', breed: 'Domestic Shorthair' },
    3: { name: 'Buddy', species: 'Dog', breed: 'Beagle' },
    4: { name: 'Bella', species: 'Cat', breed: 'Siamese' }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPet(samplePets[petId]);
      setLoading(false);
    }, 500);
  }, [petId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, send to backend
      console.log('Adoption application submitted:', {
        petId,
        petInfo: pet,
        application: formData
      });

      // Navigate to success page
      navigate('/adoption-success', { 
        state: { 
          petName: pet.name,
          applicationId: `APP-${Date.now()}`
        }
      });
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
          <p className="mt-4 text-green-300">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Pet not found</p>
          <button 
            onClick={() => navigate('/adoption')}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Adoption
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/adoption')}
            className="flex items-center text-green-400 hover:text-green-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Adoption
          </button>
          <h1 className="text-3xl font-bold text-white text-center">Adoption Application</h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        {/* Pet Info Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <FileText className="h-6 w-6 mr-2 text-green-400" />
            Applying to Adopt: {pet.name}
          </h2>
          <p className="text-green-300">
            {pet.breed} {pet.species} • Application ID: APP-{Date.now().toString().slice(-6)}
          </p>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-400" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name *"
                value={formData.firstName}
                onChange={handleChange}
                className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name *"
                value={formData.lastName}
                onChange={handleChange}
                className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleChange}
                className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={handleChange}
                className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Street Address *"
                value={formData.address}
                onChange={handleChange}
                className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={formData.city}
                  onChange={handleChange}
                  className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State *"
                  value={formData.state}
                  onChange={handleChange}
                  className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code *"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Housing Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Home className="h-5 w-5 mr-2 text-green-400" />
              Housing Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="housingType"
                value={formData.housingType}
                onChange={handleChange}
                className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Type of Housing *</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="other">Other</option>
              </select>
              
              <select
                name="ownOrRent"
                value={formData.ownOrRent}
                onChange={handleChange}
                className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Do you own or rent? *</option>
                <option value="own">Own</option>
                <option value="rent">Rent</option>
              </select>

              {formData.ownOrRent === 'rent' && (
                <input
                  type="text"
                  name="landlordPhone"
                  placeholder="Landlord Phone Number *"
                  value={formData.landlordPhone}
                  onChange={handleChange}
                  className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              )}

              <select
                name="yardAccess"
                value={formData.yardAccess}
                onChange={handleChange}
                className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Do you have yard access? *</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>

              {formData.yardAccess === 'yes' && (
                <select
                  name="yardFenced"
                  value={formData.yardFenced}
                  onChange={handleChange}
                  className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Is the yard fenced? *</option>
                  <option value="fully">Fully Fenced</option>
                  <option value="partially">Partially Fenced</option>
                  <option value="no">Not Fenced</option>
                </select>
              )}
            </div>
          </div>

          {/* Family & Experience */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Family & Experience</h3>
            <div className="space-y-4">
              <textarea
                name="householdMembers"
                placeholder="Tell us about the people in your household (ages, relationships) *"
                value={formData.householdMembers}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              
              <textarea
                name="experienceWithPets"
                placeholder="Describe your experience with pets *"
                value={formData.experienceWithPets}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              
              <textarea
                name="currentPets"
                placeholder="List current pets (type, age, gender) or write 'None' *"
                value={formData.currentPets}
                onChange={handleChange}
                rows="2"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          {/* Pet Care Plans */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-400" />
              Pet Care Plans
            </h3>
            <div className="space-y-4">
              <select
                name="hoursAlone"
                value={formData.hoursAlone}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">How many hours will the pet be alone daily? *</option>
                <option value="0-4">0-4 hours</option>
                <option value="4-8">4-8 hours</option>
                <option value="8+">8+ hours</option>
              </select>

              <textarea
                name="sleepingArrangements"
                placeholder="Where will the pet sleep? *"
                value={formData.sleepingArrangements}
                onChange={handleChange}
                rows="2"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />

              <textarea
                name="exercisePlans"
                placeholder="Describe your exercise and activity plans for the pet *"
                value={formData.exercisePlans}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          {/* Financial Preparedness */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-400" />
              Financial Preparedness
            </h3>
            <textarea
              name="financialPreparedness"
              placeholder="Are you prepared for the financial responsibility of pet ownership (food, vet care, emergencies)? Please describe. *"
              value={formData.financialPreparedness}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Veterinary Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Veterinary Information</h3>
            <input
              type="text"
              name="veterinaryClinic"
              placeholder="Name of your veterinary clinic (or planned clinic) *"
              value={formData.veterinaryClinic}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* References */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Personal References</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-green-400 font-semibold">Reference 1</h4>
                <input
                  type="text"
                  name="reference1Name"
                  placeholder="Full Name *"
                  value={formData.reference1Name}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
                <input
                  type="tel"
                  name="reference1Phone"
                  placeholder="Phone Number *"
                  value={formData.reference1Phone}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
                <input
                  type="text"
                  name="reference1Relationship"
                  placeholder="Relationship *"
                  value={formData.reference1Relationship}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-green-400 font-semibold">Reference 2</h4>
                <input
                  type="text"
                  name="reference2Name"
                  placeholder="Full Name *"
                  value={formData.reference2Name}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
                <input
                  type="tel"
                  name="reference2Phone"
                  placeholder="Phone Number *"
                  value={formData.reference2Phone}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
                <input
                  type="text"
                  name="reference2Relationship"
                  placeholder="Relationship *"
                  value={formData.reference2Relationship}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Agreement */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="agreement"
                checked={formData.agreement}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                required
              />
              <label className="text-white text-sm">
                I certify that the information provided is true and complete. 
                I understand that falsification of any information may result in 
                refusal of adoption. I authorize investigation of all statements 
                in this application and agree to comply with the adoption process. *
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={submitting || !formData.agreement}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-12 py-4 rounded-xl font-bold text-lg transition duration-200"
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Submitting Application...
                </span>
              ) : (
                'Submit Adoption Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptionApplication;