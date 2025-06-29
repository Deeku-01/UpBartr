
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/DashBoard';
import { useEffect, useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';

// Create a separate component for the navigation logic
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasInitialized, setHasInitialized] = useState(false);

   useEffect(() => {
    // Only run this logic once on initial load
    if (hasInitialized) return;

    const token = localStorage.getItem('authToken');
    const currentPath = location.pathname;

    if (token) {
      // User is logged in
      if (currentPath === '/') {
        // Only redirect to dashboard if they're at the root
        navigate('/dashboard/profile');
      }
      // Otherwise, stay on whatever page they're currently on (handles refresh)
    } else {
      // User not logged in - redirect to root only if they're on a protected route
      if (currentPath.startsWith('/dashboard')) {
        navigate('/');
      }
    }

    setHasInitialized(true);
  }, [navigate, location.pathname, hasInitialized]);

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