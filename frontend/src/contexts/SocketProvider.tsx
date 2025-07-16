// src/contexts/SocketProvider.tsx
import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { api } from '../components/utils/setAuthToken'; // Import api for fetching messages

interface SocketProviderProps {
  children: React.ReactNode;
  currentUserId: string; // Add current user's ID here (e.g., from your auth context)
}

interface ChatMessage {
  id: string;
  senderId: string; // Now we use ID for consistent identification
  receiverId: string | null; // Changed to allow null
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

interface ISocketContext {
  sendMessage: (conversationId: string, recipientId: string, msg: string) => void; // sendMessage now takes conversationId and recipientId
  socket: Socket | null;
  isConnected: boolean;
  loadConversationMessages: (conversationId: string, currentUserId: string) => Promise<ChatMessage[]>; // Updated to take currentUserId
}

export const socketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(socketContext);
  if (!state) throw new Error('useSocket must be used within a SocketProvider');
  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, currentUserId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  // Use a ref for the messages cache to avoid re-creating it on every render
  // and to ensure its value is stable across `useEffect` calls.
  const messagesCache = useRef<Map<string, ChatMessage[]>>(new Map());

  // Function to load messages for a specific conversation, with caching
  const loadConversationMessages = useCallback(async (conversationId: string, userId: string): Promise<ChatMessage[]> => {
    // Check cache first
    if (messagesCache.current.has(conversationId)) {
      console.log(`Loading messages for ${conversationId} from cache.`);
      return messagesCache.current.get(conversationId)!;
    }

    console.log(`Fetching messages for ${conversationId} from API.`);
    try {
      const response = await api.get<ChatMessage[]>(`/api/messages/${conversationId}`);
      const fetchedMessages = response.data.map(msg => ({
        ...msg,
        isOwn: msg.senderId === userId,
      }));
      messagesCache.current.set(conversationId, fetchedMessages); // Store in cache
      return fetchedMessages;
    } catch (error) {
      console.error('Error loading conversation messages:', error);
      throw error; // Re-throw to be handled by the component
    }
  }, []); // No dependencies, as messagesCache.current is stable

  // Function to send a message (now includes conversationId)
  const sendMessage = useCallback((conversationId: string, recipientId: string, msg: string) => {
    if (socket && isConnected) {
      // The backend's /api/conversations/messages route handles the Socket.IO emit
      // So, we don't emit directly from here for chat messages.
      // We'll rely on the real-time listener to update the cache and UI.
      console.log(`Attempting to send message to conversation ${conversationId} for recipient ${recipientId}: ${msg}`);
    } else {
      console.warn('Socket not connected. Message not sent.');
    }
  }, [socket, isConnected]);

  useEffect(() => {
    if (!currentUserId) {
      console.log('No currentUserId, skipping socket connection.');
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setIsConnected(false);
      return;
    }

    const newSocket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000', {
      auth: {
        token: localStorage.getItem('authToken'), // Pass JWT token for authentication
      },
      query: { userId: currentUserId } // Pass userId as query parameter
    });

    newSocket.on('connect', () => {
      console.log('Socket connected with ID:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected.');
      setIsConnected(false);
      messagesCache.current.clear(); // Clear cache on disconnect
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setIsConnected(false);
    });

    // Listener for individual messages arriving in a room
    newSocket.on('receive_message', (data: RealtimeChatMessage) => {
      console.log('Received real-time message in SocketProvider:', data);

      // Update the cache with the new message
      messagesCache.current.set(
        data.conversationId,
        [...(messagesCache.current.get(data.conversationId) || []), { ...data, isOwn: data.senderId === currentUserId }]
      );
    });


    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
      messagesCache.current.clear(); // Clear cache on unmount
    };
  }, [currentUserId]); // Re-run effect if currentUserId changes

  const contextValue = {
    sendMessage,
    socket, // Provide the raw socket for other components to listen directly
    isConnected,
    loadConversationMessages,
  };

  return (
    <socketContext.Provider value={contextValue}>
      {children}
    </socketContext.Provider>
  );
};
