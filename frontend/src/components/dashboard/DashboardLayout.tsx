import React, { useState } from 'react';
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

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'My Requests', href: '/dashboard/my-requests', icon: FileText },
  { name: 'My Applications', href: '/dashboard/my-applications', icon: Send },
  { name: 'Browse Skills', href: '/dashboard/browse', icon: Search },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentUser = {
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 4.9,
    completedTrades: 23
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
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

        {/* User info */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-100"
            />
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
              <p className="text-xs text-gray-600">⭐ {currentUser.rating} • {currentUser.completedTrades} trades</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
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

        {/* Bottom actions */}
        <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0">
          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
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
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}