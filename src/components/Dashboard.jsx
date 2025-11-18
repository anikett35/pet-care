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
  Users
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data
  const mockStats = {
    totalPets: 4,
    totalAppointments: 12,
    upcomingAppointments: 3,
    groomingSessions: 5,
    healthRecords: 8,
    adoptionApplications: 2
  };

  const mockRecentAppointments = [
    {
      id: 1,
      petName: 'Buddy',
      type: 'Checkup',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'Completed',
      veterinarian: 'Dr. Smith'
    },
    {
      id: 2,
      petName: 'Whiskers',
      type: 'Vaccination',
      date: '2024-01-14',
      time: '02:30 PM',
      status: 'Completed',
      veterinarian: 'Dr. Johnson'
    },
    {
      id: 3,
      petName: 'Max',
      type: 'Dental Cleaning',
      date: '2024-01-12',
      time: '11:00 AM',
      status: 'Completed',
      veterinarian: 'Dr. Wilson'
    }
  ];

  const mockUpcomingAppointments = [
    {
      id: 4,
      petName: 'Buddy',
      type: 'Annual Checkup',
      date: '2024-01-20',
      time: '10:00 AM',
      status: 'Scheduled',
      veterinarian: 'Dr. Smith'
    },
    {
      id: 5,
      petName: 'Whiskers',
      type: 'Grooming',
      date: '2024-01-25',
      time: '11:00 AM',
      status: 'Scheduled',
      veterinarian: 'Dr. Wilson'
    },
    {
      id: 6,
      petName: 'Luna',
      type: 'Vaccination',
      date: '2024-01-28',
      time: '03:00 PM',
      status: 'Scheduled',
      veterinarian: 'Dr. Brown'
    }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use mock data instead of API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
      
      setStats(mockStats);
      setRecentAppointments(mockRecentAppointments);
      setUpcomingAppointments(mockUpcomingAppointments);
      
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.color}`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const AppointmentCard = ({ appointment, isUpcoming = false }) => (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-purple-500/30 transition-all duration-200">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-white">{appointment.petName}</h4>
          <p className="text-sm text-gray-400">{appointment.type}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isUpcoming 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-blue-500/20 text-blue-400'
        }`}>
          {appointment.status}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-400 mb-1">
        <Calendar className="h-4 w-4 mr-2" />
        <span>{new Date(appointment.date).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center text-sm text-gray-400">
        <Clock className="h-4 w-4 mr-2" />
        <span>{appointment.time}</span>
        <span className="mx-2">•</span>
        <Stethoscope className="h-4 w-4 mr-2" />
        <span>{appointment.veterinarian}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-purple-300">Loading dashboard...</p>
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
          <p className="text-purple-300 mb-2">Using demo data for display</p>
          <p className="text-gray-400 text-sm mb-6">Backend server is not available</p>
          <button 
            onClick={fetchDashboardData}
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
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                PetCare Pro
              </span>
            </h1>
            <p className="text-xl text-purple-300 max-w-2xl mx-auto">
              Your complete pet care management solution. Track appointments, health records, grooming, and adoptions all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon={PawPrint}
              title="Total Pets"
              value={stats.totalPets}
              color="bg-purple-500"
              trend={{ value: "+2 this month", color: "text-green-400" }}
            />
            <StatCard
              icon={Calendar}
              title="Total Appointments"
              value={stats.totalAppointments}
              color="bg-blue-500"
              trend={{ value: "3 upcoming", color: "text-blue-400" }}
            />
            <StatCard
              icon={Stethoscope}
              title="Health Records"
              value={stats.healthRecords}
              color="bg-green-500"
              trend={{ value: "All up to date", color: "text-green-400" }}
            />
            <StatCard
              icon={Scissors}
              title="Grooming Sessions"
              value={stats.groomingSessions}
              color="bg-pink-500"
              trend={{ value: "2 scheduled", color: "text-pink-400" }}
            />
            <StatCard
              icon={Heart}
              title="Adoption Applications"
              value={stats.adoptionApplications}
              color="bg-red-500"
              trend={{ value: "1 pending", color: "text-red-400" }}
            />
            <StatCard
              icon={Users}
              title="Active Services"
              value="6"
              color="bg-orange-500"
              trend={{ value: "All active", color: "text-orange-400" }}
            />
          </div>
        </div>
      </section>

      {/* Appointments Section */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Appointments */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-3 text-purple-400" />
                Recent Appointments
              </h2>
              <div className="space-y-4">
                {recentAppointments.map(appointment => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                  />
                ))}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Calendar className="h-6 w-6 mr-3 text-pink-400" />
                Upcoming Appointments
              </h2>
              <div className="space-y-4">
                {upcomingAppointments.map(appointment => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                    isUpcoming={true}
                  />
                ))}
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
            {[
              { icon: Calendar, label: 'Schedule Visit', color: 'from-purple-500 to-pink-500' },
              { icon: Stethoscope, label: 'Health Record', color: 'from-green-500 to-blue-500' },
              { icon: Scissors, label: 'Book Grooming', color: 'from-pink-500 to-red-500' },
              { icon: Heart, label: 'Adoption', color: 'from-blue-500 to-purple-500' }
            ].map((action, index) => (
              <button
                key={index}
                className={`bg-gradient-to-r ${action.color} text-white p-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              >
                <action.icon className="h-8 w-8 mx-auto mb-2" />
                <span className="text-sm">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;