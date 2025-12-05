import { useState } from 'react';
import { PawPrint, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

const PetForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    size: 'Medium',
    weight: '',
    color: '',
    image: '',
    owner: {
      name: '',
      email: '',
      phone: '',
      address: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      owner: {
        ...prev.owner,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add pet');
      }

      const data = await response.json();
      setSuccess('Pet added successfully!');
      
      setTimeout(() => {
        if (onSuccess) onSuccess(data);
        if (onClose) onClose();
      }, 1500);

    } catch (err) {
      console.error('Error adding pet:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-purple-500/30">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
                <PawPrint className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Add New Pet</h2>
            </div>
            {onClose && (
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white text-3xl"
              >
                <X className="h-8 w-8" />
              </button>
            )}
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-500/20 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <span className="text-green-300 font-semibold">{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/20 border-2 border-red-500 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-400" />
              <span className="text-red-300 font-semibold">{error}</span>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Pet Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400"
                    placeholder="Enter pet name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Species *</label>
                  <select
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white"
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
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400"
                    placeholder="Enter breed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Age *</label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400"
                    placeholder="e.g., 2 years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Size *</label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
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
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400"
                    placeholder="e.g., 25 lbs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400"
                    placeholder="e.g., Brown"
                  />
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Owner Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.owner.name}
                    onChange={handleOwnerChange}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.owner.email}
                    onChange={handleOwnerChange}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.owner.phone}
                    onChange={handleOwnerChange}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400"
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.owner.address}
                    onChange={handleOwnerChange}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400"
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Image URL (Optional)</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400"
                placeholder="https://example.com/pet-image.jpg"
              />
              <p className="text-gray-400 text-xs mt-2">Enter a direct link to your pet's photo</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition"
              >
                {loading ? 'Adding Pet...' : 'Add Pet'}
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetForm;