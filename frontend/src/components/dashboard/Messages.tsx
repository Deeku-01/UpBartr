// src/components/Messages.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
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
import axios from 'axios'; // Import axios
import { currentUser } from './DashboardLayout'; // Assuming currentUser is available globally or via another context

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string | null; // receiverId can be null as per your schema (though we're setting it for 1-on-1)
  content: string;
  timestamp: string;
  isOwn: boolean;
  type: 'CHAT' | 'SYSTEM'; // Add message type
  senderName: string; // From backend include
  senderAvatar: string; // From backend include
  conversationId?:string
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  status?: 'online' | 'away' | 'offline'; // Optional, if you track presence
}

interface Conversation {
  id: string; // Changed to string to match backend conversationId (UUID)
  participant: Participant;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  skillRequest: string;
  isStarred: boolean;
}

const CURRENT_USER_ID = currentUser.id;

export default function Messages() {
  const { socket, isConnected } = useSocket();
  const { conversationId, otherParticipantId } = useParams<{ conversationId: string; otherParticipantId: string }>(); // Get params from URL
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to fetch conversations list on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get('/api/conversations', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        setConversations(response.data);
        // If a conversationId is in the URL, try to select it
        if (conversationId && response.data.length > 0) {
          const conv = response.data.find((c: Conversation) => c.id === conversationId);
          if (conv) {
            setSelectedConversation(conv);
          } else if (otherParticipantId) {
            // If convId not found, but otherParticipantId is present, try to construct one
            // This scenario should be rare if the /new endpoint works correctly.
            // You might need a more robust way to select/find it or handle redirect.
          }
        } else if (response.data.length > 0) {
          // If no specific conversation is selected, select the first one by default
          setSelectedConversation(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  // Effect to fetch messages for the selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation) {
        try {
          const response = await axios.get(`/api/conversations/${selectedConversation.id}/messages`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          });
          const fetchedMessages = response.data.map((msg: ChatMessage) => ({
            ...msg,
            isOwn: msg.senderId === CURRENT_USER_ID,
          }));
          setMessages(fetchedMessages);
          scrollToBottom();

          // --- NEW: Join Socket.IO room when conversation is selected ---
          if (socket && isConnected) {
            socket.emit('join_conversation', selectedConversation.id);
            console.log(`Joined Socket.IO room: ${selectedConversation.id}`);
          }
          // --- END NEW ---

        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      } else {
        setMessages([]); // Clear messages if no conversation is selected
      }
    };

    fetchMessages();

    // --- NEW: Leave Socket.IO room on component unmount or conversation change ---
    return () => {
      if (socket && isConnected && selectedConversation) {
        socket.emit('leave_conversation', selectedConversation.id);
        console.log(`Left Socket.IO room: ${selectedConversation.id}`);
      }
    };
    // --- END NEW ---

  }, [selectedConversation, socket, isConnected]); // Re-run when selectedConversation or socket connection changes

  // Effect to handle incoming real-time messages
  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (message: ChatMessage) => {
        console.log("Received real-time message:", message);
        // Only add message if it belongs to the currently selected conversation
        if (selectedConversation && message.conversationId === selectedConversation.id) { // Ensure conversationId is part of ChatMessage type
            setMessages((prevMessages) => {
                const newMessages = [...prevMessages, {
                    ...message,
                    isOwn: message.senderId === CURRENT_USER_ID,
                }];
                return newMessages;
            });
            scrollToBottom();
        }

        // Update conversation list with latest message and unread count
        setConversations(prevConversations => {
          const updatedConversations = prevConversations.map(conv => {
            if (conv.id === message.conversationId) { // Ensure message has conversationId
              return {
                ...conv,
                lastMessage: message.content, // Or format system message differently
                timestamp: message.timestamp,
                // Increment unread count only if message is not from current user AND not the selected conversation
                unreadCount: (message.senderId !== CURRENT_USER_ID && conv.id !== selectedConversation?.id)
                             ? conv.unreadCount + 1
                             : conv.unreadCount
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
  }, [socket, selectedConversation]);


  // Handle sending messages
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || !isConnected) return;

    try {
      // --- NEW: Send message via HTTP POST request to your backend API ---
      const response = await axios.post(
        `/api/conversations/${selectedConversation.id}/messages`,
        { content: messageText.trim() },
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );

      const sentMessage = response.data; // Backend returns the created message

      // Add the message immediately to local state for instant UI update
      setMessages((prevMessages) => [...prevMessages, {
        ...sentMessage,
        isOwn: true, // It's always our own message when sent from here
      }]);
      setMessageText('');
      scrollToBottom();

      // No need to emit via socket.emit('send_message') here,
      // because the backend will emit via `io.to(conversationId).emit` after DB save.

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
                    src={conv.participant.avatar}
                    alt={conv.participant.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {/* {conv.participant.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )} */}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 truncate">{conv.participant.name}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 truncate">
                    <p className="flex-1 truncate pr-2">{conv.lastMessage}</p>
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
                src={selectedConversation.participant.avatar}
                alt={selectedConversation.participant.name}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{selectedConversation.participant.name}</h3>
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
                      src={senderDetails.avatar}
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
                      src={senderDetails.avatar}
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