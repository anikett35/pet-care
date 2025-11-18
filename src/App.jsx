// src/App.jsx - Updated with Adoption Features
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
} from "lucide-react";

// --- Auth Context ---
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
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
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-gray-900", "text-white");
      document.body.classList.remove("bg-gray-100", "text-gray-900");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.add("bg-gray-100", "text-gray-900");
      document.body.classList.remove("bg-gray-900", "text-white");
    }
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
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
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold"
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

  const navigation = [
    { path: "/", name: "Dashboard", icon: Home },
    { path: "/pets", name: "Pets", icon: PawPrint },
    { path: "/appointments", name: "Appointments", icon: CalendarDays },
    { path: "/grooming", name: "Grooming", icon: Scissors },
    { path: "/health-timeline", name: "Health Timeline", icon: Activity },
    { path: "/adoption", name: "Adoption", icon: Heart },
  ];

  // Add admin link if user is admin
  if (user?.role === "admin") {
    navigation.push({
      path: "/admin/appointments",
      name: "Admin Panel",
      icon: Shield,
    });
  }

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
          w-full text-left inline-flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 
          ${
            isMobile
              ? `block rounded-md mt-1 ${
                  isActive(item.path)
                    ? "bg-blue-700 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`
              : `${
                  isActive(item.path)
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-200 hover:border-b-2 hover:border-gray-500"
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
    <nav className="bg-gray-800 shadow-lg border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-xl font-extrabold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <PawPrint className="h-7 w-7" />
              <h1>PetCare Pro</h1>
            </button>
          </div>

          <div className="hidden sm:flex sm:space-x-4 lg:space-x-8 items-center">
            {navigation.map((item) => (
              <NavButton key={item.path} item={item} />
            ))}
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button className="p-2 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors">
              <Settings className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2 p-2 rounded-full bg-blue-600 text-white font-semibold text-sm">
              <UserCircle className="h-5 w-5" />
              <span>{user?.username || "User"}</span>
              {user?.role === "admin" && (
                <Shield className="h-4 w-4 text-yellow-300" />
              )}
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-red-400 hover:text-red-300 hover:bg-red-900 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-100 hover:bg-gray-600"
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

      {isOpen && (
        <div className="sm:hidden border-t border-gray-700 pt-2 pb-3 px-2">
          {navigation.map((item) => (
            <NavButton key={item.path} item={item} isMobile={true} />
          ))}
          <div className="border-t border-gray-700 mt-2 pt-2">
            <button
              onClick={toggleTheme}
              className="w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-md flex items-center"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 mr-2" />
              ) : (
                <Moon className="h-4 w-4 mr-2" />
              )}
              <span>Switch to {theme === "dark" ? "Light" : "Dark"} Mode</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900 rounded-md mt-1 flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" /> <span>Log Out</span>
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 text-white">
      <div className="text-center bg-gray-800 p-10 rounded-2xl shadow-xl border border-gray-700">
        <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500" />
        <h1 className="text-4xl font-bold text-white mb-4">
          404 Page Not Found
        </h1>
        <p className="text-gray-400 mb-8 max-w-md">
          The page you're looking for doesn't exist.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold inline-flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" /> <span>Go Back</span>
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Go Home
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center text-white">
        <div className="text-center bg-gray-800 p-8 rounded-xl shadow-lg border border-red-700">
          <div className="text-6xl mb-4 text-red-500">🚨</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Application Error
          </h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      } transition-colors duration-300`}
    >
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
        <Route
          path="/pets/:id/timeline"
          element={
            <ProtectedRoute>
              <PetHealthTimeline />
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
