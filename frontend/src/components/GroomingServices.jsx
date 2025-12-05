// src/components/GroomingServices.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Scissors, Sparkles, Shield, Award } from 'lucide-react';

const GroomingServices = ({ onBookAppointment }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);
  const navigate = useNavigate();

  const groomingServices = [
    {
      id: 1,
      name: 'Basic Grooming',
      description: 'Essential grooming for regular maintenance',
      duration: '60 mins',
      price: '$45',
      originalPrice: '$55',
      features: ['Bath & blow dry', 'Brushing', 'Nail trimming', 'Ear cleaning', 'Cologne spray'],
      popular: false,
      icon: Scissors,
      color: 'from-purple-500 to-blue-500',
      badge: 'Essential'
    },
    {
      id: 2,
      name: 'Full Grooming',
      description: 'Complete grooming package with haircut',
      duration: '90 mins',
      price: '$65',
      originalPrice: '$80',
      features: ['Everything in Basic', 'Haircut & styling', 'Sanitary trim', 'Paw pad shaving', 'Bandana or bow'],
      popular: true,
      icon: Sparkles,
      color: 'from-pink-500 to-purple-500',
      badge: 'Most Popular'
    },
    {
      id: 3,
      name: 'Deluxe Spa',
      description: 'Premium grooming experience with luxury extras',
      duration: '120 mins',
      price: '$95',
      originalPrice: '$120',
      features: ['Everything in Full', 'Teeth brushing', 'Blueberry facial', 'Paw massage', 'Conditioning treatment', 'Specialty shampoo'],
      popular: false,
      icon: Award,
      color: 'from-orange-500 to-pink-500',
      badge: 'Luxury'
    },
    {
      id: 4,
      name: 'À La Carte',
      description: 'Customize with individual grooming services',
      duration: 'Varies',
      price: 'From $15',
      features: ['Nail trim only - $15', 'Ear cleaning - $12', 'Teeth brushing - $10', 'Sanitary trim - $20', 'Paw massage - $18'],
      popular: false,
      icon: Shield,
      color: 'from-green-500 to-teal-500',
      badge: 'Custom'
    }
  ];

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedService) {
        setSelectedService(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedService]);

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
      navigate('/grooming-booking', { 
        state: { 
          selectedService: service 
        } 
      });
    }
  };

  const ServiceCard = ({ service }) => {
    const Icon = service.icon;
    
    return (
      <div
        key={service.id}
        className={`group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 transition-all duration-500 hover:scale-105 cursor-pointer ${
          selectedService?.id === service.id
            ? 'border-purple-500 shadow-2xl shadow-purple-500/20'
            : service.popular 
            ? 'border-yellow-500 shadow-xl shadow-yellow-500/10'
            : 'border-gray-700 hover:border-purple-400/50'
        }`}
        onClick={(e) => handleCardClick(service, e)}
        onMouseEnter={() => setHoveredService(service.id)}
        onMouseLeave={() => setHoveredService(null)}
      >
        {/* Popular Badge */}
        {service.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              <span>MOST POPULAR</span>
            </div>
          </div>
        )}

        {/* Service Badge */}
        {!service.popular && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className={`bg-gradient-to-r ${service.color} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg`}>
              {service.badge}
            </div>
          </div>
        )}

        {/* Icon */}
        <div className="text-center mb-4">
          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${service.color} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
          <p className="text-purple-300 text-sm leading-relaxed">{service.description}</p>
        </div>

        {/* Price */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-bold text-white">{service.price}</span>
            {service.originalPrice && (
              <span className="text-lg text-gray-400 line-through">{service.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center justify-center gap-1 text-sm text-purple-300 mt-1">
            <Clock className="h-4 w-4" />
            <span>{service.duration}</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <div className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 bg-gradient-to-r ${service.color}`}></div>
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Book Button */}
        <button
          onClick={(e) => handleBookClick(service, e)}
          className={`w-full py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            service.popular
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 shadow-lg shadow-yellow-500/25'
              : `bg-gradient-to-r ${service.color} hover:shadow-xl text-white`
          }`}
        >
          Book Now
        </button>

        {/* Hover Effect */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
      </div>
    );
  };

  const ServiceDetailModal = ({ service, onClose }) => {
    if (!service) return null;
    
    const Icon = service.icon;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-purple-500/30 shadow-2xl">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${service.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{service.name}</h2>
                  <p className="text-purple-300">{service.description}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl font-bold transition-colors"
              >
                ×
              </button>
            </div>

            {/* Price & Duration */}
            <div className="bg-gray-700/50 rounded-2xl p-6 mb-6 border border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold text-white">{service.price}</div>
                  {service.originalPrice && (
                    <div className="text-lg text-gray-400 line-through">{service.originalPrice}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-purple-300">
                    <Clock className="h-5 w-5" />
                    <span className="text-lg font-semibold">{service.duration}</span>
                  </div>
                  <div className="text-sm text-gray-400">Estimated duration</div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">What's Included</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color}`}></div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={(e) => {
                  handleBookClick(service, e);
                  onClose();
                }}
                className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 ${
                  service.popular
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 shadow-lg'
                    : `bg-gradient-to-r ${service.color} text-white hover:shadow-xl`
                }`}
              >
                Book This Service
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300"
              >
                View Other Services
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto">
        <section className="text-center mb-12 py-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-6 py-3 mb-6">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span className="text-purple-300 font-semibold">Premium Grooming Services</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Pet Grooming</span>
          </h1>
          <p className="text-xl text-purple-300 max-w-2xl mx-auto">
            Keep your furry friends looking fabulous with our expert grooming services. 
            From basic baths to luxury spa treatments, we've got you covered.
          </p>
        </section>

        {/* Services Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {groomingServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        {/* Additional Info */}
        <section className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-purple-500/20 p-4 rounded-2xl mb-4">
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Certified Experts</h3>
              <p className="text-purple-300 text-sm">Our groomers are professionally trained and certified</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-pink-500/20 p-4 rounded-2xl mb-4">
                <Sparkles className="h-8 w-8 text-pink-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Premium Products</h3>
              <p className="text-purple-300 text-sm">We use only the highest quality, pet-safe products</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-500/20 p-4 rounded-2xl mb-4">
                <Award className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Satisfaction Guaranteed</h3>
              <p className="text-purple-300 text-sm">Your pet's happiness and safety are our top priority</p>
            </div>
          </div>
        </section>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <ServiceDetailModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
    </div>
  );
};

GroomingServices.defaultProps = {
  onBookAppointment: null
};

export default GroomingServices;