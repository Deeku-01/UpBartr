// src/components/dashboard/SkillRequestDetails.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/setAuthToken';
import {
  ArrowLeft,
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
  Users,
} from 'lucide-react';
import SkeletonDetails from '../lib/skeleton';

// Define enums to match your Prisma schema
enum SkillRequestStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  CLOSED = 'CLOSED',
}

enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

// Interface for an application nested within a skill request
interface ApplicationInRequest {
  id: string;
  status: ApplicationStatus;
  applicant: {
    id: string; // Added applicant ID
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
  };
  message: string; // To show a snippet of the application message
  createdAt: string;
}

// Interface for the detailed skill request data
interface SkillRequestDetail {
  id: string;
  authorId: string;
  title: string;
  description: string;
  skillNeeded: string;
  skillOffered: string;
  category: string;
  estimatedDuration?: string;
  deadline?: string;
  location?: string;
  isRemote: boolean;
  requirements: string[];
  deliverables: string[];
  tags: string[];
  status: SkillRequestStatus;
  acceptedApplicantId?: string;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
    rating: number;
    totalRatings: number;
    location?: string;
    createdAt: string;
  };
  applications: ApplicationInRequest[]; // Include applications
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

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


export default function SkillRequestDetails() {
  const { requestId } = useParams<{ requestId: string }>();
  const [skillRequest, setSkillRequest] = useState<SkillRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem('userId'); // Get current user ID from localStorage

  useEffect(() => {
    const fetchSkillRequestDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<SkillRequestDetail>(`/api/skillreqs/${requestId}`);
        setSkillRequest(response.data);
      } catch (err) {
        console.error('Error fetching skill request details:', err);
        setError('Failed to load skill request details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkillRequestDetails();
  }, [requestId]);

  const handleMessageUser = async (otherUserId: string, relatedApplicationId?: string) => {
    if (!currentUserId) {
      console.error('Current user ID not found.');
      return;
    }

    try {
      const response = await api.post('/api/conversations', {
        otherUserId: otherUserId,
        skillRequestId: requestId, // Link conversation to this skill request
        applicationId: relatedApplicationId, // Link to specific application if applicable
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

  if (!skillRequest) {
    return (
      <div className="text-center py-12 text-gray-500">
        <AlertCircle className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Skill Request not found.</h3>
        <p>The skill request you are looking for does not exist or you do not have permission to view it.</p>
        <Link to="/dashboard/my-requests" className="text-emerald-600 hover:underline mt-4 block">
          Go back to My Requests
        </Link>
      </div>
    );
  }

  const isAuthorOfRequest = currentUserId === skillRequest.authorId;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Link to="/dashboard/my-requests" className="text-gray-500 hover:text-gray-700 mr-4">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Skill Request Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Skill Request Details */}
        <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">{skillRequest.title}</h2>
              <p className="text-gray-600 text-sm">
                Category: <span className="font-medium">{skillRequest.category}</span>
              </p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              skillRequest.status === SkillRequestStatus.OPEN ? 'bg-green-100 text-green-800' :
              skillRequest.status === SkillRequestStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
              skillRequest.status === SkillRequestStatus.COMPLETED ? 'bg-purple-100 text-purple-800' :
              skillRequest.status === SkillRequestStatus.CANCELLED ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {skillRequest.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{skillRequest.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                <Layers className="w-5 h-5 mr-2 text-gray-500" /> Skill Needed
              </h3>
              <p className="text-gray-700">{skillRequest.skillNeeded}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-gray-500" /> Skill Offered
              </h3>
              <p className="text-gray-700">{skillRequest.skillOffered}</p>
            </div>
          </div>

          {skillRequest.estimatedDuration && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-500" /> Estimated Duration
              </h3>
              <p className="text-gray-700">{skillRequest.estimatedDuration}</p>
            </div>
          )}

          {skillRequest.deadline && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-500" /> Deadline
              </h3>
              <p className="text-gray-700">{formatDate(skillRequest.deadline)}</p>
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-gray-500" /> Location
            </h3>
            <p className="text-gray-700">{skillRequest.isRemote ? 'Remote' : skillRequest.location || 'Not specified'}</p>
          </div>

          {skillRequest.requirements.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-500" /> Requirements
              </h3>
              <ul className="list-disc list-inside text-gray-700">
                {skillRequest.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {skillRequest.deliverables.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-gray-500" /> Deliverables
              </h3>
              <ul className="list-disc list-inside text-gray-700">
                {skillRequest.deliverables.map((del, index) => (
                  <li key={index}>{del}</li>
                ))}
              </ul>
            </div>
          )}

          {skillRequest.tags.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-gray-500" /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillRequest.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 mt-6 pt-4 border-t border-gray-200">
            <p>Posted on: {formatDate(skillRequest.createdAt)}</p>
          </div>
        </div>

        {/* Author Profile Summary and Applications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col items-center text-center mb-6">
            <img
              src={skillRequest.author.avatar || 'https://via.placeholder.com/100'}
              alt={`${skillRequest.author.firstName} ${skillRequest.author.lastName}`}
              className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-emerald-400"
            />
            <h3 className="text-xl font-semibold text-gray-900">
              {skillRequest.author.firstName} {skillRequest.author.lastName}
            </h3>
            <p className="text-gray-600">@{skillRequest.author.username}</p>
            <p className="text-sm text-gray-500 mt-1">Rating: {skillRequest.author.rating.toFixed(1)} ({skillRequest.author.totalRatings} reviews)</p>
            {skillRequest.author.location && (
              <p className="text-gray-700 text-sm mt-3 flex items-center">
                <MapPin className="w-4 h-4 mr-1" /> {skillRequest.author.location}
              </p>
            )}
            <Link
              to={`/dashboard/profile/${skillRequest.author.id}`}
              className="mt-3 text-emerald-600 hover:underline flex items-center text-sm font-medium"
            >
              <Eye className="w-4 h-4 mr-1" /> View Full Profile
            </Link>
          </div>

          {/* Applications section (only visible to author) */}
          {isAuthorOfRequest && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-gray-500" /> Applications ({skillRequest.applications.length})
              </h3>
              {skillRequest.applications.length > 0 ? (
                <div className="space-y-4">
                  {skillRequest.applications.map((app) => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-4 flex items-start space-x-3">
                      <img
                        src={app.applicant.avatar || 'https://via.placeholder.com/40'}
                        alt={`${app.applicant.firstName} ${app.applicant.lastName}`}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {app.applicant.firstName} {app.applicant.lastName}
                          </h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            app.status === ApplicationStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                            app.status === ApplicationStatus.ACCEPTED ? 'bg-green-100 text-green-800' :
                            app.status === ApplicationStatus.REJECTED ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {getStatusIcon(app.status)}
                            <span className="ml-1">{getStatusText(app.status)}</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{app.message}</p>
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/dashboard/applications/${app.id}`}
                            className="text-emerald-600 hover:underline text-sm flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" /> View Application
                          </Link>
                          {/* Message button for applicant */}
                          {(app.status === ApplicationStatus.ACCEPTED || app.status === ApplicationStatus.IN_PROGRESS) && (
                            <button
                              onClick={() => handleMessageUser(app.applicant.id, app.id)}
                              className="text-blue-600 hover:underline text-sm flex items-center"
                            >
                              <MessageCircle className="w-4 h-4 mr-1" /> Message
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center">No applications for this skill request yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
