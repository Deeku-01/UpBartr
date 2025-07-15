"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/conversation.ts
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
const db = new client_1.PrismaClient();
// @route   GET /api/conversations
// @desc    Get a list of conversations for the authenticated user
// @access  Private
// @ts-ignore
router.get('/', authMiddleware_1.authenticateToken, async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }
    try {
        // Fetch all messages involving the current user, ordered by timestamp to easily find the last message for each conversation
        const messages = await db.message.findMany({
            where: {
                OR: [
                    { senderId: currentUserId },
                    { receiverId: currentUserId },
                ],
            },
            orderBy: {
                timestamp: 'desc', // Most recent messages first
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        username: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        username: true,
                    },
                },
            },
        });
        const conversationMap = new Map(); // Map to store conversations, keyed by conversationId
        for (const msg of messages) {
            if (!conversationMap.has(msg.conversationId)) {
                // This is the latest message for this conversation
                const otherParticipant = msg.senderId === currentUserId ? msg.receiver : msg.sender;
                // Fetch unread count for this conversation for the current user
                const unreadCount = await db.message.count({
                    where: {
                        conversationId: msg.conversationId,
                        receiverId: currentUserId,
                        read: false,
                        type: 'CHAT', // Only count chat messages as unread
                    },
                });
                conversationMap.set(msg.conversationId, {
                    id: msg.conversationId,
                    participant: {
                        id: otherParticipant?.id,
                        firstName: otherParticipant?.firstName,
                        lastName: otherParticipant?.lastName,
                        avatar: otherParticipant?.avatar,
                        username: otherParticipant?.username,
                    },
                    lastMessage: msg.content,
                    timestamp: msg.timestamp.toISOString(),
                    unreadCount: unreadCount,
                    skillRequest: 'N/A', // Placeholder: This field would typically come from a Conversation model linked to SkillRequest
                    isStarred: false, // Placeholder: This field would typically be on a Conversation model
                });
            }
        }
        const conversations = Array.from(conversationMap.values());
        // Sort conversations by the timestamp of their last message (most recent first)
        conversations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        res.status(200).json(conversations);
    }
    catch (error) {
        console.error('Error fetching conversations list:', error);
        res.status(500).json({ error: 'Failed to retrieve conversations list.' });
    }
});
// @route   GET /api/conversations/:conversationId/messages
// @desc    Get messages for a specific conversation
// @access  Private
// @ts-ignore
router.get('/:conversationId/messages', authMiddleware_1.authenticateToken, async (req, res) => {
    const currentUserId = req.user?.id;
    const { conversationId } = req.params;
    if (!currentUserId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }
    try {
        const messageInConversation = await db.message.findFirst({
            where: {
                conversationId: conversationId,
                OR: [
                    { senderId: currentUserId },
                    { receiverId: currentUserId },
                ],
            },
            select: { id: true, senderId: true, receiverId: true },
        });
        if (!messageInConversation) {
            return res.status(403).json({ error: 'Access denied to this conversation or conversation does not exist.' });
        }
        const messages = await db.message.findMany({
            where: { conversationId: conversationId },
            orderBy: { timestamp: 'asc' },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            }
        });
        await db.message.updateMany({
            where: {
                conversationId: conversationId,
                NOT: { senderId: currentUserId },
                read: false,
                type: 'CHAT'
            },
            data: { read: true }
        });
        const transformedMessages = messages.map(msg => ({
            id: msg.id,
            senderId: msg.senderId,
            receiverId: msg.senderId === currentUserId ? msg.receiverId : msg.senderId,
            content: msg.content,
            timestamp: msg.timestamp.toISOString(),
            isOwn: msg.senderId === currentUserId,
            type: msg.type,
            senderName: `${msg.sender.firstName} ${msg.sender.lastName}`,
            senderAvatar: msg.sender.avatar
        }));
        res.status(200).json(transformedMessages);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to retrieve messages.' });
    }
});
// @route   POST /api/conversations/:conversationId/messages
// @desc    Send a new message in a conversation
// @access  Private
// @ts-ignore
router.post('/:conversationId/messages', authMiddleware_1.authenticateToken, async (req, res) => {
    const currentUserId = req.user?.id;
    const { conversationId } = req.params;
    const { content } = req.body;
    if (!currentUserId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!content || typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({ error: 'Message content cannot be empty.' });
    }
    try {
        const conversationParticipants = await db.message.findMany({
            where: {
                conversationId: conversationId,
                OR: [
                    { senderId: currentUserId },
                    { receiverId: currentUserId },
                ],
            },
            select: { senderId: true, receiverId: true },
            distinct: ['senderId', 'receiverId'],
            take: 2
        });
        if (conversationParticipants.length === 0) {
            return res.status(404).json({ error: 'Conversation not found or access denied.' });
        }
        const allParticipantIds = new Set();
        conversationParticipants.forEach(msg => {
            allParticipantIds.add(msg.senderId);
            if (msg.receiverId)
                allParticipantIds.add(msg.receiverId);
        });
        if (!allParticipantIds.has(currentUserId)) {
            return res.status(403).json({ error: 'You are not a participant in this conversation.' });
        }
        allParticipantIds.delete(currentUserId);
        const otherParticipantId = allParticipantIds.size === 1 ? allParticipantIds.values().next().value : null;
        if (!otherParticipantId) {
            return res.status(400).json({ error: 'Could not determine receiver for this message.' });
        }
        const newMessage = await db.message.create({
            data: {
                conversationId: conversationId,
                senderId: currentUserId,
                receiverId: otherParticipantId,
                content: content.trim(),
                type: "CHAT",
                read: false,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            }
        });
        // --- NEW/UPDATED: Integrate Socket.IO here to emit the new message to connected clients ---
        const io = req.app.get('io'); // Get the Socket.IO instance from app
        if (io) {
            // Prepare the message data to be sent over WebSocket, matching frontend ChatMessage interface
            const messageToEmit = {
                id: newMessage.id,
                senderId: newMessage.senderId,
                receiverId: newMessage.receiverId,
                content: newMessage.content,
                timestamp: newMessage.timestamp.toISOString(),
                isOwn: false, // This will be set to true on the sender's frontend, false for receiver
                type: newMessage.type,
                senderName: `${newMessage.sender.firstName} ${newMessage.sender.lastName}`,
                senderAvatar: newMessage.sender.avatar
            };
            // Emit the message to all clients in this specific conversation room
            io.to(conversationId).emit('receive_message', messageToEmit);
            // Optional: Send a notification to the receiver's personal room if they are not in this conversation room
            // This logic would be more complex and might involve checking if `otherParticipantId`'s sockets are in `conversationId` room
            // For simplicity, we'll rely on the `receive_message` for now.
        }
        // --- END NEW/UPDATED ---
        res.status(201).json({
            id: newMessage.id,
            senderId: newMessage.senderId,
            receiverId: newMessage.receiverId,
            content: newMessage.content,
            timestamp: newMessage.timestamp.toISOString(),
            isOwn: newMessage.senderId === currentUserId, // This is for the sender's immediate UI update
            type: newMessage.type,
            senderName: `${newMessage.sender.firstName} ${newMessage.sender.lastName}`,
            senderAvatar: newMessage.sender.avatar
        });
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message.' });
    }
});
// ... (previous routes: POST /new/:otherUserId, GET /) ...
// @route   GET /api/conversations/:conversationId/messages
// @desc    Get messages for a specific conversation
// @access  Private
// @ts-ignore
router.get('/:conversationId/messages', authMiddleware_1.authenticateToken, async (req, res) => {
    const currentUserId = req.user?.id;
    const { conversationId } = req.params;
    if (!currentUserId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }
    try {
        const messageInConversation = await db.message.findFirst({
            where: {
                conversationId: conversationId,
                OR: [
                    { senderId: currentUserId },
                    { receiverId: currentUserId },
                ],
            },
            select: { id: true, senderId: true, receiverId: true },
        });
        if (!messageInConversation) {
            return res.status(403).json({ error: 'Access denied to this conversation or conversation does not exist.' });
        }
        const messages = await db.message.findMany({
            where: { conversationId: conversationId },
            orderBy: { timestamp: 'asc' },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        username: true,
                    },
                },
            },
        });
        // Mark messages as read for the current user
        await db.message.updateMany({
            where: {
                conversationId: conversationId,
                receiverId: currentUserId,
                read: false,
            },
            data: {
                read: true,
            },
        });
        res.status(200).json(messages);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages.' });
    }
});
// @route   GET /api/conversations/stats
// @desc    Get conversation statistics for the authenticated user (e.g., unread messages)
// @access  Private
// NEW ENDPOINT FOR DASHBOARD STATS
// @ts-ignore
router.get('/stats', authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const currentUserId = req.user?.id;
        if (!currentUserId) {
            return res.status(401).json({ error: 'Authentication required.' });
        }
        const unreadMessages = await db.message.count({
            where: {
                receiverId: currentUserId,
                read: false,
            },
        });
        res.json({ unreadMessages });
    }
    catch (error) {
        console.error('Error fetching conversation stats:', error);
        res.status(500).json({ error: 'Failed to fetch conversation statistics' });
    }
});
// @route   POST /api/conversations/messages
// @desc    Send a new message within a conversation
// @access  Private
// @ts-ignore
router.post('/messages', authMiddleware_1.authenticateToken, async (req, res) => {
    const currentUserId = req.user?.id;
    const { conversationId, receiverId, content } = req.body; // conversationId is now explicitly passed from frontend
    if (!currentUserId || !receiverId || !content) {
        return res.status(400).json({ error: 'Sender, receiver, conversation ID, and content are required.' });
    }
    try {
        // --- NEW/UPDATED ---
        // First, ensure the conversation exists or create it if this is the first message
        // If conversationId is provided, validate it belongs to the users
        // If not provided, it means it's a new conversation initiation
        let conversation;
        if (conversationId) {
            // Validate that the conversationId is valid and involves both users
            conversation = await db.conversation.findFirst({
                where: {
                    id: conversationId,
                    participants: {
                        some: {
                            userId: {
                                in: [currentUserId, receiverId]
                            }
                        }
                    }
                },
                include: { participants: true } // Include participants to verify
            });
            if (!conversation || conversation.participants.length < 2) {
                return res.status(404).json({ error: 'Conversation not found or invalid participants.' });
            }
        }
        else {
            // Find if a conversation already exists between these two users
            conversation = await db.conversation.findFirst({
                where: {
                    AND: [
                        {
                            participants: {
                                some: { userId: currentUserId }
                            }
                        },
                        {
                            participants: {
                                some: { userId: receiverId }
                            }
                        }
                    ]
                },
                include: { participants: true }
            });
            if (!conversation) {
                // Create a new conversation if none exists
                conversation = await db.conversation.create({
                    data: {
                        id: `conv_${crypto_1.default.randomBytes(16).toString('hex')}`, // Generate a unique ID for the conversation
                        participants: {
                            create: [
                                { userId: currentUserId },
                                { userId: receiverId }
                            ]
                        }
                    },
                    include: { participants: true }
                });
            }
        }
        // Now, create the message using the determined conversation.id
        const newMessage = await db.message.create({
            data: {
                conversationId: conversation.id, // Use the ID of the found or created conversation
                senderId: currentUserId,
                receiverId: receiverId, // This might be redundant if using conversationId, but useful for filtering
                content: content,
                timestamp: new Date(),
                read: false,
                type: 'CHAT', // Default message type
            },
            include: {
                sender: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
        });
        // --- Socket.IO integration (assuming 'io' is accessible via app.set('io')) ---
        const io = req.app.get('io'); // Get the Socket.IO instance from the app
        if (io) {
            const messageToEmit = {
                id: newMessage.id,
                conversationId: newMessage.conversationId,
                senderId: newMessage.senderId,
                receiverId: newMessage.receiverId,
                content: newMessage.content,
                timestamp: newMessage.timestamp.toISOString(),
                isOwn: false, // This will be set to true on the sender's frontend, false for receiver
                type: newMessage.type,
                senderName: `${newMessage.sender.firstName} ${newMessage.sender.lastName}`,
                senderAvatar: newMessage.sender.avatar
            };
            // Emit the message to all clients in this specific conversation room
            io.to(conversation.id).emit('receive_message', messageToEmit); // Use conversation.id
        }
        // --- END NEW/UPDATED ---\
        res.status(201).json({
            id: newMessage.id,
            senderId: newMessage.senderId,
            receiverId: newMessage.receiverId,
            content: newMessage.content,
            timestamp: newMessage.timestamp.toISOString(),
            isOwn: newMessage.senderId === currentUserId, // This is for the sender's immediate UI update
            type: newMessage.type,
            senderName: `${newMessage.sender.firstName} ${newMessage.sender.lastName}`,
            senderAvatar: newMessage.sender.avatar
        });
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message.' });
    }
});
exports.default = router;
