"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/conversations.ts
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const db = new client_1.PrismaClient();
// Helper function to get the Socket.IO instance from the Express app
const getIo = (req) => {
    return req.app.get('io');
};
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
                            // Get the last message for each conversation
                            orderBy: {
                                timestamp: 'desc',
                            },
                            take: 1,
                            select: {
                                content: true,
                                timestamp: true,
                                senderId: true,
                                skillRequestId: true, // Include skillRequestId if present
                                applicationId: true, // Include applicationId if present
                            },
                        },
                    },
                },
            },
            orderBy: {
                // Order conversations by the timestamp of their last message
                conversation: {
                    messages: {
                        _count: 'desc', // This is a placeholder, ideally order by last message timestamp
                    },
                },
            },
        });
        const conversations = await Promise.all(userConversations.map(async (cp) => {
            const conversation = cp.conversation;
            const otherParticipant = conversation.participants.find((p) => p.user.id !== currentUserId)?.user;
            if (!otherParticipant) {
                // This should ideally not happen for 1-on-1 chats if participants are correctly managed
                return null;
            }
            // Count unread messages for the current user in this conversation
            const unreadCount = await db.message.count({
                where: {
                    conversationId: conversation.id,
                    receiverId: currentUserId,
                    read: false,
                },
            });
            // Determine if there's an associated skill request or application
            let associatedSkillRequestTitle;
            if (conversation.messages.length > 0 && conversation.messages[0].skillRequestId) {
                const sr = await db.skillRequest.findUnique({
                    where: { id: conversation.messages[0].skillRequestId },
                    select: { title: true },
                });
                associatedSkillRequestTitle = sr?.title;
            }
            else if (conversation.messages.length > 0 && conversation.messages[0].applicationId) {
                const app = await db.application.findUnique({
                    where: { id: conversation.messages[0].applicationId },
                    select: { skillRequest: { select: { title: true } } },
                });
                associatedSkillRequestTitle = app?.skillRequest?.title;
            }
            return {
                id: conversation.id,
                participant: {
                    id: otherParticipant.id,
                    firstName: otherParticipant.firstName,
                    lastName: otherParticipant.lastName,
                    avatar: otherParticipant.avatar,
                    username: otherParticipant.username,
                },
                lastMessage: conversation.messages[0]?.content || null,
                timestamp: conversation.messages[0]?.timestamp || conversation.createdAt,
                unreadCount: unreadCount,
                skillRequest: associatedSkillRequestTitle ? { title: associatedSkillRequestTitle } : undefined,
            };
        }));
        // Filter out any nulls if otherParticipant was not found
        const filteredConversations = conversations.filter(Boolean);
        // Further filter by skillRequestId if provided (this is a client-side filter for now)
        const finalConversations = skillRequestIdFilter
            ? filteredConversations.filter(conv => conv?.skillRequest?.title?.includes(skillRequestIdFilter))
            : filteredConversations;
        // Sort by latest message timestamp
        finalConversations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        res.status(200).json(finalConversations);
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Failed to fetch conversations.' });
    }
});
// @route   POST /api/conversations
// @desc    Create a new conversation or get an existing one between two users
// @access  Private
// @ts-ignore
router.post('/', authMiddleware_1.authenticateToken, async (req, res) => {
    const currentUserId = req.user?.id;
    const { otherUserId, skillRequestId, applicationId } = req.body; // otherUserId is the ID of the person to chat with
    if (!currentUserId || !otherUserId || currentUserId === otherUserId) {
        return res.status(400).json({ error: 'Invalid participant IDs.' });
    }
    try {
        // 1. Check if a conversation already exists between these two users
        // Find conversations where currentUserId is a participant
        const conversationsWithCurrentUser = await db.conversationParticipant.findMany({
            where: {
                userId: currentUserId,
            },
            select: {
                conversationId: true,
            },
        });
        const currentUserConversationIds = conversationsWithCurrentUser.map(cp => cp.conversationId);
        // From those, find if otherUserId is also a participant and it's a 2-person chat
        const existingConversation = await db.conversation.findFirst({
            where: {
                id: { in: currentUserConversationIds },
                participants: {
                    some: {
                        userId: otherUserId,
                    },
                },
                // Ensure it's a 1-on-1 conversation
                AND: {
                    participants: {
                        every: {
                            userId: { in: [currentUserId, otherUserId] },
                        },
                    }
                }
            },
            include: {
                participants: {
                    select: {
                        userId: true
                    }
                }
            }
        });
        if (existingConversation) {
            // Double-check if it's truly a 2-person conversation with *only* these two
            const participantIdsInFoundConversation = existingConversation.participants.map(p => p.userId);
            if (participantIdsInFoundConversation.length === 2 &&
                participantIdsInFoundConversation.includes(currentUserId) &&
                participantIdsInFoundConversation.includes(otherUserId)) {
                console.log(`Existing conversation found: ${existingConversation.id}`);
                return res.status(200).json({
                    conversationId: existingConversation.id,
                    otherParticipantId: otherUserId,
                    message: 'Existing conversation retrieved.'
                });
            }
        }
        // 2. If no existing conversation, create a new one
        const newConversation = await db.$transaction(async (tx) => {
            const conversation = await tx.conversation.create({
                data: {
                    participants: {
                        create: [
                            { userId: currentUserId },
                            { userId: otherUserId }
                        ]
                    }
                }
            });
            // Optionally create a system message to indicate the conversation start
            let systemMessageContent = `Conversation started.`;
            if (skillRequestId) {
                const skillReq = await tx.skillRequest.findUnique({ where: { id: skillRequestId }, select: { title: true } });
                systemMessageContent = `Conversation started regarding skill request: "${skillReq?.title || 'Unknown Skill Request'}"`;
            }
            else if (applicationId) {
                const application = await tx.application.findUnique({
                    where: { id: applicationId },
                    select: { skillRequest: { select: { title: true } } }
                });
                systemMessageContent = `Conversation started regarding application for skill request: "${application?.skillRequest?.title || 'Unknown Skill Request'}"`;
            }
            await tx.message.create({
                data: {
                    conversationId: conversation.id,
                    senderId: currentUserId, // The user who initiated the chat
                    receiverId: otherUserId,
                    content: systemMessageContent,
                    type: 'SYSTEM',
                    skillRequestId: skillRequestId,
                    applicationId: applicationId,
                },
            });
            return conversation;
        });
        res.status(201).json({
            conversationId: newConversation.id,
            otherParticipantId: otherUserId,
            message: 'New conversation created successfully.'
        });
    }
    catch (error) {
        console.error('Error creating/getting conversation:', error);
        res.status(500).json({ error: 'Failed to create/get conversation.' });
    }
});
// @route   POST /api/conversations/messages
// @desc    Send a new message within a conversation
// @access  Private
// @ts-ignore
router.post('/messages', authMiddleware_1.authenticateToken, async (req, res) => {
    const currentUserId = req.user?.id;
    const { conversationId, receiverId, content, skillRequestId, applicationId } = req.body; // receiverId is the other participant in a 1-on-1 chat
    if (!currentUserId || !content || !conversationId || !receiverId) {
        return res.status(400).json({ error: 'Sender ID, receiver ID, conversation ID, and content are required.' });
    }
    try {
        // Verify that the current user is a participant in the conversation
        const isParticipant = await db.conversationParticipant.findFirst({
            where: {
                conversationId: conversationId,
                userId: currentUserId,
            },
        });
        if (!isParticipant) {
            return res.status(403).json({ error: 'Not authorized to send messages in this conversation.' });
        }
        // Create the new message
        const newMessage = await db.message.create({
            data: {
                conversationId: conversationId,
                senderId: currentUserId,
                receiverId: receiverId, // The other participant
                content: content,
                type: 'CHAT', // Default to CHAT type for user-sent messages
                skillRequestId: skillRequestId,
                applicationId: applicationId,
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
        // Emit the message via Socket.IO to the conversation room
        const io = getIo(req);
        if (io) {
            const messageToEmit = {
                id: newMessage.id,
                conversationId: newMessage.conversationId,
                senderId: newMessage.senderId,
                receiverId: newMessage.receiverId,
                content: newMessage.content,
                timestamp: newMessage.timestamp.toISOString(),
                isOwn: newMessage.senderId === currentUserId, // For the client receiving it
                type: newMessage.type,
                senderName: `${newMessage.sender.firstName} ${newMessage.sender.lastName}`,
                senderAvatar: newMessage.sender.avatar,
            };
            io.to(conversationId).emit('receive_message', messageToEmit); // Use conversation.id
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
            senderAvatar: newMessage.sender.avatar,
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
        res.status(500).json({ error: 'Failed to fetch conversation stats.' });
    }
});
exports.default = router;
