"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/services/socket/index.ts (or wherever SocketService lives)
const socket_io_1 = require("socket.io");
class SocketService {
    constructor() {
        // Initialize Socket.IO server.
        // This allows you to set CORS or other options here.
        this.io = new socket_io_1.Server({
            cors: {
                origin: 'http://localhost:5173', // Your frontend URL
                methods: ['GET', 'POST'],
                credentials: true
            }
        });
        console.log('SocketService initialized');
    }
    initListeners() {
        this.io.on('connection', (socket) => {
            console.log(`User connected: ${socket.id}`);
            // Listen for 'send_message' from clients
            socket.on('send_message', (data) => {
                console.log(`Message from ${data.sender} (${socket.id}): ${data.content}`);
                // Broadcast the message to all connected clients (or rooms)
                // This is what the frontend's `receive_message` listener will pick up
                this.io.emit('receive_message', {
                    id: `${socket.id}-${Date.now()}`, // A unique ID for the message
                    sender: data.sender,
                    content: data.content,
                    timestamp: data.timestamp,
                });
            });
            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
            });
            // You can add more listeners here for other events (e.g., 'join_room', 'typing', etc.)
        });
    }
    // Example of a method to emit an event from other parts of your server (e.g., an Express route)
    emitToAll(eventName, data) {
        this.io.emit(eventName, data);
    }
    // Example for emitting to a specific user/socket
    emitToSocket(socketId, eventName, data) {
        this.io.to(socketId).emit(eventName, data);
    }
}
exports.default = SocketService;
