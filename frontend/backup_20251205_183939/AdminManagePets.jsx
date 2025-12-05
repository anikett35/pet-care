import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Edit, 
  Eye, 
  Plus,
  Search,
  Filter,
  PawPrint,
  AlertCircle,
  CheckCircle,
  X,
  Heart,
  Users
} from 'lucide-react';

const AdminManagePets = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [petTypeStats, setPetTypeStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ show: false, pet: null });
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchPets();
    fetchPetTypeStats();
  }, []);

  useEffect(() => {
    filterPetsList();
  }, [searchTerm, filterStatus, pets]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/pets`);
      if (!response.ok) throw new Error('Failed to fetch pets');
      
      const data = await response.json();
      setPets(data);
      setFilteredPets(data);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError('Failed to load pets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPetTypeStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/adoption/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data = await response.json();
      setPetTypeStats(data);
    } catch (err) {
      console.error('Error fetching pet type stats:', err);
      // Set empty stats if fails
      setPetTypeStats({});
    }
  };

  const filterPetsList = () => {
    let filtered = [...pets];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.species.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      if (filterStatus === 'available') {
        filtered = filtered.filter(pet => pet.availableForAdoption === true);
      } else if (filterStatus === 'adopted') {
        filtered = filtered.filter(pet => pet.availableForAdoption === false);
      }
    }

    setFilteredPets(filtered);
  };

  const handleDeleteClick = (pet) => {
    setDeleteModal({ show: true, pet });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.pet) return;

    try {
      const response = await fetch(`${API_BASE_URL}/pets/${deleteModal.pet._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete pet');

      setSuccessMessage(`${deleteModal.pet.name} has been deleted successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);

      // Remove pet from local state
      setPets(prev => prev.filter(p => p._id !== deleteModal.pet._id));
      setDeleteModal({ show: false, pet: null });
      
      // Refresh stats
      fetchPetTypeStats();
    } catch (err) {
      console.error('Error deleting pet:', err);
      setError('Failed to delete pet. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, pet: null });
  };

  const getStatusBadge = (pet) => {
    if (pet.availableForAdoption) {
      return (
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
          Available
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-semibold border border-gray-500/30">
        Adopted
      </span>
    );
  };

  const getUserInterestCount = (species) => {
    return petTypeStats[species?.toLowerCase()] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-300">Loading pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2">
                Manage Pets
              </h1>
              <p className="text-purple-300 text-lg">
                View, edit, and manage all pets in the system
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/add-pet')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add New Pet
            </button>
          </div>
        </div>

        {/* Pet Type Stats Section */}
        {Object.keys(petTypeStats).length > 0 && (
          <div className="mb-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-400" />
              User Interest by Pet Type
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(petTypeStats).map(([type, count]) => (
                <div key={type} className="bg-gray-700/50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-purple-400">{count}</p>
                  <p className="text-sm text-gray-300 capitalize mt-1">{type}</p>
                  <p className="text-xs text-gray-500 mt-1">interested users</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-500/20 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <span className="text-green-300 font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/20 border-2 border-red-500 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <span className="text-red-300 font-semibold">{error}</span>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, breed, or species..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available for Adoption</option>
                <option value="adopted">Adopted</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-purple-400 font-semibold">
              <Filter className="h-4 w-4 inline mr-2" />
              {filteredPets.length} pets found
            </span>
            <span className="text-gray-400">
              Total: {pets.length} pets
            </span>
          </div>
        </div>

        {/* Pets Grid */}
        {filteredPets.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-purple-500/30 text-center">
            <PawPrint className="h-16 w-16 text-purple-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-bold text-white mb-2">No pets found</h3>
            <p className="text-purple-300 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by adding your first pet'}
            </p>
            <button
              onClick={() => navigate('/admin/add-pet')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              Add Your First Pet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <div
                key={pet._id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:scale-105"
              >
                {/* Pet Image */}
                <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 relative overflow-hidden">
                  {pet.image ? (
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PawPrint className="h-16 w-16 text-white opacity-50" />
                    </div>
                  )}
                  {pet.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </div>
                  )}
                  {/* User Interest Badge */}
                  <div className="absolute top-3 right-3 bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {getUserInterestCount(pet.species)} interested
                  </div>
                </div>

                {/* Pet Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">{pet.name}</h3>
                      <p className="text-purple-400 text-sm">{pet.breed} • {pet.age}</p>
                    </div>
                    {getStatusBadge(pet)}
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center text-gray-300">
                      <span className="w-20 text-gray-400">Species:</span>
                      <span className="font-semibold">{pet.species}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="w-20 text-gray-400">Gender:</span>
                      <span className="font-semibold">{pet.gender}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="w-20 text-gray-400">Size:</span>
                      <span className="font-semibold">{pet.size}</span>
                    </div>
                    {pet.adoptionFee > 0 && (
                      <div className="flex items-center text-gray-300">
                        <span className="w-20 text-gray-400">Fee:</span>
                        <span className="font-semibold text-green-400">${pet.adoptionFee}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/pets/${pet._id}`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/admin/edit-pet/${pet._id}`)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                      title="Edit Pet"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(pet)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
                      title="Delete Pet"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border-2 border-red-500/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-red-500/20 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Delete Pet?</h3>
                <p className="text-gray-400">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-xl p-4 mb-6">
              <p className="text-white mb-2">
                Are you sure you want to delete{' '}
                <span className="font-bold text-purple-400">{deleteModal.pet?.name}</span>?
              </p>
              <p className="text-gray-400 text-sm">
                All information about this pet will be permanently removed from the system.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Trash2 className="h-5 w-5" />
                Delete Pet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagePets;