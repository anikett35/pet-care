// src/components/Appointments.jsx - REPLACE ENTIRE FILE
import { useState, useEffect } from 'react';
import { Calendar, Clock, Stethoscope, AlertCircle, CheckCircle } from 'lucide-react';

const Appointments = () => {
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    petId: '',
    date: '',
    time: '',
    type: 'Checkup',
    veterinarian: '',
    notes: ''
  });

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchPets();
    fetchAppointments();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pets`);
      if (!response.ok) throw new Error('Failed to fetch pets');
      const data = await response.json();
      setPets(data);
    } catch (err) {
      console.error('Error fetching pets:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please login to view appointments');
      }

      const response = await fetch(`${API_BASE_URL}/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch appointments');
      
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please login to create appointments');
      }

      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create appointment');
      }

      setSuccessMessage('Appointment scheduled! Waiting for admin approval.');
      setTimeout(() => setSuccessMessage(''), 5000);
      
      setShowForm(false);
      setFormData({
        petId: '',
        date: '',
        time: '',
        type: 'Checkup',
        veterinarian: '',
        notes: ''
      });
      
      fetchAppointments();
      
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm('Cancel this appointment?')) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to cancel appointment');

      setSuccessMessage('Appointment cancelled successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      fetchAppointments();
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError(err.message);
    }
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointments.filter(appt => 
      new Date(appt.date) >= today && appt.status !== 'Completed' && appt.status !== 'Cancelled'
    );
  };

  const getPastAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointments.filter(appt => 
      new Date(appt.date) < today || appt.status === 'Completed'
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set';
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      Confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
      Completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      Cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
      Rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    const icons = {
      Checkup: '🩺', Vaccination: '💉', Grooming: '✂️',
      Emergency: '🚨', Surgery: '🏥', Dental: '🦷', Other: '📋'
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

      {/* Messages */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <span className="text-green-300 font-semibold">{successMessage}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <span className="text-red-300 font-semibold">{error}</span>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-purple-500/30">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">New Appointment</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-3xl">×</button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Select Pet *</label>
                  <select 
                    value={formData.petId} 
                    onChange={(e) => setFormData({...formData, petId: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white"
                    required
                  >
                    <option value="">Choose a pet...</option>
                    {pets.map(pet => (
                      <option key={pet._id} value={pet._id}>{pet.name} ({pet.species})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Date *</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Time *</label>
                  <input 
                    type="time" 
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Type *</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white"
                  >
                    <option value="Checkup">Checkup</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Grooming">Grooming</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Dental">Dental</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Veterinarian</label>
                  <input 
                    type="text" 
                    value={formData.veterinarian}
                    onChange={(e) => setFormData({...formData, veterinarian: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white"
                    placeholder="Dr. Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Notes</label>
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-purple-500/30 rounded-xl text-white"
                    rows="3"
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold"
                  >
                    Schedule
                  </button>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Appointments */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Visits</span>
          </h2>
          
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((appt) => (
                <div key={appt._id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getTypeIcon(appt.type)}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{appt.petName}</h3>
                        <span className="text-sm text-purple-300">{appt.petSpecies}</span>
                      </div>
                    </div>
                    {getStatusBadge(appt.status)}
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
                    {appt.notes && (
                      <p className="text-sm text-gray-400 bg-gray-700/50 p-3 rounded-lg mt-3">{appt.notes}</p>
                    )}
                  </div>

                  {appt.status === 'Pending' && (
                    <button
                      onClick={() => handleDelete(appt._id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-800/50 rounded-3xl border border-purple-500/30">
              <Calendar className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Upcoming Appointments</h3>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Schedule Now
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Appointments;