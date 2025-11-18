// src/components/GroomingServices.jsx
import React, { useState, useEffect } from 'react';

const GroomingServices = ({ onBookAppointment }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [serviceToBook, setServiceToBook] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    petName: '',
    ownerName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  });

  const groomingServices = [
    {
      id: 1,
      name: 'Basic Grooming',
      description: 'Bath, brush, nail trim, and ear cleaning',
      duration: '60 mins',
      price: '$45',
      features: ['Bath & blow dry', 'Brushing', 'Nail trimming', 'Ear cleaning', 'Cologne spray'],
      popular: false
    },
    {
      id: 2,
      name: 'Full Grooming',
      description: 'Complete grooming package with haircut',
      duration: '90 mins',
      price: '$65',
      features: ['Everything in Basic', 'Haircut & styling', 'Sanitary trim', 'Paw pad shaving', 'Bandana or bow'],
      popular: true
    },
    {
      id: 3,
      name: 'Deluxe Spa',
      description: 'Premium grooming experience with extras',
      duration: '120 mins',
      price: '$95',
      features: ['Everything in Full', 'Teeth brushing', 'Blueberry facial', 'Paw massage', 'Conditioning treatment', 'Specialty shampoo'],
      popular: false
    },
    {
      id: 4,
      name: 'À La Carte',
      description: 'Individual grooming services',
      duration: 'Varies',
      price: 'From $15',
      features: ['Nail trim only - $15', 'Ear cleaning - $12', 'Teeth brushing - $10', 'Sanitary trim - $20'],
      popular: false
    }
  ];

  // Reset form when modal opens
  useEffect(() => {
    if (showBookingModal) {
      setBookingForm({
        petName: '',
        ownerName: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        notes: ''
      });
    }
  }, [showBookingModal]);

  const handleCardClick = (service, event) => {
    if (!event.target.closest('button')) {
      setSelectedService(service);
    }
  };

  const handleBookClick = (service, event) => {
    event.stopPropagation();
    event.preventDefault();
    
    if (onBookAppointment && typeof onBookAppointment === 'function') {
      onBookAppointment(service);
    } else {
      setServiceToBook(service);
      setShowBookingModal(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to:`, value); // Debug log
    
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    console.log('Booking submitted:', {
      service: serviceToBook,
      formData: bookingForm
    });
    
    alert(`✅ Booking confirmed for ${serviceToBook.name}!\n\nPet: ${bookingForm.petName}\nDate: ${bookingForm.date} at ${bookingForm.time}\nWe'll contact you at ${bookingForm.email} to confirm.`);
    
    setShowBookingModal(false);
    setServiceToBook(null);
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setServiceToBook(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // Generate time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'
  ];

  // Get tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get max date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Grooming Services</h2>
      <p className="text-gray-600 mb-6">Keep your pet looking and feeling their best with our professional grooming services</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {groomingServices.map((service) => (
          <div
            key={service.id}
            className={`border rounded-xl p-5 transition-all duration-300 hover:shadow-md cursor-pointer ${
              selectedService?.id === service.id
                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                : 'border-gray-200'
            } ${service.popular ? 'border-2 border-yellow-400 relative' : ''}`}
            onClick={(e) => handleCardClick(service, e)}
          >
            {service.popular && (
              <div className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                MOST POPULAR
              </div>
            )}
            
            <h3 className="text-lg font-bold text-gray-800 mb-2">{service.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{service.description}</p>
            
            <div className="mb-4">
              <span className="text-2xl font-bold text-blue-600">{service.price}</span>
              <span className="text-gray-500 text-sm ml-2">• {service.duration}</span>
            </div>

            <ul className="space-y-2 mb-4">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={(e) => handleBookClick(service, e)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200 font-medium active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {selectedService && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-blue-800">Selected: {selectedService.name}</h4>
              <p className="text-blue-600 text-sm">{selectedService.description}</p>
              <p className="text-blue-700 font-medium mt-1">{selectedService.price} • {selectedService.duration}</p>
            </div>
            <button
              onClick={() => setSelectedService(null)}
              className="text-blue-600 hover:text-blue-800 text-lg font-bold bg-blue-100 hover:bg-blue-200 w-8 h-8 rounded-full flex items-center justify-center transition duration-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && serviceToBook && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4"
          onClick={handleBackdropClick}
        >
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Book {serviceToBook.name}</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-lg font-bold bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                ✕
              </button>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 text-lg">{serviceToBook.name}</h4>
              <p className="text-blue-600 text-sm mt-1">{serviceToBook.description}</p>
              <p className="text-blue-700 font-medium mt-2">{serviceToBook.price} • {serviceToBook.duration}</p>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div>
                <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Name *
                </label>
                <input
                  id="petName"
                  type="text"
                  name="petName"
                  value={bookingForm.petName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter your pet's name"
                />
                <div className="text-xs text-gray-500 mt-1">Current value: "{bookingForm.petName}"</div>
              </div>

              <div>
                <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  id="ownerName"
                  type="text"
                  name="ownerName"
                  value={bookingForm.ownerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter your full name"
                />
                <div className="text-xs text-gray-500 mt-1">Current value: "{bookingForm.ownerName}"</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={bookingForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="your@email.com"
                  />
                  <div className="text-xs text-gray-500 mt-1">Current value: "{bookingForm.email}"</div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={bookingForm.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="(123) 456-7890"
                  />
                  <div className="text-xs text-gray-500 mt-1">Current value: "{bookingForm.phone}"</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Date *
                  </label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={bookingForm.date}
                    onChange={handleInputChange}
                    required
                    min={minDate}
                    max={maxDateStr}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                  <div className="text-xs text-gray-500 mt-1">Current value: "{bookingForm.date}"</div>
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Time *
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={bookingForm.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-500 mt-1">Current value: "{bookingForm.time}"</div>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Special Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={bookingForm.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Any special requirements or notes about your pet..."
                />
                <div className="text-xs text-gray-500 mt-1">Current value: "{bookingForm.notes}"</div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Confirm Booking
              </button>
            </form>

            {/* Debug info */}
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <h4 className="font-semibold text-gray-700 text-sm">Debug Info:</h4>
              <pre className="text-xs text-gray-600 mt-1">
                {JSON.stringify(bookingForm, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

GroomingServices.defaultProps = {
  onBookAppointment: null
};

export default GroomingServices;