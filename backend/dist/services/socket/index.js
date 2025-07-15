"use strict";
// src/services/socket/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// JWT Secret - ensure this matches your backend's authMiddleware
const JWT_SECRET = process.env.JWT_SECRET || 'SachinnaNainuoo';
class SocketService {
    constructor() {
        this.activeUsers = new Map();
        this.io = new socket_io_1.Server({
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
    setupAuthMiddleware() {
        this.io.use(async (socket, next) => {
            const token = socket.handshake.auth.token;
            if (!token) {
                console.warn('Socket authentication failed: No token provided');
                return next(new Error('Authentication error: No token provided'));
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                socket.data.userId = decoded.id; // Attach userId to socket.data
                console.log(`Socket authenticated: User ${decoded.id}`);
                next();
            }
            catch (error) {
                console.error('Socket authentication failed:', error);
                return next(new Error('Authentication error: Invalid or expired token'));
            }
        });
    }
    initListeners() {
        this.io.on('connection', (socket) => {
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
            socket.on('join_conversation', (conversationId) => {
                if (!conversationId) {
                    console.warn(`User ${userId} tried to join an invalid conversationId.`);
                    return;
                }
                socket.join(conversationId);
                console.log(`User ${userId} (Socket: ${socket.id}) joined conversation: ${conversationId}`);
                socket.emit('joined_conversation', conversationId); // Optional confirmation
            });
            // Listener for leaving a specific conversation room
            socket.on('leave_conversation', (conversationId) => {
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
    emitNotificationToUser(userId, data) {
        this.io.to(`user:${userId}`).emit('new_notification', data);
        console.log(`Emitted notification to user:${userId} for event: ${data.type}`);
    }
    // Public method to emit messages directly to a conversation room (less used now, as Express route does it)
    emitMessageToConversation(conversationId, message) {
        this.io.to(conversationId).emit('receive_message', message);
        console.log(`Emitted message to conversation: ${conversationId}`);
    }
    getActiveUsers() {
        return Array.from(this.activeUsers.keys());
    }
}
exports.default = SocketService;
