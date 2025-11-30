// src/App.jsx - Complete Version with Admin Navigation & User Management
import { useState, useEffect, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

// Import auth components
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

// Import main components
import Dashboard from "./components/Dashboard.jsx";
import PetList from "./components/PetList.jsx";
import PetDetail from "./components/PetDetail.jsx";
import Appointments from "./components/Appointments.jsx";
import AdminAppointments from "./components/AdminAppointments.jsx";
import PetHealthTimeline from "./components/PetHealthTimeline.jsx";
import GroomingServices from "./components/GroomingServices.jsx";
import GroomingAppointment from "./components/GroomingAppointment.jsx";
import AdoptionCenter from "./components/AdoptionCenter.jsx";
import AdoptionApplication from "./components/AdoptionApplication.jsx";
import AdoptionSuccess from "./components/AdoptionSuccess.jsx";
import AdminAddPet from "./components/AdminAddPet.jsx";
import AdminManagePets from "./components/AdminManagePets.jsx";
import AdminUserManagement from "./components/AdminUserManagement.jsx";

// Import Lucide React Icons
import {
  Home,
  PawPrint,
  CalendarDays,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  AlertTriangle,
  ChevronLeft,
  UserCircle,
  Shield,
  Scissors,
  Activity,
  Heart,
  Plus,
  List,
  Users,
} from "lucide-react";

// --- Auth Context ---
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      // Check if both token AND valid user data exist
      if (token && storedUser && storedUser !== "undefined") {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (parseError) {
          console.error("Error parsing stored user:", parseError);
          // Clear invalid data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      // Clear potentially corrupted data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    try {
      // Ensure userData has the expected structure
      if (userData && userData.token && userData.user) {
        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData.user));
        setUser(userData.user);
      } else if (userData && userData.user) {
        // Handle case where token might be separate
        localStorage.setItem("user", JSON.stringify(userData.user));
        setUser(userData.user);
      } else {
        console.error("Invalid userData structure:", userData);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// --- Theme Context ---
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    // Always use dark theme - remove light theme completely
    document.documentElement.classList.add("dark");
    document.body.className = "bg-gray-900 text-white transition-colors duration-300";
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// --- Protected Route Component ---
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-purple-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// --- Admin Only Route Component ---
function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-purple-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 flex items-center justify-center p-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-red-500/30 max-w-md">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-purple-300 mb-6">
            You need admin privileges to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
}

// --- Navigation Component ---
function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Define navigation based on user role
  const getNavigation = () => {
    if (user?.role === "admin") {
      // Admin sees only: Dashboard, User Management, and Pet Management
      return [
        { path: "/", name: "Dashboard", icon: Home },
        { path: "/admin/users", name: "User Management", icon: Users },
        { path: "/admin/manage-pets", name: "Manage Pets", icon: List },
        { path: "/admin/add-pet", name: "Add Pet", icon: Plus },
        { path: "/admin/appointments", name: "Appointments", icon: Shield },
      ];
    } else {
      // Regular users see all features
      return [
        { path: "/", name: "Dashboard", icon: Home },
        { path: "/pets", name: "Pets", icon: PawPrint },
        { path: "/appointments", name: "Appointments", icon: CalendarDays },
        { path: "/grooming", name: "Grooming", icon: Scissors },
        { path: "/health-timeline", name: "Health Timeline", icon: Activity },
        { path: "/adoption", name: "Adoption", icon: Heart },
      ];
    }
  };

  const navigation = getNavigation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavButton = ({ item, isMobile = false }) => {
    const Icon = item.icon;
    return (
      <button
        onClick={() => {
          navigate(item.path);
          if (isMobile) setIsOpen(false);
        }}
        className={`
          w-full text-left inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 
          ${
            isMobile
              ? `block rounded-lg mt-1 ${
                  isActive(item.path)
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              : `rounded-lg px-4 py-2 ${
                  isActive(item.path)
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
          }
        `}
      >
        <Icon className="h-4 w-4 mr-2" />
        {item.name}
      </button>
    );
  };

  return (
    <nav className="bg-gray-800/80 backdrop-blur-sm shadow-xl border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-3 text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                <PawPrint className="h-6 w-6 text-white" />
              </div>
              <span>PetCare Pro</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:space-x-1 lg:space-x-2 items-center">
            {navigation.map((item) => (
              <NavButton key={item.path} item={item} />
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200">
              <Settings className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm">
              <UserCircle className="h-5 w-5" />
              <span>{user?.username || "User"}</span>
              {user?.role === "admin" && (
                <Shield className="h-4 w-4 text-yellow-300" />
              )}
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/50 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-700 inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-600 transition-all duration-200"
            >
              {!isOpen ? (
                <Menu className="h-6 w-6" />
              ) : (
                <X className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="sm:hidden bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 py-2 px-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavButton key={item.path} item={item} isMobile={true} />
            ))}
          </div>
          
          <div className="border-t border-gray-700 mt-2 pt-2 space-y-1">
            <div className="px-3 py-2 text-sm font-semibold text-purple-400 flex items-center">
              <UserCircle className="h-4 w-4 mr-2" />
              {user?.username || "User"}
              {user?.role === "admin" && (
                <Shield className="h-4 w-4 ml-2 text-yellow-300" />
              )}
            </div>
            <button
              onClick={toggleTheme}
              className="w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg flex items-center transition-all duration-200"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 mr-2" />
              ) : (
                <Moon className="h-4 w-4 mr-2" />
              )}
              <span>Switch to {theme === "dark" ? "Light" : "Dark"} Mode</span>
            </button>
            <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg flex items-center transition-all duration-200">
              <Settings className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900/50 hover:text-red-300 rounded-lg flex items-center transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" /> 
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

function PetDetailWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PetDetail petId={id} onClose={() => navigate("/pets")} />
    </div>
  );
}

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 flex items-center justify-center p-6">
      <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-2xl p-10 border border-purple-500/30 shadow-2xl">
        <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
        <h1 className="text-4xl font-bold text-white mb-4">
          404 Page Not Found
        </h1>
        <p className="text-purple-300 mb-8 max-w-md text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center justify-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" /> 
            <span>Go Back</span>
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [error, setError] = useState(null);
  const { theme } = useContext(ThemeContext);
  const { user, login } = useAuth();

  // Global error handler
  useEffect(() => {
    const handleError = (event) => {
      console.error('Global error:', event.error);
      setError('An unexpected error occurred. Please refresh the page.');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 p-6 flex items-center justify-center">
        <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30 max-w-md">
          <div className="text-6xl mb-4">🚨</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Application Error
          </h2>
          <p className="text-purple-300 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Reload App
            </button>
            <button
              onClick={() => setError(null)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 transition-all duration-300">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLoginSuccess={login} />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Register onRegisterSuccess={login} />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigation />
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pets"
          element={
            <ProtectedRoute>
              <Navigation />
              <PetList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Navigation />
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grooming"
          element={
            <ProtectedRoute>
              <Navigation />
              <GroomingServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grooming-booking"
          element={
            <ProtectedRoute>
              <Navigation />
              <GroomingAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-timeline"
          element={
            <ProtectedRoute>
              <Navigation />
              <PetHealthTimeline />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adoption"
          element={
            <ProtectedRoute>
              <Navigation />
              <AdoptionCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adoption-application/:petId"
          element={
            <ProtectedRoute>
              <Navigation />
              <AdoptionApplication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adoption-success"
          element={
            <ProtectedRoute>
              <Navigation />
              <AdoptionSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pets/:id"
          element={
            <ProtectedRoute>
              <Navigation />
              <PetDetailWrapper />
            </ProtectedRoute>
          }
        />

        {/* Admin Only Routes */}
        <Route
          path="/admin/appointments"
          element={
            <AdminRoute>
              <Navigation />
              <AdminAppointments />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-pet"
          element={
            <AdminRoute>
              <Navigation />
              <AdminAddPet />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage-pets"
          element={
            <AdminRoute>
              <Navigation />
              <AdminManagePets />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <Navigation />
              <AdminUserManagement />
            </AdminRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;