// src/App.tsx

import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/DashBoard'; // This will now handle nested routes for dashboard
import { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from './contexts/SocketProvider';
// Removed jwtDecode as we are now directly reading userId from localStorage
// import { jwtDecode } from 'jwt-decode';
import { MessageCircle } from 'lucide-react';

// Helper function to get userId directly from localStorage
const getCurrentUserId = (): string | null => {
  const userId = localStorage.getItem('userId');
  console.log('Retrieved userId directly from localStorage:', userId); // Debugging: See retrieved ID
  return userId; // userId will be null if not found
};

// Create a separate component for the navigation logic
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    const token = localStorage.getItem('authToken'); // Still check token for navigation logic
    const currentPath = location.pathname;
    const isInitialLoad = !sessionStorage.getItem('appHasLoaded');

    if (token) {
      if (currentPath === '/' && isInitialLoad) {
        navigate('/dashboard/profile', { replace: true });
      }
    } else {
      if (currentPath.startsWith('/dashboard')) {
        navigate('/', { replace: true });
      }
    }

    sessionStorage.setItem('appHasLoaded', 'true');
    hasInitialized.current = true;
  }, [navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Dashboard component will now contain its own nested routes */}
      <Route path="/dashboard/*" element={<Dashboard />} />
    </Routes>
  );
}

function App() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(getCurrentUserId()); // Initialize with current user ID

  useEffect(() => {
    // Listen for auth changes (e.g., login/logout)
    const handleAuthChange = () => {
      setCurrentUserId(getCurrentUserId());
    };
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  // Ensure SocketProvider is always rendered if a userId is available,
  // wrapping the main content that might need it.
  return (
    <Router>
      <ThemeProvider>
        {/* Conditionally render SocketProvider around AppContent if currentUserId is available */}
        {currentUserId ? (
          <SocketProvider currentUserId={currentUserId}>
            <AppContent />
          </SocketProvider>
        ) : (
          // If no currentUserId, render AppContent without SocketProvider
          // Routes within AppContent (like Dashboard) will handle their own auth checks
          <AppContent />
        )}
      </ThemeProvider>
    </Router>
  );
}

export default App;
