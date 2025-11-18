// src/components/PetHealthTimeline.jsx
import React, { useState, useEffect } from 'react';

const PetHealthTimeline = () => {
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    type: 'vaccination',
    title: '',
    date: '',
    description: '',
    status: 'upcoming',
    petName: ''
  });

  // Sample data
  const sampleEvents = [
    {
      id: 1,
      type: 'vaccination',
      title: 'Rabies Vaccination',
      date: '2024-11-15',
      description: 'Annual rabies vaccine administered',
      status: 'completed',
      petName: 'Buddy'
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Regular Checkup',
      date: '2024-11-10',
      description: 'Routine health examination',
      status: 'completed',
      petName: 'Max'
    },
    {
      id: 3,
      type: 'medication',
      title: 'Flea Treatment',
      date: '2024-11-05',
      description: 'Monthly flea prevention',
      status: 'completed',
      petName: 'Bella'
    },
    {
      id: 4,
      type: 'appointment',
      title: 'Dental Cleaning',
      date: '2024-11-25',
      description: 'Scheduled dental cleaning appointment',
      status: 'upcoming',
      petName: 'Charlie'
    },
    {
      id: 5,
      type: 'vaccination',
      title: 'Distemper Vaccine',
      date: '2024-12-01',
      description: 'Annual distemper vaccine due',
      status: 'upcoming',
      petName: 'Luna'
    },
    {
      id: 6,
      type: 'grooming',
      title: 'Full Grooming Session',
      date: '2024-11-20',
      description: 'Scheduled full grooming with haircut',
      status: 'upcoming',
      petName: 'Buddy'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchTimelineEvents = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setTimelineEvents(sampleEvents);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load timeline events');
        setLoading(false);
      }
    };

    fetchTimelineEvents();
  }, []);

  // Function to handle adding new event
  const handleAddEvent = () => {
    setEditingEvent(null);
    setFormData({
      type: 'vaccination',
      title: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      status: 'upcoming',
      petName: ''
    });
    setShowForm(true);
  };

  // Function to handle editing event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormData({
      type: event.type,
      title: event.title,
      date: event.date,
      description: event.description,
      status: event.status,
      petName: event.petName
    });
    setShowForm(true);
  };

  // Function to handle deleting event
  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = timelineEvents.filter(event => event.id !== eventId);
      setTimelineEvents(updatedEvents);
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingEvent) {
      // Update existing event
      const updatedEvents = timelineEvents.map(event =>
        event.id === editingEvent.id
          ? { ...event, ...formData }
          : event
      );
      setTimelineEvents(updatedEvents);
    } else {
      // Add new event
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
      petName: ''
    });
    setEditingEvent(null);
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'vaccination':
        return '💉';
      case 'appointment':
        return '📅';
      case 'medication':
        return '💊';
      case 'surgery':
        return '🏥';
      case 'grooming':
        return '✂️';
      default:
        return '📝';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Health Timeline</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading timeline...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Health Timeline</h2>
        <div className="bg-red-50 border border-red-300 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Health Timeline</h2>
        <button 
          onClick={handleAddEvent}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 font-semibold hover:scale-105 active:scale-95"
        >
          + Add Event
        </button>
      </div>

      <div className="space-y-4">
        {timelineEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No health events found.</p>
            <p className="text-sm mt-2">Add vaccinations, appointments, or medications to see them here.</p>
          </div>
        ) : (
          timelineEvents.map((event, index) => (
            <div 
              key={event.id} 
              className="relative flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150 group"
            >
              {/* Timeline line */}
              {index !== timelineEvents.length - 1 && (
                <div className="absolute left-8 top-16 w-0.5 h-12 bg-gray-300 ml-3 mt-2"></div>
              )}
              
              {/* Event icon */}
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                {getEventIcon(event.type)}
              </div>
              
              {/* Event content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800 truncate">{event.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                      {event.petName}
                    </span>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      onClick={() => handleEditEvent(event)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition duration-150"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition duration-150"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Event Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
                <button 
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    value={formData.petName}
                    onChange={(e) => setFormData({...formData, petName: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter pet name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Enter event description"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200"
                  >
                    {editingEvent ? 'Update Event' : 'Add Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Stats summary */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {timelineEvents.filter(e => e.status === 'completed').length}
          </div>
          <div className="text-sm text-green-800">Completed</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">
            {timelineEvents.filter(e => e.status === 'upcoming').length}
          </div>
          <div className="text-sm text-blue-800">Upcoming</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">
            {timelineEvents.length}
          </div>
          <div className="text-sm text-gray-800">Total Events</div>
        </div>
      </div>
    </div>
  );
};

export default PetHealthTimeline;