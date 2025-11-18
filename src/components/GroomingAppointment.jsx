// src/components/GroomingAppointment.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GroomingAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the selected service from navigation state or use default
  const selectedService = location.state?.selectedService || {
    id: 3,
    name: 'Deluxe Spa',
    description: 'Premium grooming experience with extras',
    duration: '120 mins',
    price: '$95',
    features: [
      'Everything in Full Grooming',
      'Teeth brushing',
      'Blueberry facial',
      'Paw massage',
      'Conditioning treatment',
      'Specialty shampoo'
    ]
  };

  const [formData, setFormData] = useState({
    petName: '',
    ownerName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    specialNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour}:00`);
      if (hour < 17) slots.push(`${hour}:30`);
    }
    return slots;
  };

  const [availableSlots] = useState(generateTimeSlots());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.petName || !formData.ownerName || !formData.email || !formData.phone || !formData.date || !formData.time) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      console.log('Booking appointment:', {
        service: selectedService,
        formData: formData
      });
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      alert(`✅ ${selectedService.name} appointment booked successfully!\n\nPet: ${formData.petName}\nDate: ${formData.date} at ${formData.time}\nWe'll contact you at ${formData.email} to confirm.`);
      
      // Navigate back to grooming services
      navigate('/grooming');
      
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get max date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/grooming')}
            className="flex items-center text-blue-400 hover:text-blue-300 mb-4 font-medium text-sm"
          >
            ← Back to Services
          </button>
          
          <h1 className="text-3xl font-bold text-white mb-2">Book {selectedService.name}</h1>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">{selectedService.name}</h2>
            <p className="text-purple-100">{selectedService.description}</p>
            <p className="text-xl font-semibold mt-2">{selectedService.price} • {selectedService.duration}</p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Pet Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pet Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                placeholder="Enter your pet's name"
                required
              />
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={getTomorrowDate()}
                  max={getMaxDate()}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Time <span className="text-red-400">*</span>
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                  required
                >
                  <option value="">Select a time</option>
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Special Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Special Notes
              </label>
              <textarea
                name="specialNotes"
                value={formData.specialNotes}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                placeholder="Any special instructions or notes about your pet..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-400 text-white py-3 rounded-xl font-bold transition duration-200 shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Booking...
                  </span>
                ) : (
                  `Book ${selectedService.name}`
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/grooming')}
                disabled={loading}
                className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white py-3 rounded-xl font-bold transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Service Details */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">What's Included in {selectedService.name}:</h3>
          <ul className="text-gray-300 space-y-2">
            {selectedService.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GroomingAppointment;