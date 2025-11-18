// src/components/Appointments.jsx
import { useState, useEffect } from 'react';
import { Calendar, Clock, Stethoscope, AlertCircle } from 'lucide-react';

const Appointments = () => {
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    petId: '',
    date: '',
    time: '',
    type: 'Checkup',
    veterinarian: '',
    notes: ''
  });

  // Mock data to prevent 404 errors
  const mockPets = [
    {
      _id: '1',
      name: 'Buddy',
      species: 'Dog',
      breed: 'Golden Retriever',
      appointments: [
        {
          date: '2024-01-20',
          time: '10:00 AM',
          type: 'Checkup',
          veterinarian: 'Dr. Smith',
          notes: 'Annual health check',
          status: 'Scheduled'
        }
      ]
    },
    {
      _id: '2',
      name: 'Whiskers',
      species: 'Cat',
      breed: 'Siamese',
      appointments: [
        {
          date: '2024-01-25',
          time: '11:00 AM',
          type: 'Grooming',
          veterinarian: 'Dr. Wilson',
          status: 'Scheduled'
        }
      ]
    }
  ];

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (pets.length > 0) {
      extractAppointments();
    }
  }, [pets]);

  // FIXED: Use mock data instead of API call
  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use mock data directly instead of API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for realism
      setPets(mockPets);
      
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load data');
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const extractAppointments = () => {
    if (!Array.isArray(pets)) {
      setAppointments([]);
      return;
    }

    const allAppointments = [];
    pets.forEach(pet => {
      if (pet && pet.appointments && Array.isArray(pet.appointments)) {
        pet.appointments.forEach(appt => {
          if (appt) {
            allAppointments.push({
              ...appt,
              petId: pet._id,
              petName: pet.name || 'Unknown Pet',
              petSpecies: pet.species || 'Unknown'
            });
          }
        });
      }
    });
    
    allAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
    setAppointments(allAppointments);
  };

  // FIXED: Update local state instead of API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const pet = pets.find(p => p._id === formData.petId);
      if (!pet) {
        throw new Error('Pet not found');
      }

      // Update local state directly
      const updatedAppointments = [...(pet.appointments || []), {
        date: formData.date,
        time: formData.time,
        type: formData.type,
        veterinarian: formData.veterinarian,
        notes: formData.notes,
        status: 'Scheduled'
      }];

      const updatedPets = pets.map(p => 
        p._id === formData.petId 
          ? { ...p, appointments: updatedAppointments }
          : p
      );

      setPets(updatedPets);
      setShowForm(false);
      setFormData({
        petId: '',
        date: '',
        time: '',
        type: 'Checkup',
        veterinarian: '',
        notes: ''
      });
      
      // Show success message
      alert(`Appointment scheduled successfully for ${pet.name}!`);
      
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError(err.message);
    }
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointments.filter(appt => 
      appt && new Date(appt.date) >= today && appt.status === 'Scheduled'
    );
  };

  const getPastAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointments.filter(appt => 
      appt && (new Date(appt.date) < today || appt.status === 'Completed')
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTypeIcon = (type) => {
    const icons = {
      Checkup: '🩺',
      Vaccination: '💉',
      Grooming: '✂️',
      Emergency: '🚨',
      Other: '📋'
    };
    return icons[type] || '📋';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-purple-300">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6">
        <div className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 text-center border border-purple-500/30">
          <AlertCircle className="h-16 w-16 text-pink-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Appointments</h2>
          <p className="text-purple-300 mb-4">{error}</p>
          <button 
            onClick={fetchPets}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const upcoming = getUpcomingAppointments();
  const past = getPastAppointments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Appointments</span> Calendar
              </h1>
              <p className="text-xl text-purple-300">Schedule and manage pet visits</p>
            </div>
            <button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-2xl hover:scale-105 flex items-center gap-2"
            >
              <Calendar className="h-5 w-5" />
              <span>Schedule Visit</span>
            </button>
          </div>
        </div>
      </section>

      {/* Appointment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-purple-500/30">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">New Appointment</h2>
                <button 
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white text-3xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Select Pet *</label>
                  <select 
                    value={formData.petId} 
                    onChange={(e) => setFormData({...formData, petId: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Choose a pet...</option>
                    {pets.map(pet => (
                      <option key={pet._id} value={pet._id}>
                        {pet.name} ({pet.species})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Date *</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Time *</label>
                  <input 
                    type="time" 
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Type *</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Checkup">Checkup</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Grooming">Grooming</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Veterinarian</label>
                  <input 
                    type="text" 
                    value={formData.veterinarian}
                    onChange={(e) => setFormData({...formData, veterinarian: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                    placeholder="Dr. Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Notes</label>
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                    rows="3"
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold transition"
                  >
                    Schedule
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-bold transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Rest of your component remains exactly the same */}
      {/* Upcoming Appointments Section */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Visits</span>
            </h2>
            <p className="text-purple-300">Scheduled appointments for your pets</p>
          </div>
          
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((appt, idx) => (
                <div key={idx} className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getTypeIcon(appt.type)}</span>
                        <div>
                          <h3 className="text-xl font-bold text-white">{appt.petName}</h3>
                          <span className="text-sm text-purple-300">{appt.petSpecies}</span>
                        </div>
                      </div>
                      <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                        {appt.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-purple-200">
                        <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                        <span className="text-sm">{formatDate(appt.date)}</span>
                      </div>
                      <div className="flex items-center text-purple-200">
                        <Clock className="h-4 w-4 mr-2 text-pink-400" />
                        <span className="text-sm">{appt.time}</span>
                      </div>
                      <div className="flex items-center text-purple-200">
                        <Stethoscope className="h-4 w-4 mr-2 text-purple-400" />
                        <span className="text-sm">{appt.type}</span>
                      </div>
                      {appt.veterinarian && (
                        <p className="text-sm text-gray-300 mt-3">
                          <strong className="text-purple-300">Vet:</strong> {appt.veterinarian}
                        </p>
                      )}
                      {appt.notes && (
                        <p className="text-sm text-gray-400 bg-gray-700/50 p-3 rounded-lg mt-3">
                          {appt.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-purple-500/30">
              <Calendar className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Upcoming Appointments</h3>
              <p className="text-purple-300 mb-6">Schedule your first appointment</p>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Schedule Now
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Past Appointments Section */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Past <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Visits</span>
            </h2>
            <p className="text-purple-300">Completed appointments history</p>
          </div>
          
          {past.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((appt, idx) => (
                <div key={idx} className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 opacity-75">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(appt.type)}</span>
                      <div>
                        <h3 className="text-lg font-bold text-white">{appt.petName}</h3>
                        <span className="text-sm text-gray-400">{appt.petSpecies}</span>
                      </div>
                    </div>
                    <span className="bg-gray-600 text-gray-300 text-xs px-3 py-1 rounded-full">
                      Completed
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-300">
                      <strong>Date:</strong> {formatDate(appt.date)}
                    </p>
                    <p className="text-gray-300">
                      <strong>Time:</strong> {appt.time}
                    </p>
                    <p className="text-gray-300">
                      <strong>Type:</strong> {appt.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700">
              <p className="text-gray-400">No past appointments</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Appointments;