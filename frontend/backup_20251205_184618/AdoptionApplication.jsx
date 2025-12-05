import { API_URL } from '../config';
// src/components/AdoptionApplication.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Home, 
  Users, 
  Calendar, 
  DollarSign,
  Heart,
  Shield,
  CheckCircle,
  AlertCircle,
  PawPrint,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  Star
} from 'lucide-react';

const AdoptionApplication = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);

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

  const sections = [
    { id: 'personal', title: 'Personal Info', icon: User },
    { id: 'housing', title: 'Housing', icon: Home },
    { id: 'family', title: 'Family & Experience', icon: Users },
    { id: 'care', title: 'Pet Care Plans', icon: Heart },
    { id: 'financial', title: 'Financial', icon: DollarSign },
    { id: 'references', title: 'References', icon: Shield },
    { id: 'agreement', title: 'Agreement', icon: FileText }
  ];

  const API_BASE_URL = `${API_URL}`/api';

  useEffect(() => {
    fetchPet();
  }, [petId]);

  const fetchPet = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/pets/${petId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch pet information');
      }

      const petData = await response.json();
      setPet(petData);
    } catch (err) {
      console.error('Error fetching pet:', err);
      setError('Failed to load pet information');
    } finally {
      setLoading(false);
    }
  };

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
    setError(null);

    try {
      const applicationData = {
        petId: petId,
        applicant: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        housing: {
          type: formData.housingType,
          ownership: formData.ownOrRent,
          landlordPhone: formData.landlordPhone,
          yardAccess: formData.yardAccess,
          yardFenced: formData.yardFenced
        },
        family: {
          householdMembers: formData.householdMembers,
          childrenAges: formData.childrenAges,
          experienceWithPets: formData.experienceWithPets,
          currentPets: formData.currentPets
        },
        carePlans: {
          hoursAlone: formData.hoursAlone,
          sleepingArrangements: formData.sleepingArrangements,
          exercisePlans: formData.exercisePlans,
          financialPreparedness: formData.financialPreparedness,
          veterinaryClinic: formData.veterinaryClinic
        },
        references: [
          {
            name: formData.reference1Name,
            phone: formData.reference1Phone,
            relationship: formData.reference1Relationship
          },
          {
            name: formData.reference2Name,
            phone: formData.reference2Phone,
            relationship: formData.reference2Relationship
          }
        ],
        agreement: formData.agreement
      };

      const response = await fetch(`${API_BASE_URL}/adoption/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      // Navigate to success page with real data
      navigate('/adoption-success', { 
        state: { 
          petName: pet.name,
          applicationId: data.application.applicationId
        }
      });

    } catch (error) {
      console.error('Error submitting application:', error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const nextSection = () => {
    setCurrentSection(prev => Math.min(prev + 1, sections.length - 1));
  };

  const prevSection = () => {
    setCurrentSection(prev => Math.max(prev - 1, 0));
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0: // Personal Information
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Street Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  placeholder="State"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">ZIP Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  placeholder="12345"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 1: // Housing Information
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Type of Housing *</label>
                <select
                  name="housingType"
                  value={formData.housingType}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  required
                >
                  <option value="">Select housing type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Do you own or rent? *</label>
                <select
                  name="ownOrRent"
                  value={formData.ownOrRent}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  required
                >
                  <option value="">Select option</option>
                  <option value="own">Own</option>
                  <option value="rent">Rent</option>
                </select>
              </div>
            </div>

            {formData.ownOrRent === 'rent' && (
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Landlord Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                  <input
                    type="tel"
                    name="landlordPhone"
                    value={formData.landlordPhone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Do you have yard access? *</label>
                <select
                  name="yardAccess"
                  value={formData.yardAccess}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  required
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {formData.yardAccess === 'yes' && (
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Is the yard fenced? *</label>
                  <select
                    name="yardFenced"
                    value={formData.yardFenced}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    required
                  >
                    <option value="">Select option</option>
                    <option value="fully">Fully Fenced</option>
                    <option value="partially">Partially Fenced</option>
                    <option value="no">Not Fenced</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        );

      case 2: // Family & Experience
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Household Members *</label>
              <textarea
                name="householdMembers"
                placeholder="Tell us about the people in your household (ages, relationships) *"
                value={formData.householdMembers}
                onChange={handleChange}
                rows="3"
                className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Children's Ages (if any)</label>
              <input
                type="text"
                name="childrenAges"
                value={formData.childrenAges}
                onChange={handleChange}
                className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                placeholder="e.g., 5, 8, 12 or None"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Experience with Pets *</label>
              <textarea
                name="experienceWithPets"
                placeholder="Describe your experience with pets *"
                value={formData.experienceWithPets}
                onChange={handleChange}
                rows="3"
                className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Current Pets *</label>
              <textarea
                name="currentPets"
                placeholder="List current pets (type, age, gender) or write 'None' *"
                value={formData.currentPets}
                onChange={handleChange}
                rows="2"
                className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                required
              />
            </div>
          </div>
        );

      case 3: // Pet Care Plans
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Hours Alone Daily *</label>
              <select
                name="hoursAlone"
                value={formData.hoursAlone}
                onChange={handleChange}
                className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                required
              >
                <option value="">How many hours will the pet be alone daily? *</option>
                <option value="0-4">0-4 hours</option>
                <option value="4-8">4-8 hours</option>
                <option value="8+">8+ hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Sleeping Arrangements *</label>
              <textarea
                name="sleepingArrangements"
                placeholder="Where will the pet sleep? *"
                value={formData.sleepingArrangements}
                onChange={handleChange}
                rows="2"
                className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Exercise Plans *</label>
              <textarea
                name="exercisePlans"
                placeholder="Describe your exercise and activity plans for the pet *"
                value={formData.exercisePlans}
                onChange={handleChange}
                rows="3"
                className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                required
              />
            </div>
          </div>
        );

      case 4: // Financial Preparedness
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Financial Preparedness *</label>
              <textarea
                name="financialPreparedness"
                placeholder="Are you prepared for the financial responsibility of pet ownership (food, vet care, emergencies)? Please describe. *"
                value={formData.financialPreparedness}
                onChange={handleChange}
                rows="3"
                className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Veterinary Clinic *</label>
              <input
                type="text"
                name="veterinaryClinic"
                value={formData.veterinaryClinic}
                onChange={handleChange}
                className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                placeholder="Name of your veterinary clinic (or planned clinic)"
                required
              />
            </div>
          </div>
        );

      case 5: // References
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center">
                  <User className="h-5 w-5 mr-2 text-purple-400" />
                  Reference 1
                </h4>
                <input
                  type="text"
                  name="reference1Name"
                  placeholder="Full Name *"
                  value={formData.reference1Name}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  required
                />
                <input
                  type="tel"
                  name="reference1Phone"
                  placeholder="Phone Number *"
                  value={formData.reference1Phone}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  required
                />
                <input
                  type="text"
                  name="reference1Relationship"
                  placeholder="Relationship *"
                  value={formData.reference1Relationship}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center">
                  <User className="h-5 w-5 mr-2 text-purple-400" />
                  Reference 2
                </h4>
                <input
                  type="text"
                  name="reference2Name"
                  placeholder="Full Name *"
                  value={formData.reference2Name}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  required
                />
                <input
                  type="tel"
                  name="reference2Phone"
                  placeholder="Phone Number *"
                  value={formData.reference2Phone}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  required
                />
                <input
                  type="text"
                  name="reference2Relationship"
                  placeholder="Relationship *"
                  value={formData.reference2Relationship}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 6: // Agreement
        return (
          <div className="space-y-6">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-purple-400" />
                Important Information
              </h4>
              <ul className="space-y-3 text-purple-300 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Application review typically takes 3-5 business days</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>We will contact your references and veterinarian</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>A home visit may be required for certain pets</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Adoption fee covers vaccinations, spay/neuter, and microchip</span>
                </li>
              </ul>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-gray-700/50 rounded-2xl border border-purple-500/30">
              <input
                type="checkbox"
                name="agreement"
                checked={formData.agreement}
                onChange={handleChange}
                className="mt-1 w-5 h-5 text-purple-600 bg-gray-700 border-purple-500/30 rounded focus:ring-purple-500 focus:ring-2"
                required
              />
              <div>
                <label className="text-white font-semibold block mb-2">
                  Adoption Agreement
                </label>
                <p className="text-purple-300 text-sm leading-relaxed">
                  I certify that all information provided is true and complete. I understand that 
                  falsification may result in refusal of adoption. I authorize investigation of 
                  all statements and agree to comply with the adoption process. I am prepared 
                  to provide a loving, permanent home for this pet.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Section content</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-purple-300">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error && !pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
          <AlertCircle className="h-16 w-16 text-pink-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Application</h2>
          <p className="text-purple-300 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/adoption')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
          >
            Back to Adoption Center
          </button>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
          <AlertCircle className="h-16 w-16 text-pink-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Pet Not Found</h2>
          <p className="text-purple-300 mb-6">The pet you're looking for is not available.</p>
          <button 
            onClick={() => navigate('/adoption')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
          >
            Back to Adoption Center
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/adoption')}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Adoption
          </button>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Adoption <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Application</span>
            </h1>
            <p className="text-purple-300 text-lg">
              You're applying to adopt {pet.name}
            </p>
          </div>
          <div className="w-20"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Pet Info Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <PawPrint className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{pet.name}</h3>
                  <p className="text-purple-400">{pet.breed} {pet.species}</p>
                  <p className="text-gray-400 text-sm">{pet.age}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Adoption Fee:</span>
                  <span className="text-purple-400 font-semibold">${pet.adoptionFee}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Location:</span>
                  <span className="text-pink-400">{pet.location}</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-400" />
                Application Progress
              </h4>
              <div className="space-y-3">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  const isCompleted = index < currentSection;
                  const isCurrent = index === currentSection;
                  
                  return (
                    <div
                      key={section.id}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                        isCurrent
                          ? 'bg-purple-500/20 border border-purple-500/50'
                          : isCompleted
                          ? 'bg-green-500/10 border border-green-500/30'
                          : 'bg-gray-700/50 border border-gray-600'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isCurrent
                          ? 'bg-purple-500 text-white'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-600 text-gray-400'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className={`font-medium ${
                        isCurrent ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {section.title}
                      </span>
                      {isCompleted && (
                        <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    {React.createElement(sections[currentSection].icon, { 
                      className: "h-6 w-6 text-white" 
                    })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {sections[currentSection].title}
                    </h2>
                    <p className="text-purple-300">
                      Step {currentSection + 1} of {sections.length}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-purple-300 mb-1">Completion</div>
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit}>
                {renderSection()}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 mt-8 border-t border-purple-500/30">
                  <button
                    type="button"
                    onClick={prevSection}
                    disabled={currentSection === 0}
                    className="px-8 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-xl font-semibold transition-all duration-300 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {currentSection < sections.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextSection}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    >
                      Next Section
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting || !formData.agreement}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </span>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptionApplication;