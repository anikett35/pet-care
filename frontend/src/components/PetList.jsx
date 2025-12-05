// src/components/PetList.jsx - FIXED to use MongoDB
import React, { useState, useEffect } from 'react';
import { Plus, Camera, Edit, Trash2, Upload, AlertCircle, CheckCircle } from 'lucide-react';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    weight: '',
    size: 'Medium',
    color: '',
    image: '',
    imagePreview: ''
  });

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/pets`);
      if (!response.ok) throw new Error('Failed to fetch pets');
      
      const data = await response.json();
      console.log('✅ Pets loaded from database:', data);
      setPets(data);
      
    } catch (err) {
      console.error('❌ Error fetching pets:', err);
      setError('Failed to load pets from database');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = () => {
    setEditingPet(null);
    setFormData({
      name: '',
      species: 'Dog',
      breed: '',
      age: '',
      gender: 'Male',
      weight: '',
      size: 'Medium',
      color: '',
      image: '',
      imagePreview: ''
    });
    setShowForm(true);
  };

  const handleEditPet = (pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      weight: pet.weight || '',
      size: pet.size || 'Medium',
      color: pet.color || '',
      image: pet.image || '',
      imagePreview: pet.image || ''
    });
    setShowForm(true);
  };

  const handleDeletePet = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/pets/${petId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete pet');

      setSuccessMessage('Pet deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh the pet list
      fetchPets();
    } catch (err) {
      console.error('Error deleting pet:', err);
      setError('Failed to delete pet');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result, // Store base64 for database
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      // Prepare data for API
      const petData = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        age: formData.age,
        gender: formData.gender,
        weight: formData.weight,
        size: formData.size,
        color: formData.color,
        image: formData.image || formData.imagePreview
      };

      let response;
      
      if (editingPet) {
        // Update existing pet
        response = await fetch(`${API_BASE_URL}/pets/${editingPet._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(petData)
        });
      } else {
        // Create new pet
        response = await fetch(`${API_BASE_URL}/pets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(petData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save pet');
      }

      const result = await response.json();
      console.log('✅ Pet saved:', result);

      setSuccessMessage(editingPet ? 'Pet updated successfully!' : 'Pet added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setShowForm(false);
      setEditingPet(null);
      
      // Refresh the pet list
      fetchPets();
      
    } catch (err) {
      console.error('❌ Error saving pet:', err);
      setError(err.message);
    }
  };

  const getSpeciesIcon = (species) => {
    return species === 'Dog' ? '🐕' : species === 'Cat' ? '🐈' : '🐾';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-purple-300">Loading pets from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900">
      {/* Header Section */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Pet Family</span>
              </h1>
              <p className="text-xl text-purple-300">Manage your beloved companions</p>
            </div>
            <button 
              onClick={handleAddPet}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-2xl hover:scale-105 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Pet</span>
            </button>
          </div>
        </div>
      </section>

      {/* Messages */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <span className="text-green-300 font-semibold">{successMessage}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <span className="text-red-300 font-semibold">{error}</span>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Pet Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{pets.length}</div>
                <div className="text-purple-300">Total Pets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {pets.filter(pet => pet.species === 'Dog').length}
                </div>
                <div className="text-purple-300">Dogs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {pets.filter(pet => pet.species === 'Cat').length}
                </div>
                <div className="text-purple-300">Cats</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {pets.filter(pet => pet.gender === 'Male').length}
                </div>
                <div className="text-purple-300">Males</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pets Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {pets.length === 0 ? (
            <div className="text-center py-20 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-purple-500/30">
              <div className="text-6xl mb-4">🐾</div>
              <h3 className="text-2xl font-bold text-white mb-2">No pets in database</h3>
              <p className="text-purple-300 mb-6">Add your first pet to get started!</p>
              <button 
                onClick={handleAddPet}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Add Your First Pet
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pets.map((pet) => (
                <div
                  key={pet._id}
                  className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10">
                    {/* Pet Image */}
                    <div className="relative mb-4">
                      {pet.image ? (
                        <img
                          src={pet.image}
                          alt={pet.name}
                          className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-purple-500/30"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center border-4 border-purple-500/30">
                          <span className="text-3xl">{getSpeciesIcon(pet.species)}</span>
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 bg-purple-600 rounded-full p-2">
                        <span className="text-xl">{getSpeciesIcon(pet.species)}</span>
                      </div>
                    </div>

                    {/* Pet Info */}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-white mb-1">{pet.name}</h3>
                      <p className="text-purple-300 text-sm">
                        {pet.breed} • {pet.species}
                      </p>
                    </div>

                    {/* Pet Details */}
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex justify-between">
                        <span>Age:</span>
                        <span className="text-white">{pet.age}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gender:</span>
                        <span className="text-white">{pet.gender}</span>
                      </div>
                      {pet.weight && (
                        <div className="flex justify-between">
                          <span>Weight:</span>
                          <span className="text-white">{pet.weight}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-gray-700">
                      <button
                        onClick={() => handleEditPet(pet)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePet(pet._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add/Edit Pet Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-purple-500/30">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingPet ? 'Edit Pet' : 'Add New Pet'}
                </h2>
                <button 
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Image Upload */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full border-4 border-purple-500/30 overflow-hidden bg-gray-700">
                      {formData.imagePreview ? (
                        <img
                          src={formData.imagePreview}
                          alt="Pet preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Camera className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full cursor-pointer transition duration-200">
                      <Upload className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Click to upload image</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Pet Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white"
                    placeholder="Enter pet name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Species *</label>
                    <select
                      value={formData.species}
                      onChange={(e) => setFormData({...formData, species: e.target.value})}
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white"
                      required
                    >
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Breed *</label>
                    <input
                      type="text"
                      value={formData.breed}
                      onChange={(e) => setFormData({...formData, breed: e.target.value})}
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white"
                      placeholder="Enter breed"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Age *</label>
                    <input
                      type="text"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white"
                      placeholder="e.g., 2 years"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Size *</label>
                    <select
                      value={formData.size}
                      onChange={(e) => setFormData({...formData, size: e.target.value})}
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white"
                    >
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Weight</label>
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white"
                      placeholder="e.g., 25 lbs"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold"
                  >
                    {editingPet ? 'Update Pet' : 'Add Pet'}
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetList;