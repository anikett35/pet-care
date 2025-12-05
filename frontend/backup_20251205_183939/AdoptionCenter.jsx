// src/components/AdoptionCenter.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Search, 
  Filter, 
  PawPrint, 
  MapPin, 
  Calendar, 
  Users, 
  Star,
  Shield,
  Clock,
  TrendingUp,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const AdoptionCenter = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    species: '',
    age: '',
    gender: '',
    size: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    dogs: 0,
    cats: 0,
    adopted: 0
  });

  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (filters.species) queryParams.append('species', filters.species);
      if (filters.age) queryParams.append('age', filters.age);
      if (filters.size) queryParams.append('size', filters.size);
      if (searchTerm) queryParams.append('search', searchTerm);

      console.log('Fetching pets from:', `${API_BASE_URL}/adoption/available-pets?${queryParams}`);
      
      const response = await fetch(`${API_BASE_URL}/adoption/available-pets?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch pets: ${response.status}`);
      }

      const petsData = await response.json();
      console.log('Pets data received:', petsData);
      
      setPets(petsData);
      setFilteredPets(petsData);
      
      // Calculate stats
      setStats({
        total: petsData.length,
        dogs: petsData.filter(pet => pet.species === 'Dog').length,
        cats: petsData.filter(pet => pet.species === 'Cat').length,
        adopted: petsData.filter(pet => !pet.availableForAdoption).length
      });
      
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError('Failed to load pets. Please try again later.');
      setPets([]);
      setFilteredPets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterPets();
  }, [searchTerm, filters, pets]);

  const filterPets = () => {
    let filtered = pets;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Species filter
    if (filters.species) {
      filtered = filtered.filter(pet => pet.species === filters.species);
    }

    // Age filter
    if (filters.age) {
      filtered = filtered.filter(pet => {
        if (filters.age === 'puppy') return pet.age.includes('months') || parseInt(pet.age) < 2;
        if (filters.age === 'young') return parseInt(pet.age) >= 2 && parseInt(pet.age) < 5;
        if (filters.age === 'adult') return parseInt(pet.age) >= 5;
        return true;
      });
    }

    // Gender filter
    if (filters.gender) {
      filtered = filtered.filter(pet => pet.gender === filters.gender);
    }

    // Size filter
    if (filters.size) {
      filtered = filtered.filter(pet => pet.size === filters.size);
    }

    setFilteredPets(filtered);
  };

  const handleAdoptClick = (petId) => {
    navigate(`/adoption-application/${petId}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      species: '',
      age: '',
      gender: '',
      size: ''
    });
  };

  const getEnergyLevelColor = (level) => {
    const colors = {
      'Very High': 'from-red-500 to-orange-500',
      'High': 'from-orange-500 to-yellow-500',
      'Medium': 'from-yellow-500 to-green-500',
      'Low': 'from-green-500 to-blue-500',
      'Very Low': 'from-blue-500 to-purple-500'
    };
    return colors[level] || 'from-gray-500 to-slate-500';
  };

  // If no pets are available for adoption, show a helpful message
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-purple-300">Loading adoption center...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-purple-500/30">
          <AlertCircle className="h-16 w-16 text-pink-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Pets</h2>
          <p className="text-purple-300 mb-2">{error}</p>
          <p className="text-gray-400 text-sm mb-6">
            Make sure your backend server is running on port 5000
          </p>
          <div className="space-y-3">
            <button 
              onClick={fetchPets}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900">
      {/* Header Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4 shadow-2xl">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">New Best Friend</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-300 max-w-2xl mx-auto">
              Give a loving home to pets in need. Browse our available pets ready for adoption and start your journey today.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <div className="text-3xl font-bold text-white">{stats.total}</div>
              <div className="text-purple-300 text-sm">Pets Available</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
              <div className="text-3xl font-bold text-white">{stats.dogs}</div>
              <div className="text-blue-300 text-sm">Dogs Waiting</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30">
              <div className="text-3xl font-bold text-white">{stats.cats}</div>
              <div className="text-pink-300 text-sm">Cats Waiting</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
              <div className="text-3xl font-bold text-white">{stats.adopted}</div>
              <div className="text-green-300 text-sm">Recently Adopted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by name, breed, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Species Filter */}
              <div>
                <select
                  value={filters.species}
                  onChange={(e) => setFilters(prev => ({ ...prev, species: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                >
                  <option value="">All Species</option>
                  <option value="Dog">Dogs</option>
                  <option value="Cat">Cats</option>
                  <option value="Bird">Birds</option>
                  <option value="Rabbit">Rabbits</option>
                </select>
              </div>

              {/* Age Filter */}
              <div>
                <select
                  value={filters.age}
                  onChange={(e) => setFilters(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                >
                  <option value="">Any Age</option>
                  <option value="puppy">Puppy/Kitten</option>
                  <option value="young">Young (2-5 years)</option>
                  <option value="adult">Adult (5+ years)</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div>
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <select
                value={filters.gender}
                onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                className="px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
              >
                <option value="">Any Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <select
                value={filters.size}
                onChange={(e) => setFilters(prev => ({ ...prev, size: e.target.value }))}
                className="px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
              >
                <option value="">Any Size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>

              <div className="text-purple-400 font-semibold flex items-center justify-center bg-gray-700/50 rounded-xl p-3 border border-purple-500/30">
                <Filter className="h-5 w-5 mr-2" />
                {filteredPets.length} pets found
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pets Grid */}
      <section className="px-6 py-8 pb-32">
        <div className="max-w-7xl mx-auto">
          {filteredPets.length === 0 ? (
            <div className="text-center py-20 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-purple-500/30">
              <PawPrint className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No pets available for adoption</h3>
              <p className="text-purple-300 mb-6">
                {pets.length === 0 
                  ? "No pets are currently marked as available for adoption. Please check back later."
                  : "No pets match your search criteria. Try adjusting your filters."
                }
              </p>
              {pets.length === 0 && (
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm">
                    If you're an admin, make sure pets are marked as available for adoption.
                  </p>
                  <button 
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition duration-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPets.map((pet) => (
                <div key={pet._id} className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/30 hover:border-purple-500 transition-all duration-500 hover:scale-105">
                  {/* Featured Badge */}
                  {pet.featured && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        <span>FEATURED</span>
                      </div>
                    </div>
                  )}

                  {/* Pet Image */}
                  <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 relative overflow-hidden">
                    {pet.image ? (
                      <img 
                        src={pet.image} 
                        alt={pet.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PawPrint className="h-16 w-16 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-2 text-white">
                        <PawPrint className="h-4 w-4" />
                        <span className="font-semibold">{pet.species}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pet Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white">{pet.name}</h3>
                        <p className="text-purple-400">{pet.breed} • {pet.age}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        pet.availableForAdoption 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {pet.availableForAdoption ? 'Available' : 'Adopted'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-300">
                        <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                        {pet.location || 'Shelter'}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Users className="h-4 w-4 mr-2 text-blue-400" />
                        Good with: {pet.goodWith?.join(', ') || 'Not specified'}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-pink-400" />
                        Energy: <span className={`ml-1 px-2 py-1 rounded-full text-xs bg-gradient-to-r ${getEnergyLevelColor(pet.energyLevel)} text-white`}>{pet.energyLevel}</span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{pet.description}</p>

                    {/* Pet Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="text-gray-300 flex items-center gap-1">
                        <Shield className="h-3 w-3 text-green-400" />
                        <span>Vaccinated: {pet.vaccinated ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="text-gray-300 flex items-center gap-1">
                        <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                        <span>Neutered: {pet.neutered ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="text-gray-300 col-span-2 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-purple-400" />
                        <span>Training: {pet.trainingLevel}</span>
                      </div>
                      {pet.specialNeeds !== 'None' && (
                        <div className="text-gray-300 col-span-2 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-yellow-400" />
                          <span>Special Needs: {pet.specialNeeds}</span>
                        </div>
                      )}
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-bold text-white">
                        Adoption Fee: <span className="text-purple-400">${pet.adoptionFee || 0}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleAdoptClick(pet._id)}
                      disabled={!pet.availableForAdoption}
                      className={`w-full py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 ${
                        pet.availableForAdoption
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {pet.availableForAdoption ? 'Start Adoption Process' : 'Already Adopted'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdoptionCenter;