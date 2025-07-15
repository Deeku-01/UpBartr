// src/contexts/SocketProvider.tsx
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketProviderProps {
  children: React.ReactNode;
  currentUserId: string; // Add current user's ID here (e.g., from your auth context)
}

interface ChatMessage {
  id: string;
  senderId: string; // Now we use ID for consistent identification
  receiverId: string; // Explicitly for direct messages
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface ISocketContext {
  sendMessage: (recipientId: string, msg: string) => void; // sendMessage now takes recipientId
  socket: Socket | null;
  isConnected: boolean;
  // messages: ChatMessage[]; // Removed: messages will be managed by Messages.tsx based on selected convo
  // Instead, provide a function to load messages for a specific conversation
  loadConversationMessages: (user1Id: string, user2Id: string) => Promise<ChatMessage[]>;
}

export const socketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(socketContext);
  if (!state) throw new Error('useSocket must be used within a SocketProvider');
  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, currentUserId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]); // This will hold all received/sent messages
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  // messages state is now handled within Messages.tsx for the selected conversation

  const sendMessage = useCallback((recipientId: string, msg: string) => {
    if (socket && isConnected && currentUserId) {
      const messageData = {
        senderId: currentUserId,
        recipientId: recipientId, // The ID of the person we are sending to
        content: msg,
        timestamp: new Date().toISOString(), // Use ISO string for consistent time
      };
      socket.emit('send_message', messageData);
      console.log('Emitted send_message:', messageData);

    } else {
      console.warn('Socket not connected or currentUserId missing, message not sent:', msg);
    }
  }, [socket, isConnected, currentUserId]);

  const loadConversationMessages = useCallback(async (user1Id: string, user2Id: string): Promise<ChatMessage[]> => {
    if (!socket || !isConnected) {
        console.warn('Socket not connected. Cannot load conversation history.');
        return [];
    }
    // Emit an event to the server to request message history
    // The server will then emit back a 'message_history' event
    // For now, we'll return a promise that resolves when history is received.
    // In a real app, you might use a more robust promise-based approach
    // or store this history in a local state and resolve/reject.

    // A more direct way is to fetch history via a REST API if it's large,
    // or if you always fetch the whole history. If it's for initial load
    // of a specific chat, Socket.IO can manage it.
    return new Promise((resolve) => {
        const historyListener = (messages: any[]) => {
            console.log('Received message_history:', messages);
            const formattedMessages = messages.map(msg => ({
                id: msg._id || msg.id, // Use _id from MongoDB or 'id' if just generated
                senderId: msg.senderId,
                receiverId: msg.receiverId,
                content: msg.content,
                timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: msg.senderId === currentUserId,
            }));
            socket.off('message_history', historyListener); // Remove listener after receiving history
            resolve(formattedMessages);
        };
        socket.on('message_history', historyListener);
        socket.emit('request_message_history', { user1Id, user2Id });
    });
  }, [socket, isConnected, currentUserId]);


  useEffect(() => {
    if (!currentUserId) {
        console.log("Waiting for current user ID before connecting socket.");
        return; // Don't connect until we have a user ID
    }

    const newSocket = io('http://localhost:3000', {
      query: { userId: currentUserId }, // Pass current user ID on connection
    });

    newSocket.on('connect', () => {
      console.log('Socket connected successfully! User ID:', currentUserId);
      setIsConnected(true);
      // Join a personal room for direct messaging
      newSocket.emit('join_personal_room', currentUserId);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected.');
      setIsConnected(false);
      setMessages([]); // Clear messages on disconnect
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setIsConnected(false);
    });

    // Listener for individual messages arriving in a room
    newSocket.on('receive_message', (data: { id: string; content: string; senderId: string; receiverId: string; timestamp: string }) => {
      console.log('Received direct message:', data);
      // The `Messages.tsx` component will handle adding this to its local state
      // if the message belongs to the currently selected conversation.
      // So, we don't update `messages` state here in SocketProvider anymore.
      // We could use a global state management library (Redux, Zustand) or a
      // more complex Context structure if you want all messages available here.
      // For now, `Messages.tsx` will listen for this specifically.
    });


    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
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





