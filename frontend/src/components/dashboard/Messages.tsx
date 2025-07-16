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
  MessageCircle,
} from 'lucide-react';
import { useSocket } from '../../contexts/SocketProvider';
import { api } from '../utils/setAuthToken';

interface CurrentUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  username?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string | null;
  content: string;
  timestamp: string;
  isOwn: boolean;
  type: 'CHAT' | 'SYSTEM';
  senderName: string;
  senderAvatar: string;
  conversationId: string;
}

interface RealtimeChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string | null;
  content: string;
  timestamp: string;
  isOwn: boolean;
  type: 'CHAT' | 'SYSTEM';
  senderName: string;
  senderAvatar: string;
}

interface OtherParticipantDetails {
  id: string;
  email: string;
  avatar?: string;
  firstName: string;
  fullName: string;
  rating: number;
  completedTrades: number;
  username?: string;
}

export default function Messages() {
  const { conversationId, otherParticipantId } = useParams<{ conversationId?: string; otherParticipantId?: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [otherParticipant, setOtherParticipant] = useState<OtherParticipantDetails | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<CurrentUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { socket, isConnected, loadConversationMessages } = useSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch current user's profile
  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      try {
        const response = await api.get<CurrentUserProfile>('/api/users/profile');
        console.log('Current user profile data from API:', response.data);
        setCurrentUserProfile(response.data);
      } catch (err) {
        console.error('Error fetching current user profile:', err);
      }
    };
    fetchCurrentUserProfile();
  }, []);

  // Fetch other participant's details
  useEffect(() => {
    const fetchOtherParticipant = async () => {
      if (otherParticipantId) {
        try {
          console.log('Fetching other participant with ID:', otherParticipantId);
          const response = await api.get<OtherParticipantDetails>(`/api/users/${otherParticipantId}`);
          console.log('Fetched other participant details:', response.data);
          console.log('Other participant avatar URL:', response.data.avatar);
          setOtherParticipant(response.data);
        } catch (err) {
          console.error('Error fetching other participant details:', err);
          setOtherParticipant(null);
        }
      } else {
        console.log('No otherParticipantId provided');
        setOtherParticipant(null);
      }
    };
    fetchOtherParticipant();
  }, [otherParticipantId]);

  // Fetch messages for the selected conversation
  useEffect(() => {
    const fetchAndSetMessages = async () => {
      if (!conversationId || !currentUserProfile?.id) {
        setMessages([]);
        setLoading(false);
        setOtherParticipant(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const fetchedMsgs = await loadConversationMessages(conversationId, currentUserProfile.id);
        setMessages(fetchedMsgs);
        scrollToBottom();

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

    fetchAndSetMessages();

    return () => {
      if (socket && isConnected && conversationId) {
        socket.emit('leave_conversation', conversationId);
        console.log(`Left Socket.IO room: ${conversationId}`);
      }
    };
  }, [conversationId, currentUserProfile?.id, socket, isConnected, loadConversationMessages]);

  // Listen for real-time messages
  useEffect(() => {
    if (!socket || !currentUserProfile?.id) return;

    const handleReceiveMessage = (data: RealtimeChatMessage) => {
      if (data.conversationId === conversationId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...data,
            isOwn: data.senderId === currentUserProfile.id,
          },
        ]);
        scrollToBottom();
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, conversationId, currentUserProfile?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !conversationId || !otherParticipantId || !currentUserProfile?.id) {
      return;
    }

    try {
      const response = await api.post('/api/conversations/messages', {
        conversationId,
        receiverId: otherParticipantId,
        content: messageText.trim(),
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...response.data,
          isOwn: true,
        },
      ]);

      setMessageText('');
      scrollToBottom();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  // Helper to display sender name/avatar for messages
  const getSenderDetails = (message: ChatMessage) => {
    if (message.isOwn) {
      const avatarSrc = currentUserProfile?.avatar || 'https://via.placeholder.com/40';
      console.log('Current user avatar src for sent message:', avatarSrc);
      return {
        name: `${currentUserProfile?.firstName || 'You'} ${currentUserProfile?.lastName || ''}`.trim(),
        avatar: avatarSrc
      };
    }
    
    // For received messages, try to get avatar from otherParticipant first, then fallback to message data
    let senderAvatarSrc = message.senderAvatar;
    
    // If the sender is the other participant, use their avatar from the profile
    if (message.senderId === otherParticipantId && otherParticipant?.avatar) {
      senderAvatarSrc = otherParticipant.avatar;
    }
    
    const finalAvatarSrc = senderAvatarSrc || 'https://via.placeholder.com/40';
    console.log('Sender avatar src for received message:', finalAvatarSrc);
    
    return { 
      name: message.senderName || otherParticipant?.fullName || 'Unknown User', 
      avatar: finalAvatarSrc 
    };
  };

  // Show loading state
  if (!currentUserProfile || loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        <p className="ml-3">Loading chat...</p>
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

  // No conversation selected
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

  // Debug the avatar URL before rendering
  const otherParticipantAvatarSrc = otherParticipant?.avatar || 'https://via.placeholder.com/50';
  console.log('Other participant data:', otherParticipant);
  console.log('Other participant avatar src (header):', otherParticipantAvatarSrc);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center">
          <img
            src={otherParticipantAvatarSrc}
            alt={otherParticipant?.fullName || 'User'}
            className="w-10 h-10 rounded-full object-cover mr-3"
            onError={(e) => {
              console.error('Avatar image failed to load:', otherParticipantAvatarSrc);
              e.currentTarget.src = 'https://via.placeholder.com/50';
            }}
            onLoad={() => {
              console.log('Avatar image loaded successfully:', otherParticipantAvatarSrc);
            }}
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
                  src={senderDetails.avatar}
                  alt={senderDetails.name}
                  className="w-8 h-8 rounded-full object-cover mr-3 flex-shrink-0"
                  onError={(e) => {
                    console.error('Message avatar failed to load:', senderDetails.avatar);
                    e.currentTarget.src = 'https://via.placeholder.com/40';
                  }}
                  onLoad={() => {
                    console.log('Message avatar loaded successfully:', senderDetails.avatar);
                  }}
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
                  src={senderDetails.avatar}
                  alt={senderDetails.name}
                  className="w-8 h-8 rounded-full object-cover ml-3 flex-shrink-0"
                  onError={(e) => {
                    console.error('Own message avatar failed to load:', senderDetails.avatar);
                    e.currentTarget.src = 'https://via.placeholder.com/40';
                  }}
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
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
          disabled={!messageText.trim() || !isConnected || !conversationId}
          className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}