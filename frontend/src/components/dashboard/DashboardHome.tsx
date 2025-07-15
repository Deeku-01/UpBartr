import React, { useEffect, useState } from 'react';
import {
  Users,
  FileText,
  MessageCircle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { api } from '../utils/setAuthToken';
import SkeletonCard from '../lib/skeleton';

// Define interfaces for the fetched data
interface ApplicationStats {
  submitted: {
    total: number;
    pending: number;
    accepted: number;
    completed: number;
  };
  received: {
    total: number;
    pending: number;
  };
}

interface ConversationStats {
  unreadMessages: number;
}

export default function DashboardHome() {
  const [appStats, setAppStats] = useState<ApplicationStats | null>(null);
  const [convStats, setConvStats] = useState<ConversationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // No need to manually get token or create config object here
        // The `api` instance's interceptor handles it.

        // Fetch application statistics
        // The baseURL is already configured in api instance
        const appStatsResponse = await api.get<ApplicationStats>(`/api/skills/stats`);
        setAppStats(appStatsResponse.data);

        // Fetch conversation statistics
        const convStatsResponse = await api.get<ConversationStats>(`/api/conversations/stats`);
        setConvStats(convStatsResponse.data);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        // The interceptor in setAuthToken.ts can handle 401s globally.
        // For other errors, you can still display them here.
        // if (api.isAxiosError(err) && err.response) { // Use api.isAxiosError
        //   setError(err.response.data.error || 'Failed to fetch data');
        // } else {
        //   setError((err as Error).message || 'An unexpected error occurred');
        // }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      name: 'Active Requests',
      value: appStats?.submitted.pending.toString() || '0', // Assuming 'pending' submitted applications are active requests
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      name: 'Applications Sent',
      value: appStats?.submitted.total.toString() || '0',
      icon: Users,
      color: 'bg-emerald-500',
    },
    {
      name: 'Completed Trades',
      value: appStats?.submitted.completed.toString() || '0', // Assuming completed submitted applications are completed trades
      icon: CheckCircle,
      color: 'bg-purple-500',
    },
    {
      name: 'Unread Messages', // Changed from 'Messages' for more specificity
      value: convStats?.unreadMessages.toString() || '0',
      icon: MessageCircle,
      color: 'bg-orange-500',
    },
  ];

  // Dummy data for Recent Activity (you'll replace this with actual data from your backend later)
  const recentActivity = [
    {
      id: 1,
      type: 'application',
      title: 'New application received',
      description: 'Marcus Johnson applied to your "React Development" request',
      time: '2 hours ago',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    },
    {
      id: 2,
      type: 'message',
      title: 'New message',
      description: 'Elena Rodriguez sent you a message about Spanish tutoring',
      time: '4 hours ago',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    },
    {
      id: 3,
      type: 'trade',
      title: 'Trade completed',
      description: 'You completed a trade for "Logo Design"',
      time: '1 day ago',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
        <div className="text-red-500 bg-red-100 border border-red-400 rounded-md p-4">
          <p className="font-semibold">Error loading dashboard data:</p>
          <p>{error}</p>
          <p className="mt-2">Please ensure your backend is running and you are authenticated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item) => (
          <div
            key={item.name}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center">
              <div
                className={`w-12 h-12 ${item.color} bg-opacity-20 rounded-full flex items-center justify-center mr-4`}
              >
                <item.icon className={`w-6 h-6 ${item.color.replace('bg', 'text')}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {item.name}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    {activity.avatar && (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={activity.avatar}
                        alt=""
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No recent activity.</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <button
              className="flex items-center justify-between w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-emerald-200 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors group"
              onClick={() => (window.location.href = '/dashboard/create-request')}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Create New Request
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
            </button>

            <button
              className="flex items-center justify-between w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
              onClick={() => (window.location.href = '/dashboard/browse')}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Browse Skills
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}