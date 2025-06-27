import { useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  MessageCircle,
  Star,
  Calendar
} from 'lucide-react';

const mockApplications = [
  {
    id: 1,
    skillRequest: {
      title: 'Brand Identity Design for Startup',
      author: 'Elena Rodriguez',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    },
    status: 'ACCEPTED',
    appliedAt: '2024-01-20',
    respondedAt: '2024-01-22',
    message: 'I\'m very interested in this opportunity and believe my skills would be a perfect match...',
    responseMessage: 'Great application! I\'d love to work with you. Let\'s schedule a call to discuss details.',
    proposedTimeline: '3 weeks',
    startedAt: '2024-01-25'
  },
  {
    id: 2,
    skillRequest: {
      title: 'Learn Music Production Basics',
      author: 'Ryan Mitchell',
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    },
    status: 'PENDING',
    appliedAt: '2024-01-18',
    message: 'I have extensive experience in music production and would love to share my knowledge...',
    proposedTimeline: '6 weeks'
  },
  {
    id: 3,
    skillRequest: {
      title: 'Personal Fitness Training Program',
      author: 'Maya Thompson',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    },
    status: 'REJECTED',
    appliedAt: '2024-01-15',
    respondedAt: '2024-01-17',
    message: 'I\'m a certified personal trainer with 5+ years of experience...',
    responseMessage: 'Thank you for your application. We decided to go with someone local for in-person sessions.',
    proposedTimeline: '2 months'
  },
  {
    id: 4,
    skillRequest: {
      title: 'Advanced Photography Techniques',
      author: 'Marcus Johnson',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    },
    status: 'COMPLETED',
    appliedAt: '2023-12-10',
    respondedAt: '2023-12-12',
    completedAt: '2024-01-15',
    message: 'I\'d love to learn advanced photography techniques from a professional...',
    responseMessage: 'Perfect! Your enthusiasm for learning is exactly what I\'m looking for.',
    proposedTimeline: '4 weeks',
    rating: 5,
    review: 'Excellent collaboration! Sarah was a dedicated student and picked up techniques quickly.'
  }
];

const statusConfig = {
  PENDING: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    iconColor: 'text-yellow-600'
  },
  ACCEPTED: {
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-600'
  },
  REJECTED: {
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
    iconColor: 'text-red-600'
  },
  IN_PROGRESS: {
    color: 'bg-blue-100 text-blue-800',
    icon: AlertCircle,
    iconColor: 'text-blue-600'
  },
  COMPLETED: {
    color: 'bg-purple-100 text-purple-800',
    icon: CheckCircle,
    iconColor: 'text-purple-600'
  }
};

export default function MyApplications() {
  const [selectedTab, setSelectedTab] = useState('all');

  const tabs = [
    { id: 'all', name: 'All Applications', count: mockApplications.length },
    { id: 'pending', name: 'Pending', count: mockApplications.filter(a => a.status === 'PENDING').length },
    { id: 'accepted', name: 'Accepted', count: mockApplications.filter(a => a.status === 'ACCEPTED').length },
    { id: 'completed', name: 'Completed', count: mockApplications.filter(a => a.status === 'COMPLETED').length }
  ];

  const filteredApplications = selectedTab === 'all' 
    ? mockApplications 
    : mockApplications.filter(a => a.status.toLowerCase() === selectedTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-1">Track your skill exchange applications and their status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockApplications.filter(a => a.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockApplications.filter(a => a.status === 'ACCEPTED').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockApplications.filter(a => a.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Star className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">75%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => {
          const config = statusConfig[application.status as keyof typeof statusConfig];
          const StatusIcon = config.icon;
          
          return (
            <div key={application.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={application.skillRequest.avatar}
                    alt={application.skillRequest.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{application.skillRequest.title}</h3>
                    <p className="text-sm text-gray-600">by {application.skillRequest.author}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                    {application.status.replace('_', ' ')}
                  </span>
                  <StatusIcon className={`w-5 h-5 ${config.iconColor}`} />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Your Application Message:</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    "{application.message}"
                  </p>
                </div>

                {application.responseMessage && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Response:</h4>
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      "{application.responseMessage}"
                    </p>
                  </div>
                )}

                {application.review && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Review Received:</h4>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        {[...Array(application.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                        <span className="ml-2 text-sm font-medium text-gray-900">{application.rating}/5</span>
                      </div>
                      <p className="text-sm text-gray-600">"{application.review}"</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Applied: {new Date(application.appliedAt).toLocaleDateString()}
                    </div>
                    {application.respondedAt && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Responded: {new Date(application.respondedAt).toLocaleDateString()}
                      </div>
                    )}
                    <div>
                      Timeline: {application.proposedTimeline}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center text-emerald-600 hover:text-emerald-700">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                    {application.status === 'ACCEPTED' && (
                      <button className="flex items-center text-blue-600 hover:text-blue-700">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600 mb-6">
            {selectedTab === 'all' 
              ? "You haven't applied to any skill requests yet." 
              : `No ${selectedTab} applications found.`}
          </p>
          <button className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300">
            Browse Skill Requests
          </button>
        </div>
      )}
    </div>
  );
}