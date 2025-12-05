// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';

import { 
  PawPrint, 
  Calendar, 
  Stethoscope, 
  Scissors, 
  Heart,
  TrendingUp,
  AlertCircle,
  Clock,
  Users,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch pets data
      const petsResponse = await fetch(`${API_BASE_URL}/pets`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!petsResponse.ok) {
        throw new Error('Failed to fetch pets data');
      }

      const pets = await petsResponse.json();

      // Calculate statistics from pets data
      const totalPets = pets.length;
      
      // Extract all appointments from pets
      const allAppointments = pets.flatMap(pet => 
        (pet.appointments || []).map(appt => ({
          ...appt,
          petId: pet._id,
          petName: pet.name,
          petSpecies: pet.species
        }))
      );

      // Sort appointments by date
      allAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Separate upcoming and recent appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = allAppointments.filter(appt => 
        new Date(appt.date) >= today && appt.status === 'Scheduled'
      );

      const recent = allAppointments.filter(appt => 
        new Date(appt.date) < today || appt.status === 'Completed'
      ).slice(-3); // Get last 3 completed appointments

      // Calculate other statistics
      const totalAppointments = allAppointments.length;
      const upcomingAppointmentsCount = upcoming.length;
      
      // Count grooming sessions
      const groomingSessions = allAppointments.filter(appt => 
        appt.type === 'Grooming'
      ).length;

      // Count health records (vaccinations + medications + medical history)
      const healthRecords = pets.reduce((total, pet) => {
        const vaccinations = pet.vaccinations?.length || 0;
        const medications = pet.medications?.length || 0;
        const medicalHistory = pet.medicalHistory?.length || 0;
        return total + vaccinations + medications + medicalHistory;
      }, 0);

      // Mock adoption applications (you can replace this with real API call)
      const adoptionApplications = 2;

      setStats({
        totalPets,
        totalAppointments,
        upcomingAppointments: upcomingAppointmentsCount,
        groomingSessions,
        healthRecords,
        adoptionApplications
      });

      setRecentAppointments(recent);
      setUpcomingAppointments(upcoming);
      
    } catch (err) {
      console.error('Error loading dashboard:', err);
      if (err.message.includes('token')) {
        setError('Please log in again');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Backend server is not available. Please make sure the server is running on port 5000.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const StatCard = ({ icon: Icon, title, value, color, trend, description }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
              {description}
            </p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.color}`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const AppointmentCard = ({ appointment, isUpcoming = false }) => (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-purple-500/30 transition-all duration-200 hover:scale-102">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-white">{appointment.petName}</h4>
          <p className="text-sm text-gray-400 capitalize">{appointment.petSpecies}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isUpcoming 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-blue-500/20 text-blue-400'
        }`}>
          {appointment.status || 'Scheduled'}
        </span>
      </div>
      
      <div className="mb-2">
        <p className="text-sm text-white font-medium capitalize">{appointment.type}</p>
        {appointment.veterinarian && (
          <p className="text-xs text-gray-400">with {appointment.veterinarian}</p>
        )}
      </div>

      <div className="flex items-center text-sm text-gray-400 mb-1">
        <Calendar className="h-4 w-4 mr-2" />
        <span>{new Date(appointment.date).toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}</span>
      </div>
      <div className="flex items-center text-sm text-gray-400">
        <Clock className="h-4 w-4 mr-2" />
        <span>{appointment.time}</span>
      </div>
      
      {appointment.notes && (
        <div className="mt-2 pt-2 border-t border-gray-700">
          <p className="text-xs text-gray-500">{appointment.notes}</p>
        </div>
      )}
    </div>
  );

  const QuickActionButton = ({ icon: Icon, label, color, onClick }) => (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r ${color} text-white p-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center justify-center min-h-[100px]`}
    >
      <Icon className="h-8 w-8 mb-2" />
      <span className="text-sm">{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-purple-300">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-purple-500/30">
          <AlertCircle className="h-16 w-16 text-pink-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Dashboard</h2>
          <p className="text-purple-300 mb-2">{error}</p>
          <p className="text-gray-400 text-sm mb-6">
            {error.includes('Backend server') 
              ? 'Make sure your backend server is running on port 5000'
              : 'Please check your connection and try again'
            }
          </p>
          <div className="flex gap-3">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {refreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Retry
            </button>
            {error.includes('log in') && (
              <button 
                onClick={() => window.location.href = '/login'}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900">
      {/* Header Section */}
      <section className="relative overflow-hidden px-6 py-8">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  PetCare Pro
                </span>
              </h1>
              <p className="text-xl text-purple-300 max-w-2xl">
                Your complete pet care management solution
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 disabled:opacity-50 flex items-center gap-2"
            >
              {refreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon={PawPrint}
              title="Total Pets"
              value={stats.totalPets || 0}
              color="bg-purple-500"
              description="Registered in your care"
              trend={{ value: "+0 this month", color: "text-green-400" }}
            />
            <StatCard
              icon={Calendar}
              title="Total Appointments"
              value={stats.totalAppointments || 0}
              color="bg-blue-500"
              description="All time visits"
              trend={{ value: `${stats.upcomingAppointments || 0} upcoming`, color: "text-blue-400" }}
            />
            <StatCard
              icon={Stethoscope}
              title="Health Records"
              value={stats.healthRecords || 0}
              color="bg-green-500"
              description="Vaccinations & medications"
              trend={{ value: "Track health", color: "text-green-400" }}
            />
            <StatCard
              icon={Scissors}
              title="Grooming Sessions"
              value={stats.groomingSessions || 0}
              color="bg-pink-500"
              description="Beauty treatments"
              trend={{ value: "Keep them fresh", color: "text-pink-400" }}
            />
            <StatCard
              icon={Heart}
              title="Adoption Applications"
              value={stats.adoptionApplications || 0}
              color="bg-red-500"
              description="Pending requests"
              trend={{ value: "Help pets find homes", color: "text-red-400" }}
            />
            <StatCard
              icon={Users}
              title="Active Services"
              value="6"
              color="bg-orange-500"
              description="Available features"
              trend={{ value: "All active", color: "text-orange-400" }}
            />
          </div>
        </div>
      </section>

      {/* Appointments Section */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Appointments */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-3 text-purple-400" />
                Recent Appointments
              </h2>
              <div className="space-y-4">
                {recentAppointments.length > 0 ? (
                  recentAppointments.map((appointment, index) => (
                    <AppointmentCard 
                      key={index} 
                      appointment={appointment} 
                    />
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-800/30 rounded-xl border border-gray-700">
                    <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No recent appointments</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Calendar className="h-6 w-6 mr-3 text-pink-400" />
                Upcoming Appointments
              </h2>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment, index) => (
                    <AppointmentCard 
                      key={index} 
                      appointment={appointment} 
                      isUpcoming={true}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-800/30 rounded-xl border border-gray-700">
                    <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No upcoming appointments</p>
                    <p className="text-gray-500 text-sm mt-2">Schedule a visit for your pet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton 
              icon={Calendar}
              label="Schedule Visit"
              color="from-purple-500 to-pink-500"
              onClick={() => window.location.href = '/appointments'}
            />
            <QuickActionButton 
              icon={Stethoscope}
              label="Health Record"
              color="from-green-500 to-blue-500"
              onClick={() => window.location.href = '/health-timeline'}
            />
            <QuickActionButton 
              icon={Scissors}
              label="Book Grooming"
              color="from-pink-500 to-red-500"
              onClick={() => window.location.href = '/grooming'}
            />
            <QuickActionButton 
              icon={Heart}
              label="Adoption"
              color="from-blue-500 to-purple-500"
              onClick={() => window.location.href = '/adoption'}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;