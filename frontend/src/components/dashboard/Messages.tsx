// src/components/Messages.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  MessageCircle, // Added for the "No messages yet" placeholder
} from 'lucide-react';
import { useSocket } from '../../contexts/SocketProvider';
import { api } from '../utils/setAuthToken'; // Use your configured axios instance

// Helper function to get current user's details.
// Only userId is retrieved from localStorage as per request.
// firstName, lastName, and avatar will use default values.
const getCurrentUser = (): { id: string | null; name: string; avatar: string } => {
  const userId = localStorage.getItem('userId');
  // Default values for firstName, lastName, and avatar as they are no longer from localStorage
  const firstName = 'You'; // Default first name
  const lastName = '';    // Default last name
  const avatar = ''; // Default avatar

  return {
    id: userId,
    name: `${firstName} ${lastName}`.trim(),
    avatar: avatar,
  };
};

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string | null;
  content: string;
  timestamp: string;
  isOwn: boolean;
  type: 'CHAT' | 'SYSTEM';
  senderName: string; // Populated by backend
  senderAvatar: string; // Populated by backend
  conversationId: string; // Ensure this is always present
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

// Updated interface to match the API response for /api/users/:id
interface OtherParticipantDetails {
  id: string;
  email: string;
  avatar?: string; // Made optional as per your response
  firstName: string;
  fullName: string; // Added fullName
  rating: number;
  completedTrades: number;
  username?: string; // Keep username as it might be used for fallback display
}


export default function Messages() {
  const { conversationId, otherParticipantId } = useParams<{ conversationId?: string; otherParticipantId?: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [otherParticipant, setOtherParticipant] = useState<OtherParticipantDetails | null>(null); // State to hold other participant's details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { socket, isConnected } = useSocket(); // Get socket and isConnected from context
  const currentUser = getCurrentUser(); // Get current user details using the updated helper

  // Scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch other participant's details
  useEffect(() => {
    const fetchOtherParticipant = async () => {
      if (otherParticipantId) {
        try {
          const response = await api.get<OtherParticipantDetails>(`/api/users/${otherParticipantId}`);
          console.log('Fetched other participant details:', response.data); // Debugging log
          setOtherParticipant(response.data);
        } catch (err) {
          console.error('Error fetching other participant details:', err);
          setOtherParticipant(null);
        }
      } else {
        setOtherParticipant(null); // Clear participant if no otherParticipantId
      }
    };
    fetchOtherParticipant();
  }, [otherParticipantId]);


  // Fetch messages for the selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) {
        setMessages([]);
        setLoading(false);
        setOtherParticipant(null); // Clear participant if no conversation
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await api.get<ChatMessage[]>(`/api/messages/${conversationId}`);
        // Mark messages as own or not based on senderId
        const fetchedMessages = response.data.map(msg => ({
          ...msg,
          isOwn: msg.senderId === currentUser.id,
        }));
        setMessages(fetchedMessages);
        scrollToBottom(); // Scroll after initial load

        // Join Socket.IO room when conversation is selected
        if (socket && isConnected) {
          socket.emit('join_conversation', conversationId);
          console.log(`Joined Socket.IO room: ${conversationId}`);
        }

      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again.');
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Leave Socket.IO room on component unmount or conversation change
    return () => {
      if (socket && isConnected && conversationId) {
        socket.emit('leave_conversation', conversationId);
        console.log(`Left Socket.IO room: ${conversationId}`);
      }
    };
  }, [conversationId, currentUser.id, socket, isConnected]); // Re-fetch messages if conversationId or currentUser changes

  // Listen for real-time messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data: RealtimeChatMessage) => {
      // Only add the message if it belongs to the currently active conversation
      if (data.conversationId === conversationId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...data,
            isOwn: data.senderId === currentUser.id, // Determine if it's the current user's message
          },
        ]);
        scrollToBottom(); // Scroll after new message
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, conversationId, currentUser.id]); // Re-attach listener if socket, convoId, or currentUser changes

  // Scroll to bottom when messages update (debounced or only on new message)
  // This useEffect is now less critical as individual message additions trigger scroll
  // but kept for robustness, e.g., if messages are re-ordered or bulk-added.
  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSendMessage = async () => {
    if (!messageText.trim() || !conversationId || !otherParticipantId) {
      return;
    }

    try {
      // Send message via API (which then emits via Socket.IO from backend)
      const response = await api.post('/api/conversations/messages', {
        conversationId,
        receiverId: otherParticipantId,
        content: messageText.trim(),
      });

      // Optimistically update UI with the sent message
      // The backend response already includes `isOwn` and `senderName`/`senderAvatar`
      // which is good for consistency.
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...response.data, // Use the data returned from the backend
          isOwn: true, // It's always our own message if we just sent it
        },
      ]);

      setMessageText(''); // Clear input after sending
      scrollToBottom();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  // Helper to display sender name/avatar for messages
  const getSenderDetails = (message: ChatMessage) => {
    if (message.isOwn) {
      // Use currentUser.avatar, which now handles empty string fallbacks
      return { name: currentUser.name, avatar: currentUser.avatar };
    }
    // For messages not from current user, sender details come directly from `message.senderName/senderAvatar`
    // which are populated by backend's `include: { sender: ... }`
    return { name: message.senderName, avatar: message.senderAvatar }
  };


  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        <p className="ml-3">Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        <Info className="w-6 h-6 mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  // Display this if no conversation is selected (e.g., initial load of /dashboard/messages)
  if (!conversationId || !otherParticipantId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
        <MessageCircle className="w-16 h-16 mb-4 text-emerald-400" />
        <h2 className="text-xl font-semibold mb-2">Select a Conversation</h2>
        <p className="text-center text-gray-600">
          Choose a chat from the list on the left to view messages.
        </p>
        <p className="text-center text-sm text-gray-500 mt-2">
          If you don't see any, you can start one from a user's profile or a skill request.
        </p>
      </div>
    );
  }

  return (
    // This div is the main content area for messages, no sidebar here
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center">
          <img
            src={otherParticipant?.avatar || 'https://via.placeholder.com/50'}
            alt={otherParticipant?.fullName || 'User'}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {otherParticipant?.fullName || otherParticipant?.username || 'Loading User...'}
            </h2>
            <p className="text-sm text-gray-500">
              {isConnected ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Info className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {messages.length === 0 && !loading && !error && (
          <div className="text-center text-gray-500 py-10">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((msg) => {
          const senderDetails = getSenderDetails(msg);
          return (
            <div
              key={msg.id}
              className={`flex mb-4 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isOwn && (
                <img
                  src={senderDetails.avatar || 'https://via.placeholder.com/40'}
                  alt={senderDetails.name}
                  className="w-8 h-8 rounded-full object-cover mr-3 flex-shrink-0"
                />
              )}
              <div
                className={`relative max-w-[70%] p-3 rounded-lg shadow-sm ${
                  msg.isOwn
                    ? 'bg-emerald-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.type === 'SYSTEM' ? (
                    <p className="text-xs text-center text-gray-500 italic">{msg.content}</p>
                ) : (
                    <p>{msg.content}</p>
                )}
                <span className={`block text-xs mt-1 ${msg.isOwn ? 'text-emerald-100' : 'text-gray-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {msg.isOwn && (
                <img
                  src={currentUser.avatar || 'https://via.placeholder.com/40'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ml-3 flex-shrink-0"
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} /> {/* Scroll target */}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 flex items-center space-x-3 flex-shrink-0">
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <Paperclip className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <Smile className="w-5 h-5" />
        </button>

        <button
          onClick={handleSendMessage}
          disabled={!messageText.trim() || !isConnected || !conversationId} // Disable if no conversation selected
          className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
