
import {  
  Users, 
  FileText, 
  MessageCircle, 
  Star,
  Clock,
  ArrowRight,
  Eye,
  CheckCircle
} from 'lucide-react';

const stats = [
  { name: 'Active Requests', value: '3', change: '+2', icon: FileText, color: 'bg-blue-500' },
  { name: 'Applications Sent', value: '8', change: '+1', icon: Users, color: 'bg-emerald-500' },
  { name: 'Completed Trades', value: '23', change: '+3', icon: CheckCircle, color: 'bg-purple-500' },
  { name: 'Messages', value: '12', change: '+5', icon: MessageCircle, color: 'bg-orange-500' },
];

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
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
  },
  {
    id: 3,
    type: 'completed',
    title: 'Trade completed',
    description: 'Photography lessons with David Park marked as complete',
    time: '1 day ago',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
  }
];

const activeRequests = [
  {
    id: 1,
    title: 'Need React Developer for Portfolio Website',
    applications: 12,
    views: 89,
    timeLeft: '5 days',
    status: 'active'
  },
  {
    id: 2,
    title: 'Looking for Spanish Conversation Partner',
    applications: 6,
    views: 34,
    timeLeft: '12 days',
    status: 'active'
  },
  {
    id: 3,
    title: 'Digital Marketing Strategy Help',
    applications: 3,
    views: 21,
    timeLeft: '8 days',
    status: 'active'
  }
];

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Sarah! 👋</h1>
        <p className="text-emerald-100 mb-6">
          You have 5 new notifications and 3 pending applications to review.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Review Applications
          </button>
          <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
            Browse New Skills
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-emerald-600 mt-1">
                  {stat.change} this week
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <img
                    src={activity.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View all activity
            </button>
          </div>
        </div>

        {/* Active Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your Active Requests</h2>
              <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                View all
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activeRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-200 transition-colors">
                  <h3 className="font-medium text-gray-900 mb-3">{request.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {request.applications} applications
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {request.views} views
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {request.timeLeft} left
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50 transition-colors group">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="font-medium text-gray-900">Create New Request</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
          </button>
          
          <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-colors group">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-medium text-gray-900">Browse Skills</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
          </button>
          
          <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-200 hover:bg-purple-50 transition-colors group">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-medium text-gray-900">Update Profile</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
          </button>
        </div>
      </div>
    </div>
  );
}