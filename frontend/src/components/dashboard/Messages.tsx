// src/components/Messages.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Star,
} from 'lucide-react';
import { useSocket } from '../../contexts/SocketProvider';
import { api } from '../utils/setAuthToken'; // Use your configured axios instance

// Helper function to get current user's details from localStorage
const getCurrentUser = (): { id: string | null; name: string; avatar: string } => {
  const userId = localStorage.getItem('userId');
  const firstName = localStorage.getItem('firstName') || 'Guest';
  const lastName = localStorage.getItem('lastName') || '';
  const avatar = localStorage.getItem('avatar') || 'https://via.placeholder.com/50'; // Default avatar

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

interface OtherParticipant {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  username?: string;
  status?: 'online' | 'away' | 'offline'; // Optional, if you track presence
}

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

interface Conversation {
  id: string;
  participant: OtherParticipant;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  skillRequest?: ConversationSkillRequest;
  isStarred: boolean;
}

export default function Messages() {
  const { socket, isConnected } = useSocket();
  const { conversationId, otherParticipantId } = useParams<{ conversationId?: string; otherParticipantId?: string }>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = getCurrentUser(); // Get current user details

  // Function to scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Effect to fetch conversations list and select the current one
  useEffect(() => {
    const fetchAndSelectConversations = async () => {
      if (!currentUser.id) {
        console.error('Current user ID not available for fetching conversations.');
        return;
      }

      try {
        const response = await api.get<Conversation[]>(`/api/conversations`);
        setConversations(response.data);

        if (conversationId) {
          const conv = response.data.find((c) => c.id === conversationId);
          if (conv) {
            setSelectedConversation(conv);
          } else if (otherParticipantId) {
            // This case handles direct navigation to a new conversation that might not yet be in the list
            // If the conversationId from URL is not found in the fetched list,
            // it implies it's a brand new conversation that might not have a message yet,
            // or the list hasn't updated. We can construct a temporary selectedConversation
            // or re-fetch specifically for this conversation.
            // For robustness, it's better to ensure the 'initiate' endpoint returns the full conversation object.
            // For now, we'll assume conversationId is valid if present.
            console.warn(`Conversation ID ${conversationId} not found in list. Attempting to use otherParticipantId.`);
            // You might want to fetch the other participant's details here
            // and construct a minimal selectedConversation object.
            // For simplicity, if conv is not found, selectedConversation remains null,
            // and the user will see "Select a conversation..."
          }
        } else if (response.data.length > 0) {
          // If no specific conversation is selected, select the first one by default
          setSelectedConversation(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchAndSelectConversations();
  }, [currentUser.id, conversationId, otherParticipantId]); // Re-run if URL params or current user changes

  // Effect to fetch messages for the selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation?.id) {
        try {
          const response = await api.get<ChatMessage[]>(`/api/messages/${selectedConversation.id}`);
          const fetchedMessages = response.data.map((msg) => ({
            ...msg,
            isOwn: msg.senderId === currentUser.id,
          }));
          setMessages(fetchedMessages);
          scrollToBottom();

          // Join Socket.IO room when conversation is selected
          if (socket && isConnected) {
            socket.emit('join_conversation', selectedConversation.id);
            console.log(`Joined Socket.IO room: ${selectedConversation.id}`);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
          setMessages([]); // Clear messages on error
        }
      } else {
        setMessages([]); // Clear messages if no conversation is selected
      }
    };

    fetchMessages();

    // Leave Socket.IO room on component unmount or conversation change
    return () => {
      if (socket && isConnected && selectedConversation?.id) {
        socket.emit('leave_conversation', selectedConversation.id);
        console.log(`Left Socket.IO room: ${selectedConversation.id}`);
      }
    };
  }, [selectedConversation, socket, isConnected, currentUser.id]); // Re-run when selectedConversation or socket connection changes

  // Effect to handle incoming real-time messages
  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (message: RealtimeChatMessage) => {
        console.log("Received real-time message:", message);

        // Only add message if it belongs to the currently selected conversation
        if (selectedConversation && message.conversationId === selectedConversation.id) {
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages, {
              ...message,
              isOwn: message.senderId === currentUser.id,
            }];
            return newMessages;
          });
          scrollToBottom();
        }

        // Update conversation list with latest message and unread count
        setConversations(prevConversations => {
          const updatedConversations = prevConversations.map(conv => {
            if (conv.id === message.conversationId) {
              const newUnreadCount =
                message.senderId !== currentUser.id && conv.id !== selectedConversation?.id
                  ? conv.unreadCount + 1
                  : conv.unreadCount;
              return {
                ...conv,
                lastMessage: message.content,
                timestamp: message.timestamp,
                unreadCount: newUnreadCount,
              };
            }
            return conv;
          });
          // Sort to bring the updated conversation to the top
          return updatedConversations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        });
      };

      socket.on('receive_message', handleReceiveMessage);

      return () => {
        socket.off('receive_message', handleReceiveMessage);
      };
    }
  }, [socket, selectedConversation, currentUser.id]);


  // Handle sending messages
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || !isConnected) return;

    try {
      const response = await api.post(
        `/api/conversations/${selectedConversation.id}/messages`,
        { content: messageText.trim() },
      );

      const sentMessage = response.data; // Backend returns the created message

      // Add the message immediately to local state for instant UI update
      setMessages((prevMessages) => [...prevMessages, {
        ...sentMessage,
        isOwn: true, // It's always our own message when sent from here
      }]);
      setMessageText('');
      scrollToBottom();

      // Update the conversation list immediately with this new message
      setConversations(prevConversations => {
        const updatedConversations = prevConversations.map(conv => {
          if (conv.id === selectedConversation.id) {
            return {
              ...conv,
              lastMessage: sentMessage.content,
              timestamp: sentMessage.timestamp,
              unreadCount: 0 // If we sent a message, we assume we've "read" the conversation
            };
          }
          return conv;
        });
        return updatedConversations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      });

    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error, e.g., show a toast notification
      alert('Failed to send message. Please try again.');
    }
  };

  // Helper to display sender name/avatar for messages
  const getSenderDetails = (message: ChatMessage) => {
    if (message.isOwn) {
      return { name: currentUser.name, avatar: currentUser.avatar };
    }
    // For messages not from current user, sender details come directly from `message.senderName/senderAvatar`
    // which are populated by backend's `include: { sender: ... }`
    return { name: message.senderName, avatar: message.senderAvatar };
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
      {/* Conversation List Sidebar */}
      <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Conversation Items */}
        <nav className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">No conversations yet.</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${
                  selectedConversation?.id === conv.id ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''
                }`}
              >
                <div className="relative mr-3">
                  <img
                    src={conv.participant.avatar || 'https://via.placeholder.com/50'}
                    alt={`${conv.participant.firstName} ${conv.participant.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {/* {conv.participant.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )} */}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {conv.participant.firstName} {conv.participant.lastName}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 truncate">
                    <p className="flex-1 truncate pr-2">
                      {conv.skillRequest?.title ? `[${conv.skillRequest.title}] ` : ''}
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </nav>
      </div>

      {/* Chat Window */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={selectedConversation.participant.avatar || 'https://via.placeholder.com/50'}
                alt={`${selectedConversation.participant.firstName} ${selectedConversation.participant.lastName}`}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedConversation.participant.firstName} {selectedConversation.participant.lastName}
                </h3>
                {/* <span className="text-sm text-gray-500">
                  {selectedConversation.participant.status === 'online' ? 'Online' : 'Offline'}
                </span> */}
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
                <Star className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
            {messages.map((msg) => {
              const senderDetails = getSenderDetails(msg);
              return (
                <div
                  key={msg.id}
                  className={`flex items-end ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isOwn && (
                    <img
                      src={senderDetails.avatar || 'https://via.placeholder.com/32'}
                      alt={senderDetails.name}
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                  )}
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.isOwn
                        ? 'bg-emerald-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                    }`}
                  >
                    {msg.type === 'SYSTEM' ? (
                        <p className="text-xs text-center text-gray-500 italic">{msg.content}</p>
                    ) : (
                        <p>{msg.content}</p>
                    )}
                    <span
                      className={`block text-xs mt-1 ${
                        msg.isOwn ? 'text-emerald-100 text-right' : 'text-gray-500 text-left'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {msg.isOwn && (
                    <img
                      src={senderDetails.avatar || 'https://via.placeholder.com/32'}
                      alt={senderDetails.name}
                      className="w-8 h-8 rounded-full object-cover ml-2"
                    />
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} id="messages-end" />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
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
                disabled={!messageText.trim() || !isConnected || !selectedConversation}
                className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a conversation to start chatting.
        </div>
      )}
    </div>
  );
}
