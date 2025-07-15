// src/components/dashboard/Profile.tsx

import { useEffect, useState } from 'react';
import {
  Camera,
  Edit,
  Star,
  MapPin,
  Calendar,
  Award,
  CheckCircle,
  Plus,
  X,
  Save,
  MessageCircle
} from 'lucide-react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  rating: number;
  totalRatings: number;
  completedTrades: number;
  isVerified: boolean;
  joinedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:3000';

export default function Profile() {
  const { identifier } = useParams<{ identifier?: string }>();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const targetIdentifier = identifier || currentUserId;

        if (!targetIdentifier) {
          setError("User ID not found. Please log in or provide a valid profile identifier.");
          setIsLoading(false);
          return;
        }

        const response = await axios.get<UserProfile>(
          `${API_BASE_URL}/api/users/${targetIdentifier}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        setProfileData(response.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [identifier, currentUserId]);

  const handleMessageUser = async () => {
    if (!profileData || !currentUserId) {
      console.error("Cannot message user: Profile data or current user ID missing.");
      return;
    }

    if (profileData.id === currentUserId) {
      console.warn("Attempted to message self, redirecting to own messages.");
      navigate('/dashboard/messages');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/conversations/new/${profileData.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      const { conversationId } = response.data;

      if (conversationId) {
        navigate(`/dashboard/messages/${conversationId}/${profileData.id}`);
      } else {
        console.error("Failed to get conversation ID from backend.");
        alert("Could not start conversation. Please try again.");
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
      alert('Failed to start conversation. Please ensure the user exists and you are logged in.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>No profile data available.</p>
      </div>
    );
  }

  const isOwnProfile = profileData.id === currentUserId;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8 mb-8">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-400 shadow-md flex-shrink-0">
            <img
              src={profileData.avatar || 'https://via.placeholder.com/128/ccc/white?text=No+Avatar'}
              alt={`${profileData.firstName} ${profileData.lastName}`}
              className="w-full h-full object-cover"
            />
            {isOwnProfile && (
              <button className="absolute bottom-0 right-0 bg-emerald-500 p-2 rounded-full text-white hover:bg-emerald-600 transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="text-center sm:text-left flex-grow">
            <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {profileData.firstName} {profileData.lastName}
              </h1>
              {profileData.isVerified && (
                <CheckCircle className="w-6 h-6 text-emerald-500" /* REMOVED: title="Verified User" */ />
              )}
            </div>
            {profileData.username && (
              <p className="text-gray-500 text-lg mb-2">@{profileData.username}</p>
            )}
            <div className="flex items-center justify-center sm:justify-start text-gray-600 mb-3">
              <Star className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" />
              <span className="font-semibold">{profileData.rating.toFixed(1)}</span>
              <span className="ml-1 text-sm">({profileData.totalRatings} ratings)</span>
              {profileData.location && (
                <>
                  <MapPin className="w-5 h-5 ml-4 mr-1" />
                  <span>{profileData.location}</span>
                </>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              {profileData.bio || 'No bio provided yet.'}
            </p>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              {isOwnProfile ? (
                <>
                  <button className="flex items-center px-5 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-blue-700 transition-all duration-300">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </>
              ) : (
                <button
                  onClick={handleMessageUser}
                  className="flex items-center px-5 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-blue-700 transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message {profileData.firstName}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Trades</span>
                  <span className="font-semibold text-gray-900 flex items-center">
                    <Award className="w-5 h-5 text-yellow-500 mr-2" />
                    {profileData.completedTrades}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 text-purple-500 mr-2" />
                    {new Date(profileData.joinedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Profile Views</span>
                  <span className="font-semibold text-gray-900">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Rate</span>
                  <span className="font-semibold text-gray-900">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Response Time</span>
                  <span className="font-semibold text-gray-900">2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold text-gray-900">95%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">React.js</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Node.js</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">TypeScript</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">UI/UX Design</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}