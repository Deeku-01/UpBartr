import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { api } from '../utils/setAuthToken';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Mail,
  MapPin,
  Calendar,
  Layers,
  Tag,
  FileText,
  MessageCircle,
  Eye,
  ArrowLeft // Import ArrowLeft for the back button
} from 'lucide-react';
import  SkeletonDetails  from '../lib/skeleton'; // Assuming you have a skeleton for details pages

// Define the ApplicationStatus enum to match your Prisma schema
enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

// Interface for the detailed application data
interface ApplicationDetail {
  id: string;
  skillRequestId: string;
  applicantId: string;
  message: string;
  proposedTimeline: string;
  portfolio: string[]; // Changed to array of strings
  experience?: string;
  whyChooseMe?: string;
  status: ApplicationStatus;
  responseMessage?: string;
  respondedAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  applicant: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
    rating: number;
    totalRatings: number;
    location?: string;
    createdAt: string;
  };
  skillRequest: {
    id: string;
    title: string;
    authorId: string; // Add authorId to check if current user is the author
    category: string;
    skillNeeded: string;
    skillOffered: string;
    estimatedDuration?: string;
    deadline?: string;
    location?: string;
    isRemote: boolean;
    requirements: string[];
    deliverables: string[];
    tags: string[];
    status: string; // SkillRequestStatus
    createdAt: string;
  };
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function ApplicationDetails() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const navigate = useNavigate(); // Initialize navigate hook

  const currentUserId = localStorage.getItem('userId'); // Get current user ID from localStorage

  // Helper functions for status display
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

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<ApplicationDetail>(`/api/skills/${applicationId}`);
        setApplication(response.data);
      } catch (err) {
        console.error('Error fetching application details:', err);
        setError('Failed to load application details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [applicationId]);

  const handleStatusUpdate = async (newStatus: ApplicationStatus) => {
    if (!application || !currentUserId) return;

    setIsUpdatingStatus(true);
    try {
      let endpoint = '';
      switch (newStatus) {
        case ApplicationStatus.ACCEPTED:
          endpoint = `/api/skills/applications/${application.id}/accept`;
          break;
        case ApplicationStatus.REJECTED:
          endpoint = `/api/skills/applications/${application.id}/reject`;
          break;
        case ApplicationStatus.IN_PROGRESS:
          endpoint = `/api/skills/applications/${application.id}/start`;
          break;
        case ApplicationStatus.COMPLETED:
          endpoint = `/api/skills/applications/${application.id}/complete`;
          break;
        default:
          console.warn('Unsupported status update:', newStatus);
          setIsUpdatingStatus(false);
          return;
      }

      const response = await api.patch(endpoint);
      setApplication(response.data.application); // Assuming backend returns updated application
      // Use a custom modal instead of alert in production
      // For now, using a simple alert as per previous instruction, but recommend replacing
      alert(`Application status updated to ${newStatus.replace(/_/g, ' ')}!`);
    } catch (err: any) {
      console.error(`Error updating status to ${newStatus}:`, err);
      setError(err.response?.data?.error || 'Failed to update application status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleMessageUser = async (otherUserId: string, relatedSkillRequestId?: string, relatedApplicationId?: string) => {
    if (!currentUserId) {
      console.error('Current user ID not found.');
      return;
    }

    try {
      const response = await api.post('/api/conversations', {
        otherUserId: otherUserId,
        skillRequestId: relatedSkillRequestId,
        applicationId: relatedApplicationId,
      });

      const { conversationId, otherParticipantId } = response.data;
      navigate(`/dashboard/messages/${conversationId}/${otherParticipantId}`);
    } catch (err) {
      console.error('Error initiating conversation:', err);
      setError('Failed to start conversation. Please try again.');
    }
  };

  if (loading) {
    return <SkeletonDetails />;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-6" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12 text-gray-500">
        <AlertCircle className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Application not found.</h3>
        <p>The application you are looking for does not exist or you do not have permission to view it.</p>
        <Link to="/dashboard/my-applications" className="text-emerald-600 hover:underline mt-4 block">
          Go back to My Applications
        </Link>
      </div>
    );
  }

  const isAuthorOfSkillRequest = currentUserId === application.skillRequest.authorId;
  const isApplicant = currentUserId === application.applicantId;


  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Link to="/dashboard/my-applications" className="text-gray-500 hover:text-gray-700 mr-4">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Application Details */}
        <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">{application.skillRequest.title}</h2>
              <p className="text-gray-600 text-sm">
                Category: <span className="font-medium">{application.skillRequest.category}</span>
              </p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
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

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">My Message</h3>
            <p className="text-gray-700 leading-relaxed">{application.message}</p>
          </div>

          {application.proposedTimeline && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-500" /> Proposed Timeline
              </h3>
              <p className="text-gray-700">{application.proposedTimeline}</p>
            </div>
          )}

          {application.experience && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                <Layers className="w-5 h-5 mr-2 text-gray-500" /> Relevant Experience
              </h3>
              <p className="text-gray-700">{application.experience}</p>
            </div>
          )}

          {application.whyChooseMe && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-gray-500" /> Why Choose Me
              </h3>
              <p className="text-gray-700">{application.whyChooseMe}</p>
            </div>
          )}

          {application.portfolio && application.portfolio.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-500" /> Portfolio
              </h3>
              <ul className="list-disc list-inside text-blue-600">
                {application.portfolio.map((item, index) => (
                  <li key={index}>
                    <a href={item} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-sm text-gray-500 mt-6 pt-4 border-t border-gray-200">
            <p>Applied on: {formatDate(application.createdAt)}</p>
            {application.respondedAt && <p>Responded on: {formatDate(application.respondedAt)}</p>}
            {application.startedAt && <p>Started on: {formatDate(application.startedAt)}</p>}
            {application.completedAt && <p>Completed on: {formatDate(application.completedAt)}</p>}
          </div>

          {/* Action Buttons (only for skill request author) */}
          {isAuthorOfSkillRequest && (
            <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
              {application.status === ApplicationStatus.PENDING && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(ApplicationStatus.ACCEPTED)}
                    disabled={isUpdatingStatus}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingStatus ? 'Accepting...' : 'Accept Application'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(ApplicationStatus.REJECTED)}
                    disabled={isUpdatingStatus}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingStatus ? 'Rejecting...' : 'Reject Application'}
                  </button>
                </>
              )}
              {application.status === ApplicationStatus.ACCEPTED && (
                <button
                  onClick={() => handleStatusUpdate(ApplicationStatus.IN_PROGRESS)}
                  disabled={isUpdatingStatus}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingStatus ? 'Starting...' : 'Mark as In Progress'}
                </button>
              )}
              {application.status === ApplicationStatus.IN_PROGRESS && (
                <button
                  onClick={() => handleStatusUpdate(ApplicationStatus.COMPLETED)}
                  disabled={isUpdatingStatus}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingStatus ? 'Completing...' : 'Mark as Completed'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Applicant Profile Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col items-center text-center mb-6">
            <img
              src={application.applicant.avatar || 'https://via.placeholder.com/100'}
              alt={`${application.applicant.firstName} ${application.applicant.lastName}`}
              className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-emerald-400"
            />
            <h3 className="text-xl font-semibold text-gray-900">
              {application.applicant.firstName} {application.applicant.lastName}
            </h3>
            <p className="text-gray-600">@{application.applicant.username}</p>
            <p className="text-sm text-gray-500 mt-1">Rating: {application.applicant.rating.toFixed(1)} ({application.applicant.totalRatings} reviews)</p>
            {application.applicant.bio && (
              <p className="text-gray-700 text-sm mt-3 italic">"{application.applicant.bio}"</p>
            )}
            <Link
              to={`/dashboard/profile/${application.applicant.id}`}
              className="mt-3 text-emerald-600 hover:underline flex items-center text-sm font-medium"
            >
              <Eye className="w-4 h-4 mr-1" /> View Full Profile
            </Link>
          </div>

          <div className="space-y-3 text-gray-700">
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-3 text-gray-500" />
              <p>{application.applicant.username}</p> {/* Assuming username is also the email for display */}
            </div>
            {application.applicant.location && (
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                <p>{application.applicant.location}</p>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-3 text-gray-500" />
              <p>Member since: {formatDate(application.applicant.createdAt)}</p>
            </div>
          </div>

          {/* Message button for direct chat */}
          {/* Show if current user is the author of the skill request AND application is accepted/in-progress */}
          {isAuthorOfSkillRequest && (application.status === ApplicationStatus.ACCEPTED || application.status === ApplicationStatus.IN_PROGRESS) && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleMessageUser(application.applicant.id, application.skillRequestId, application.id)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Message Applicant
              </button>
            </div>
          )}
          {/* Show if current user is the applicant AND application is accepted/in-progress */}
          {isApplicant && (application.status === ApplicationStatus.ACCEPTED || application.status === ApplicationStatus.IN_PROGRESS) && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleMessageUser(application.skillRequest.authorId, application.skillRequestId, application.id)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Message Author
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
