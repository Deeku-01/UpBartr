
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/DashBoard';
import { useEffect } from 'react';

// Create a separate component for the navigation logic
function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard'); // User is logged in
    } else {
      navigate('/'); // User not logged in - redirect to root
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
    </Routes>
  );
}


function App() {

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;