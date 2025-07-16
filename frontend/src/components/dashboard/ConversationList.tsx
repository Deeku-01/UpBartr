// src/components/ConversationList.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, MessageCircle, Info } from 'lucide-react';
import { api } from '../utils/setAuthToken'; // Import your configured axios instance
import { useSocket } from '../../contexts/SocketProvider'; // Import the useSocket hook

// Helper function to get userId from token (can be a shared utility)
const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem('authToken'); // Assuming you store userId in localStorage
  if (token) {
    try {
      // You might need a more robust way to get user ID from token,
      // e.g., by decoding it or fetching from a user context.
      // For now, assuming it's available directly or via a simple decode.
      // If your JWT payload has an 'id' or 'sub' field, use that.
      const decoded: any = JSON.parse(atob(token.split('.')[1])); // Basic JWT decode
      return decoded.id || decoded.sub || null;
    } catch (error) {
      console.error('Failed to decode JWT for current user ID:', error);
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

// Interface for the skill request associated with a conversation (as returned by backend)
interface ConversationSkillRequest {
  id: string;
  title: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
}

// Interface for a single conversation item from the backend API
interface Conversation {
  id: string;
  participant: OtherParticipant;
  lastMessage: string;
  timestamp: string; // ISO string for the last message's timestamp
  unreadCount: number;
  skillRequest?: ConversationSkillRequest; // Updated to be an object or undefined
  isStarred: boolean;
}

// Interface for a chat message received via Socket.IO (should match backend emit structure)
interface RealtimeChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string | null;
  content: string;
  timestamp: string;
  isOwn: boolean; // True if sent by current user, false otherwise
  type: 'CHAT' | 'SYSTEM';
  senderName: string;
  senderAvatar: string;
}


export default function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket(); // Get the socket instance from context

  const currentUserId = getCurrentUserId();

  // Function to fetch conversations from the API
  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    if (!currentUserId) {
      setError('User not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.get<Conversation[]>(`/api/conversations`);

      if (Array.isArray(response.data)) {
        setConversations(response.data);
      } else {
        console.error("API response for conversations was not an array:", response.data);
        setError('Invalid data received from server. Please try again.');
        setConversations([]);
      }
    } catch (err: any) {
      console.error('Error fetching conversations:', err);
      setError(err.response?.data?.error || 'Failed to load conversations. Please try again.');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();

    // Set up Socket.IO listener for new messages
    if (socket) {
      const handleReceiveMessage = (message: RealtimeChatMessage) => {
        console.log('Received real-time message in ConversationList:', message);

        setConversations(prevConversations => {
          const existingConvIndex = prevConversations.findIndex(
            (conv) => conv.id === message.conversationId
          );

          let updatedConversations;

          if (existingConvIndex > -1) {
            // Update existing conversation
            const existingConv = prevConversations[existingConvIndex];
            const newUnreadCount =
              message.senderId !== currentUserId && message.type === 'CHAT'
                ? existingConv.unreadCount + 1
                : existingConv.unreadCount;

            const updatedConv = {
              ...existingConv,
              lastMessage: message.content,
              timestamp: message.timestamp,
              unreadCount: newUnreadCount,
            };

            updatedConversations = [
              updatedConv,
              ...prevConversations.slice(0, existingConvIndex),
              ...prevConversations.slice(existingConvIndex + 1),
            ];
          } else {
            // New conversation: need to fetch participant details
            // This scenario is less common if conversations are initiated via API,
            // but good to handle for robustness or if system messages create new convs.
            // For simplicity, we'll refetch all conversations. A more complex solution
            // would involve fetching just the new participant's details.
            console.warn("New conversation detected, refetching all conversations.");
            fetchConversations(); // Re-fetch all conversations to get the new one
            return prevConversations; // Return previous state for now, will update after refetch
          }

          // Sort by timestamp to bring the most recent conversation to the top
          return updatedConversations.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        });
      };

      socket.on('receive_message', handleReceiveMessage);

      // Clean up listener on component unmount
      return () => {
        socket.off('receive_message', handleReceiveMessage);
      };
    }
  }, [currentUserId, socket]); // Depend on socket to re-run effect when socket connects/disconnects

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
                {conv.skillRequest?.title ? `[${conv.skillRequest.title}] ` : ''}
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
