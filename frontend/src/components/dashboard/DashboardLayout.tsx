import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Send, 
  Search, 
  MessageCircle, 
  User, 
  Plus,
  Bell,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import axios from 'axios';
import { SocketProvider } from '@/contexts/SocketProvider';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'My Requests', href: '/dashboard/my-requests', icon: FileText },
  { name: 'My Applications', href: '/dashboard/my-applications', icon: Send },
  { name: 'Browse Skills', href: '/dashboard/browse', icon: Search },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle },
  // { name: 'Profile', href: '/dashboard/profile', icon: User },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}
export const currentUser = { // Export it if used directly in Messages.tsx for now
    id: 'myUserId123', // !!! IMPORTANT: Replace with actual dynamic user ID from your authentication
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 4.9,
    completedTrades: 23
};

  interface CurrentUserInput{
    name:string,
    email:string,
    avatar:string,
    rating:number,
    completedTrades:number
  }

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [curuser,setcurUser] =useState<CurrentUserInput>(currentUser);
  const [loading, setLoading] = useState(true);


  const fetchUserProfile = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    
    console.log('Fetching user profile for ID:', userId); // Debug log
    
    const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
      headers: { 
        'Authorization': `${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response:', response.data); // Debug log
    
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = response.data;
    
    // Transform the data to ensure all required fields exist
    const transformedData = {
      name: data.firstName || data.fullName || 'Unknown', // Use correct field name from schema
      email: data.email || '',
      avatar: data.avatar || '',
      rating: data.rating || 0,
      completedTrades: data.completedTrades || 0 // Use actual calculated data
    };
    
    console.log('Transformed data:', transformedData); // Debug log
    setcurUser(transformedData);
    
  } catch (error) { 
    console.error('Error fetching user profile:', error);
    console.error('Error details:', error); // More detailed error logging
    // Keep the default profile data if fetch fails
  }finally{
    setLoading(false);
  }
};

useEffect(() => {
  fetchUserProfile();
}, []);


  return (
    <SocketProvider currentUserId={currentUser.id}>
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col overflow-hidden h-screen`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              UpBartr
            </span>
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* User info -> should navigate to his profile once clicked*/}
        {!loading && ( <div className="p-6 border-b border-gray-200 flex-shrink-0 cursor-pointer" onClick={()=> location.pathname !== '/dashboard/profile' && (window.location.href = '/dashboard/profile')}>
          <div className="flex items-center">
            <img
              src={curuser.avatar}
              alt={curuser.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-100"
            />
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-900">{curuser.name}</p>
              <p className="text-xs text-gray-600">⭐ {curuser.rating} • {curuser.completedTrades} trades</p>
            </div>
          </div>
        </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions - Fixed at bottom */}
        <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0 bg-white">
          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => window.location.href = '/dashboard/settings'}>
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => {localStorage.clear(); window.location.href = '/'}}>
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Top bar - Fixed */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-gray-400" />
            </button>
            
            <div className="flex items-center space-x-4 ml-auto">
              <Link
                to="/dashboard/create-request"
                className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Request
              </Link>
              
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <ThemeToggle size="md" />
            </div>
          </div>
        </div>

        {/* Page content - Only this scrolls */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
    </SocketProvider>
  );
}