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
  FileText,
  AlertCircle
} from 'lucide-react';
import { SkeletonCardReq } from '../lib/skeleton';
import { api } from '../utils/setAuthToken'; // Import the configured axios instance
import { useNavigate } from 'react-router-dom';

// Define the SkillRequestStatus enum to match your Prisma schema
enum SkillRequestStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  CLOSED = 'CLOSED',
}

// Define the Application status enum for applications within a request
enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHWITHDRAWN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

// Interface for an application nested within a skill request
interface ApplicationInRequest {
  id: string; // Changed from number to string (cuid)
  status: ApplicationStatus;
  applicant: {
    id: string; // Added applicant ID
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
  };
}

// Interface for a transformed skill request to be displayed
interface TransformedRequest {
  id: string; // Changed from number to string (cuid)
  title: string;
  description: string;
  skillNeeded: string;
  skillOffered: string;
  category: string;
  status: SkillRequestStatus; // Use the enum
  applications: ApplicationInRequest[]; // Array of applications
  views: number; // Placeholder, as backend currently doesn't provide this directly
  createdAt: string; // ISO string date
  deadline: string; // ISO string date
  isRemote: boolean;
  estimatedDuration: string;
  location: string;
  tags: string[];
  acceptedApplicant?: string; // Derived field
}

const statusColors = {
  [SkillRequestStatus.OPEN]: 'bg-green-100 text-green-800',
  [SkillRequestStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [SkillRequestStatus.COMPLETED]: 'bg-purple-100 text-purple-800',
  [SkillRequestStatus.CANCELLED]: 'bg-red-100 text-red-800',
  [SkillRequestStatus.CLOSED]: 'bg-gray-100 text-gray-800',
};

export default function MyRequests() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [requests, setRequests] = useState<TransformedRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewDetails = (requestId: string) => {
    // Navigate to a dedicated skill request detail page
    navigate(`/dashboard/requests/${requestId}`);
  };

  // Function to fetch requests
  const fetchMyRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch user profile which contains their skill requests
      const response = await api.get('/api/users/profile');
      const userProfile = response.data;
      const fetchedRequests: TransformedRequest[] = userProfile.skillRequests.map((req: any) => ({
        id: req.id,
        title: req.title,
        description: req.description,
        skillNeeded: req.skillNeeded,
        skillOffered: req.skillOffered,
        category: req.category,
        status: req.status as SkillRequestStatus, // Cast to enum
        applications: req.applications.map((app: any) => ({
          id: app.id,
          status: app.status as ApplicationStatus,
          applicant: {
            id: app.applicant.id,
            firstName: app.applicant.firstName,
            lastName: app.applicant.lastName,
            username: app.applicant.username,
            avatar: app.applicant.avatar,
          },
        })),
        views: 0, // Assuming views are not directly available from this endpoint yet
        createdAt: req.createdAt,
        deadline: req.deadline,
        isRemote: req.isRemote,
        estimatedDuration: req.estimatedDuration,
        location: req.location,
        tags: req.tags,
        // Determine acceptedApplicant if needed based on applications status
        acceptedApplicant: req.applications.find((app: any) => app.status === ApplicationStatus.ACCEPTED)?.applicant.firstName + ' ' + req.applications.find((app: any) => app.status === ApplicationStatus.ACCEPTED)?.applicant.lastName,
      }));
      setRequests(fetchedRequests);
    } catch (err: any) {
      console.error('Failed to fetch my requests:', err);
      setError(err.response?.data?.error || 'Failed to load your skill requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []); // Fetch once on component mount

  const handleMenuToggle = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleEditRequest = (id: string) => {
    // Implement navigation to edit page
    console.log('Edit request:', id);
    setOpenMenuId(null);
  };

  const handleUpdateStatus = async (id: string, newStatus: SkillRequestStatus) => {
    try {
      await api.put(`/api/skillreqs/${id}`, { status: newStatus });
      // Update the local state to reflect the change
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === id ? { ...req, status: newStatus } : req
        )
      );
      setOpenMenuId(null);
    } catch (err: any) {
      console.error(`Failed to update request status to ${newStatus}:`, err);
      setError(err.response?.data?.error || `Failed to update request status. Please try again.`);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      await api.delete(`/api/skillreqs/${id}`);
      // Remove the request from the local state
      setRequests(prevRequests => prevRequests.filter(req => req.id !== id));
      setOpenMenuId(null);
    } catch (err: any) {
      console.error('Failed to delete request:', err);
      setError(err.response?.data?.error || 'Failed to delete request. Please try again.');
    }
  };

  const filteredRequests = requests.filter((request) => {
    if (selectedTab === 'all') return true;
    return request.status.toLowerCase().replace('_', '-') === selectedTab;
  });

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Skill Requests</h1>
        <button
          onClick={() => console.log('Navigate to create request')}
          className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Request
        </button>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['all', 'open', 'in-progress', 'completed', 'cancelled', 'closed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`${
                selectedTab === tab
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
            </button>
          ))}
        </nav>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCardReq />
          <SkeletonCardReq />
          <SkeletonCardReq />
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md flex items-center mb-4" role="alert">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && filteredRequests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <span
                    className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                      statusColors[request.status]
                    }`}
                  >
                    {request.status.replace('_', ' ')}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => handleMenuToggle(request.id)}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {openMenuId === request.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                        <button
                          onClick={() => handleEditRequest(request.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="w-4 h-4 mr-3" />
                          Edit Request
                        </button>
                        {request.status === SkillRequestStatus.OPEN && (
                          <button
                            onClick={() => handleUpdateStatus(request.id, SkillRequestStatus.CLOSED)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Pause className="w-4 h-4 mr-3" />
                            Close Request
                          </button>
                        )}
                        {request.status === SkillRequestStatus.CLOSED && (
                          <button
                            onClick={() => handleUpdateStatus(request.id, SkillRequestStatus.OPEN)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Play className="w-4 h-4 mr-3" />
                            Reopen Request
                          </button>
                        )}
                        <hr className="my-1" />
                        <button
                          onClick={() => handleDeleteRequest(request.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-3" />
                          Delete Request
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{request.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{request.description}</p>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Duration: {request.estimatedDuration}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{request.applications.length} Applications</span>
                </div>
                {request.acceptedApplicant && (
                  <div className="flex items-center text-emerald-600 text-sm mb-4">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Accepted: {request.acceptedApplicant}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Posted: {formatDate(request.createdAt)}</span>
                  <span>Deadline: {request.deadline ? formatDate(request.deadline) : 'N/A'}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 flex justify-end">
                 <button
                    onClick={() => handleViewDetails(request.id)}
                    className="flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredRequests.length === 0 && !loading && !error && (
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
        </div>
      )}
    </div>
  );
}