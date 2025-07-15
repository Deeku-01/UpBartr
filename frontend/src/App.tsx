// src/App.tsx (No changes needed here from your last provided code, it already points to Dashboard correctly)

import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/DashBoard'; // This will now handle nested routes for dashboard
import { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from './contexts/SocketProvider';
// ConversationList and Messages are now imported and used inside MessagesPageWrapper/Dashboard.tsx
// import ConversationList from './components/dashboard/ConversationList';
// import Messages from './components/dashboard/Messages';

import { jwtDecode } from 'jwt-decode';
import { MessageCircle } from 'lucide-react'; // Still used in MessagesPageWrapper, keep this import for now if not already there.

// Helper function to get userId from token
const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem('authToken'); // This will now get just the JWT string
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.userId || decoded.sub || null; // Adjust to your actual JWT claim for user ID
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  }
  return null;
};

// Create a separate component for the navigation logic
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    const token = localStorage.getItem('authToken');
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const userId = getCurrentUserId();
    setCurrentUserId(userId);

    const handleAuthChange = () => {
      setCurrentUserId(getCurrentUserId());
    };
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  if (currentUserId === null) {
      return (
        <Router>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </Router>
      );
  }

  return (
    <Router>
      <SocketProvider currentUserId={currentUserId}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SocketProvider>
    </Router>
  );
}

export default App;