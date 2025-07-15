
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware'; // Assuming this path

const router = Router();
const db = new PrismaClient();

// GET /api/messages/:conversationId
// Fetches all messages for a given conversation ID
// @ts-ignore
router.get('/:conversationId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { conversationId } = req.params;
  const currentUserId = req.user?.id; // Authenticated user's ID

  if (!currentUserId) {
    return res.status(401).json({ error: 'Unauthorized: User ID not found.' });
  }

  try {
    // Fetch messages for the given conversationId
    // Ensure that both the sender and receiver are part of the conversation,
    // or that the current user is involved in the messages.
    const messages = await db.message.findMany({
      where: {
        conversationId: conversationId,
        // Optional: Add conditions to ensure the current user is either sender or receiver
        // This prevents users from fetching messages from conversations they are not part of.
        // For a more robust solution, you'd have a 'Conversation' model and check participants there.
        OR: [
          { senderId: currentUserId },
          { receiverId: currentUserId }
        ]
      },
      orderBy: {
        timestamp: 'asc', // Order messages by time, oldest first
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            username: true,
          }
        },
        receiver: { // Include receiver if present
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            username: true,
          }
        }
      },
    });

    if (messages.length === 0) {
      // It's possible there are no messages yet, or the conversationId is invalid
      // We return an empty array if no messages are found, rather than 404
      console.log(`No messages found for conversationId: ${conversationId}`);
      return res.status(200).json([]);
    }

    // You might want to mark messages as read for the current user here
    await db.message.updateMany({
        where: {
            conversationId: conversationId,
            receiverId: currentUserId, // Messages where current user is the receiver
            read: false,
        },
        data: {
            read: true,
        },
    });


    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

export default router;