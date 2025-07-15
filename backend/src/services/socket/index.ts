// src/services/socket/index.ts

import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient, MessageType } from '@prisma/client'; // Import MessageType if used in socket.ts

// JWT Secret - ensure this matches your backend's authMiddleware
const JWT_SECRET = process.env.JWT_SECRET || 'SachinnaNainuoo';

// Extend Socket.data to include userId after authentication
interface AuthenticatedSocket extends Socket {
  data: {
    userId?: string;
  };
}

// Define the structure of your JWT payload
interface JWTPayload {
  id: string;
  email?: string;
  iat?: number;
  exp?: number;
}

class SocketService {
  public io: SocketIOServer;
  // Map to store active user IDs to their connected socket IDs
  private activeUsers: Map<string, Set<string>>;

  constructor() {
    this.activeUsers = new Map();
    this.io = new SocketIOServer({
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Use env variable for frontend URL
        methods: ['GET', 'POST'],
        credentials: true
      }
    });
    console.log('SocketService initialized');
    this.setupAuthMiddleware(); // Call the authentication middleware setup
  }

  // Socket.IO authentication middleware
  private setupAuthMiddleware(): void {
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        console.warn('Socket authentication failed: No token provided');
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        socket.data.userId = decoded.id; // Attach userId to socket.data
        console.log(`Socket authenticated: User ${decoded.id}`);
        next();
      } catch (error) {
        console.error('Socket authentication failed:', error);
        return next(new Error('Authentication error: Invalid or expired token'));
      }
    });
  }

  public initListeners(): void {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      const userId = socket.data.userId;
      if (!userId) {
        console.error('Connected socket has no userId, disconnecting.');
        socket.disconnect(true);
        return;
      }

      console.log(`User connected: ${socket.id} (User ID: ${userId})`);

      // Add socket to the active users map
      if (!this.activeUsers.has(userId)) {
        this.activeUsers.set(userId, new Set());
      }
      this.activeUsers.get(userId)?.add(socket.id);

      // Join a personal room for notifications
      socket.join(`user:${userId}`);
      console.log(`Socket ${socket.id} joined personal room: user:${userId}`);


      // Listener for joining a specific conversation room
      socket.on('join_conversation', (conversationId: string) => {
        if (!conversationId) {
          console.warn(`User ${userId} tried to join an invalid conversationId.`);
          return;
        }
        socket.join(conversationId);
        console.log(`User ${userId} (Socket: ${socket.id}) joined conversation: ${conversationId}`);
        socket.emit('joined_conversation', conversationId); // Optional confirmation
      });

      // Listener for leaving a specific conversation room
      socket.on('leave_conversation', (conversationId: string) => {
        if (!conversationId) {
          console.warn(`User ${userId} tried to leave an invalid conversationId.`);
          return;
        }
        socket.leave(conversationId);
        console.log(`User ${userId} (Socket: ${socket.id}) left conversation: ${conversationId}`);
        socket.emit('left_conversation', conversationId); // Optional confirmation
      });

      // --- IMPORTANT: REMOVE THIS OLD 'send_message' LISTENER ---
      // Messages are now sent via HTTP POST to Express API and then emitted by Express via `io.to().emit()`
      // socket.on('send_message', async (data: {
      //   conversationId: string;
      //   receiverId: string;
      //   content: string;
      //   skillRequestId?: string;
      //   applicationId?: string;
      // }) => {
      //   // This logic is now in src/routes/conversation.ts
      // });
      // --- END REMOVAL ---

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id} (User ID: ${userId})`);
        if (userId && this.activeUsers.has(userId)) {
          this.activeUsers.get(userId)?.delete(socket.id);
          if (this.activeUsers.get(userId)?.size === 0) {
            this.activeUsers.delete(userId);
          }
        }
      });
    });
  }

  // Public method to emit notifications to a specific user's personal room
  public emitNotificationToUser(userId: string, data: any): void {
    this.io.to(`user:${userId}`).emit('new_notification', data);
    console.log(`Emitted notification to user:${userId} for event: ${data.type}`);
  }

  // Public method to emit messages directly to a conversation room (less used now, as Express route does it)
  public emitMessageToConversation(conversationId: string, message: any): void {
    this.io.to(conversationId).emit('receive_message', message);
    console.log(`Emitted message to conversation: ${conversationId}`);
  }

  public getActiveUsers(): string[] {
    return Array.from(this.activeUsers.keys());
  }
}

export default SocketService;