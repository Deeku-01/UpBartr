import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/DashBoard';
import { useEffect, useRef } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';

// Create a separate component for the navigation logic
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run this logic once on initial load
    if (hasInitialized.current) return;

    const token = localStorage.getItem('authToken');
    const currentPath = location.pathname;
    
    // Check if this is truly the initial app load (not a refresh)
    const isInitialLoad = !sessionStorage.getItem('appHasLoaded');
    
    if (token) {
      // User is logged in
      if (currentPath === '/' && isInitialLoad) {
        // Only redirect to dashboard on initial app load at root
        navigate('/dashboard/profile', { replace: true });
      }
      // If it's a refresh at '/' or any other path, stay where they are
    } else {
      // User not logged in - redirect to root only if they're on a protected route
      if (currentPath.startsWith('/dashboard')) {
        navigate('/', { replace: true });
      }
    }

    // Mark that the app has loaded in this session
    sessionStorage.setItem('appHasLoaded', 'true');
    hasInitialized.current = true;
  }, [navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;