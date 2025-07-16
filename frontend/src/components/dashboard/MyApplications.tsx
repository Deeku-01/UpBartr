import { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MessageCircle,
  Calendar,
  FileText
} from 'lucide-react';
import { api } from '../utils/setAuthToken'; // Import the configured axios instance
import { SkeletonCardReq } from '../lib/skeleton'; // Assuming you have a skeleton for applications
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

// Define the ApplicationStatus enum to match your Prisma schema
enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

// Interface for a single application fetched from the backend
interface Application {
  id: string;
  skillRequestId: string;
  applicantId: string;
  message: string;
  proposedTimeline: string;
  portfolio?: string[]; // Corrected: Changed to string[] as per your schema
  experience?: string;
  whyChooseMe?: string;
  status: ApplicationStatus;
  responseMessage?: string;
  respondedAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string; // This is the appliedAt equivalent
  skillRequest: {
    id: string;
    title: string;
    author: {
      id: string; // Added author ID for messaging
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  };
}

// Interface for the full API response structure
interface ApplicationsApiResponse {
  applications: Application[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('all'); // 'all', 'pending', 'accepted', 'rejected', 'in_progress', 'completed'
  const navigate = useNavigate(); // Initialize navigate hook

  const currentUserId = localStorage.getItem('userId'); // Get current user ID from localStorage

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        // Change the type parameter to ApplicationsApiResponse
        const response = await api.get<ApplicationsApiResponse>('/api/skills/my-applications');
        // Access the 'applications' array from the response data
        if (response.data && Array.isArray(response.data.applications)) {
          setApplications(response.data.applications);
          console.log('Applications successfully set. Count:', response.data.applications.length);
        } else {
          console.warn('API response for applications was not in expected format or applications array missing:', response.data);
          setApplications([]); // Default to empty array to prevent errors
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case ApplicationStatus.ACCEPTED:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case ApplicationStatus.REJECTED:
        return <XCircle className="w-4 h-4 text-red-500" />;
      case ApplicationStatus.WITHDRAWN:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      case ApplicationStatus.IN_PROGRESS:
        return <Clock className="w-4 h-4 text-blue-500" />;
      case ApplicationStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: ApplicationStatus) => {
    return status.replace(/_/g, ' ').toLowerCase();
  };

  const filteredApplications = applications.filter(app => {
    if (selectedTab === 'all') return true;
    return app.status.toLowerCase() === selectedTab;
  });

  const handleViewDetails = (applicationId: string) => {
    navigate(`/dashboard/applications/${applicationId}`);
  };

  // New function to handle messaging the author of the skill request
  const handleMessageAuthor = async (authorId: string, skillRequestId: string, skillRequestTitle: string) => {
    if (!currentUserId) {
      console.error('Current user ID not found.');
      return;
    }

    try {
      const response = await api.post('/api/conversations', {
        otherUserId: authorId,
        skillRequestId: skillRequestId,
      });

      const { conversationId, otherParticipantId } = response.data;
      navigate(`/dashboard/messages/${conversationId}/${otherParticipantId}`);
    } catch (err) {
      console.error('Error initiating conversation:', err);
      setError('Failed to start conversation. Please try again.');
    }
  };


  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Applications</h1>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['all', 'pending', 'accepted', 'in_progress', 'completed', 'rejected', 'withdrawn'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`${
                selectedTab === tab
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab.replace(/_/g, ' ')}
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!loading && !error && filteredApplications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((application) => {
            // Check if the current user is the author of the skill request
            const isAuthor = currentUserId === application.skillRequest.author.id;

            return (
              <div key={application.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-900 truncate">
                      {application.skillRequest.title}
                    </h2>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      application.status === ApplicationStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                      application.status === ApplicationStatus.ACCEPTED ? 'bg-green-100 text-green-800' :
                      application.status === ApplicationStatus.REJECTED ? 'bg-red-100 text-red-800' :
                      application.status === ApplicationStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                      application.status === ApplicationStatus.COMPLETED ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1">{getStatusText(application.status)}</span>
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <img
                      src={application.skillRequest.author.avatar || 'https://via.placeholder.com/40'}
                      alt={`${application.skillRequest.author.firstName} ${application.skillRequest.author.lastName}`}
                      className="w-6 h-6 rounded-full mr-2 object-cover"
                    />
                    <span>{application.skillRequest.author.firstName} {application.skillRequest.author.lastName}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {application.message}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Applied on: {formatDate(application.createdAt)}</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 flex justify-end space-x-4">
                  <button
                    onClick={() => handleViewDetails(application.id)}
                    className="flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  {/* Only show message button if the current user is NOT the author of the request */}
                  {application.status === ApplicationStatus.ACCEPTED && !isAuthor && (
                    <button
                      onClick={() => handleMessageAuthor(application.skillRequest.author.id, application.skillRequestId, application.skillRequest.title)}
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredApplications.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600 mb-6">
            {selectedTab === 'all'
              ? "You haven't applied to any skill requests yet."
              : `No ${getStatusText(selectedTab as ApplicationStatus)} applications found.`}
          </p>
        </div>
      )}
    </div>
  );
}
