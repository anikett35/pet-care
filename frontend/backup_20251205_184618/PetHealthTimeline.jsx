// src/components/PetHealthTimeline.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Stethoscope, 
  Syringe, 
  Pill, 
  Scissors, 
  Activity,
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

const PetHealthTimeline = () => {
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    type: 'vaccination',
    title: '',
    date: '',
    description: '',
    status: 'upcoming',
    petName: '',
    veterinarian: '',
    location: ''
  });

  // Sample data with enhanced details
  const sampleEvents = [
    {
      id: 1,
      type: 'vaccination',
      title: 'Rabies Vaccination',
      date: '2024-11-15',
      description: 'Annual rabies vaccine administered. Pet showed no adverse reactions.',
      status: 'completed',
      petName: 'Buddy',
      veterinarian: 'Dr. Sarah Wilson',
      location: 'Paws & Claws Veterinary'
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Regular Checkup',
      date: '2024-11-10',
      description: 'Routine health examination. All vitals normal, weight maintained.',
      status: 'completed',
      petName: 'Max',
      veterinarian: 'Dr. Michael Brown',
      location: 'City Animal Hospital'
    },
    {
      id: 3,
      type: 'medication',
      title: 'Flea & Tick Prevention',
      date: '2024-11-05',
      description: 'Monthly flea and tick prevention treatment applied.',
      status: 'completed',
      petName: 'Bella',
      veterinarian: 'Dr. Emily Chen',
      location: 'Pet Wellness Center'
    },
    {
      id: 4,
      type: 'appointment',
      title: 'Dental Cleaning',
      date: '2024-11-25',
      description: 'Scheduled dental cleaning and oral examination.',
      status: 'upcoming',
      petName: 'Charlie',
      veterinarian: 'Dr. James Wilson',
      location: 'Animal Dental Care'
    },
    {
      id: 5,
      type: 'vaccination',
      title: 'Distemper Vaccine',
      date: '2024-12-01',
      description: 'Annual distemper combination vaccine due.',
      status: 'upcoming',
      petName: 'Luna',
      veterinarian: 'Dr. Sarah Wilson',
      location: 'Paws & Claws Veterinary'
    },
    {
      id: 6,
      type: 'grooming',
      title: 'Full Grooming Session',
      date: '2024-11-20',
      description: 'Complete grooming package with haircut, bath, and nail trim.',
      status: 'upcoming',
      petName: 'Buddy',
      location: 'Premium Pet Spa'
    },
    {
      id: 7,
      type: 'surgery',
      title: 'Spay Procedure',
      date: '2024-10-15',
      description: 'Routine spay surgery completed successfully.',
      status: 'completed',
      petName: 'Daisy',
      veterinarian: 'Dr. Robert Kim',
      location: 'Surgical Specialists'
    }
  ];

  useEffect(() => {
    const fetchTimelineEvents = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1200));
        setTimelineEvents(sampleEvents);
        setLoading(false);
      } catch (err) {
        setError('Failed to load timeline events');
        setLoading(false);
      }
    };

    fetchTimelineEvents();
  }, []);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setFormData({
      type: 'vaccination',
      title: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      status: 'upcoming',
      petName: '',
      veterinarian: '',
      location: ''
    });
    setShowForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormData({
      type: event.type,
      title: event.title,
      date: event.date,
      description: event.description,
      status: event.status,
      petName: event.petName,
      veterinarian: event.veterinarian || '',
      location: event.location || ''
    });
    setShowForm(true);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = timelineEvents.filter(event => event.id !== eventId);
      setTimelineEvents(updatedEvents);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingEvent) {
      const updatedEvents = timelineEvents.map(event =>
        event.id === editingEvent.id
          ? { ...event, ...formData }
          : event
      );
      setTimelineEvents(updatedEvents);
    } else {
      const newEvent = {
        id: Date.now(),
        ...formData
      };
      setTimelineEvents([...timelineEvents, newEvent]);
    }
    
    setShowForm(false);
    setFormData({
      type: 'vaccination',
      title: '',
      date: '',
      description: '',
      status: 'upcoming',
      petName: '',
      veterinarian: '',
      location: ''
    });
    setEditingEvent(null);
  };

  const getEventIcon = (type) => {
    const icons = {
      vaccination: Syringe,
      appointment: Stethoscope,
      medication: Pill,
      surgery: Activity,
      grooming: Scissors,
      other: Calendar
    };
    const IconComponent = icons[type] || Calendar;
    return <IconComponent className="h-5 w-5" />;
  };

  const getEventColor = (type) => {
    const colors = {
      vaccination: 'from-purple-500 to-pink-500',
      appointment: 'from-blue-500 to-cyan-500',
      medication: 'from-green-500 to-emerald-500',
      surgery: 'from-red-500 to-orange-500',
      grooming: 'from-pink-500 to-rose-500',
      other: 'from-gray-500 to-slate-500'
    };
    return colors[type] || 'from-gray-500 to-slate-500';
  };

  const getStatusIcon = (status) => {
    return status === 'completed' ? CheckCircle : Clock;
  };

  const getStatusColor = (status) => {
    return status === 'completed' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
      : status === 'upcoming'
      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredEvents = timelineEvents.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return event.status === 'upcoming';
    if (filter === 'completed') return event.status === 'completed';
    return event.type === filter;
  });

  const stats = {
    total: timelineEvents.length,
    completed: timelineEvents.filter(e => e.status === 'completed').length,
    upcoming: timelineEvents.filter(e => e.status === 'upcoming').length,
    byType: {
      vaccination: timelineEvents.filter(e => e.type === 'vaccination').length,
      appointment: timelineEvents.filter(e => e.type === 'appointment').length,
      medication: timelineEvents.filter(e => e.type === 'medication').length,
      grooming: timelineEvents.filter(e => e.type === 'grooming').length
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-purple-300">Loading health timeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-red-500/30">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Timeline</h2>
          <p className="text-purple-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900">
      {/* Header Section */}
      <section className="relative overflow-hidden px-6 py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Timeline</span>
              </h1>
              <p className="text-xl text-purple-300">Track your pet's medical history and upcoming appointments</p>
            </div>
            <button 
              onClick={handleAddEvent}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-2xl hover:scale-105 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Event</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-purple-300 text-sm">Total Events</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-green-500/30">
              <div className="text-2xl font-bold text-white">{stats.completed}</div>
              <div className="text-green-300 text-sm">Completed</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30">
              <div className="text-2xl font-bold text-white">{stats.upcoming}</div>
              <div className="text-blue-300 text-sm">Upcoming</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-pink-500/30">
              <div className="text-2xl font-bold text-white">{stats.byType.vaccination}</div>
              <div className="text-pink-300 text-sm">Vaccinations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {['all', 'upcoming', 'completed', 'vaccination', 'appointment', 'medication', 'grooming'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 capitalize ${
                  filter === filterType
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-purple-500/30">
              <Calendar className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
              <p className="text-purple-300 mb-6">Add health events to track your pet's medical history</p>
              <button 
                onClick={handleAddEvent}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Add Your First Event
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEvents.map((event, index) => {
                const StatusIcon = getStatusIcon(event.status);
                return (
                  <div 
                    key={event.id} 
                    className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-102"
                  >
                    {/* Timeline connector */}
                    {index !== filteredEvents.length - 1 && (
                      <div className="absolute left-8 top-20 w-0.5 h-8 bg-purple-500/30 ml-4"></div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      {/* Event Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r ${getEventColor(event.type)} flex items-center justify-center text-white shadow-lg`}>
                        {getEventIcon(event.type)}
                      </div>
                      
                      {/* Event Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                            <p className="text-purple-300 text-sm">{event.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)} flex items-center gap-1`}>
                              <StatusIcon className="h-3 w-3" />
                              {event.status}
                            </span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                              <button 
                                onClick={() => handleEditEvent(event)}
                                className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition duration-200"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteEvent(event.id)}
                                className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center text-gray-300">
                            <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                            <span>{event.petName}</span>
                          </div>
                          {event.veterinarian && (
                            <div className="flex items-center text-gray-300">
                              <Stethoscope className="h-4 w-4 mr-2 text-blue-400" />
                              <span>{event.veterinarian}</span>
                            </div>
                          )}
                        </div>
                        
                        {event.location && (
                          <div className="mt-3 text-xs text-gray-400">
                            📍 {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Add/Edit Event Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-purple-500/30 shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button 
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white text-3xl font-bold transition-colors"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Event Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="vaccination">Vaccination</option>
                      <option value="appointment">Appointment</option>
                      <option value="medication">Medication</option>
                      <option value="grooming">Grooming</option>
                      <option value="surgery">Surgery</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Pet Name *
                    </label>
                    <input
                      type="text"
                      value={formData.petName}
                      onChange={(e) => setFormData({...formData, petName: e.target.value})}
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter pet name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Veterinarian
                    </label>
                    <input
                      type="text"
                      value={formData.veterinarian}
                      onChange={(e) => setFormData({...formData, veterinarian: e.target.value})}
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Dr. Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Clinic or facility name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows="4"
                    placeholder="Enter event description, notes, or instructions..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold transition-all duration-300"
                  >
                    {editingEvent ? 'Update Event' : 'Add Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold transition-all duration-300"
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

export default PetHealthTimeline;