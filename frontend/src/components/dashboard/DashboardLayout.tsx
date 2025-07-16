import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  X,
  ChevronDown, // Added for dropdown
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import { api, setAuthToken } from '../utils/setAuthToken'; // Import setAuthToken for logout

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'My Requests', href: '/dashboard/my-requests', icon: FileText },
  { name: 'My Applications', href: '/dashboard/my-applications', icon: Send },
  { name: 'Browse Skills', href: '/dashboard/browse', icon: Search },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Interface for the current authenticated user's profile
interface CurrentUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  username?: string; // Assuming username might also be available
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<CurrentUserProfile | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch current user's profile
  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      try {
        const response = await api.get<CurrentUserProfile>('/api/users/profile');
        setCurrentUserProfile(response.data);
      } catch (err) {
        console.error('Error fetching current user profile:', err);
        // Handle error, e.g., redirect to login if token is invalid
        setAuthToken(null, null); // Clear invalid token
        navigate('/login'); // Redirect to login page
      }
    };
    fetchCurrentUserProfile();
  }, [navigate]); // Re-fetch if navigate function changes (unlikely)

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setAuthToken(null, null); // Clear token and userId from localStorage
    navigate('/'); // Redirect to landing page or login
  };

  const currentPath = location.pathname;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:hidden shadow-lg`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/dashboard" className="flex items-center text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {/* Changed logo name */}
            UpBartr
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col flex-1 overflow-y-auto pt-5 pb-4">
          <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 mb-4">
            <img
              className="h-10 w-10 rounded-full object-cover mr-3"
              src={currentUserProfile?.avatar || 'https://via.placeholder.com/50'}
              alt="User Avatar"
            />
            <div>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {currentUserProfile ? `${currentUserProfile.firstName} ${currentUserProfile.lastName}`.trim() : 'Loading...'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentUserProfile?.username || currentUserProfile?.id}
              </p>
            </div>
          </div>
          <ul className="space-y-1 px-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => setSidebarOpen(false)} // Close sidebar on nav click
                  className={`group flex items-center px-3 py-2 text-base font-medium rounded-md
                    ${
                      // Logic to correctly highlight the active link
                      (item.href === '/dashboard' && currentPath === '/dashboard') || // Exact match for Dashboard root
                      (item.href !== '/dashboard' && currentPath.startsWith(item.href)) // startsWith for other routes
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                >
                  <item.icon
                    className={`mr-4 flex-shrink-0 h-6 w-6
                      ${
                        (item.href === '/dashboard' && currentPath === '/dashboard') ||
                        (item.href !== '/dashboard' && currentPath.startsWith(item.href))
                          ? 'text-emerald-500 dark:text-emerald-300'
                          : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 mx-2">
            <Link
              to="/dashboard/settings"
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center px-3 py-2 text-base font-medium rounded-md
                ${
                  currentPath === '/dashboard/settings'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
            >
              <Settings
                className={`mr-4 flex-shrink-0 h-6 w-6
                  ${
                    currentPath === '/dashboard/settings'
                      ? 'text-emerald-500 dark:text-emerald-300'
                      : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                  }`}
                aria-hidden="true"
              />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-3 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white mt-1"
            >
              <LogOut className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/dashboard" className="flex items-center text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {/* Changed logo name */}
              UpBartr
            </Link>
          </div>
          <nav className="flex flex-col flex-1 overflow-y-auto pt-5 pb-4">
            <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 mb-4">
              <img
                className="h-10 w-10 rounded-full object-cover mr-3"
                src={currentUserProfile?.avatar || 'https://via.placeholder.com/50'}
                alt="User Avatar"
              />
              <div>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {currentUserProfile ? `${currentUserProfile.firstName} ${currentUserProfile.lastName}`.trim() : 'Loading...'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentUserProfile?.username || currentUserProfile?.id}
                </p>
              </div>
            </div>
            <ul className="space-y-1 px-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md
                      ${
                        // Logic to correctly highlight the active link
                        (item.href === '/dashboard' && currentPath === '/dashboard') || // Exact match for Dashboard root
                        (item.href !== '/dashboard' && currentPath.startsWith(item.href)) // startsWith for other routes
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                      }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6
                        ${
                          (item.href === '/dashboard' && currentPath === '/dashboard') ||
                          (item.href !== '/dashboard' && currentPath.startsWith(item.href))
                            ? 'text-emerald-500 dark:text-emerald-300'
                            : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                        }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 mx-2">
              <Link
                to="/dashboard/settings"
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md
                  ${
                    currentPath === '/dashboard/settings'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
              >
                <Settings
                  className={`mr-3 flex-shrink-0 h-6 w-6
                    ${
                      currentPath === '/dashboard/settings'
                        ? 'text-emerald-500 dark:text-emerald-300'
                        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    }`}
                  aria-hidden="true"
                />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white mt-1"
              >
                <LogOut className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top bar (Navbar) */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 flex-shrink-0 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Placeholder for left-aligned content (e.g., search bar or breadcrumbs) */}
            <div className="flex-1 hidden md:block">
                {/* <Search className="w-5 h-5 text-gray-400 mr-2 inline-block" />
                <input type="text" placeholder="Search..." className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-emerald-400" /> */}
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4 ml-auto">
              {/* Create Request Button */}
              <Link
                to="/dashboard/create-request"
                className="hidden md:flex bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 items-center shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Request
              </Link>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
              </button>

              {/* Theme Toggle */}
              <ThemeToggle size="md" />

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={currentUserProfile?.avatar || 'https://via.placeholder.com/50'}
                    alt="User Avatar"
                  />
                  <span className="hidden sm:block text-gray-800 dark:text-white text-sm font-medium">
                    {currentUserProfile?.firstName || 'Guest'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-10">
                    <Link
                      to="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="inline-block w-4 h-4 mr-2" />
                      Your Profile
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Settings className="inline-block w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700"
                    >
                      <LogOut className="inline-block w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content - this area will scroll */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
