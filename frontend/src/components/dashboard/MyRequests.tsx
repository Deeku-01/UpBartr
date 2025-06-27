import { useState, useEffect } from 'react';
import axios from 'axios';
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


import {SkeletonCardReq} from '../lib/skeleton';

interface Application {
  id: number;
  status: string;
  skillRequest: {
    id: number;
    title: string;
    description: string;
    skillNeeded: string;
    skillOffered: string;
    category: string;
    status: string;
    createdAt: string;
    author: {
      id: number;
      firstName: string;
      lastName: string;
      username: string;
      avatar: string;
      rating: number;
    };
  };
  review?: {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
  };
}

interface TransformedRequest {
  id: number;
  title: string;
  description: string;
  skillNeeded: string;
  skillOffered: string;
  category: string;
  status: string;
  applications: number;
  views: number;
  createdAt: string;
  deadline: string;
  isRemote: boolean;
  acceptedApplicant?: string;
}

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
  const [requests, setRequests] = useState<TransformedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform backend response to frontend format
  const transformApplicationsToRequests = (applications: Application[]): TransformedRequest[] => {
    return applications.map(app => ({
      id: app.skillRequest.id,
      title: app.skillRequest.title,
      description: app.skillRequest.description,
      skillNeeded: app.skillRequest.skillNeeded,
      skillOffered: app.skillRequest.skillOffered,
      category: app.skillRequest.category,
      status: app.skillRequest.status,
      applications: 0, // You'll need to get this from another endpoint or include in backend
      views: 0, // You'll need to get this from another endpoint or include in backend
      createdAt: app.skillRequest.createdAt,
      deadline: app.skillRequest.createdAt, // Adjust this based on your data structure
      isRemote: true, // Adjust this based on your data structure
      acceptedApplicant: app.skillRequest.status === 'IN_PROGRESS' || app.skillRequest.status === 'COMPLETED' 
        ? `${app.skillRequest.author.firstName} ${app.skillRequest.author.lastName}` 
        : undefined
    }));
  };

  // Fetch applications from API
  const fetchMyApplications = async (status: string = 'ALL') => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken'); // Adjust based on how you store the token
      
      const response = await axios.get('http://localhost:3000/api/skills/my-applications', {
        headers: {
          'authorization': `${token}`
        },
        params: {
          status: status,
          page: 1,
          limit: 11, // Adjust as needed
          sortBy: 'createdAt',
          sortOrder: 'desc'
        }
      });

      const transformedRequests = transformApplicationsToRequests(response.data.applications);
      setRequests(transformedRequests);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to fetch applications. Please try again.');
    } finally {
      const promise = await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      setLoading(false);
    }
  };

  // Fetch data on component mount and when tab changes

  useEffect(() => {
    // Always fetch all data first, then filter on frontend
    fetchMyApplications('ALL');
  }, [selectedTab]);

  const tabs = [
    { id: 'all', name: 'All Requests', count: requests.length },
    { id: 'open', name: 'Open', count: requests.filter(r => r.status === 'OPEN').length },
    { id: 'in_progress', name: 'In Progress', count: requests.filter(r => r.status === 'IN_PROGRESS').length },
    { id: 'completed', name: 'Completed', count: requests.filter(r => r.status === 'COMPLETED').length }
  ];

  const filteredRequests = selectedTab === 'all' 
    ? requests 
    : requests.filter(r => r.status.toLowerCase() === selectedTab);


  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Skill Requests</h1>
            <p className="text-gray-600 mt-1">Manage your posted skill requests and track applications</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-12 h-12 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Requests</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => fetchMyApplications()}
            className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Skill Requests</h1>
          <p className="text-gray-600 mt-1">Manage your posted skill requests and track applications</p>
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

      {/* loading Skeleton *5 */}
      {loading && (
        <div>
          {Array.from({ length: 2 }).map((_, index) => (
            <SkeletonCardReq key={index} />
          ))}

        </div>
      )}


      {/* Requests List */}
      {!loading &&(
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
                    Created: {new Date(request.createdAt).toLocaleDateString()}
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
      )}

      {filteredRequests.length === 0 && !loading && (
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