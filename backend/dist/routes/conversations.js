"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/conversations.ts
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const db = new client_1.PrismaClient();
// @route   GET /api/conversations
// @desc    Get a list of conversations for the authenticated user
// @access  Private
// @ts-ignore
router.get('/', authMiddleware_1.authenticateToken, async (req, res) => {
    const currentUserId = req.user?.id;
    // Allow filtering by skillRequestId, though the Conversation model doesn't directly link to it.
    // This will primarily rely on messages linked to skill requests.
    const skillRequestIdFilter = req.query.skillRequestId;
    if (!currentUserId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }
    try {
        // Fetch conversations where the current user is a participant
        const userConversations = await db.conversationParticipant.findMany({
            where: {
                userId: currentUserId,
            },
            select: {
                conversation: {
                    include: {
                        participants: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        avatar: true,
                                        username: true,
                                    },
                                },
                            },
                        },
                        messages: {
                            orderBy: { timestamp: 'desc' },
                            take: 1, // Get only the latest message
                            include: {
                                sender: { select: { firstName: true, lastName: true, avatar: true } },
                                skillRequest: { select: { title: true } }, // Include skill request title
                            },
                        },
                    },
                },
            },
            orderBy: {
                conversation: {
                    updatedAt: 'desc', // Assuming Conversation has an updatedAt field
                },
            },
        });
        const conversations = [];
        for (const userConv of userConversations) {
            const conversation = userConv.conversation;
            if (!conversation)
                continue;
            // Find the other participant in this conversation
            const otherParticipant = conversation.participants.find((p) => p.userId !== currentUserId)?.user;
            if (!otherParticipant)
                continue; // Skip if no other participant (e.g., malformed data or single-user conversation)
            const lastMessage = conversation.messages[0]; // Get the latest message
            // Count unread messages for this conversation where the current user is the receiver
            const unreadCount = await db.message.count({
                where: {
                    conversationId: conversation.id,
                    receiverId: currentUserId,
                    read: false,
                },
            });
            // If a skillRequestId filter is applied, check if any message in this conversation is linked to it
            if (skillRequestIdFilter) {
                const hasMatchingSkillRequest = await db.message.count({
                    where: {
                        conversationId: conversation.id,
                        skillRequestId: skillRequestIdFilter,
                    },
                }) > 0;
                if (!hasMatchingSkillRequest) {
                    continue; // Skip this conversation if it doesn't match the skillRequestId filter
                }
            }
            conversations.push({
                id: conversation.id,
                participant: {
                    id: otherParticipant.id,
                    firstName: otherParticipant.firstName,
                    lastName: otherParticipant.lastName,
                    avatar: otherParticipant.avatar,
                    username: otherParticipant.username,
                },
                lastMessage: lastMessage ? lastMessage.content : 'No messages yet.',
                timestamp: lastMessage ? lastMessage.timestamp.toISOString() : conversation.createdAt.toISOString(),
                unreadCount: unreadCount,
                skillRequest: lastMessage?.skillRequest?.title || 'General Chat', // Get title from message's skillRequest
                isStarred: false, // Placeholder, implement if you add starring functionality to Conversation model
            });
        }
        res.json(conversations);
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Failed to fetch conversations.' });
    }
});
// @route   POST /api/conversations/initiate
// @desc    Initiate a conversation with another user (finds existing or creates new)
// @access  Private
// @ts-ignore
router.post('/initiate', authMiddleware_1.authenticateToken, async (req, res) => {
    const currentUserId = req.user?.id;
    const { otherUserId, skillRequestId, applicationId, initialMessage } = req.body; // Added skillRequestId, applicationId, initialMessage
    if (!currentUserId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!otherUserId) {
        return res.status(400).json({ error: 'Other user ID is required to initiate a conversation.' });
    }
    if (currentUserId === otherUserId) {
        return res.status(400).json({ error: 'Cannot initiate a conversation with yourself.' });
    }
    try {
        // 1. Find an existing conversation that includes both users
        // This requires checking the ConversationParticipant model
        const existingConversationParticipants = await db.conversationParticipant.findMany({
            where: {
                userId: { in: [currentUserId, otherUserId] },
            },
            select: {
                conversationId: true,
            },
        });
        // Group by conversationId to find conversations with both participants
        const conversationCounts = new Map();
        for (const cp of existingConversationParticipants) {
            conversationCounts.set(cp.conversationId, (conversationCounts.get(cp.conversationId) || 0) + 1);
        }
        let existingConversationId = null;
        for (const [convId, count] of conversationCounts.entries()) {
            // For a 1-on-1 chat, we expect count of 2 (both participants)
            if (count === 2) {
                // Optionally, if you want to link it to a specific skillRequest or application,
                // you might need to query messages within that conversation
                // For simplicity here, we'll just take the first 1-on-1 found.
                existingConversationId = convId;
                break;
            }
        }
        let conversation;
        if (existingConversationId) {
            conversation = await db.conversation.findUnique({
                where: { id: existingConversationId },
                select: { id: true },
            });
            return res.status(200).json({ conversationId: conversation?.id, message: 'Conversation already exists.' });
        }
        // 2. If no conversation exists, create a new one
        conversation = await db.conversation.create({
            data: {
                createdAt: new Date(),
                updatedAt: new Date(),
                participants: {
                    create: [
                        { userId: currentUserId },
                        { userId: otherUserId },
                    ],
                },
            },
            select: {
                id: true,
            },
        });
        // Optionally, create an initial message
        if (initialMessage) {
            await db.message.create({
                data: {
                    conversationId: conversation.id,
                    senderId: currentUserId,
                    receiverId: otherUserId, // Explicitly set receiver for 1-on-1
                    content: initialMessage,
                    type: 'CHAT', // Or 'SYSTEM' if it's an auto-generated welcome
                    read: false,
                    timestamp: new Date(),
                    skillRequestId: skillRequestId || null,
                    applicationId: applicationId || null,
                },
            });
        }
        res.status(201).json({ conversationId: conversation.id, message: 'New conversation created.' });
    }
    catch (error) {
        console.error('Error initiating conversation:', error);
        res.status(500).json({ error: 'Failed to initiate conversation.' });
    }
});
// @route   POST /api/conversations/:conversationId/messages
// @desc    Send a message in a conversation
// @access  Private
// @ts-ignore
router.post('/:conversationId/messages', authMiddleware_1.authenticateToken, async (req, res) => {
    const { conversationId } = req.params;
    const { content, type = 'CHAT', skillRequestId = null, applicationId = null } = req.body; // Default type to CHAT
    const currentUserId = req.user?.id;
    if (!currentUserId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!content) {
        return res.status(400).json({ error: 'Message content cannot be empty.' });
    }
    try {
        // Verify the conversation exists and the current user is a participant
        const conversation = await db.conversation.findUnique({
            where: { id: conversationId },
            include: {
                participants: {
                    select: { userId: true }
                }
            }
        });
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found.' });
        }
        const participantUserIds = conversation.participants.map(p => p.userId);
        if (!participantUserIds.includes(currentUserId)) {
            return res.status(403).json({ error: 'Not authorized to send messages in this conversation.' });
        }
        // Determine the receiverId for a 1-on-1 chat
        const receiverId = participantUserIds.find(id => id !== currentUserId) || null;
        const newMessage = await db.message.create({
            data: {
                conversationId,
                senderId: currentUserId,
                receiverId, // Set the other participant as receiver
                content,
                type,
                skillRequestId,
                applicationId,
                timestamp: new Date(),
                read: false, // Mark as unread for the receiver
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
        // Update conversation's updatedAt to bring it to top of list
        await db.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });
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
// @route   GET /api/conversations/stats
// @desc    Get conversation statistics for the authenticated user
// @access  Private
// @ts-ignore
router.get('/stats', authMiddleware_1.authenticateToken, async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }
    try {
        const unreadMessagesCount = await db.message.count({
            where: {
                receiverId: currentUserId,
                read: false,
            },
        });
        res.json({ unreadMessages: unreadMessagesCount });
    }
    catch (error) {
        console.error('Error fetching conversation stats:', error);
        res.status(500).json({ error: 'Failed to fetch conversation statistics.' });
    }
});
exports.default = router;
