import { API_URL } from '../config';
// src/components/AdminAppointments.jsx - SIMPLIFIED (No Auth Check)
import { useState, useEffect } from 'react';
import { Calendar, Clock, Stethoscope, CheckCircle, XCircle, Trash2, AlertCircle, ThumbsUp } from 'lucide-react';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all');

  const API_BASE_URL = `${API_URL}`/api';

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch appointments');
      }
      
      const data = await response.json();
      console.log('Appointments loaded:', data);
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      console.log('Changing status to:', newStatus, 'for appointment:', appointmentId);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Status change error:', errorData);
        throw new Error(errorData.error || 'Failed to update status');
      }

      const result = await response.json();
      console.log('Status change success:', result);

      setSuccessMessage(`Appointment ${newStatus.toLowerCase()} successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh appointments
      await fetchAppointments();
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete');
      }

      setSuccessMessage('Appointment deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      await fetchAppointments();
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const getFilteredAppointments = () => {
    if (filter === 'all') return appointments;
    return appointments.filter(appt => appt.status.toLowerCase() === filter);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set';
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  const getTypeIcon = (type) => {
    const icons = {
      Checkup: '🩺', Vaccination: '💉', Grooming: '✂️',
      Emergency: '🚨', Surgery: '🏥', Dental: '🦷', Other: '📋'
    };
    return icons[type] || '📋';
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      Confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
      Completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      Cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      Rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[status] || '';
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

  const filteredAppointments = getFilteredAppointments();
  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'Pending').length,
    confirmed: appointments.filter(a => a.status === 'Confirmed').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
    rejected: appointments.filter(a => a.status === 'Rejected').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900">
      
      {/* Header */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 text-center">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Appointments</span> Manager
          </h1>
          <p className="text-xl text-purple-300 text-center">Manage all pet appointments from one place</p>
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

      {/* Stats & Filter */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
              <p className="text-3xl font-bold text-white text-center">{stats.total}</p>
              <p className="text-purple-300 text-sm mt-2 text-center">Total</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
              <p className="text-3xl font-bold text-yellow-400 text-center">{stats.pending}</p>
              <p className="text-yellow-300 text-sm mt-2 text-center">Pending</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
              <p className="text-3xl font-bold text-green-400 text-center">{stats.confirmed}</p>
              <p className="text-green-300 text-sm mt-2 text-center">Confirmed</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
              <p className="text-3xl font-bold text-blue-400 text-center">{stats.completed}</p>
              <p className="text-blue-300 text-sm mt-2 text-center">Completed</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30">
              <p className="text-3xl font-bold text-red-400 text-center">{stats.rejected}</p>
              <p className="text-red-300 text-sm mt-2 text-center">Rejected</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-pink-500/30">
              <label className="block text-xs font-semibold text-purple-300 mb-2">Filter</label>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-purple-500/30 rounded-xl text-white text-sm"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Appointments Grid */}
          {filteredAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAppointments.map((appt) => (
                <div key={appt._id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500 transition-all">
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getTypeIcon(appt.type)}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{appt.petName}</h3>
                        <span className="text-sm text-purple-300">{appt.petSpecies}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(appt.status)}`}>
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
                    <p className="text-sm text-gray-300 mt-2">
                      <strong>User:</strong> {appt.userName} ({appt.userEmail})
                    </p>
                    {appt.notes && (
                      <p className="text-sm text-gray-400 bg-gray-700/50 p-3 rounded-lg mt-3">{appt.notes}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4 border-t border-gray-700">
                    {appt.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(appt._id, 'Confirmed')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-1"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(appt._id, 'Rejected')}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-1"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    )}
                    
                    {appt.status === 'Confirmed' && (
                      <button
                        onClick={() => handleStatusChange(appt._id, 'Completed')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark Complete
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(appt._id)}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-purple-500/30">
              <Calendar className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Appointments Found</h3>
              <p className="text-purple-300">No {filter !== 'all' ? filter : ''} appointments to display</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminAppointments;