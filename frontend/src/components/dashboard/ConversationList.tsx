// src/components/ConversationList.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Loader2, MessageCircle, Info } from 'lucide-react';

// Helper function to get userId from token (can be a shared utility)
const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem('authToken');
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.id || decoded.sub || null; // Adjust to your actual JWT claim for user ID
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  }
  return null;
};

// Interface for the other participant in a conversation
interface OtherParticipant {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  username?: string;
}

// Interface for a single conversation item from the backend API
interface Conversation {
  id: string; // Changed from 'number' to 'string' to match backend UUIDs
  participant: OtherParticipant; // Renamed to 'participant' for consistency with backend
  lastMessage: string;
  timestamp: string; // ISO string for the last message's timestamp
  unreadCount: number;
  skillRequest: string; // Added to match backend response
  isStarred: boolean; // Added to match backend response
}

const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:3000';

export default function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (!currentUserId) {
      setError('User not authenticated.');
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get<Conversation[]>(`${API_BASE_URL}/api/conversations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Defensive check: Ensure response.data is an array before setting state
        if (Array.isArray(response.data)) {
          setConversations(response.data);
        } else {
          console.error("API response for conversations was not an array:", response.data);
          setError('Invalid data received from server. Please try again.');
          setConversations([]); // Ensure conversations is always an array
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations. Please try again.');
        setConversations([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUserId]); // Re-fetch if currentUserId changes (e.g., after login/logout)

  const formatTimestamp = (isoString: string): string => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid Date";

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (messageDate.getFullYear() === today.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-white rounded-lg shadow-sm">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-gray-600">Loading conversations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-white rounded-lg shadow-sm text-red-600">
        <Info className="w-10 h-10 mb-4" />
        <p className="text-lg font-medium">{error}</p>
        <p className="text-sm text-gray-500 mt-2">Please ensure you are logged in and your backend is running.</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-white rounded-lg shadow-sm text-gray-500">
        <MessageCircle className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium mb-2">No conversations yet.</p>
        <p className="text-sm text-center">
          Start a new conversation by messaging a user from their profile or a skill request application.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Your Conversations</h2>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {conversations.map((conv) => (
          <Link
            key={conv.id}
            to={`/dashboard/messages/${conv.id}/${conv.participant.id}`}
            className="flex items-center p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 relative">
              <img
                src={conv.participant.avatar || 'https://via.placeholder.com/50'}
                alt={`${conv.participant.firstName} ${conv.participant.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-semibold text-gray-900 truncate">
                  {`${conv.participant.firstName} ${conv.participant.lastName}`}
                </h3>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                  {formatTimestamp(conv.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {conv.lastMessage || 'No messages yet.'}
              </p>
            </div>
            {conv.unreadCount > 0 && (
              <span className="ml-4 flex-shrink-0 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {conv.unreadCount}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}