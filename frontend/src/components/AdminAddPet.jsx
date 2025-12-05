import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, Upload, X, Check, AlertCircle, Heart, Eye } from 'lucide-react';

const AdminAddPet = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    size: 'Medium',
    weight: '',
    color: '',
    image: '',
    
    // Adoption Specific
    availableForAdoption: true,
    adoptionFee: 50,
    adoptionStatus: 'available',
    location: 'Main Shelter',
    description: '',
    goodWith: [],
    specialNeeds: 'None',
    energyLevel: 'Medium',
    trainingLevel: 'Basic',
    featured: false,
    vaccinated: false,
    neutered: false
  });

  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [addedPetId, setAddedPetId] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGoodWithChange = (option) => {
    setFormData(prev => {
      const currentGoodWith = prev.goodWith || [];
      if (currentGoodWith.includes(option)) {
        return {
          ...prev,
          goodWith: currentGoodWith.filter(item => item !== option)
        };
      } else {
        return {
          ...prev,
          goodWith: [...currentGoodWith, option]
        };
      }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size too large. Please upload an image smaller than 5MB');
        setTimeout(() => setError(''), 3000);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Compress image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set max dimensions
          const maxWidth = 800;
          const maxHeight = 800;
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = height * (maxWidth / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = width * (maxHeight / height);
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.7 quality
          const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
          
          setImagePreview(compressedImage);
          setFormData(prev => ({ ...prev, image: compressedImage }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Pet name is required');
      return false;
    }
    if (!formData.breed.trim()) {
      setError('Breed is required');
      return false;
    }
    if (!formData.age.trim()) {
      setError('Age is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      console.log('Submitting pet data:', formData);
      
      const response = await fetch(`${API_BASE_URL}/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();
      console.log('Server response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to add pet');
      }

      const newPet = responseData;
      console.log('Pet added successfully:', newPet);
      
      setAddedPetId(newPet._id);
      setSuccess(true);
      
      // Show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('Error adding pet:', err);
      setError(err.message || 'Failed to add pet. Please check your backend server and try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    setFormData({
      name: '',
      species: 'Dog',
      breed: '',
      age: '',
      gender: 'Male',
      size: 'Medium',
      weight: '',
      color: '',
      image: '',
      availableForAdoption: true,
      adoptionFee: 50,
      adoptionStatus: 'available',
      location: 'Main Shelter',
      description: '',
      goodWith: [],
      specialNeeds: 'None',
      energyLevel: 'Medium',
      trainingLevel: 'Basic',
      featured: false,
      vaccinated: false,
      neutered: false
    });
    setImagePreview('');
    setSuccess(false);
    setAddedPetId(null);
  };

  const handleViewInAdoptionCenter = () => {
    navigate('/adoption');
  };

  const goodWithOptions = ['Kids', 'Dogs', 'Cats', 'Other Pets'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4 shadow-2xl">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Add Pet for Adoption
          </h1>
          <p className="text-purple-300 text-lg">
            Help a pet find their forever home
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-500/20 border-2 border-green-500 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-500 rounded-full p-2">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-green-300 font-bold text-xl mb-2">Pet Added Successfully! 🎉</h3>
                <p className="text-green-200 mb-4">
                  The pet has been added and is now available for adoption in the Adoption Center.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleViewInAdoptionCenter}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View in Adoption Center
                  </button>
                  <button
                    onClick={handleAddAnother}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200"
                  >
                    Add Another Pet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/20 border-2 border-red-500 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-300 font-semibold">{error}</p>
              <p className="text-red-200 text-sm mt-1">
                Make sure your backend server is running on http://localhost:5000
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
          
          {/* Image Upload */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5 text-purple-400" />
              Pet Photo
            </h3>
            <div className="flex flex-col items-center gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-48 h-48 object-cover rounded-2xl border-4 border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, image: '' }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="w-48 h-48 border-2 border-dashed border-purple-500 rounded-2xl flex items-center justify-center bg-gray-700/50">
                  <PawPrint className="h-16 w-16 text-purple-400 opacity-50" />
                </div>
              )}
              <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 inline-flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-300 font-semibold mb-2">
                  Pet Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  placeholder="e.g., Max"
                />
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">
                  Species <span className="text-red-400">*</span>
                </label>
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">
                  Breed <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  placeholder="e.g., Golden Retriever"
                />
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">
                  Age <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  placeholder="e.g., 2 years or 6 months"
                />
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">Size</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                >
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">Weight (kg)</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  placeholder="e.g., 15"
                />
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  placeholder="e.g., Brown"
                />
              </div>
            </div>
          </div>

          {/* Adoption Details */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Adoption Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-300 font-semibold mb-2">Adoption Fee ($)</label>
                <input
                  type="number"
                  name="adoptionFee"
                  value={formData.adoptionFee}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  placeholder="e.g., Main Shelter"
                />
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">Energy Level</label>
                <select
                  name="energyLevel"
                  value={formData.energyLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                >
                  <option value="Very Low">Very Low</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Very High">Very High</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">Training Level</label>
                <select
                  name="trainingLevel"
                  value={formData.trainingLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                >
                  <option value="None">None</option>
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-purple-300 font-semibold mb-2">Special Needs</label>
                <input
                  type="text"
                  name="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  placeholder="e.g., None or describe needs"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-purple-300 font-semibold mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                placeholder="Tell us about this pet's personality, behavior, and what makes them special..."
              />
            </div>
          </div>

          {/* Good With */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Good With</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {goodWithOptions.map(option => (
                <div
                  key={option}
                  onClick={() => handleGoodWithChange(option)}
                  className={`flex items-center justify-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.goodWith.includes(option)
                      ? 'bg-purple-600 border-2 border-purple-400'
                      : 'bg-gray-700 border-2 border-gray-600 hover:border-purple-500'
                  }`}
                >
                  <span className="text-white font-semibold">{option}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Health Status */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Health Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                onClick={() => setFormData(prev => ({ ...prev, vaccinated: !prev.vaccinated }))}
                className="flex items-center gap-3 px-4 py-3 bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-600 transition-all duration-200"
              >
                <input
                  type="checkbox"
                  checked={formData.vaccinated}
                  readOnly
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 pointer-events-none"
                />
                <span className="text-white font-semibold">Vaccinated</span>
              </div>

              <div 
                onClick={() => setFormData(prev => ({ ...prev, neutered: !prev.neutered }))}
                className="flex items-center gap-3 px-4 py-3 bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-600 transition-all duration-200"
              >
                <input
                  type="checkbox"
                  checked={formData.neutered}
                  readOnly
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 pointer-events-none"
                />
                <span className="text-white font-semibold">Neutered/Spayed</span>
              </div>

              <div 
                onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
                className="flex items-center gap-3 px-4 py-3 bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-600 transition-all duration-200"
              >
                <input
                  type="checkbox"
                  checked={formData.featured}
                  readOnly
                  className="w-5 h-5 text-yellow-600 rounded focus:ring-2 focus:ring-yellow-500 pointer-events-none"
                />
                <span className="text-white font-semibold">Featured Pet</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Adding Pet...
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5" />
                  Add Pet for Adoption
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddPet;