import { useState } from 'react';
import { 
  Plus, 
  Eye, 
  Users, 
  Clock, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Pause,
  Play,
  CheckCircle,
  FileText
} from 'lucide-react';

const mockRequests = [
  {
    id: 1,
    title: 'Need React Developer for Portfolio Website',
    description: 'Looking for an experienced React developer to help me build a modern portfolio website...',
    skillNeeded: 'React Development',
    skillOffered: 'Professional Photography',
    category: 'Technology',
    status: 'OPEN',
    applications: 12,
    views: 89,
    createdAt: '2024-01-15',
    deadline: '2024-02-15',
    isRemote: true
  },
  {
    id: 2,
    title: 'Looking for Spanish Conversation Partner',
    description: 'Seeking a native Spanish speaker for regular conversation practice...',
    skillNeeded: 'Spanish Tutoring',
    skillOffered: 'Guitar Lessons',
    category: 'Language',
    status: 'IN_PROGRESS',
    applications: 6,
    views: 34,
    createdAt: '2024-01-10',
    deadline: '2024-03-10',
    isRemote: true,
    acceptedApplicant: 'David Park'
  },
  {
    id: 3,
    title: 'Digital Marketing Strategy Help',
    description: 'Need help developing a comprehensive digital marketing strategy...',
    skillNeeded: 'Digital Marketing',
    skillOffered: 'Web Development',
    category: 'Business',
    status: 'COMPLETED',
    applications: 8,
    views: 56,
    createdAt: '2023-12-20',
    deadline: '2024-01-20',
    isRemote: true,
    acceptedApplicant: 'Elena Rodriguez'
  }
];

const statusColors = {
  OPEN: 'bg-green-100 text-green-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-purple-100 text-purple-800',
  CANCELLED: 'bg-red-100 text-red-800',
  CLOSED: 'bg-gray-100 text-gray-800'
};

export default function MyRequests() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [showDropdown, setShowDropdown] = useState<number | null>(null);

  const tabs = [
    { id: 'all', name: 'All Requests', count: mockRequests.length },
    { id: 'open', name: 'Open', count: mockRequests.filter(r => r.status === 'OPEN').length },
    { id: 'in_progress', name: 'In Progress', count: mockRequests.filter(r => r.status === 'IN_PROGRESS').length },
    { id: 'completed', name: 'Completed', count: mockRequests.filter(r => r.status === 'COMPLETED').length }
  ];

  const filteredRequests = selectedTab === 'all' 
    ? mockRequests 
    : mockRequests.filter(r => r.status.toLowerCase() === selectedTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Skill Requests</h1>
          <p className="text-gray-600 mt-1">Manage your posted skill requests and track applications</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Create New Request
        </button>
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

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[request.status as keyof typeof statusColors]}`}>
                    {request.status.replace('_', ' ')}
                  </span>
                  {request.isRemote && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      Remote OK
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{request.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">Needs:</span>
                    <span className="text-sm text-gray-700 ml-2">{request.skillNeeded}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Offers:</span>
                    <span className="text-sm text-gray-700 ml-2">{request.skillOffered}</span>
                  </div>
                </div>

                {request.acceptedApplicant && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Working with: <span className="font-medium">{request.acceptedApplicant}</span>
                    </p>
                  </div>
                )}
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {request.applications} applications
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {request.views} views
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Deadline: {new Date(request.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(showDropdown === request.id ? null : request.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                
                {showDropdown === request.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Eye className="w-4 h-4 mr-3" />
                        View Details
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Edit className="w-4 h-4 mr-3" />
                        Edit Request
                      </button>
                      {request.status === 'OPEN' && (
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Pause className="w-4 h-4 mr-3" />
                          Pause Request
                        </button>
                      )}
                      {request.status === 'CLOSED' && (
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Play className="w-4 h-4 mr-3" />
                          Reopen Request
                        </button>
                      )}
                      <hr className="my-1" />
                      <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-3" />
                        Delete Request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-600 mb-6">
            {selectedTab === 'all' 
              ? "You haven't created any skill requests yet." 
              : `No ${selectedTab.replace('_', ' ')} requests found.`}
          </p>
          <button className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300">
            Create Your First Request
          </button>
        </div>
      )}
    </div>
  );
}