// src/components/AdminAppointments.jsx
import { useState, useEffect } from 'react';
import { Calendar, Clock, Stethoscope, CheckCircle, Trash2, AlertCircle } from 'lucide-react';

const AdminAppointments = () => {
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, scheduled, completed

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (pets.length > 0) {
      extractAppointments();
    }
  }, [pets]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/pets');
      
      if (!response.ok) {
        throw new Error('Failed to fetch pets');
      }
      
      const data = await response.json();
      setPets(data);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError(err.message);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const extractAppointments = () => {
    const allAppointments = [];
    pets.forEach(pet => {
      if (pet && pet.appointments && Array.isArray(pet.appointments)) {
        pet.appointments.forEach((appt, index) => {
          if (appt) {
            allAppointments.push({
              ...appt,
              petId: pet._id,
              appointmentIndex: index,
              petName: pet.name || 'Unknown',
              petSpecies: pet.species || 'Unknown'
            });
          }
        });
      }
    });
    
    allAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
    setAppointments(allAppointments);
  };

  const handleCompleteAppointment = async (petId, appointmentIndex) => {
    try {
      const pet = pets.find(p => p._id === petId);
      if (!pet) throw new Error('Pet not found');

      const updatedAppointments = [...pet.appointments];
      updatedAppointments[appointmentIndex] = {
        ...updatedAppointments[appointmentIndex],
        status: 'Completed'
      };

      const response = await fetch(`http://localhost:5000/api/pets/${petId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointments: updatedAppointments })
      });

      if (!response.ok) throw new Error('Failed to update appointment');

      await fetchPets();
    } catch (err) {
      console.error('Error completing appointment:', err);
      setError(err.message);
    }
  };

  const handleDeleteAppointment = async (petId, appointmentIndex) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      const pet = pets.find(p => p._id === petId);
      if (!pet) throw new Error('Pet not found');

      const updatedAppointments = pet.appointments.filter((_, index) => index !== appointmentIndex);

      const response = await fetch(`http://localhost:5000/api/pets/${petId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointments: updatedAppointments })
      });

      if (!response.ok) throw new Error('Failed to delete appointment');

      await fetchPets();
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setError(err.message);
    }
  };

  const getFilteredAppointments = () => {
    switch (filter) {
      case 'scheduled':
        return appointments.filter(appt => appt.status === 'Scheduled');
      case 'completed':
        return appointments.filter(appt => appt.status === 'Completed');
      default:
        return appointments;
    }
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
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Data</h2>
          <p className="text-purple-300 mb-4">{error}</p>
          <button 
            onClick={fetchPets}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredAppointments = getFilteredAppointments();
  const scheduledCount = appointments.filter(a => a.status === 'Scheduled').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900">
      
      {/* Header Section */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
              Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Appointments</span> Manager
            </h1>
            <p className="text-xl text-purple-300">Manage all pet appointments from one place</p>
          </div>
        </div>
      </section>

      {/* Stats & Filter Section */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            
            {/* Stats Cards */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <div className="text-center">
                <p className="text-4xl font-bold text-white">{appointments.length}</p>
                <p className="text-purple-300 text-sm mt-2">Total Appointments</p>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-400">{scheduledCount}</p>
                <p className="text-green-300 text-sm mt-2">Scheduled</p>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-400">{completedCount}</p>
                <p className="text-blue-300 text-sm mt-2">Completed</p>
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-pink-500/30">
              <label className="block text-sm font-semibold text-purple-300 mb-2">Filter</label>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All ({appointments.length})</option>
                <option value="scheduled">Scheduled ({scheduledCount})</option>
                <option value="completed">Completed ({completedCount})</option>
              </select>
            </div>
          </div>

          {/* Appointments List */}
          {filteredAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAppointments.map((appt, idx) => (
                <div key={idx} className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500 transition-all duration-300">
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getTypeIcon(appt.type)}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{appt.petName}</h3>
                        <span className="text-sm text-purple-300">{appt.petSpecies}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      appt.status === 'Scheduled' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
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

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                    {appt.status === 'Scheduled' && (
                      <button
                        onClick={() => handleCompleteAppointment(appt.petId, appt.appointmentIndex)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Complete</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAppointment(appt.petId, appt.appointmentIndex)}
                      className={`${appt.status === 'Scheduled' ? 'flex-1' : 'w-full'} bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl font-semibold transition flex items-center justify-center gap-2`}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-purple-500/30">
              <Calendar className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Appointments Found</h3>
              <p className="text-purple-300">
                {filter === 'all' 
                  ? 'No appointments have been scheduled yet.' 
                  : `No ${filter} appointments found.`}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminAppointments;