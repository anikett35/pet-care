// src/components/AdoptionCenter.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, Filter, PawPrint, MapPin, Calendar, Users } from 'lucide-react';

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

  const navigate = useNavigate();

  // Sample adoption pets data
  const sampleAdoptionPets = [
    {
      id: 1,
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: '2 years',
      gender: 'Male',
      size: 'Large',
      location: 'New York, NY',
      description: 'Friendly and energetic golden retriever looking for an active family. Great with kids and other pets.',
      image: '/api/placeholder/300/200',
      available: true,
      adoptionFee: 250,
      vaccinated: true,
      neutered: true,
      goodWith: ['Kids', 'Dogs', 'Cats'],
      specialNeeds: 'None'
    },
    {
      id: 2,
      name: 'Luna',
      species: 'Cat',
      breed: 'Domestic Shorthair',
      age: '1 year',
      gender: 'Female',
      size: 'Small',
      location: 'Brooklyn, NY',
      description: 'Sweet and affectionate cat who loves cuddles and quiet evenings. Perfect for apartment living.',
      image: '/api/placeholder/300/200',
      available: true,
      adoptionFee: 150,
      vaccinated: true,
      neutered: true,
      goodWith: ['Kids', 'Cats'],
      specialNeeds: 'None'
    },
    {
      id: 3,
      name: 'Buddy',
      species: 'Dog',
      breed: 'Beagle',
      age: '4 years',
      gender: 'Male',
      size: 'Medium',
      location: 'Queens, NY',
      description: 'Gentle and calm beagle with lots of love to give. Great companion for seniors or quiet households.',
      image: '/api/placeholder/300/200',
      available: true,
      adoptionFee: 200,
      vaccinated: true,
      neutered: true,
      goodWith: ['Kids', 'Dogs'],
      specialNeeds: 'Mild arthritis'
    },
    {
      id: 4,
      name: 'Bella',
      species: 'Cat',
      breed: 'Siamese',
      age: '6 months',
      gender: 'Female',
      size: 'Small',
      location: 'Manhattan, NY',
      description: 'Playful and curious siamese kitten. Very intelligent and loves interactive toys.',
      image: '/api/placeholder/300/200',
      available: true,
      adoptionFee: 175,
      vaccinated: true,
      neutered: false,
      goodWith: ['Kids', 'Cats', 'Dogs'],
      specialNeeds: 'None'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPets(sampleAdoptionPets);
      setFilteredPets(sampleAdoptionPets);
      setLoading(false);
    }, 1000);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
            <p className="mt-4 text-green-300">Loading adoption center...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-blue-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-green-600/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-full mb-4">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">New Best Friend</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-300 max-w-2xl mx-auto">
              Give a loving home to pets in need. Browse our available pets ready for adoption.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by name, breed, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Species Filter */}
              <div>
                <select
                  value={filters.species}
                  onChange={(e) => setFilters(prev => ({ ...prev, species: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition duration-200 font-semibold"
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
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Any Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <select
                value={filters.size}
                onChange={(e) => setFilters(prev => ({ ...prev, size: e.target.value }))}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Any Size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>

              <div className="text-green-400 font-semibold flex items-center justify-center">
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
            <div className="text-center py-12 bg-gray-800/50 rounded-2xl border border-green-500/30">
              <PawPrint className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No pets found</h3>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPets.map((pet) => (
                <div key={pet.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-green-500/30 hover:border-green-500 transition-all duration-300">
                  {/* Pet Image */}
                  <div className="h-48 bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
                    <PawPrint className="h-16 w-16 text-white opacity-50" />
                  </div>

                  {/* Pet Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white">{pet.name}</h3>
                        <p className="text-green-400">{pet.breed} • {pet.age}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        pet.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {pet.available ? 'Available' : 'Adopted'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-300">
                        <MapPin className="h-4 w-4 mr-2" />
                        {pet.location}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Users className="h-4 w-4 mr-2" />
                        Good with: {pet.goodWith.join(', ')}
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{pet.description}</p>

                    {/* Pet Details */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                      <div className="text-gray-300">
                        <span className="text-green-400">Vaccinated:</span> {pet.vaccinated ? 'Yes' : 'No'}
                      </div>
                      <div className="text-gray-300">
                        <span className="text-green-400">Neutered:</span> {pet.neutered ? 'Yes' : 'No'}
                      </div>
                      <div className="text-gray-300">
                        <span className="text-green-400">Adoption Fee:</span> ${pet.adoptionFee}
                      </div>
                      {pet.specialNeeds !== 'None' && (
                        <div className="text-gray-300 col-span-2">
                          <span className="text-yellow-400">Special Needs:</span> {pet.specialNeeds}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleAdoptClick(pet.id)}
                      disabled={!pet.available}
                      className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
                        pet.available
                          ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {pet.available ? 'Start Adoption Process' : 'Already Adopted'}
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