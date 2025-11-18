// src/components/GroomingServices.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import

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

  const navigate = useNavigate(); // Add this hook

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

  // Close modal when clicking outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showBookingModal) {
        handleCloseModal();
      }
    };

    if (showBookingModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showBookingModal]);

  const handleCardClick = (service, event) => {
    if (!event.target.closest('button')) {
      setSelectedService(service);
    }
  };

  const handleBookClick = (service, event) => {
    event.stopPropagation();
    
    if (onBookAppointment && typeof onBookAppointment === 'function') {
      onBookAppointment(service);
    } else {
      // Navigate to grooming booking page with service data
      navigate('/grooming-booking', { 
        state: { 
          selectedService: service 
        } 
      });
    }
  };

  // ... rest of your component remains the same until the return statement

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

      {/* Remove the modal code since we're navigating to a separate page */}
    </div>
  );
};

GroomingServices.defaultProps = {
  onBookAppointment: null
};

export default GroomingServices;