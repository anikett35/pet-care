// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, CalendarDays, Pill, AlertTriangle, Plus, Stethoscope, TrendingUp, Heart, Activity } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPets: 0,
    upcomingAppointments: 0,
    activeMedications: 0,
    vaccinationsDue: 0
  });
  const [pets, setPets] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/pets');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format');
      }
      
      setPets(data);
      calculateStats(data);
      generateRecentActivity(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (petsData) => {
    if (!Array.isArray(petsData)) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    let upcomingAppts = 0;
    let activeMeds = 0;
    let vaccsDue = 0;

    petsData.forEach(pet => {
      if (pet.appointments && Array.isArray(pet.appointments)) {
        upcomingAppts += pet.appointments.filter(appt => 
          appt && appt.status === 'Scheduled' && new Date(appt.date) >= today
        ).length;
      }

      if (pet.medications && Array.isArray(pet.medications)) {
        activeMeds += pet.medications.filter(med => {
          if (!med) return false;
          if (!med.endDate) return true;
          return new Date(med.endDate) >= today;
        }).length;
      }

      if (pet.vaccinations && Array.isArray(pet.vaccinations)) {
        vaccsDue += pet.vaccinations.filter(vacc => {
          if (!vacc || !vacc.nextDue) return false;
          const dueDate = new Date(vacc.nextDue);
          return dueDate >= today && dueDate <= thirtyDaysFromNow;
        }).length;
      }
    });

    setStats({
      totalPets: petsData.length,
      upcomingAppointments: upcomingAppts,
      activeMedications: activeMeds,
      vaccinationsDue: vaccsDue
    });
  };

  const generateRecentActivity = (petsData) => {
    if (!Array.isArray(petsData)) {
      setRecentActivity([]);
      return;
    }

    const activities = [];

    petsData.forEach(pet => {
      if (!pet) return;

      if (pet.medicalHistory && Array.isArray(pet.medicalHistory)) {
        const recent = pet.medicalHistory.slice(-2).reverse();
        recent.forEach(record => {
          if (record) {
            activities.push({
              type: 'medical',
              petName: pet.name || 'Unknown Pet',
              date: record.date,
              description: record.diagnosis || 'Medical visit',
              icon: Stethoscope
            });
          }
        });
      }

      if (pet.vaccinations && Array.isArray(pet.vaccinations)) {
        const recent = pet.vaccinations.slice(-1);
        recent.forEach(vacc => {
          if (vacc) {
            activities.push({
              type: 'vaccination',
              petName: pet.name || 'Unknown Pet',
              date: vacc.date,
              description: `Vaccination: ${vacc.name || 'Unknown'}`,
              icon: Pill
            });
          }
        });
      }
    });

    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    setRecentActivity(activities.slice(0, 5));
  };

  const getSpeciesDistribution = () => {
    const distribution = {};
    pets.forEach(pet => {
      if (pet && pet.species) {
        distribution[pet.species] = (distribution[pet.species] || 0) + 1;
      }
    });
    return distribution;
  };

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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6">
        <div className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 text-center border border-purple-500/30">
          <AlertTriangle className="h-16 w-16 text-pink-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Dashboard</h2>
          <p className="text-purple-300 mb-4">{error}</p>
          <p className="text-sm text-gray-400 mb-6">
            Please check if your backend server is running on http://localhost:5000
          </p>
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

  const speciesDistribution = getSpeciesDistribution();
  const speciesEmojis = {
    Dog: '🐕',
    Cat: '🐈',
    Bird: '🐦',
    Fish: '🐠',
    Rabbit: '🐰',
    Other: '🐾'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4 animate-pulse">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4">
              Pet Wellness <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Dashboard</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-300 max-w-2xl mx-auto">
              Your complete pet care management system at a glance
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Total Pets */}
            <div className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => navigate('/pets')}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <PawPrint className="h-8 w-8 text-purple-400" />
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-6xl font-bold text-white mb-2">{stats.totalPets}</p>
                <p className="text-purple-300 font-medium">Total Pets</p>
              </div>
            </div>

            {/* Appointments */}
            <div className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30 hover:border-pink-500 transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => navigate('/appointments')}>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <CalendarDays className="h-8 w-8 text-pink-400" />
                  <Activity className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-6xl font-bold text-white mb-2">{stats.upcomingAppointments}</p>
                <p className="text-pink-300 font-medium">Upcoming Visits</p>
              </div>
            </div>

            {/* Medications */}
            <div className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <Pill className="h-8 w-8 text-purple-400" />
                  <Heart className="h-5 w-5 text-red-400" />
                </div>
                <p className="text-6xl font-bold text-white mb-2">{stats.activeMedications}</p>
                <p className="text-purple-300 font-medium">Active Meds</p>
              </div>
            </div>

            {/* Vaccinations Due */}
            <div className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30 hover:border-pink-500 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <AlertTriangle className="h-8 w-8 text-pink-400" />
                  <span className="px-2 py-1 bg-pink-600 text-white text-xs rounded-full">Urgent</span>
                </div>
                <p className="text-6xl font-bold text-white mb-2">{stats.vaccinationsDue}</p>
                <p className="text-pink-300 font-medium">Vaccines Due</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Species Distribution Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/30">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Pet <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Species</span>
            </h2>
            
            {stats.totalPets > 0 ? (
              <div className="space-y-6">
                {Object.entries(speciesDistribution).map(([species, count]) => {
                  const percentage = (count / stats.totalPets) * 100;
                  return (
                    <div key={species} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{speciesEmojis[species] || '🐾'}</span>
                          <span className="text-lg font-semibold text-white">{species}</span>
                          <span className="text-purple-400">({count})</span>
                        </div>
                        <span className="text-2xl font-bold text-white">{percentage.toFixed(0)}%</span>
                      </div>
                      <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No pets found</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-pink-500/30">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Recent <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Activity</span>
            </h2>
            
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <div key={idx} className="flex items-start space-x-4 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors border border-transparent hover:border-purple-500/50">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold">{activity.petName}</p>
                        <p className="text-purple-300 text-sm">{activity.description}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {activity.date ? new Date(activity.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'Date unknown'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="px-6 py-16 pb-32">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Quick <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Actions</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button 
              onClick={() => navigate('/pets')}
              className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 text-center">
                <Plus className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <p className="text-white font-semibold">Add New Pet</p>
              </div>
            </button>

            <button 
              onClick={() => navigate('/appointments')}
              className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-pink-500/30 hover:border-pink-500 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 text-center">
                <CalendarDays className="h-12 w-12 text-pink-400 mx-auto mb-4" />
                <p className="text-white font-semibold">Schedule Visit</p>
              </div>
            </button>

            <button className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 text-center">
                <Pill className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <p className="text-white font-semibold">Add Vaccination</p>
              </div>
            </button>

            <button className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-pink-500/30 hover:border-pink-500 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 text-center">
                <Stethoscope className="h-12 w-12 text-pink-400 mx-auto mb-4" />
                <p className="text-white font-semibold">Medical Record</p>
              </div>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;