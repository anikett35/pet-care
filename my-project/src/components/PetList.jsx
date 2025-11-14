// src/components/PetList.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showPetForm, setShowPetForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    weight: '',
    gender: 'Male',
    color: '',
    owner: {
      name: '',
      email: '',
      phone: '',
      address: ''
    }
  });

  const fetchPets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/pets');
      if (!response.ok) throw new Error('Failed to fetch pets');
      const data = await response.json();
      setPets(data);
    } catch (err) {
      console.error('Error fetching pets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleDeletePet = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/pets/${petId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setPets(pets.filter(pet => pet._id !== petId));
        }
      } catch (err) {
        console.error('Error deleting pet:', err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('owner.')) {
      const ownerField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        owner: { ...prev.owner, [ownerField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        await fetchPets();
        setShowPetForm(false);
        setFormData({
          name: '',
          species: 'Dog',
          breed: '',
          age: '',
          weight: '',
          gender: 'Male',
          color: '',
          owner: { name: '', email: '', phone: '', address: '' }
        });
      }
    } catch (err) {
      console.error('Error creating pet:', err);
    }
  };

  const filteredPets = pets.filter(pet => {
    if (filter === 'all') return true;
    return pet.species === filter;
  });

  const speciesCounts = pets.reduce((acc, pet) => {
    acc[pet.species] = (acc[pet.species] || 0) + 1;
    return acc;
  }, {});

  const speciesConfig = {
    Dog: { emoji: '🐶', gradient: 'from-purple-600 to-purple-800' },
    Cat: { emoji: '🐱', gradient: 'from-pink-600 to-pink-800' },
    Bird: { emoji: '🐦', gradient: 'from-purple-500 to-pink-500' },
    Fish: { emoji: '🐠', gradient: 'from-pink-500 to-purple-500' },
    Rabbit: { emoji: '🐰', gradient: 'from-purple-700 to-pink-700' },
    Other: { emoji: '🐾', gradient: 'from-gray-600 to-gray-800' }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-purple-300 font-medium">Loading pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6">
      
      {/* Header Section */}
      <section className="mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Pet Family</span>
              </h1>
              <p className="text-purple-300 text-lg">Manage your beloved companions</p>
            </div>
            <button 
              onClick={() => setShowPetForm(true)}
              className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-2xl hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <span className="text-2xl">+</span>
                <span>Add New Pet</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats & Filter Section */}
      <section className="mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Stats Cards */}
            <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Pet Statistics</h3>
              <div className="flex flex-wrap gap-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl">
                  <span className="text-3xl font-bold text-white">{pets.length}</span>
                  <span className="text-purple-100 ml-2">Total</span>
                </div>
                {Object.entries(speciesCounts).map(([species, count]) => (
                  <div key={species} className="bg-gray-700/50 px-4 py-3 rounded-xl border border-purple-500/20">
                    <span className="text-xl font-bold text-white">{count}</span>
                    <span className="text-purple-300 ml-2 text-sm">{species}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30">
              <label className="block text-sm font-semibold text-purple-300 mb-3">Filter</label>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              >
                <option value="all">All ({pets.length})</option>
                {Object.keys(speciesCounts).map(species => (
                  <option key={species} value={species}>
                    {species} ({speciesCounts[species]})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Pets Grid */}
      <section>
        <div className="max-w-7xl mx-auto">
          {filteredPets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPets.map(pet => {
                const config = speciesConfig[pet.species] || speciesConfig.Other;
                return (
                  <div key={pet._id} className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:scale-105">
                    
                    {/* Pet Image */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                      {pet.imageUrl ? (
                        <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-6xl">{config.emoji}</span>
                      )}
                      <div className={`absolute top-3 right-3 bg-gradient-to-r ${config.gradient} px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg`}>
                        {pet.species}
                      </div>
                    </div>

                    {/* Pet Info */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{pet.name}</h3>
                      
                      {pet.breed && (
                        <p className="text-purple-300 text-sm mb-3">{pet.breed}</p>
                      )}

                      <div className="space-y-2 mb-4">
                        {pet.age && (
                          <div className="flex items-center text-sm text-gray-300">
                            <span className="text-purple-400 mr-2">⏰</span>
                            <span>{pet.age} {pet.age === 1 ? 'year' : 'years'} old</span>
                          </div>
                        )}
                        {pet.gender && (
                          <div className="flex items-center text-sm text-gray-300">
                            <span className="text-pink-400 mr-2">⚧</span>
                            <span>{pet.gender}</span>
                          </div>
                        )}
                        {pet.weight && (
                          <div className="flex items-center text-sm text-gray-300">
                            <span className="text-purple-400 mr-2">⚖️</span>
                            <span>{pet.weight} kg</span>
                          </div>
                        )}
                      </div>

                      {/* Owner */}
                      {pet.owner?.name && (
                        <div className="mb-4 pb-4 border-b border-gray-700">
                          <p className="text-xs text-gray-400">Owner</p>
                          <p className="text-sm text-white font-semibold">{pet.owner.name}</p>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center bg-gray-700/50 rounded-lg p-2">
                          <span className="block text-lg font-bold text-green-400">{pet.vaccinations?.length || 0}</span>
                          <span className="text-xs text-gray-400">Vaccines</span>
                        </div>
                        <div className="text-center bg-gray-700/50 rounded-lg p-2">
                          <span className="block text-lg font-bold text-blue-400">{pet.appointments?.length || 0}</span>
                          <span className="text-xs text-gray-400">Appts</span>
                        </div>
                        <div className="text-center bg-gray-700/50 rounded-lg p-2">
                          <span className="block text-lg font-bold text-purple-400">{pet.medications?.length || 0}</span>
                          <span className="text-xs text-gray-400">Meds</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link 
                          to={`/pets/${pet._id}`}
                          className={`flex-1 text-center bg-gradient-to-r ${config.gradient} text-white py-2 rounded-xl font-semibold transition hover:opacity-90`}
                        >
                          View
                        </Link>
                        <button 
                          onClick={() => handleDeletePet(pet._id)}
                          className="px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-purple-500/30">
              <div className="text-6xl mb-4">🐾</div>
              <h3 className="text-2xl font-bold text-white mb-2">No pets found</h3>
              <p className="text-purple-300 mb-6">
                {filter === 'all' 
                  ? 'Add your first pet to get started!' 
                  : `No ${filter.toLowerCase()} found.`}
              </p>
              {filter !== 'all' ? (
                <button 
                  onClick={() => setFilter('all')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Show All Pets
                </button>
              ) : (
                <button 
                  onClick={() => setShowPetForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Add Your First Pet
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Add Pet Form Modal */}
      {showPetForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-purple-500/30">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Add New Pet</h2>
                <button 
                  onClick={() => setShowPetForm(false)}
                  className="text-gray-400 hover:text-white text-3xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Pet Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="Buddy"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Species *</label>
                    <select
                      name="species"
                      value={formData.species}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Fish">Fish</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Breed</label>
                    <input
                      type="text"
                      name="breed"
                      value={formData.breed}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="Golden Retriever"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Age (years)</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="0"
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="25"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Color</label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="Golden"
                    />
                  </div>
                </div>

                {/* Owner Info */}
                <div className="pt-4 border-t border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Owner Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">Name</label>
                      <input
                        type="text"
                        name="owner.name"
                        value={formData.owner.name}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">Email</label>
                      <input
                        type="email"
                        name="owner.email"
                        value={formData.owner.email}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="owner.phone"
                        value={formData.owner.phone}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-300 mb-2">Address</label>
                      <input
                        type="text"
                        name="owner.address"
                        value={formData.owner.address}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold transition"
                  >
                    Add Pet
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPetForm(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-bold transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetList;